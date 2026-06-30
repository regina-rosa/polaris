import Link from "next/link";

type Tool = {
  href: string;
  icon: string;
  label: string;
  description: string;
  tag: string;
  tagColor: string;
  border: string;
};

const TOOLS: Tool[] = [
  {
    href: "/audit-simulation",
    icon: "🧪",
    label: "Audit Simulation",
    description: "Jalankan audit end-to-end dengan studi kasus nyata — dari scoping sampai generate report PDF.",
    tag: "Flagship",
    tagColor: "bg-indigo-600 text-white",
    border: "border-indigo-200 hover:border-indigo-400",
  },
  {
    href: "/interview-lab",
    icon: "🎤",
    label: "Interview Lab",
    description: "30+ pertanyaan interview IT auditor dengan jawaban terstruktur dan pro tips. Ada progress tracker.",
    tag: "Career Prep",
    tagColor: "bg-rose-100 text-rose-700",
    border: "border-rose-100 hover:border-rose-300",
  },
  {
    href: "/audit-toolkit",
    icon: "📝",
    label: "Audit Toolkit",
    description: "Checklist lengkap ISO 27001 (114 controls), NIST CSF (108), dan SOC 2 (33). Bisa search dan filter.",
    tag: "Frameworks",
    tagColor: "bg-blue-100 text-blue-700",
    border: "border-blue-100 hover:border-blue-300",
  },
  {
    href: "/risk-register",
    icon: "📊",
    label: "Risk Register",
    description: "Buat dan kelola risk register interaktif. Scoring L×I, filter severity, export-ready.",
    tag: "Risk Mgmt",
    tagColor: "bg-orange-100 text-orange-700",
    border: "border-orange-100 hover:border-orange-300",
  },
  {
    href: "/evidence-library",
    icon: "📋",
    label: "Evidence Library",
    description: "Referensi lengkap tiap jenis bukti audit: yang harus dicari, red flags, dan template email request.",
    tag: "Reference",
    tagColor: "bg-teal-100 text-teal-700",
    border: "border-teal-100 hover:border-teal-300",
  },
  {
    href: "/ai-policy-review",
    icon: "🤖",
    label: "AI Policy Review",
    description: "Framework untuk audit AI governance: risiko AI, template kebijakan, dan checklist EU AI Act.",
    tag: "Modern",
    tagColor: "bg-purple-100 text-purple-700",
    border: "border-purple-100 hover:border-purple-300",
  },
  {
    href: "/knowledge",
    icon: "📚",
    label: "Knowledge Hub",
    description: "Modul belajar ISO 27002, NIST CSF, Audit Evidence, dan Risk Assessment dengan penjelasan mendalam.",
    tag: "Learn",
    tagColor: "bg-green-100 text-green-700",
    border: "border-green-100 hover:border-green-300",
  },
  {
    href: "/settings",
    icon: "⚙️",
    label: "Settings",
    description: "Set nama, target role, timeline, dan focus area belajar kamu. Data disimpan di browser.",
    tag: "Profile",
    tagColor: "bg-slate-100 text-slate-600",
    border: "border-slate-200 hover:border-slate-300",
  },
];

export default function ToolGrid() {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-4">⚡ Semua Tools</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`group flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${tool.border}`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-2xl">{tool.icon}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tool.tagColor}`}>
                {tool.tag}
              </span>
            </div>
            <p className="mt-3 font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
              {tool.label}
            </p>
            <p className="mt-1.5 text-xs leading-5 text-slate-500 flex-1">
              {tool.description}
            </p>
            <p className="mt-3 text-xs font-semibold text-indigo-500 group-hover:text-indigo-700 transition-colors">
              Buka →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
