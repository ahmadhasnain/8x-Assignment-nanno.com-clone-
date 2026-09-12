import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, apiErrorMessage } from "../../lib/api";
import type { Campaign } from "../../lib/types";
import { generateCampaignBrief } from "../../lib/campaignBrief";

const TABS = ["Collaborations", "Brief", "Shortlist", "Analytics"] as const;
type Tab = (typeof TABS)[number];

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("Brief");

  useEffect(() => {
    api
      .get<Campaign>(`/companies/me/campaigns/${id}`)
      .then(({ data }) => setCampaign(data))
      .catch((err) => setError(apiErrorMessage(err, "Could not load this campaign")))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-sm text-gray-400">Loading campaign…</p>;
  if (error || !campaign) return <p className="text-sm text-red-500">{error || "Campaign not found"}</p>;

  const brief = generateCampaignBrief(campaign);

  return (
    <div>
      <Link to="/brand/campaigns" className="text-sm text-gray-500 hover:text-naano-dark">
        ← Campaigns
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-4 mt-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-naano-dark">{campaign.title}</h1>
          <span className="text-xs font-medium bg-green-50 text-green-600 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            {campaign.status}
          </span>
        </div>
        <Link
          to="/brand/creators"
          className="bg-naano-blue text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-naano-blue/90"
        >
          Invite a creator
        </Link>
      </div>

      <div className="flex items-center gap-1 border-b border-gray-100 mt-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-sm font-medium px-4 py-2.5 -mb-px border-b-2 ${
              tab === t ? "border-naano-dark text-naano-dark" : "border-transparent text-gray-500 hover:text-naano-dark"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Brief" && (
        <div className="bg-white rounded-card border border-gray-100 p-6 mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-naano-dark">Campaign brief</h2>
            <span className="text-xs font-medium bg-naano-blue/10 text-naano-blue px-2.5 py-1 rounded-full">
              Naano AI
            </span>
          </div>

          <section>
            <h3 className="font-semibold text-naano-dark mb-2">Context & objective</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{brief.contextObjective}</p>
          </section>

          <hr className="border-gray-100" />

          <section>
            <h3 className="font-semibold text-naano-dark mb-2">Audience & tone</h3>
            <p className="text-xs text-gray-400">Tone</p>
            <p className="text-sm text-gray-600 mt-1">{brief.tone}</p>
          </section>

          <hr className="border-gray-100" />

          <section>
            <h3 className="font-semibold text-naano-dark mb-3">Editorial rules</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-400 mb-1">Do</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {brief.editorialDo.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Avoid</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {brief.editorialAvoid.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section>
            <h3 className="font-semibold text-naano-dark mb-3">Angles & post examples</h3>
            <div className="space-y-5">
              {brief.angles.map((angle, i) => (
                <div key={angle.title}>
                  <p className="text-sm font-semibold text-naano-dark">
                    <span className="text-gray-400 font-normal mr-2">{String(i + 1).padStart(2, "0")}</span>
                    {angle.title}
                  </p>
                  <p className="text-sm text-gray-600 border-l-2 border-gray-200 pl-3 mt-2">{angle.instruction}</p>
                  <p className="text-sm text-gray-600 mt-2">{angle.guidance}</p>
                  <details className="mt-2">
                    <summary className="text-sm text-naano-blue cursor-pointer select-none">Post example</summary>
                    <p className="text-sm text-gray-600 mt-2">{angle.postExample}</p>
                  </details>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {tab === "Collaborations" && (
        <div className="bg-white rounded-card border border-gray-100 p-6 mt-6">
          <p className="text-sm text-gray-400">No collaborations yet, invite a creator from the Marketplace.</p>
          <Link to="/brand/creators" className="text-sm font-medium text-naano-blue hover:underline mt-2 inline-block">
            Browse creators →
          </Link>
        </div>
      )}

      {tab === "Shortlist" && (
        <div className="bg-white rounded-card border border-gray-100 p-6 mt-6">
          <h3 className="font-semibold text-naano-dark">Shortlist</h3>
          <p className="text-sm text-gray-500 mt-1">Save creators from the marketplace to build your shortlist.</p>
          <Link
            to="/brand/creators"
            className="inline-block mt-3 border border-gray-200 text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-50"
          >
            Find creators
          </Link>
        </div>
      )}

      {tab === "Analytics" && (
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-card border border-gray-100 p-5">
            <p className="text-xs text-gray-400">Est. reach</p>
            <p className="text-2xl font-bold text-naano-dark mt-1">0</p>
            <p className="text-xs text-gray-400 mt-1">No published posts yet</p>
          </div>
          <div className="bg-white rounded-card border border-gray-100 p-5">
            <p className="text-xs text-gray-400">Qualified clicks</p>
            <p className="text-2xl font-bold text-naano-dark mt-1">0</p>
            <p className="text-xs text-gray-400 mt-1">Since the campaign started</p>
          </div>
          <div className="bg-white rounded-card border border-gray-100 p-5">
            <p className="text-xs text-gray-400">Committed budget</p>
            <p className="text-2xl font-bold text-naano-dark mt-1">€0</p>
            <p className="text-xs text-gray-400 mt-1">Since the campaign started</p>
          </div>
        </div>
      )}
    </div>
  );
}
