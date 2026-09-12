const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sept"];

export default function Results() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-naano-dark">Results</h1>
      <p className="text-sm text-gray-500 mt-1">Track reach, clicks and spend across your campaigns.</p>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-card border border-gray-100 p-5">
          <div className="text-xs text-gray-500">Est. reach</div>
          <div className="text-2xl font-bold text-naano-dark mt-1">0</div>
          <div className="text-xs text-gray-400 mt-1">No published posts yet</div>
        </div>
        <div className="bg-white rounded-card border border-gray-100 p-5">
          <div className="text-xs text-gray-500">Qualified clicks</div>
          <div className="text-2xl font-bold text-naano-dark mt-1">0</div>
          <div className="text-xs text-gray-400 mt-1">Last 30 days</div>
        </div>
        <div className="bg-white rounded-card border border-gray-100 p-5">
          <div className="text-xs text-gray-500">Committed budget</div>
          <div className="text-2xl font-bold text-naano-dark mt-1">€0</div>
          <div className="text-xs text-gray-400 mt-1">0 bookings</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white rounded-card border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-naano-dark">Performance over time</h3>
            <span className="text-xs text-gray-400">Qualified clicks</span>
          </div>
          <div className="flex items-end justify-between gap-2 mt-6 h-32">
            {MONTHS.map((m) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full h-1.5 bg-naano-blue/20 rounded-full" />
                <span className="text-xs text-gray-400">{m}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-card border border-gray-100 p-6">
          <h3 className="font-semibold text-naano-dark">Post performance</h3>
          <p className="text-xs text-gray-400 mt-1">Latest metrics collected from your posts.</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Posts</span>
              <span className="font-semibold text-naano-dark">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Reactions</span>
              <span className="font-semibold text-naano-dark">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Comments</span>
              <span className="font-semibold text-naano-dark">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
