import { useState } from "react";

const TABS = ["All", "Active", "Needs action", "Applications sent", "Declined", "Completed"];

export default function Collaborations() {
  const [tab, setTab] = useState("All");

  return (
    <div>
      <h1 className="text-2xl font-bold text-naano-dark">Collaborations</h1>
      <p className="text-sm text-gray-500 mt-1">
        Every step tells you where you stand, what to do, and what happens if you do nothing.
      </p>

      <div className="flex items-center gap-5 mt-6 border-b border-gray-100 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 pb-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px ${
              tab === t ? "border-naano-blue text-naano-blue" : "border-transparent text-gray-400"
            }`}
          >
            {t}
            <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-1.5">0</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-card border border-gray-100 mt-4 overflow-hidden">
        <div className="grid grid-cols-6 gap-4 px-5 py-3 text-xs font-medium text-gray-400 border-b border-gray-100">
          <span>Brand</span>
          <span>Campaign</span>
          <span>Status</span>
          <span>Performance</span>
          <span>Next action</span>
          <span>Your net</span>
        </div>
        <div className="px-5 py-10 text-center text-sm text-gray-400">
          No collaborations yet. Brand invitations and your accepted applications land here.
        </div>
      </div>
    </div>
  );
}
