export default function MissionCard() {
  const missions = [
    { title: "Finish ISO 27002 Control 5.1", done: true },
    { title: "Read Risk Assessment", done: true },
    { title: "Complete Audit Case #1", done: false },
    { title: "Practice 5 Interview Questions", done: false },
  ];

  return (
    <div className="rounded-[2rem] border border-blue-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-indigo-700">
        🎯 Today's Mission
      </h2>

      <div className="mt-5 space-y-4">
        {missions.map((mission) => (
          <div key={mission.title} className="flex items-center gap-3 rounded-3xl bg-indigo-50 p-4 transition hover:bg-indigo-100">
            <span className="text-xl">
              {mission.done ? "✅" : "⬜"}
            </span>

            <p className={mission.done ? "text-slate-500 line-through" : "text-slate-700"}>
              {mission.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
