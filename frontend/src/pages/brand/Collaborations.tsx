import { useState } from "react";

const TABS = ["All", "Active", "Invitations received", "Invitations sent", "To do", "Completed"];

export default function Collaborations() {
  const [tab, setTab] = useState("All");

  return (
    <div>
      <h1 className="text-2xl font-bold text-naano-dark">Collaborations</h1>
      <p className="text-sm text-gray-500 mt-1">
        Every step tells you where you stand, what to do, and what happens if you do nothing.
      </p>

      <div className="flex items-center gap-4 border-b border-gray-100 mt-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-sm font-medium pb-3 border-b-2 -mb-px ${
              tab === t ? "border-naano-blue text-naano-blue" : "border-transparent text-gray-400"
            }`}
          >
            {t} <span className="text-xs">0</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-card border border-gray-100 mt-4">
        <div className="grid grid-cols-6 gap-4 px-5 py-3 text-xs font-medium text-gray-400 border-b border-gray-100">
          <span>Creator</span>
          <span>Campaign</span>
          <span>Status</span>
          <span>Next action</span>
          <span>Due date</span>
          <span>Amount</span>
        </div>
        <p className="text-sm text-gray-400 text-center py-10">
          No collaborations yet, invite a creator from the Creators tab.
        </p>
      </div>
    </div>
  );
}
