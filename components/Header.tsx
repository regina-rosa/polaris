export default function Header() {
  return (
    <header className="flex flex-col gap-6 rounded-[2rem] border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          Good Evening, Scarlet 👋
        </h2>

        <p className="mt-2 text-slate-600">
          Ready for today's audit?
        </p>
      </div>

      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-200 font-bold text-indigo-700 shadow-sm">
        S
      </div>
    </header>
  );
}
