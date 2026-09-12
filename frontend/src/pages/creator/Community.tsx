export default function Community() {
  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-naano-dark">Community</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-lg">
            Learn with other B2B creators, share what works and make your Naano identity visible.
          </p>
        </div>
        <span className="text-xs font-medium bg-green-50 text-green-600 px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Creator network
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-card border border-gray-100 p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Naano creators community</p>
          <h3 className="text-lg font-bold text-naano-dark mt-1">The room where B2B creators get better together.</h3>
          <p className="text-sm text-gray-500 mt-2">
            Ask for feedback on a sponsored post, compare campaign lessons, meet creators in your language and help
            shape what naano builds next.
          </p>
          <div className="mt-4 space-y-1.5 text-sm text-gray-500">
            <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Get feedback before you publish</div>
            <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Share campaign tips that work</div>
            <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Talk directly with the naano team</div>
          </div>
          <button
            disabled
            className="mt-4 w-full text-sm font-medium border border-gray-200 rounded-xl px-4 py-2.5 text-gray-400 cursor-not-allowed"
          >
            Join the community (coming soon)
          </button>
        </div>

        <div className="bg-white rounded-card border border-gray-100 p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">LinkedIn visibility</p>
          <h3 className="text-lg font-bold text-naano-dark mt-1">Turn your LinkedIn profile into an always-on card.</h3>
          <p className="text-sm text-gray-500 mt-2">
            Add your creator card to LinkedIn so brands can discover your work and reach out directly.
          </p>
          <div className="mt-4 bg-naano-blue/5 rounded-xl p-4 text-sm text-gray-500">
            Leave your card link on your LinkedIn profile so brands can find your marketplace card straight from
            your experience section.
          </div>
        </div>
      </div>
    </div>
  );
}
