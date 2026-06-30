"use client";

import { useState } from "react";
import Link from "next/link";
import KnowledgeShell from "@/components/KnowledgeShell";
import HowToUse from "@/components/HowToUse";

const MODULES = [
  {
    href: "/knowledge/iso27002",
    icon: "🔐",
    title: "ISO 27002 Essentials",
    description: "Panduan lengkap information security controls — 14 domain, mulai dari kebijakan sampai kriptografi. Ini fondasi paling penting untuk audit IT.",
    category: "Compliance",
    difficulty: "Intermediate",
    readTime: "12 min",
    topics: ["14 control domains", "Control objectives", "Annex A mapping", "Implementation guidance"],
  },
  {
    href: "/knowledge/nist-csf",
    icon: "🛡️",
    title: "NIST Cybersecurity Framework",
    description: "5 fungsi inti (Identify, Protect, Detect, Respond, Recover) yang jadi bahasa universal risk management di industri regulasi.",
    category: "Frameworks",
    difficulty: "Beginner",
    readTime: "10 min",
    topics: ["5 core functions", "Categories & subcategories", "Maturity levels", "ISO 27001 mapping"],
  },
  {
    href: "/knowledge/audit-evidence",
    icon: "📂",
    title: "Audit Evidence Workflow",
    description: "Cara mengumpulkan, mengorganisir, dan mendokumentasikan bukti audit yang kuat — dari evidence request sampai close-out.",
    category: "Audit Process",
    difficulty: "Intermediate",
    readTime: "15 min",
    topics: ["Evidence types", "5-step workflow", "Evidence requests", "Best practices"],
  },
  {
    href: "/knowledge/risk-assessment",
    icon: "⚠️",
    title: "Risk Assessment Canvas",
    description: "Cara melakukan risk assessment yang defensible — identifikasi aset, threat modeling, vulnerability mapping, sampai control selection.",
    category: "Risk Management",
    difficulty: "Intermediate",
    readTime: "10 min",
    topics: ["Asset identification", "Threat modeling", "Risk scoring L×I", "Control mapping"],
  },
];

const TOOLS = [
  {
    href: "/audit-toolkit",
    icon: "📝",
    title: "Audit Toolkit",
    description: "Checklist interaktif ISO 27001 (114 controls), NIST CSF (108), SOC 2 (33). Search, filter, progress tracking.",
    tag: "Interactive",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    href: "/risk-register",
    icon: "📊",
    title: "Risk Register",
    description: "Buat risk register dengan scoring L×I, warna severity, dan filter status. Bisa ditunjukkan ke interviewer.",
    tag: "Interactive",
    tagColor: "bg-orange-100 text-orange-700",
  },
  {
    href: "/audit-simulation",
    icon: "🧪",
    title: "Audit Simulation",
    description: "Simulasi full audit lifecycle dari scoping sampai generate report formal. Studi kasus PT DataNusa Fintech.",
    tag: "Flagship",
    tagColor: "bg-indigo-600 text-white",
  },
  {
    href: "/evidence-library",
    icon: "📋",
    title: "Evidence Library",
    description: "Referensi 17 jenis bukti audit — apa yang dicari, red flags, dan template request ke auditee.",
    tag: "Reference",
    tagColor: "bg-teal-100 text-teal-700",
  },
  {
    href: "/ai-policy-review",
    icon: "🤖",
    title: "AI Policy Review",
    description: "Framework audit AI governance: risiko, template kebijakan, dan checklist EU AI Act & NIST AI RMF.",
    tag: "Modern",
    tagColor: "bg-purple-100 text-purple-700",
  },
  {
    href: "/interview-lab",
    icon: "🎤",
    title: "Interview Lab",
    description: "30+ Q&A interview IT auditor — Frameworks, Risk, Evidence, Behavioral, Technical. Progress tracker included.",
    tag: "Career",
    tagColor: "bg-rose-100 text-rose-700",
  },
];

const CATEGORIES = ["All", "Compliance", "Frameworks", "Audit Process", "Risk Management"];
const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-yellow-100 text-yellow-700",
  Advanced: "bg-red-100 text-red-700",
};

export default function KnowledgePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = MODULES.filter((m) => {
    const matchCat = category === "All" || m.category === category;
    const matchSearch =
      !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <KnowledgeShell
      title="Knowledge Hub"
      subtitle="Modul belajar IT audit — dari teori framework sampai praktek di tools interaktif."
      titleClassName="text-5xl"
    >
      <HowToUse
        what="Pusat belajar untuk semua konsep IT audit yang perlu dikuasai sebelum masuk ke tools interaktif. Ada 4 modul teori, dan langsung terhubung ke 6 tools praktek."
        when={[
          "Baru mulai belajar IT audit dan butuh pahami konsep dasarnya",
          "Mau tahu perbedaan ISO 27001, ISO 27002, NIST CSF, dan SOC 2",
          "Butuh referensi cepat sebelum mengerjakan Audit Simulation",
          "Persiapan ujian CISA atau ISO 27001 Lead Auditor",
        ]}
        how={[
          "Mulai dari modul Teori di bawah — baca sesuai urutan untuk pemula",
          "Setelah baca teori, langsung praktekkan di Tools Interaktif di bagian bawah",
          "Urutan yang direkomendasikan: ISO 27002 → NIST CSF → Risk Assessment → Audit Evidence",
          "Setelah semua modul dibaca, jalankan Audit Simulation untuk uji semua ilmunya",
        ]}
      />

      {/* ── Search & Filter ── */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">🔍</span>
          <input
            type="search"
            placeholder="Cari modul..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-blue-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-300 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                category === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "border border-blue-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Theory Modules ── */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          📖 Modul Teori <span className="text-sm font-normal text-slate-400 ml-2">{filtered.length} modul</span>
        </h2>

        {filtered.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {filtered.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="group flex flex-col rounded-2xl border border-blue-200 bg-white p-6 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-2xl">{m.icon}</span>
                  <div className="flex gap-2 flex-wrap justify-end">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500">
                      {m.category}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${DIFFICULTY_COLOR[m.difficulty]}`}>
                      {m.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="mt-3 font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                  {m.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-500 flex-1">{m.description}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {m.topics.map((t) => (
                    <span key={t} className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs text-indigo-600">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-400">⏱ {m.readTime}</span>
                  <span className="text-xs font-semibold text-indigo-500 group-hover:text-indigo-700 transition-colors">
                    Baca sekarang →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-blue-200 p-10 text-center text-sm text-slate-400">
            Tidak ada modul yang cocok dengan pencarian ini.
          </div>
        )}
      </div>

      {/* ── Practice Tools ── */}
      <div className="mt-12">
        <div className="mb-4 flex items-end justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-800">⚡ Tools Praktek</h2>
            <p className="mt-1 text-sm text-slate-400">Setelah baca teori, langsung praktek di sini</p>
          </div>
          <Link href="/" className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold">
            Lihat semua di Dashboard →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col rounded-2xl border border-blue-200 bg-white p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xl">{tool.icon}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tool.tagColor}`}>
                  {tool.tag}
                </span>
              </div>
              <p className="mt-3 font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors text-sm">
                {tool.title}
              </p>
              <p className="mt-1.5 text-xs leading-5 text-slate-500 flex-1">{tool.description}</p>
              <p className="mt-3 text-xs font-semibold text-indigo-500 group-hover:text-indigo-700 transition-colors">
                Buka →
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Learning Path ── */}
      <div className="mt-12 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
        <h2 className="text-base font-bold text-indigo-800">🗺️ Urutan Belajar yang Direkomendasikan</h2>
        <p className="mt-1 text-xs text-indigo-600">Untuk pemula yang switching dari cybersecurity ke IT audit</p>
        <div className="mt-5 space-y-3">
          {[
            { num: "1", text: "Baca ISO 27002 Essentials — pahami 14 domain controls", href: "/knowledge/iso27002" },
            { num: "2", text: "Baca NIST CSF — pahami 5 fungsi dan bagaimana mapping ke ISO", href: "/knowledge/nist-csf" },
            { num: "3", text: "Baca Risk Assessment Canvas — pahami cara scoring dan control mapping", href: "/knowledge/risk-assessment" },
            { num: "4", text: "Baca Audit Evidence Workflow — pahami cara collect dan dokumentasi bukti", href: "/knowledge/audit-evidence" },
            { num: "5", text: "Praktek di Audit Toolkit — explore semua 265 controls", href: "/audit-toolkit" },
            { num: "6", text: "Jalankan Audit Simulation end-to-end dan generate report PDF", href: "/audit-simulation" },
            { num: "7", text: "Latihan 30+ pertanyaan di Interview Lab sampai semua dikuasai", href: "/interview-lab" },
          ].map((step) => (
            <Link
              key={step.num}
              href={step.href}
              className="flex items-center gap-3 rounded-xl bg-white border border-indigo-100 px-4 py-3 text-sm hover:border-indigo-300 hover:shadow-sm transition-all group"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {step.num}
              </span>
              <span className="text-slate-700 group-hover:text-indigo-700 flex-1">{step.text}</span>
              <span className="text-indigo-400 group-hover:text-indigo-600 text-xs">→</span>
            </Link>
          ))}
        </div>
      </div>
    </KnowledgeShell>
  );
}
