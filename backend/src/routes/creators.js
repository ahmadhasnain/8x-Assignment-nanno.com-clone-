import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { mockImportLinkedin, estimatePerformance, recommendPrice } from "../lib/mockLinkedin.js";

const router = Router();

function serialize(profile) {
  if (!profile) return null;
  return {
    ...profile,
    industries: profile.industries ? JSON.parse(profile.industries) : [],
  };
}

router.use(requireAuth);

router.get("/me", async (req, res) => {
  if (req.role !== "CREATOR") return res.status(403).json({ error: "Creator account required" });
  const profile = await prisma.creatorProfile.findUnique({ where: { userId: req.userId } });
  res.json(serialize(profile));
});

const importSchema = z.object({
  url: z.string().url().refine((u) => /linkedin\.com\/in\//i.test(u), {
    message: "Please provide a linkedin.com/in/... profile URL",
  }),
});

router.post("/me/import-linkedin", async (req, res) => {
  if (req.role !== "CREATOR") return res.status(403).json({ error: "Creator account required" });
  const parsed = importSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const imported = mockImportLinkedin(parsed.data.url);
  const performance = estimatePerformance(imported.followers);

  const profile = await prisma.creatorProfile.update({
    where: { userId: req.userId },
    data: {
      ...imported,
      ...performance,
      onboardingStep: 2,
    },
  });

  res.json(serialize(profile));
});

const step3Schema = z.object({
  country: z.string().min(1),
  countryFlag: z.string().optional(),
  industries: z.array(z.string()).max(3),
});

router.patch("/me/step3", async (req, res) => {
  if (req.role !== "CREATOR") return res.status(403).json({ error: "Creator account required" });
  const parsed = step3Schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { country, countryFlag, industries } = parsed.data;

  const profile = await prisma.creatorProfile.update({
    where: { userId: req.userId },
    data: {
      country,
      ...(countryFlag ? { countryFlag } : {}),
      industries: JSON.stringify(industries),
      onboardingStep: 3,
    },
  });

  res.json(serialize(profile));
});

router.get("/me/recommended-price", async (req, res) => {
  if (req.role !== "CREATOR") return res.status(403).json({ error: "Creator account required" });
  const profile = await prisma.creatorProfile.findUnique({ where: { userId: req.userId } });
  if (!profile || profile.followers == null) {
    return res.status(400).json({ error: "Import a LinkedIn profile first" });
  }
  res.json({ recommendedPrice: recommendPrice({ followers: profile.followers }) });
});

const step4Schema = z.object({
  pricePerPost: z.number().positive(),
  bundleEnabled: z.boolean().optional(),
  bio: z.string().max(2000).optional(),
});

router.patch("/me/step4", async (req, res) => {
  if (req.role !== "CREATOR") return res.status(403).json({ error: "Creator account required" });
  const parsed = step4Schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const profile = await prisma.creatorProfile.update({
    where: { userId: req.userId },
    data: {
      ...parsed.data,
      onboardingStep: 4,
      completed: true,
    },
  });

  res.json(serialize(profile));
});

const bioSchema = z.object({ bio: z.string().max(2000) });

router.patch("/me/bio", async (req, res) => {
  if (req.role !== "CREATOR") return res.status(403).json({ error: "Creator account required" });
  const parsed = bioSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const profile = await prisma.creatorProfile.update({
    where: { userId: req.userId },
    data: { bio: parsed.data.bio },
  });
  res.json(serialize(profile));
});

export default router;
