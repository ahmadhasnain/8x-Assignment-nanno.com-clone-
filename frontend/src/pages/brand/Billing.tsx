export default function Billing() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-naano-dark">Billing</h1>
      <p className="text-sm text-gray-500 mt-1">Top up your wallet and manage how you pay creators.</p>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="bg-gradient-to-br from-naano-blue/10 to-indigo-50 rounded-card p-5">
          <div className="text-xs text-gray-500">Wallet balance</div>
          <div className="text-2xl font-bold text-naano-dark mt-1">€0</div>
          <div className="text-xs text-gray-400 mt-1">Top up to book creators.</div>
        </div>
        <div className="bg-white rounded-card border border-gray-100 p-5">
          <div className="text-xs text-gray-500">Committed this month</div>
          <div className="text-2xl font-bold text-naano-dark mt-1">€0</div>
        </div>
        <div className="bg-white rounded-card border border-gray-100 p-5">
          <div className="text-xs text-gray-500">Invoices</div>
          <div className="text-2xl font-bold text-naano-dark mt-1">0</div>
        </div>
      </div>

      <div className="bg-white rounded-card border border-gray-100 p-6 mt-4">
        <h3 className="font-semibold text-naano-dark">Payment method</h3>
        <p className="text-xs text-gray-400 mt-1">No card on file.</p>
        <div className="mt-4 border border-naano-blue/40 bg-naano-blue/5 rounded-xl p-3 text-sm">
          <div className="font-medium text-naano-dark">Credit card</div>
          <div className="text-xs text-gray-400 mt-0.5">Not connected</div>
        </div>
        <button
          disabled
          className="mt-4 w-full bg-gray-100 text-gray-400 text-sm font-medium py-2.5 rounded-xl cursor-not-allowed"
        >
          Top up your wallet
        </button>
      </div>
    </div>
  );
}
