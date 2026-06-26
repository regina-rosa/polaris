export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center px-6">
        <p className="text-sky-400 text-sm tracking-[0.3em] uppercase">
          AI-Assisted IT Audit Workspace
        </p>

        <h1 className="mt-6 text-6xl font-bold">
          Polaris
        </h1>

        <p className="mt-6 text-xl text-slate-300 max-w-2xl">
          Think Like an Auditor.
        </p>

        <p className="mt-4 text-slate-400 max-w-2xl">
          Learn ISO 27002, perform IT audits, review policies,
          identify control gaps, and prepare for interviews —
          all in one workspace.
        </p>

        <button className="mt-10 rounded-xl bg-sky-500 px-8 py-4 font-semibold hover:bg-sky-400 transition">
          Start Learning
        </button>
      </div>
    </main>
  );
}