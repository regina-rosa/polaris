export default function QuickActions() {
  const actions = [
    "📚 Learn",
    "🤖 AI Auditor",
    "🧪 Audit Lab",
    "🎤 Interview Lab",
  ];

  return (
    <div className="rounded-[2rem] border border-blue-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-indigo-700">
        ⚡ Quick Actions
      </h2>

      <div className="mt-5 grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action}
            className="rounded-3xl bg-indigo-600 px-4 py-4 text-left text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}
