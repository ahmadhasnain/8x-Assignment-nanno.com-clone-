import { useEffect, useState } from "react";
import { api, apiErrorMessage } from "../../lib/api";
import type { MarketplaceCreator } from "../../lib/types";
import { MarketplaceCard } from "../../components/MarketplaceCard";

const INDUSTRIES = [
  "Technology",
  "Marketing",
  "Sales",
  "Finance",
  "HR",
  "Healthcare",
  "Education",
  "Real Estate",
  "E-commerce",
  "Consulting",
];

export default function Creators() {
  const [creators, setCreators] = useState<MarketplaceCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");

  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (industry) params.industry = industry;

    const timeout = setTimeout(() => {
      setLoading(true);
      api
        .get<MarketplaceCreator[]>("/marketplace/creators", { params })
        .then(({ data }) => setCreators(data))
        .catch((err) => setError(apiErrorMessage(err)))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timeout);
  }, [search, industry]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-naano-dark">Creators</h1>
      <p className="text-sm text-gray-500 mt-1">Browse LinkedIn creators available for sponsored posts.</p>

      <div className="flex flex-wrap gap-3 mt-6">
        <input
          type="text"
          placeholder="Search by name, headline, bio…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-naano-blue bg-white"
        />
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-naano-blue bg-white"
        >
          <option value="">All industries</option>
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-400 mt-10">Loading creators…</p>
      ) : creators.length === 0 ? (
        <p className="text-sm text-gray-400 mt-10">No creators match your filters yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {creators.map((creator) => (
            <MarketplaceCard key={creator.id} creator={creator} />
          ))}
        </div>
      )}
    </div>
  );
}
