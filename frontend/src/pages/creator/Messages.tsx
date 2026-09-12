export default function Messages() {
  return (
    <div className="h-full -m-8 flex" style={{ height: "calc(100vh - 4rem)" }}>
      <div className="w-80 border-r border-gray-100 bg-white shrink-0">
        <div className="p-6 pb-4">
          <h1 className="text-2xl font-bold text-naano-dark">Messages</h1>
        </div>
        <div className="px-4 pb-4">
          <input
            type="text"
            disabled
            placeholder="Search conversations"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50"
          />
        </div>
        <div className="px-2">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-naano-blue/5">
            <div className="w-9 h-9 rounded-full bg-naano-dark text-white flex items-center justify-center text-xs font-semibold">
              N
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-naano-dark">NaanoBot</div>
              <div className="text-xs text-gray-400 truncate">A question or need help? Start here.</div>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 px-6 mt-4">No conversations yet — the thread opens with your first booking.</p>
      </div>
      <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
        Select a conversation
      </div>
    </div>
  );
}
