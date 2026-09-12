import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCompanyProfile } from "../../hooks/useCompanyProfile";
import { api } from "../../lib/api";
import type { MarketplaceCreator } from "../../lib/types";
import { IconStore, IconLayers } from "../../components/icons";

export default function Overview() {
  const { profile, loading } = useCompanyProfile();
  const [creators, setCreators] = useState<MarketplaceCreator[]>([]);

  useEffect(() => {
    api
      .get<MarketplaceCreator[]>("/marketplace/creators")
      .then(({ data }) => setCreators(data.slice(0, 4)))
      .catch(() => setCreators([]));
  }, []);

  if (loading || !profile) {
    return <div className="text-sm text-gray-400">Loading…</div>;
  }

  return (
    <div>
      <p className="text-sm text-gray-500">Hello {profile.companyName} 👋</p>
      <h1 className="text-2xl font-bold text-naano-dark mt-1">
        Here is what is happening for {profile.companyName} on naano.
      </h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-card border border-gray-100 p-5">
          <div className="text-xs text-gray-500">Creators activated</div>
          <div className="text-2xl font-bold text-naano-dark mt-1">0</div>
        </div>
        <div className="bg-white rounded-card border border-gray-100 p-5">
          <div className="text-xs text-gray-500">Posts published</div>
          <div className="text-2xl font-bold text-naano-dark mt-1">0</div>
        </div>
        <div className="bg-white rounded-card border border-gray-100 p-5">
          <div className="text-xs text-gray-500">Profiles engaged</div>
          <div className="text-2xl font-bold text-naano-dark mt-1">0</div>
        </div>
        <div className="bg-white rounded-card border border-gray-100 p-5">
          <div className="text-xs text-gray-500">Impressions</div>
          <div className="text-2xl font-bold text-naano-dark mt-1">0</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white rounded-card border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-naano-dark">To do</h3>
            <span className="text-xs text-gray-400">Priority actions</span>
          </div>
          <div className="mt-4 space-y-3">
            <Link
              to="/brand/creators"
              className="flex items-center justify-between text-sm border border-gray-100 rounded-xl px-4 py-3 hover:bg-gray-50"
            >
              <span className="flex items-center gap-2 text-naano-dark font-medium">
                <IconStore /> Find creators for your next campaign
              </span>
              <span className="text-xs font-medium bg-naano-blue/10 text-naano-blue px-2 py-1 rounded-full">
                Suggested
              </span>
            </Link>
            <Link
              to="/brand/campaigns"
              className="flex items-center justify-between text-sm border border-gray-100 rounded-xl px-4 py-3 hover:bg-gray-50"
            >
              <span className="flex items-center gap-2 text-naano-dark font-medium">
                <IconLayers /> Review your campaign brief
              </span>
              <span className="text-xs font-medium bg-green-50 text-green-600 px-2 py-1 rounded-full">Ready</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-card border border-gray-100 p-6">
          <h3 className="font-semibold text-naano-dark">Messages</h3>
          <p className="text-xs text-gray-400 mt-1">Waiting on your reply</p>
          <p className="text-sm text-gray-400 mt-8">No conversation yet.</p>
        </div>
      </div>

      <div className="bg-white rounded-card border border-gray-100 p-6 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-naano-dark">New creators</h3>
            <p className="text-xs text-gray-400 mt-0.5">Profiles that fit your buyers</p>
          </div>
          <Link to="/brand/creators" className="text-sm font-medium text-naano-blue hover:underline">
            Explore
          </Link>
        </div>
        {creators.length === 0 ? (
          <p className="text-sm text-gray-400 mt-6">No creators on the marketplace yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-5">
            {creators.map((creator) => (
              <Link
                key={creator.id}
                to="/brand/creators"
                className="border border-gray-100 rounded-xl p-4 hover:border-naano-blue/40"
              >
                <div className="w-10 h-10 rounded-full bg-naano-dark text-white flex items-center justify-center text-sm font-semibold overflow-hidden">
                  {creator.photoUrl ? (
                    <img src={creator.photoUrl} alt={creator.fullName ?? ""} className="w-full h-full object-cover" />
                  ) : (
                    creator.fullName?.[0] ?? "?"
                  )}
                </div>
                <div className="text-sm font-semibold text-naano-dark mt-2 truncate">{creator.fullName}</div>
                <div className="text-xs text-gray-400 truncate">{creator.industries?.join(" · ")}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
