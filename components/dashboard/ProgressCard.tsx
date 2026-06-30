export default function ProgressCard() {
  return (
    <div className="rounded-[2rem] border border-blue-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-indigo-700">
        📚 Continue Learning
      </h2>

      <p className="mt-6 text-slate-700">
        ISO 27002
      </p>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-blue-100">
        <div className="h-full w-[18%] rounded-full bg-indigo-600" />
      </div>

      <p className="mt-4 text-3xl font-bold text-slate-800">
        18%
      </p>
    </div>
  );
}
