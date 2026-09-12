import { useCreatorProfile } from "../../hooks/useCreatorProfile";
import { IconUsers, IconThumbsUp, IconEye, IconComment, IconTrendingUp } from "../../components/icons";

function formatNumber(n: number | null) {
  if (n === null || n === undefined) return "—";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}

export default function Analytics() {
  const { profile, loading, error } = useCreatorProfile();

  if (loading) return <p className="text-gray-400 text-sm">Loading…</p>;
  if (error) return <p className="text-red-500 text-sm">{error}</p>;
  if (!profile) return null;

  const stats = [
    { label: "Followers", value: formatNumber(profile.followers), icon: IconUsers },
    { label: "Reactions / post", value: formatNumber(profile.reactionsPerPost), icon: IconThumbsUp },
    { label: "Impressions / post", value: formatNumber(profile.impressionsPerPost), icon: IconEye },
    { label: "Comments / post", value: formatNumber(profile.commentsPerPost), icon: IconComment },
  ];

  const maxRate = 8;
  const bars = [
    { label: "Reactions", value: profile.reactionsPerPost ?? 0, max: (profile.followers ?? 1) * 0.1 },
    { label: "Impressions", value: profile.impressionsPerPost ?? 0, max: (profile.followers ?? 1) * 5 },
    { label: "Comments", value: profile.commentsPerPost ?? 0, max: (profile.followers ?? 1) * 0.02 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-naano-dark">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Public LinkedIn performance imported for this profile.</p>
        </div>
        <select
          disabled
          className="border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-500 bg-white"
        >
          <option>All time</option>
        </select>
      </div>

      <div className="mt-6 rounded-card bg-gradient-to-r from-naano-blue/10 to-indigo-100 p-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Public LinkedIn snapshot
          </div>
          <h2 className="text-xl font-bold text-naano-dark mt-1">Public LinkedIn profile imported</h2>
          <p className="text-sm text-gray-500 mt-1">
            Performance below reflects the public profile data connected during onboarding.
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-naano-dark">{profile.engagementRate ?? "—"}%</div>
          <div className="text-xs text-gray-400">engagement rate</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-card p-5 border border-gray-100 flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-400">{label}</div>
              <div className="text-xl font-bold text-naano-dark mt-1">{value}</div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-naano-blue/10 text-naano-blue flex items-center justify-center">
              <Icon />
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-card p-6 border border-gray-100">
          <div className="flex items-center gap-2">
            <IconTrendingUp />
            <h3 className="font-semibold text-naano-dark">Performance breakdown</h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">Per-post average, relative to your follower base.</p>
          <div className="mt-5 space-y-4">
            {bars.map((b) => {
              const pct = Math.min(100, Math.round((b.value / Math.max(1, b.max)) * 100));
              return (
                <div key={b.label}>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{b.label}</span>
                    <span>{formatNumber(b.value)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-naano-blue rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-card p-6 border border-gray-100">
          <h3 className="font-semibold text-naano-dark">Public profile summary</h3>
          <p className="text-xs text-gray-400 mt-1">Automatically collected from public LinkedIn data.</p>
          <div className="mt-5 space-y-3">
            {[
              ["LinkedIn followers", formatNumber(profile.followers)],
              ["Reactions per post", formatNumber(profile.reactionsPerPost)],
              ["Impressions per post", formatNumber(profile.impressionsPerPost)],
              ["Comments per post", formatNumber(profile.commentsPerPost)],
              ["Engagement rate", profile.engagementRate ? `${profile.engagementRate}%` : "—"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between text-sm border-b border-gray-50 pb-3">
                <span className="text-gray-500">{label}</span>
                <span className="font-semibold text-naano-dark">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
