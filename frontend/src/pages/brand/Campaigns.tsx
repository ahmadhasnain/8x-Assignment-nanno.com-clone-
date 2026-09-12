import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, apiErrorMessage } from "../../lib/api";
import type { Campaign } from "../../lib/types";

const TABS = ["All", "Active", "Draft", "Completed"];

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("All");

  useEffect(() => {
    api
      .get<Campaign[]>("/companies/me/campaigns")
      .then(({ data }) => setCampaigns(data))
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    tab === "All" ? campaigns : campaigns.filter((c) => c.status.toLowerCase() === tab.toLowerCase());

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-naano-dark">Campaigns</h1>
        <Link
          to="/brand/campaigns/new"
          className="bg-naano-blue text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-naano-blue/90"
        >
          + Create a campaign
        </Link>
      </div>

      <div className="flex items-center gap-1 border border-gray-200 rounded-full p-1 mt-6 w-fit bg-white">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-sm font-medium px-4 py-1.5 rounded-full ${
              tab === t ? "bg-naano-dark text-white" : "text-gray-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-400 mt-8">Loading campaigns…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-400 mt-8">No campaigns in this view yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {filtered.map((campaign) => (
            <Link
              key={campaign.id}
              to={`/brand/campaigns/${campaign.id}`}
              className="bg-white rounded-card border border-gray-100 p-6 hover:border-naano-blue/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium bg-green-50 text-green-600 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {campaign.status}
                </span>
                <span className="text-xs text-gray-400">
                  Created on {new Date(campaign.createdAt).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h3 className="font-semibold text-naano-dark mt-3">{campaign.title}</h3>
              <p className="text-sm text-gray-500 mt-2 line-clamp-3">{campaign.description}</p>
              <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                <div className="border border-gray-100 rounded-xl py-2">
                  <div className="font-bold text-naano-dark">0</div>
                  <div className="text-xs text-gray-400">Creators</div>
                </div>
                <div className="border border-gray-100 rounded-xl py-2">
                  <div className="font-bold text-naano-dark">0</div>
                  <div className="text-xs text-gray-400">Published</div>
                </div>
                <div className="border border-gray-100 rounded-xl py-2">
                  <div className="font-bold text-naano-dark">€0</div>
                  <div className="text-xs text-gray-400">Committed</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">{campaign.icps.length} ideal customer profiles attached</p>
            </Link>
          ))}

          {tab === "All" && (
            <Link
              to="/brand/campaigns/new"
              className="border border-dashed border-gray-200 rounded-card p-6 hover:border-naano-blue/40 transition-colors"
            >
              <h3 className="font-semibold text-naano-dark">Create a campaign</h3>
              <p className="text-sm text-gray-500 mt-2">
                Launch a new campaign in 2 minutes — with AI, the Naano team, or an existing link.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                <div className="border border-gray-100 rounded-xl py-2">
                  <div className="font-bold text-gray-300">—</div>
                  <div className="text-xs text-gray-400">Creators</div>
                </div>
                <div className="border border-gray-100 rounded-xl py-2">
                  <div className="font-bold text-gray-300">—</div>
                  <div className="text-xs text-gray-400">Published</div>
                </div>
                <div className="border border-gray-100 rounded-xl py-2">
                  <div className="font-bold text-gray-300">—</div>
                  <div className="text-xs text-gray-400">Committed budget</div>
                </div>
              </div>
              <span className="inline-block mt-4 bg-naano-blue text-white text-sm font-medium px-4 py-2 rounded-xl">
                Get started →
              </span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
