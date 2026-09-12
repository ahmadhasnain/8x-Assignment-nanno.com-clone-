import { Link } from "react-router-dom";
import { useCreatorProfile } from "../../hooks/useCreatorProfile";
import { IconIdCard, IconStore, IconLayers } from "../../components/icons";

export default function Overview() {
  const { profile, loading, error } = useCreatorProfile();

  if (loading) return <p className="text-gray-400 text-sm">Loading…</p>;
  if (error) return <p className="text-red-500 text-sm">{error}</p>;
  if (!profile) return null;

  return (
    <div>
      <p className="text-xs font-semibold text-naano-blue uppercase tracking-wide">Creator workspace</p>
      <h1 className="text-3xl font-bold text-naano-dark mt-1">Welcome</h1>
      <p className="text-sm text-gray-500 mt-1">Your creator activity, at a glance.</p>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-card border border-gray-100 p-6">
          <div className="flex items-center gap-2 text-naano-dark">
            <IconIdCard />
            <h3 className="font-semibold">Your creator card</h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">This is how brands discover your positioning and collaboration offer.</p>
          <div className="flex flex-col gap-2 mt-4">
            <Link
              to="/creator/card"
              className="text-sm font-medium border border-gray-200 rounded-xl px-4 py-2 text-center hover:bg-gray-50"
            >
              Open card
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-card border border-gray-100 p-6">
          <h3 className="font-semibold text-naano-dark">Your launch guide</h3>
          <p className="text-sm text-gray-500 mt-1">Personalized for your Marketplace status.</p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px]">✓</span>
              Marketplace card created
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[10px]">2</span>
              Apply to your first opportunity
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[10px]">3</span>
              Complete your first collaboration
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-card border border-gray-100 p-6 mt-4">
        <h3 className="font-semibold text-naano-dark">Brand invitations</h3>
        <p className="text-sm text-gray-500 mt-1">Accept before the deadline, otherwise the invitation expires and nothing is charged to the brand.</p>
        <p className="text-sm text-gray-300 mt-4">No invitations yet.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <Link
          to="/creator/opportunities"
          className="bg-white rounded-card border border-gray-100 p-6 hover:border-naano-blue/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-naano-dark font-semibold">
              <IconStore />
              Recommended opportunities
            </div>
            <span className="text-sm text-naano-blue font-medium">Explore</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">The campaigns that best match your audience.</p>
        </Link>
        <Link
          to="/creator/collaborations"
          className="bg-white rounded-card border border-gray-100 p-6 hover:border-naano-blue/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-naano-dark font-semibold">
              <IconLayers />
              Active collaborations
            </div>
            <span className="text-sm text-naano-blue font-medium">See all</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Everything currently moving from brief to publication.</p>
        </Link>
      </div>
    </div>
  );
}
