export default function Opportunities() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-naano-dark">Opportunities</h1>
      <p className="text-sm text-gray-500 mt-1">
        Open brand campaigns — apply, the brand accepts, and the booking is created on your terms.
      </p>

      <div className="flex items-center gap-3 mt-6 flex-wrap">
        <span className="text-sm font-medium bg-naano-dark text-white px-4 py-1.5 rounded-full">All channels</span>
        <input
          type="text"
          disabled
          placeholder="Search for a campaign or a brand…"
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm flex-1 min-w-[220px] bg-gray-50"
        />
        <select disabled className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-500 bg-gray-50">
          <option>All industries</option>
        </select>
        <select disabled className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-500 bg-gray-50">
          <option>All countries</option>
        </select>
      </div>

      <div className="mt-6 bg-white rounded-card border border-dashed border-gray-200 p-16 text-center">
        <p className="text-gray-400">No open campaigns yet. Check back soon — new brand campaigns will appear here.</p>
      </div>
    </div>
  );
}
