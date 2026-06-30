import Link from "next/link";

const PATH = [
  {
    step: 1,
    label: "Pahami Frameworks Dulu",
    description: "Baca ISO 27002 dan NIST CSF di Knowledge Hub — ini pondasi semua audit IT.",
    href: "/knowledge",
    cta: "Mulai belajar",
    done: false,
    color: "border-l-indigo-400",
  },
  {
    step: 2,
    label: "Kenali Tools Audit",
    description: "Buka Audit Toolkit dan explore semua controls. Coba search control yang relate ke cybersecurity.",
    href: "/audit-toolkit",
    cta: "Buka Toolkit",
    done: false,
    color: "border-l-blue-400",
  },
  {
    step: 3,
    label: "Latihan Identifikasi Risiko",
    description: "Tambah risiko di Risk Register dan hitung scoring L×I. Coba buat 5 risiko dari pengalamanmu.",
    href: "/risk-register",
    cta: "Buka Risk Register",
    done: false,
    color: "border-l-orange-400",
  },
  {
    step: 4,
    label: "Jalankan Full Audit Simulation",
    description: "Ini yang paling penting. Jalankan simulasi end-to-end dan generate report — ini yang ditunjukkan ke interviewer.",
    href: "/audit-simulation",
    cta: "Mulai Simulasi",
    done: false,
    color: "border-l-green-500",
  },
  {
    step: 5,
    label: "Persiapan Interview",
    description: "Latih 30+ pertanyaan interview di Interview Lab. Tandai yang sudah dikuasai, fokus di yang belum.",
    href: "/interview-lab",
    cta: "Latihan Interview",
    done: false,
    color: "border-l-rose-400",
  },
];

const TIPS = [
  { icon: "💡", text: "Background engineering kamu adalah keunggulan — kamu bisa audit teknis lebih dalam dari auditor tanpa background IT." },
  { icon: "📄", text: "Report dari Audit Simulation bisa langsung ditunjukkan ke interviewer sebagai bukti kerja nyata." },
  { icon: "🎯", text: "Fokus dulu di ISO 27001 dan Risk Assessment — ini yang paling sering ditanya di interview IT auditor entry-level." },
];

export default function LearningPath() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      {/* Learning Path */}
      <div className="rounded-[2rem] border border-blue-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">🗺️ Recommended Learning Path</h2>
        <p className="mt-1 text-xs text-slate-400">Urutan belajar yang direkomendasikan untuk career switch ke IT Auditor</p>
        <div className="mt-5 space-y-0">
          {PATH.map((item, idx) => (
            <div key={item.step} className="flex gap-4">
              {/* Connector line */}
              <div className="flex flex-col items-center">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${item.done ? "bg-green-500 text-white" : "bg-indigo-100 text-indigo-700"}`}>
                  {item.done ? "✓" : item.step}
                </div>
                {idx < PATH.length - 1 && (
                  <div className="w-0.5 flex-1 bg-slate-100 my-1" />
                )}
              </div>
              {/* Content */}
              <div className={`pb-5 flex-1 border-l-2 pl-4 ${item.color} border-opacity-0`}>
                <p className="font-semibold text-sm text-slate-800">{item.label}</p>
                <p className="mt-0.5 text-xs text-slate-500 leading-5">{item.description}</p>
                <Link
                  href={item.href}
                  className="mt-2 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition"
                >
                  {item.cta} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="space-y-4">
        <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <h2 className="text-base font-bold text-amber-800">💬 Tips untuk Career Switch</h2>
          <div className="mt-4 space-y-4">
            {TIPS.map((tip) => (
              <div key={tip.text} className="flex gap-3">
                <span className="text-lg shrink-0">{tip.icon}</span>
                <p className="text-xs leading-5 text-amber-900">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-blue-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-800">🎓 Sertifikasi Target</h2>
          <div className="mt-4 space-y-3">
            {[
              { name: "CISA", org: "ISACA", desc: "Certified Information Systems Auditor — gold standard untuk IT auditor", level: "Advanced" },
              { name: "ISO 27001 LA", org: "BSI/CQI", desc: "Lead Auditor — cocok kalau mau jadi auditor eksternal", level: "Intermediate" },
              { name: "CompTIA Security+", org: "CompTIA", desc: "Bagus sebagai bridge dari engineering ke audit", level: "Beginner" },
            ].map((cert) => (
              <div key={cert.name} className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-slate-800">{cert.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    cert.level === "Beginner" ? "bg-green-100 text-green-700" :
                    cert.level === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>{cert.level}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{cert.org}</p>
                <p className="text-xs text-slate-500 mt-1">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
