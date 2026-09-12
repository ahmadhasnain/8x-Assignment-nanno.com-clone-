const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sept"];

export default function Earnings() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-naano-dark">Earnings</h1>
      <p className="text-sm text-gray-500 mt-1">Track revenue from your paid collaborations and withdraw available funds.</p>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="bg-gradient-to-br from-naano-blue/10 to-indigo-50 rounded-card p-5">
          <div className="text-xs text-gray-500">Total earned</div>
          <div className="text-2xl font-bold text-naano-dark mt-1">€0</div>
          <div className="text-xs text-gray-400 mt-1">0 paid collaborations · €0 average</div>
        </div>
        <div className="bg-white rounded-card border border-gray-100 p-5">
          <div className="text-xs text-gray-500">In transit</div>
          <div className="text-2xl font-bold text-naano-dark mt-1">€0</div>
          <div className="text-xs text-gray-400 mt-1">Transfers usually arrive within 1-7 days.</div>
        </div>
        <div className="bg-white rounded-card border border-gray-100 p-5">
          <div className="text-xs text-gray-500">Available now</div>
          <div className="text-2xl font-bold text-naano-dark mt-1">€0</div>
          <div className="text-xs text-gray-400 mt-1">Ready to withdraw to your selected payout method.</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white rounded-card border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-naano-dark">Earnings over time</h3>
            <span className="text-xs text-gray-400">€0 over 6 months</span>
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
          <h3 className="font-semibold text-naano-dark">Withdraw earnings</h3>
          <p className="text-xs text-gray-400 mt-1">Choose where your available balance should be sent.</p>
          <div className="mt-4 space-y-2">
            <div className="border border-gray-200 rounded-xl p-3 text-sm">
              <div className="font-medium text-naano-dark">Bank transfer</div>
              <div className="text-xs text-gray-400 mt-0.5">No account details on file</div>
            </div>
            <div className="border border-naano-blue/40 bg-naano-blue/5 rounded-xl p-3 text-sm">
              <div className="font-medium text-naano-dark">Stripe</div>
              <div className="text-xs text-gray-400 mt-0.5">Not connected</div>
            </div>
          </div>
          <button
            disabled
            className="mt-4 w-full bg-gray-100 text-gray-400 text-sm font-medium py-2.5 rounded-xl cursor-not-allowed"
          >
            No earnings available to withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
