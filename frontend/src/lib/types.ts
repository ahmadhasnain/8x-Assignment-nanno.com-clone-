export type Role = "CREATOR" | "COMPANY";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  onboardingStep: number;
  linkedinUrl: string | null;
  fullName: string | null;
  headline: string | null;
  photoUrl: string | null;
  country: string | null;
  countryFlag: string | null;
  followers: number | null;
  reactionsPerPost: number | null;
  impressionsPerPost: number | null;
  commentsPerPost: number | null;
  engagementRate: number | null;
  industries: string[];
  bio: string | null;
  pricePerPost: number | null;
  bundleEnabled: boolean;
  completed: boolean;
}

export type MarketplaceCreator = Omit<
  CreatorProfile,
  "userId" | "onboardingStep" | "linkedinUrl" | "bundleEnabled" | "completed"
>;

export interface ICP {
  title: string;
  description: string;
}

export interface CompanyProfile {
  id: string;
  userId: string;
  onboardingStep: number;
  companyName: string | null;
  website: string | null;
  valueProposition: string | null;
  icps: ICP[];
  completed: boolean;
}

export interface Campaign {
  id: string;
  companyId: string;
  companyName: string | null;
  title: string;
  description: string;
  icps: ICP[];
  status: string;
  createdAt: string;
}
