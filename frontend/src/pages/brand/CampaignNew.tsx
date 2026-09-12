import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, apiErrorMessage } from "../../lib/api";
import type { Campaign } from "../../lib/types";

export default function CampaignNew() {
  const navigate = useNavigate();
  const [aiOpen, setAiOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post<Campaign>("/companies/me/campaigns", { prompt });
      navigate(`/brand/campaigns/${data.id}`);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not generate a brief"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link to="/brand/campaigns" className="text-sm text-gray-500 hover:text-naano-dark">
        ← Campaigns
      </Link>

      <h1 className="text-2xl font-bold text-naano-dark mt-2 text-center">How do you want to launch your campaign?</h1>
      <p className="text-sm text-gray-500 mt-1 text-center">Choose your method. You can change everything before launch.</p>

      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white rounded-card border border-gray-100 p-6 flex flex-col">
          <p className="text-xs text-gray-400">15 min</p>
          <h3 className="font-semibold text-naano-dark mt-2">Launch free with the Naano team</h3>
          <p className="text-sm text-gray-500 mt-2 flex-1">
            A campaign manager turns your selection into a ready-to-launch campaign. You validate, they handle the rest.
          </p>
          <button
            disabled
            title="Coming soon"
            className="bg-gray-100 text-gray-400 text-sm font-medium py-2.5 rounded-xl mt-4 cursor-not-allowed"
          >
            Book my onboarding →
          </button>
        </div>

        <div className="bg-white rounded-card border border-naano-blue/30 p-6 flex flex-col">
          <p className="text-xs text-gray-400">5 min</p>
          <h3 className="font-semibold text-naano-dark mt-2">Create with AI</h3>
          <p className="text-sm text-gray-500 mt-2 flex-1">AI asks the right questions and prepares a fully editable brief.</p>

          {!aiOpen ? (
            <button
              onClick={() => setAiOpen(true)}
              className="bg-naano-blue text-white text-sm font-medium py-2.5 rounded-xl mt-4 hover:bg-naano-blue/90"
            >
              Create with AI
            </button>
          ) : (
            <form onSubmit={onGenerate} className="mt-4 space-y-2">
              <textarea
                required
                autoFocus
                rows={3}
                placeholder="e.g. I want to reach VP Sales in B2B SaaS in France."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-naano-blue resize-none"
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-naano-blue text-white text-sm font-medium py-2.5 rounded-xl hover:bg-naano-blue/90 disabled:opacity-60"
              >
                {loading ? "Generating brief…" : "Generate brief"}
              </button>
            </form>
          )}
        </div>

        <div className="bg-white rounded-card border border-gray-100 p-6 flex flex-col">
          <p className="text-xs text-gray-400">1 min</p>
          <h3 className="font-semibold text-naano-dark mt-2">Start from your link</h3>
          <p className="text-sm text-gray-500 mt-2 flex-1">
            Paste an influence campaign you already ran: Naano reuses the brief and structure.
          </p>
          <button
            disabled
            title="Coming soon"
            className="bg-gray-100 text-gray-400 text-sm font-medium py-2.5 rounded-xl mt-4 cursor-not-allowed"
          >
            Start from my link →
          </button>
        </div>
      </div>
    </div>
  );
}
