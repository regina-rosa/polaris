"use client";

import { useState } from "react";
import KnowledgeShell from "@/components/KnowledgeShell";
import HowToUse from "@/components/HowToUse";

const STEPS = [
  {
    num: 1,
    title: "Asset Identification",
    color: "bg-violet-100 text-violet-700",
    what: "Identifikasi semua aset informasi yang perlu dilindungi — ini titik awal yang sering dilewatkan.",
    why: "Tidak bisa melakukan risk assessment tanpa tahu aset apa yang perlu dilindungi. 'You can't protect what you don't know you have.'",
    actions: [
      "Buat asset inventory: hardware, software, data, proses, people",
      "Klasifikasikan tiap aset berdasarkan sensitivitas (Public/Internal/Confidential/Secret)",
      "Tentukan Business Impact Level per aset — mana yang critical?",
      "Identifikasi data owner dan system owner untuk tiap aset",
    ],
    output: "Asset Register dengan klasifikasi dan BIL per aset",
    auditQuestion: "Tunjukkan asset inventory dan bagaimana aset dikategorikan berdasarkan nilai bisnisnya.",
  },
  {
    num: 2,
    title: "Threat Identification",
    color: "bg-blue-100 text-blue-700",
    what: "Identifikasi semua ancaman realistis yang bisa berdampak pada aset — dari ancaman eksternal sampai internal.",
    why: "Risk assessment tanpa threat modeling hanya berdasarkan intuisi. Ancaman harus dipetakan secara sistematis menggunakan data industri dan konteks spesifik organisasi.",
    actions: [
      "Gunakan threat catalogs: MITRE ATT&CK, OWASP, atau threat intel industri",
      "Kategorikan: Human (malicious external, malicious internal, accidental), Environmental (bencana, kebakaran), Technical (failure, bug)",
      "Pertimbangkan threat actors: hacker, insider, competitor, nation-state, script kiddie",
      "Review insiden historis organisasi dan industri yang sama",
    ],
    output: "Threat catalog dengan likelihood per ancaman (sebelum kontrol)",
    auditQuestion: "Darimana datangnya daftar ancaman ini? Apakah menggunakan data insiden aktual atau threat intel?",
  },
  {
    num: 3,
    title: "Vulnerability Assessment",
    color: "bg-amber-100 text-amber-700",
    what: "Identifikasi kelemahan dalam kontrol, konfigurasi, dan proses yang bisa dieksploitasi ancaman.",
    why: "Ancaman tidak bisa merugikan tanpa kerentanan. Vulnerability + Threat = Risk. Tanpa mengerti vulnerability, tidak bisa quantify risk dengan benar.",
    actions: [
      "Technical: vulnerability scanning (Nessus, Qualys, Tenable), penetration testing",
      "Process: review policy dan prosedur, bandingkan dengan best practice",
      "Human: phishing simulation, security awareness assessment",
      "Physical: walkthrough fasilitas, test akses kontrol fisik",
    ],
    output: "Vulnerability list dengan CVSS score (untuk teknis) dan severity rating (untuk non-teknis)",
    auditQuestion: "Apakah vulnerability assessment dilakukan oleh pihak independen? Seberapa sering?",
  },
  {
    num: 4,
    title: "Risk Rating",
    color: "bg-orange-100 text-orange-700",
    what: "Hitung risk score menggunakan formula konsisten: Likelihood × Impact. Prioritaskan berdasarkan skor.",
    why: "Tanpa scoring yang konsisten, prioritisasi hanya berdasarkan opini. Risk rating yang defensible harus menggunakan metodologi yang dapat dijelaskan dan direproduksi.",
    actions: [
      "Tentukan skala: 1–5 (atau 1–3 untuk simplicity). Dokumentasikan definisi tiap level",
      "Likelihood: seberapa sering ancaman ini terjadi given vulnerability yang ada?",
      "Impact: seberapa parah dampak ke CIA dan bisnis jika terjadi?",
      "Score = Likelihood × Impact. Plot di risk matrix untuk visualisasi",
      "Bedakan inherent risk (sebelum kontrol) dan residual risk (setelah kontrol)",
    ],
    output: "Risk register dengan L, I, score, dan residual risk per entry",
    auditQuestion: "Tunjukkan metodologi risk scoring dan bagaimana konsistensinya dijaga lintas departemen.",
  },
  {
    num: 5,
    title: "Risk Treatment",
    color: "bg-green-100 text-green-700",
    what: "Putuskan bagaimana merespons tiap risiko yang teridentifikasi — pilih satu dari 4 strategi treatment.",
    why: "Risk assessment tanpa treatment plan hanyalah dokumen akademis. Hasil assessment harus mendorong keputusan nyata dengan PIC dan timeline.",
    actions: [
      "Reduce (Mitigate): implementasikan kontrol untuk kurangi likelihood atau impact",
      "Remove (Avoid): hentikan aktivitas yang menciptakan risiko jika cost > benefit",
      "Transfer: alihkan risiko ke pihak lain (asuransi cyber, outsource)",
      "Accept: terima risiko jika dalam risk tolerance dan cost of control terlalu tinggi",
      "Setiap keputusan harus terdokumentasi dengan justifikasi dan sign-off manajemen",
    ],
    output: "Risk Treatment Plan dengan pilihan strategi, kontrol, PIC, dan deadline",
    auditQuestion: "Apakah ada formal risk acceptance untuk risiko yang tidak di-treat? Siapa yang menyetujui?",
  },
];

const LIKELIHOOD_LABELS = ["Sangat Jarang", "Jarang", "Kadang", "Sering", "Hampir Pasti"];
const IMPACT_LABELS = ["Tidak Signifikan", "Minor", "Moderat", "Mayor", "Kritis"];

function getColor(score: number) {
  if (score >= 15) return "bg-red-500 text-white";
  if (score >= 10) return "bg-orange-400 text-white";
  if (score >= 5) return "bg-yellow-400 text-slate-800";
  return "bg-green-400 text-white";
}

function getLabel(score: number) {
  if (score >= 15) return "Critical";
  if (score >= 10) return "High";
  if (score >= 5) return "Medium";
  return "Low";
}

const RISK_TREATMENTS = [
  {
    name: "Reduce (Mitigate)",
    icon: "🛡️",
    color: "bg-blue-50 border-blue-200",
    accent: "text-blue-700",
    description: "Implementasikan kontrol untuk mengurangi likelihood dan/atau impact. Cara paling umum.",
    when: "Ketika kontrol yang efektif tersedia dan cost of control < cost of risk.",
    example: "Pasang MFA untuk reduce likelihood akun diambilalih.",
  },
  {
    name: "Remove (Avoid)",
    icon: "🚫",
    color: "bg-slate-50 border-slate-200",
    accent: "text-slate-700",
    description: "Hentikan aktivitas yang menghasilkan risiko karena terlalu tinggi.",
    when: "Ketika risiko terlalu tinggi untuk ditoleransi dan benefit aktivitas tidak sepadan.",
    example: "Stop simpan data kartu kredit sendiri — gunakan payment gateway.",
  },
  {
    name: "Transfer",
    icon: "🔄",
    color: "bg-amber-50 border-amber-200",
    accent: "text-amber-700",
    description: "Pindahkan financial exposure ke pihak lain: asuransi atau kontrak vendor.",
    when: "Ketika impact finansial bisa di-cover dengan lebih murah melalui asuransi.",
    example: "Beli cyber insurance untuk cover biaya breach response dan regulatory fines.",
  },
  {
    name: "Accept",
    icon: "✅",
    color: "bg-green-50 border-green-200",
    accent: "text-green-700",
    description: "Terima risiko karena dalam risk tolerance atau cost of control terlalu tinggi.",
    when: "Ketika residual risk di bawah risk tolerance ATAU cost mitigasi > expected loss.",
    example: "Terima risiko website downtime 99.5% uptime karena 99.99% terlalu mahal.",
  },
];

const SAMPLE_THREATS = [
  { category: "Access Control", threat: "Brute force attack", likelihood: 3, impact: 4, control: "MFA, account lockout policy" },
  { category: "Human Factor", threat: "Phishing email", likelihood: 4, impact: 4, control: "Security awareness training, email filtering" },
  { category: "Data", threat: "Unauthorized data exfiltration", likelihood: 2, impact: 5, control: "DLP, encryption, access control" },
  { category: "Operations", threat: "Unpatched vulnerability exploit", likelihood: 3, impact: 4, control: "Patch management, vulnerability scanning" },
  { category: "Physical", threat: "Unauthorized server room access", likelihood: 2, impact: 4, control: "Access card, CCTV, visitor log" },
  { category: "Continuity", threat: "Ransomware attack", likelihood: 3, impact: 5, control: "Backup (offline), EDR, incident response" },
];

export default function RiskAssessmentCanvas() {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [hoveredCell, setHoveredCell] = useState<{ l: number; i: number } | null>(null);

  return (
    <KnowledgeShell
      title="Risk Assessment Canvas"
      subtitle="Cara melakukan risk assessment yang sistematis, defensible, dan langsung bisa dipakai dalam audit."
      titleClassName="text-4xl"
      backHref="/knowledge"
      backLabel="Knowledge Hub"
    >
      <HowToUse
        what="Panduan metodologi risk assessment IT — dari identifikasi aset, threat modeling, scoring risiko (Likelihood × Impact), sampai treatment plan. Ini adalah core skill IT auditor yang paling sering ditanyakan dalam interview."
        when={[
          "Audit yang membutuhkan risk assessment atau gap analysis",
          "Mau mengerti cara kerja Risk Register yang ada di tools Polaris",
          "Interview yang nanya 'bagaimana kamu melakukan risk assessment?'",
          "Klien minta framework untuk bangun risk register mereka dari nol",
        ]}
        how={[
          "Ikuti 5 langkah berurutan: Asset → Threat → Vulnerability → Rating → Treatment",
          "Lihat Risk Matrix untuk memahami scoring secara visual",
          "Gunakan tabel Sample Threats sebagai referensi ancaman umum IT",
          "Risk Treatment section menjelaskan kapan pilih Reduce/Remove/Transfer/Accept",
        ]}
      />

      {/* ── Key Concepts ── */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: "⚠️", label: "Risk =", formula: "Likelihood × Impact", color: "bg-orange-50 border-orange-200 text-orange-800" },
          { icon: "🔢", label: "Scale", formula: "1–5 each (max score 25)", color: "bg-blue-50 border-blue-200 text-blue-800" },
          { icon: "🎯", label: "Goal", formula: "Residual risk ≤ Risk tolerance", color: "bg-green-50 border-green-200 text-green-800" },
        ].map((c) => (
          <div key={c.label} className={`rounded-2xl border p-4 ${c.color}`}>
            <p className="text-xs font-semibold opacity-70">{c.label}</p>
            <p className="mt-1 text-lg font-bold">{c.icon} {c.formula}</p>
          </div>
        ))}
      </div>

      {/* ── Risk Matrix ── */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-2">🗂️ Risk Matrix — Visualisasi Scoring</h2>
        <p className="text-sm text-slate-500 mb-5">
          Hover tiap sel untuk lihat score dan level. <strong>Kolom</strong> = Impact (I), <strong>Baris</strong> = Likelihood (L).
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-1 text-center text-xs">
            <thead>
              <tr>
                <th className="w-24 text-left text-slate-400 font-normal p-2">L \ I →</th>
                {IMPACT_LABELS.map((il, i) => (
                  <th key={i} className="text-slate-500 font-semibold p-2">
                    <span className="text-slate-400 block text-[10px]">I={i + 1}</span>
                    {il}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[5, 4, 3, 2, 1].map((l) => (
                <tr key={l}>
                  <td className="text-right pr-3 text-slate-500 font-semibold">
                    <span className="text-slate-400 block text-[10px]">L={l}</span>
                    {LIKELIHOOD_LABELS[l - 1]}
                  </td>
                  {[1, 2, 3, 4, 5].map((i) => {
                    const score = l * i;
                    const isHovered = hoveredCell?.l === l && hoveredCell?.i === i;
                    return (
                      <td
                        key={i}
                        onMouseEnter={() => setHoveredCell({ l, i })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`rounded-xl p-3 cursor-default transition-all ${getColor(score)} ${isHovered ? "scale-110 shadow-lg z-10 relative" : ""}`}
                      >
                        <span className="font-bold text-sm">{score}</span>
                        {isHovered && (
                          <span className="block text-[10px] opacity-80 mt-0.5">{getLabel(score)}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          {[
            { label: "Critical (15–25)", color: "bg-red-500 text-white" },
            { label: "High (10–14)", color: "bg-orange-400 text-white" },
            { label: "Medium (5–9)", color: "bg-yellow-400 text-slate-800" },
            { label: "Low (1–4)", color: "bg-green-400 text-white" },
          ].map((x) => (
            <span key={x.label} className={`rounded-full px-3 py-1 font-semibold ${x.color}`}>
              {x.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── 5-Step Process ── */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-slate-800 mb-2">📋 5-Step Risk Assessment Process</h2>
        <p className="text-sm text-slate-500 mb-5">
          Klik tiap langkah untuk lihat cara penerapannya dan pertanyaan audit yang relevan.
        </p>
        <div className="space-y-3">
          {STEPS.map((s) => {
            const isOpen = expandedStep === s.num;
            return (
              <div
                key={s.num}
                className={`rounded-2xl border bg-white shadow-sm overflow-hidden ${isOpen ? "border-indigo-200" : "border-blue-200"}`}
              >
                <button
                  onClick={() => setExpandedStep(isOpen ? null : s.num)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${s.color}`}>
                    {s.num}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{s.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{s.what}</p>
                  </div>
                  <span className="text-slate-400 shrink-0">{isOpen ? "▲" : "▼"}</span>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 p-5 bg-slate-50 space-y-5">
                    <div className={`rounded-xl border p-3 ${s.color.replace("bg-", "bg-").replace("text-", "border-").split(" ")[0]} bg-opacity-20`}>
                      <p className="text-xs font-bold text-slate-600">💡 Kenapa langkah ini penting?</p>
                      <p className="mt-1 text-xs text-slate-700 leading-5">{s.why}</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Yang dilakukan:</p>
                        <ul className="space-y-2">
                          {s.actions.map((a, i) => (
                            <li key={i} className="flex gap-2 text-sm text-slate-700">
                              <span className="text-indigo-400 shrink-0">{i + 1}.</span>
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <div className="rounded-xl bg-white border border-slate-200 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Output</p>
                          <p className="mt-1 text-sm text-slate-700">{s.output}</p>
                        </div>
                        <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">Pertanyaan Audit</p>
                          <p className="mt-1 text-xs text-indigo-800 leading-5 italic">"{s.auditQuestion}"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Risk Treatment ── */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-slate-800 mb-2">🔧 4 Strategi Risk Treatment</h2>
        <p className="text-sm text-slate-500 mb-5">
          Setelah risk dinilai, harus ada keputusan: mau diapakan risiko ini?
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {RISK_TREATMENTS.map((t) => (
            <div key={t.name} className={`rounded-2xl border p-5 ${t.color}`}>
              <p className={`text-base font-bold ${t.accent}`}>{t.icon} {t.name}</p>
              <p className="mt-2 text-sm text-slate-600 leading-5">{t.description}</p>
              <div className="mt-3 space-y-1.5">
                <p className="text-xs font-semibold text-slate-500">Kapan dipilih:</p>
                <p className="text-xs text-slate-600">{t.when}</p>
                <p className="text-xs font-semibold text-slate-500 mt-2">Contoh:</p>
                <p className="text-xs text-slate-600 italic">{t.example}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sample Threats ── */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-slate-800 mb-2">📋 Contoh Ancaman Umum IT</h2>
        <p className="text-sm text-slate-500 mb-5">
          Referensi cepat ancaman yang sering muncul di audit IT beserta scoring dan kontrol yang sesuai.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-blue-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Kategori</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Ancaman</th>
                <th className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">L</th>
                <th className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">I</th>
                <th className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Score</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Kontrol Kunci</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SAMPLE_THREATS.map((t, idx) => {
                const score = t.likelihood * t.impact;
                return (
                  <tr key={idx} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">{t.category}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-700 font-medium">{t.threat}</td>
                    <td className="px-5 py-3 text-center text-slate-500">{t.likelihood}</td>
                    <td className="px-5 py-3 text-center text-slate-500">{t.impact}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${getColor(score)}`}>
                        {score} — {getLabel(score)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">{t.control}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </KnowledgeShell>
  );
}
