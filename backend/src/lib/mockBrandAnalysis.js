// There is no real website scraping here (that requires a crawler / content
// extraction pipeline). This deterministically derives a plausible value
// proposition and 3 ICPs from the website URL so the same URL always yields
// the same brief, which is enough to demo the brand onboarding flow end-to-end.

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

const TEMPLATES = [
  {
    keywords: ["fashion", "wear", "cloth", "street", "apparel"],
    valueProposition: (name) =>
      `${name} is a bold streetwear brand offering limited-edition t-shirts and hoodies designed for niche communities including programmers, sports fans, anime enthusiasts, and gamers. Each collection features premium-quality apparel with graphic designs celebrating programming languages, football clubs, and pop culture. ${name} turns online fandoms into everyday wearable identity.`,
    icps: [
      {
        title: "Anime & Pop Culture Enthusiast",
        description:
          "A young adult (18-28) passionate about anime, manga, and Japanese pop culture who wants apparel that signals their fandom without looking like a costume.",
      },
      {
        title: "Tech-Savvy Developer & Programmer",
        description:
          "A software engineer or developer (22-35) who values humor and in-jokes about their craft, and wears merch that shows off their identity at meetups and remote-work calls.",
      },
      {
        title: "Sports Fan & Football Enthusiast",
        description:
          "A passionate sports fan (18-40) who follows football clubs and wants streetwear that blends fandom with everyday style.",
      },
    ],
  },
  {
    keywords: ["tech", "soft", "app", "dev", "cloud", "ai", "data"],
    valueProposition: (name) =>
      `${name} is a B2B software platform that helps growing teams automate their workflows and ship faster. Built for technical and operational leaders, ${name} replaces spreadsheets and manual processes with a single source of truth. Customers typically see faster onboarding, fewer errors, and measurable time savings within the first month.`,
    icps: [
      {
        title: "Engineering Manager at a Scaling Startup",
        description:
          "Leads a team of 5-20 engineers at a Series A-C startup, is evaluating tools to reduce manual ops overhead and improve delivery speed.",
      },
      {
        title: "Head of Operations",
        description:
          "Owns internal tooling decisions at a mid-market company, cares about integration ease, reliability, and total cost of ownership.",
      },
      {
        title: "Technical Founder",
        description:
          "Founder or co-founder of an early-stage company who wants to move fast without hiring a large platform team.",
      },
    ],
  },
  {
    keywords: ["market", "growth", "media", "agency", "brand"],
    valueProposition: (name) =>
      `${name} helps B2B companies plan, launch, and measure marketing campaigns that actually move pipeline. From positioning to execution, ${name} combines strategy and hands-on campaign management so marketing teams can prove ROI instead of just tracking vanity metrics.`,
    icps: [
      {
        title: "B2B Marketing Director",
        description:
          "Owns the marketing budget at a mid-size B2B company, is under pressure to show pipeline impact from every campaign dollar spent.",
      },
      {
        title: "Demand Generation Manager",
        description:
          "Runs day-to-day campaigns across paid, content, and social channels and needs a partner who can execute quickly.",
      },
      {
        title: "Founder-led Marketing Lead",
        description:
          "Wears the marketing hat at an early-stage company and needs an experienced partner rather than a full in-house team.",
      },
    ],
  },
  {
    keywords: ["shop", "store", "commerce", "goods"],
    valueProposition: (name) =>
      `${name} is a direct-to-consumer e-commerce brand offering curated, high-quality products backed by fast shipping and an easy returns experience. ${name} focuses on building a loyal repeat-customer base through strong product design and word-of-mouth.`,
    icps: [
      {
        title: "Value-Conscious Repeat Shopper",
        description:
          "A regular online shopper (25-45) who researches before buying and rewards brands with clear value and reliable delivery with repeat purchases.",
      },
      {
        title: "Gift Buyer",
        description:
          "Shops seasonally for friends and family, prioritizes presentation and easy checkout over price.",
      },
      {
        title: "Brand-Loyal Enthusiast",
        description:
          "Already follows the brand on social media and is likely to share purchases with their own network.",
      },
    ],
  },
];

const DEFAULT_TEMPLATE = {
  valueProposition: (name) =>
    `${name} is a B2B company that helps its customers solve a specific, high-value problem with a focused product offering. ${name} targets teams that need a reliable partner rather than a generic tool, and grows primarily through word-of-mouth and case studies.`,
  icps: [
    {
      title: "Primary Decision Maker",
      description: "The person who owns the budget and the outcome this product is responsible for.",
    },
    {
      title: "Day-to-Day User",
      description: "Uses the product regularly and cares most about ease of use and reliability.",
    },
    {
      title: "Technical Evaluator",
      description: "Assesses integrations, security, and total cost of ownership before sign-off.",
    },
  ],
};

function extractName(website) {
  try {
    const host = new URL(website.startsWith("http") ? website : `https://${website}`).hostname;
    return host.replace(/^www\./, "").split(".")[0];
  } catch {
    return website;
  }
}

export function mockAnalyzeWebsite(website, companyName) {
  const host = extractName(website).toLowerCase();
  const name = companyName || extractName(website);

  const matched = TEMPLATES.find((t) => t.keywords.some((k) => host.includes(k)));
  const template = matched || TEMPLATES[hashString(host) % TEMPLATES.length] || DEFAULT_TEMPLATE;

  return {
    valueProposition: template.valueProposition(name),
    icps: template.icps,
  };
}

// Same deterministic-template approach as mockAnalyzeWebsite, but keyed off a
// free-text campaign prompt (e.g. "I want to reach VP Sales in B2B SaaS in
// France") instead of a website URL.
export function mockGenerateCampaignBrief(prompt, companyName) {
  const lower = prompt.toLowerCase();
  const name = companyName || "Your company";

  const matched = TEMPLATES.find((t) => t.keywords.some((k) => lower.includes(k)));
  const template = matched || TEMPLATES[hashString(lower) % TEMPLATES.length] || DEFAULT_TEMPLATE;

  const shortPrompt = prompt.length > 42 ? `${prompt.slice(0, 42).trim()}…` : prompt;

  return {
    title: `${name} — ${shortPrompt}`,
    description: `${template.valueProposition(name)} Target: ${prompt}.`,
    icps: template.icps,
  };
}
