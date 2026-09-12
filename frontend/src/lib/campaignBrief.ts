import type { Campaign } from "./types";

export interface CampaignAngle {
  title: string;
  instruction: string;
  guidance: string;
  postExample: string;
}

export interface CampaignBrief {
  contextObjective: string;
  tone: string;
  editorialDo: string[];
  editorialAvoid: string[];
  angles: CampaignAngle[];
}

// The brief detail page has no dedicated backend content of its own — it's a
// structured, deterministic reformatting of the campaign's existing
// description/icps, mirroring the shape naano.com shows for a generated brief.
export function generateCampaignBrief(campaign: Campaign): CampaignBrief {
  const name = campaign.companyName || "The company";
  const audiences = campaign.icps.map((icp) => icp.title).join(", ") || "the company's ideal customers";

  return {
    contextObjective: `${name} is described by the company as ${campaign.description} The intended audience is professionals connected to ${audiences}. Introduce the product through your own expertise, adapt the angle to your audience, and keep every claim grounded in the confirmed company profile.`,
    tone: "Clear, useful and natural. Keep the creator's own voice rather than following a script.",
    editorialDo: [
      `Use only the confirmed information about ${name}.`,
      "Connect the product to a practical audience question.",
      "Disclose the sponsored partnership clearly.",
    ],
    editorialAvoid: [
      "Do not invent customers, results, figures or features.",
      "Do not force an endorsement or promise outcomes.",
    ],
    angles: (campaign.icps.length > 0
      ? campaign.icps
      : [{ title: "your audience", description: "the people who care most about this product." }]
    ).map((icp, i) => ({
      title: i === 0 ? "A practical introduction" : `Speak to the ${icp.title}`,
      instruction: `Start with the problem ${name} helps its audience understand, then introduce the product naturally.`,
      guidance: `Choose one practical question your ${icp.title.toLowerCase()} audience recognises, then explain where the product fits using your own point of view.`,
      postExample: `A common challenge for ${icp.title} is understanding where ${name} fits in their work. In this post, I will share my perspective on that problem and explain how ${name} approaches it, using only the company's confirmed information. Sponsored partnership with ${name}.`,
    })),
  };
}
