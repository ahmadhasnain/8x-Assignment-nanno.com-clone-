import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Affiliate() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  function copyLink() {
    const url = `${window.location.origin}/register?ref=${user?.id ?? ""}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="text-center max-w-xl mx-auto pt-10">
      <span className="text-xs font-medium bg-naano-blue/10 text-naano-blue px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-naano-blue" />
        Creator affiliation · 25% for 3 months
      </span>
      <h1 className="text-3xl font-bold text-naano-dark mt-4">Recommend naano. Earn for 3 months.</h1>
      <p className="text-sm text-gray-500 mt-3">
        Share your personal link with a company. If it joins naano and launches paid campaigns, you receive 25% of
        naano's commission for three months.
      </p>
      <button
        onClick={copyLink}
        className="mt-6 bg-naano-dark text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-naano-dark/90"
      >
        {copied ? "Link copied!" : "Copy my referral link"}
      </button>
    </div>
  );
}
