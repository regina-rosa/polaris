export default function RecentLearning() {
  const items = [
    "CIA Triad",
    "Risk Management",
    "Asset Inventory",
    "Threat Intelligence",
  ];

  return (
    <div className="rounded-[2rem] border border-blue-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-indigo-700">
        📖 Recent Learning
      </h2>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-3xl bg-indigo-50 px-4 py-3 text-slate-700 transition hover:bg-indigo-100"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
