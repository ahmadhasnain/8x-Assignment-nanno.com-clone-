import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

function serialize(profile) {
  return {
    id: profile.id,
    fullName: profile.fullName,
    headline: profile.headline,
    photoUrl: profile.photoUrl,
    country: profile.country,
    countryFlag: profile.countryFlag,
    followers: profile.followers,
    reactionsPerPost: profile.reactionsPerPost,
    impressionsPerPost: profile.impressionsPerPost,
    commentsPerPost: profile.commentsPerPost,
    engagementRate: profile.engagementRate,
    industries: profile.industries ? JSON.parse(profile.industries) : [],
    bio: profile.bio,
    pricePerPost: profile.pricePerPost,
  };
}

// Public marketplace listing — no auth required, mirrors what a company
// browsing the marketplace would see.
router.get("/creators", async (req, res) => {
  const { industry, country, search } = req.query;

  const profiles = await prisma.creatorProfile.findMany({
    where: { completed: true },
    orderBy: { followers: "desc" },
  });

  let results = profiles.map(serialize);

  if (industry) {
    results = results.filter((p) => p.industries.includes(industry));
  }
  if (country) {
    results = results.filter((p) => p.country === country);
  }
  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (p) =>
        p.fullName?.toLowerCase().includes(q) ||
        p.headline?.toLowerCase().includes(q) ||
        p.bio?.toLowerCase().includes(q)
    );
  }

  res.json(results);
});

router.get("/creators/:id", async (req, res) => {
  const profile = await prisma.creatorProfile.findUnique({ where: { id: req.params.id } });
  if (!profile || !profile.completed) {
    return res.status(404).json({ error: "Creator not found" });
  }
  res.json(serialize(profile));
});

export default router;
