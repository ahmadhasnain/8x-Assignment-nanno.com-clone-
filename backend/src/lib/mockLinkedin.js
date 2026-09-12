// There is no real LinkedIn scraping here (that requires LinkedIn API access /
// an approved partner integration). This deterministically derives plausible
// public-profile-shaped data from the URL so the same URL always yields the
// same card, which is enough to demo the import flow end-to-end.

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

const HEADLINES = [
  "Senior Software Engineer | MERN | React.js | Node.js | PHP | Laravel | Symfony",
  "B2B Growth Marketer | SaaS | Demand Gen | GTM Strategy",
  "Founder & CEO | Building the future of B2B sales",
  "Product Manager | AI/ML | 0-to-1 Products",
  "Sales Leader | Enterprise SaaS | Pipeline Builder",
];

const BIOS = [
  "Full Stack Software Engineer with over 4 years of hands-on experience in building and maintaining scalable web applications. Passionate about leveraging cutting-edge technologies to tackle complex challenges and deliver exceptional results.",
  "I write about B2B growth, demand generation, and what actually moves pipeline. Ex-marketer turned founder, sharing lessons from scaling three SaaS companies.",
  "Building in public. I share the highs and lows of taking a B2B startup from idea to revenue, one honest post at a time.",
  "Product leader obsessed with user research and shipping fast. I write about turning ambiguous problems into products people love.",
  "Helping enterprise sales teams hit quota without burning out. Practical, no-fluff advice from someone who's carried the bag.",
];

function pick(list, seed) {
  return list[Math.abs(seed) % list.length];
}

export function mockImportLinkedin(url) {
  const match = url.match(/linkedin\.com\/in\/([^/?#]+)/i);
  const slug = match ? decodeURIComponent(match[1]) : url;
  const seed = hashString(slug);

  const followers = 500 + (seed % 9500);

  return {
    linkedinUrl: url,
    headline: pick(HEADLINES, seed),
    bio: pick(BIOS, seed >>> 3),
    photoUrl: `https://i.pravatar.cc/300?u=${encodeURIComponent(slug)}`,
    country: "Pakistan",
    countryFlag: "🇵🇰",
    followers,
  };
}

export function estimatePerformance(followers) {
  const seed = followers % 97;
  return {
    reactionsPerPost: Math.round(followers * (0.02 + (seed % 10) / 500)),
    impressionsPerPost: Math.round(followers * (2.5 + (seed % 20) / 10)),
    commentsPerPost: Math.round(followers * (0.003 + (seed % 5) / 1000)),
    engagementRate: Math.round((1.5 + (seed % 30) / 10) * 100) / 100,
  };
}

export function recommendPrice({ followers }) {
  // Rough tiered heuristic: base price scales with follower count.
  if (followers < 1000) return 20;
  if (followers < 3000) return 50;
  if (followers < 10000) return 120;
  if (followers < 30000) return 300;
  return 600;
}
