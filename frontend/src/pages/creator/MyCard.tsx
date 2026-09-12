import { useState } from "react";
import { useCreatorProfile } from "../../hooks/useCreatorProfile";
import { MarketplaceCard } from "../../components/MarketplaceCard";

export default function MyCard() {
  const { profile, loading, error } = useCreatorProfile();
  const [copied, setCopied] = useState(false);

  if (loading) return <p className="text-gray-400 text-sm">Loading…</p>;
  if (error) return <p className="text-red-500 text-sm">{error}</p>;
  if (!profile) return null;

  function copyLink() {
    const url = `${window.location.origin}/marketplace/creators/${profile!.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-semibold text-naano-blue uppercase tracking-wide">Your creator storefront</p>
          <h1 className="text-2xl font-bold text-naano-dark mt-1">Your Naano card, ready to travel.</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-lg">
            Share clear proof of your positioning, audience and offers. This is how brands see you on the naano
            marketplace.
          </p>
        </div>
        <button
          onClick={copyLink}
          className="text-sm font-medium bg-naano-dark text-white px-4 py-2 rounded-xl hover:bg-naano-dark/90 shrink-0"
        >
          {copied ? "Link copied!" : "Copy card link"}
        </button>
      </div>

      <div className="mt-8">
        <MarketplaceCard
          creator={{
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
            industries: profile.industries,
            bio: profile.bio,
            pricePerPost: profile.pricePerPost,
          }}
        />
      </div>
    </div>
  );
}
