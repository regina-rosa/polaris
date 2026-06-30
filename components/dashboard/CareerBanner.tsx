import Link from "next/link";

export default function CareerBanner() {
  return (
    <div className="rounded-[2rem] border border-indigo-200 bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200">Career Switch Journey</p>
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
              Cybersecurity Engineer
            </span>
            <span className="text-indigo-200 text-lg">→</span>
            <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-indigo-700 shadow-sm">
              IT Auditor ✦
            </span>
          </div>
          <p className="mt-3 text-sm text-indigo-100 max-w-lg">
            Kamu punya keunggulan besar: background teknis yang dalam. Auditor tanpa pengalaman engineering tidak bisa melihat risiko seperti yang kamu lihat.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end shrink-0">
          <Link
            href="/audit-simulation"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-50 transition shadow-sm text-center"
          >
            🧪 Coba Audit Simulation
          </Link>
          <Link
            href="/interview-lab"
            className="rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition text-center"
          >
            🎤 Latihan Interview
          </Link>
        </div>
      </div>
    </div>
  );
}
