import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { mockAnalyzeWebsite, mockGenerateCampaignBrief } from "../lib/mockBrandAnalysis.js";

const router = Router();

function serialize(profile) {
  if (!profile) return null;
  return {
    ...profile,
    icps: profile.icps ? JSON.parse(profile.icps) : [],
  };
}

function serializeCampaign(campaign, companyName) {
  return {
    ...campaign,
    companyName: companyName ?? null,
    icps: campaign.icps ? JSON.parse(campaign.icps) : [],
  };
}

router.use(requireAuth);

router.get("/me", async (req, res) => {
  if (req.role !== "COMPANY") return res.status(403).json({ error: "Company account required" });
  const profile = await prisma.companyProfile.findUnique({ where: { userId: req.userId } });
  res.json(serialize(profile));
});

const analyzeSchema = z.object({
  website: z.string().min(3),
});

router.post("/me/analyze-website", async (req, res) => {
  if (req.role !== "COMPANY") return res.status(403).json({ error: "Company account required" });
  const parsed = analyzeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const existing = await prisma.companyProfile.findUnique({ where: { userId: req.userId } });
  const analyzed = mockAnalyzeWebsite(parsed.data.website, existing?.companyName);

  const profile = await prisma.companyProfile.update({
    where: { userId: req.userId },
    data: {
      website: parsed.data.website,
      valueProposition: analyzed.valueProposition,
      icps: JSON.stringify(analyzed.icps),
      onboardingStep: 2,
    },
  });

  res.json(serialize(profile));
});

const finishSchema = z.object({
  valueProposition: z.string().min(1),
  icps: z
    .array(z.object({ title: z.string().min(1), description: z.string().min(1) }))
    .length(3),
});

router.patch("/me/finish", async (req, res) => {
  if (req.role !== "COMPANY") return res.status(403).json({ error: "Company account required" });
  const parsed = finishSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { valueProposition, icps } = parsed.data;

  const profile = await prisma.companyProfile.update({
    where: { userId: req.userId },
    data: {
      valueProposition,
      icps: JSON.stringify(icps),
      onboardingStep: 3,
      completed: true,
    },
  });

  const existingCampaign = await prisma.campaign.findFirst({ where: { companyId: profile.id } });
  if (!existingCampaign) {
    await prisma.campaign.create({
      data: {
        companyId: profile.id,
        title: `${profile.companyName ?? "Your"} creator brief`,
        description: valueProposition,
        icps: JSON.stringify(icps),
      },
    });
  }

  res.json(serialize(profile));
});

router.get("/me/campaigns", async (req, res) => {
  if (req.role !== "COMPANY") return res.status(403).json({ error: "Company account required" });
  const profile = await prisma.companyProfile.findUnique({ where: { userId: req.userId } });
  if (!profile) return res.json([]);
  const campaigns = await prisma.campaign.findMany({
    where: { companyId: profile.id },
    orderBy: { createdAt: "desc" },
  });
  res.json(campaigns.map((c) => serializeCampaign(c, profile.companyName)));
});

router.get("/me/campaigns/:id", async (req, res) => {
  if (req.role !== "COMPANY") return res.status(403).json({ error: "Company account required" });
  const profile = await prisma.companyProfile.findUnique({ where: { userId: req.userId } });
  if (!profile) return res.status(404).json({ error: "Campaign not found" });
  const campaign = await prisma.campaign.findFirst({ where: { id: req.params.id, companyId: profile.id } });
  if (!campaign) return res.status(404).json({ error: "Campaign not found" });
  res.json(serializeCampaign(campaign, profile.companyName));
});

const createCampaignSchema = z.object({
  prompt: z.string().min(3),
});

router.post("/me/campaigns", async (req, res) => {
  if (req.role !== "COMPANY") return res.status(403).json({ error: "Company account required" });
  const parsed = createCampaignSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const profile = await prisma.companyProfile.findUnique({ where: { userId: req.userId } });
  if (!profile) return res.status(400).json({ error: "Finish onboarding before creating a campaign" });

  const generated = mockGenerateCampaignBrief(parsed.data.prompt, profile.companyName);
  const campaign = await prisma.campaign.create({
    data: {
      companyId: profile.id,
      title: generated.title,
      description: generated.description,
      icps: JSON.stringify(generated.icps),
    },
  });

  res.status(201).json(serializeCampaign(campaign, profile.companyName));
});

export default router;
