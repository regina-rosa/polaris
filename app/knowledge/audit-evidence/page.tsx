"use client";

import { useState } from "react";
import KnowledgeShell from "@/components/KnowledgeShell";
import HowToUse from "@/components/HowToUse";

const EVIDENCE_TYPES = [
  {
    icon: "📋",
    type: "Documentary",
    description: "Dokumen tertulis yang membuktikan keberadaan kebijakan, prosedur, atau record.",
    examples: ["Kebijakan keamanan (policy)", "Prosedur operasional (SOP)", "Log akses, log sistem", "Screenshot konfigurasi", "Laporan scan", "Kontrak, NDA"],
    strength: "Kuat",
    strengthColor: "bg-green-100 text-green-700",
    note: "Paling umum dikumpulkan. Kuat untuk membuktikan 'kontrol ADA', tapi tidak cukup untuk 'kontrol BERJALAN'. Harus dikombinasi dengan bukti lain.",
  },
  {
    icon: "👁️",
    type: "Observational",
    description: "Pengamatan langsung auditor terhadap proses, sistem, atau kondisi fisik.",
    examples: ["Walkthrough server room (lihat akses fisik, CCTV)", "Demo live sistem oleh auditee", "Observasi proses backup", "Inspect label aset fisik", "Clean desk policy compliance check"],
    strength: "Sangat Kuat",
    strengthColor: "bg-blue-100 text-blue-700",
    note: "Sulit dipalsukan karena auditor melihat langsung. Sangat kuat untuk membuktikan operating effectiveness. Tapi tidak selalu bisa dilakukan untuk semua kontrol.",
  },
  {
    icon: "🗣️",
    type: "Testimonial",
    description: "Pernyataan verbal atau tertulis dari staf, manajemen, atau pihak ketiga.",
    examples: ["Wawancara dengan IT admin tentang patching process", "Konfirmasi tertulis dari manajemen", "Kuesioner vendor", "Management representation letter"],
    strength: "Lemah (sendiri)",
    strengthColor: "bg-yellow-100 text-yellow-700",
    note: "Paling lemah bila berdiri sendiri — tidak bisa sepenuhnya bergantung pada apa yang orang katakan. SELALU corroborate dengan documentary atau observational evidence.",
  },
  {
    icon: "📊",
    type: "Analytical",
    description: "Hasil analisis data yang dilakukan auditor sendiri — bukan diterima dari auditee.",
    examples: ["Analisis log akses untuk deteksi anomali", "Comparison aktif vs terminated user list", "Kalkulasi patch coverage %", "Trend analysis vulnerability over time", "Reconciliation antara HR records vs system access"],
    strength: "Sangat Kuat",
    strengthColor: "bg-blue-100 text-blue-700",
    note: "Auditor yang generate sendiri = paling independen. Sangat valuable karena tidak bergantung pada apa yang auditee pilih untuk berikan.",
  },
];

const WORKFLOW_STEPS = [
  {
    num: 1,
    title: "Plan & Scope",
    color: "bg-violet-100 text-violet-700",
    description: "Sebelum fieldwork, tentukan evidence apa yang dibutuhkan untuk setiap kontrol yang diaudit.",
    actions: [
      "Review audit plan dan tentukan kontrol yang akan ditest",
      "Buat Evidence Request List (ERL) — daftar semua bukti yang perlu dikumpulkan",
      "Identifikasi evidence owner untuk tiap item (siapa yang pegang datanya)",
      "Tentukan format dan periode waktu yang relevan (e.g., 'log 90 hari terakhir')",
    ],
    tip: "ERL adalah deliverable pertama yang dikirim ke auditee. Semakin spesifik ERL, semakin sedikit bolak-balik permintaan.",
  },
  {
    num: 2,
    title: "Request & Receive",
    color: "bg-blue-100 text-blue-700",
    description: "Kirim permintaan evidence secara formal dengan deadline yang jelas.",
    actions: [
      "Kirim ERL via email dengan deadline yang reasonable (biasanya 5–10 hari kerja)",
      "Gunakan shared folder atau audit management tool untuk pengiriman",
      "Log tanggal permintaan, tanggal terima, dan format yang diterima",
      "Tindak lanjut item yang overdue — jangan tunggu sampai hari terakhir",
    ],
    tip: "Catat semua evidence yang belum diterima. 'Evidence not provided' sendiri adalah temuan — shows lack of auditee cooperation atau kontrol yang tidak ada.",
  },
  {
    num: 3,
    title: "Review & Validate",
    color: "bg-amber-100 text-amber-700",
    description: "Evaluasi evidence yang diterima — apakah cukup dan sesuai untuk mendukung kesimpulan audit?",
    actions: [
      "Check completeness: apakah evidence mencakup seluruh periode dan scope?",
      "Check relevance: apakah evidence langsung relate ke kontrol yang ditest?",
      "Check reliability: dari mana asalnya? Bisa diverifikasi independent?",
      "Bandingkan dengan kebijakan — apakah practice sesuai policy?",
      "Identifikasi gaps: apa yang masih kurang?",
    ],
    tip: "Dua dimensi kualitas evidence: Sufficient (cukup banyak) dan Appropriate (relevan dan reliable). Keduanya harus terpenuhi.",
  },
  {
    num: 4,
    title: "Test & Analyze",
    color: "bg-green-100 text-green-700",
    description: "Lakukan pengujian spesifik untuk membuktikan apakah kontrol berjalan efektif.",
    actions: [
      "Re-perform: lakukan ulang proses yang diklaim berjalan (e.g., test restore dari backup)",
      "Sample testing: ambil sample dari populasi dan verifikasi (e.g., 25 user dari 500)",
      "Analytical review: bandingkan data dari periode berbeda, cari anomali",
      "Reconciliation: cocokkan data dari dua sumber berbeda (e.g., HR list vs Active Directory)",
    ],
    tip: "Sample size tergantung risk level: kontrol high-risk = sample lebih besar. Gunakan statistical sampling atau ISACA guidance untuk menentukan sample size yang defensible.",
  },
  {
    num: 5,
    title: "Document & Conclude",
    color: "bg-rose-100 text-rose-700",
    description: "Dokumentasikan semua evidence, working papers, dan kesimpulan dengan jelas.",
    actions: [
      "Buat working paper untuk setiap kontrol yang ditest (control → evidence → conclusion)",
      "Link setiap temuan ke evidence spesifik yang mendukungnya",
      "Tulis conclusion: apakah kontrol berjalan efektif? Ada exception?",
      "Peer review dengan senior auditor sebelum finalisasi",
      "Archive semua evidence dengan naming convention yang konsisten",
    ],
    tip: "Working paper standar: Control ID | Objective | Procedure | Evidence Used | Conclusion | Exceptions. Kalau tidak terdokumentasi, seolah tidak dilakukan.",
  },
];

const QUALITY_CRITERIA = [
  {
    label: "Sufficient",
    desc: "Cukup dalam kuantitas untuk mendukung kesimpulan audit. Kontrol high-risk butuh lebih banyak evidence.",
    icon: "⚖️",
    color: "border-l-indigo-400 bg-indigo-50",
    checklist: [
      "Apakah sample size memadai relative to population?",
      "Apakah evidence mencakup seluruh periode audit?",
      "Apakah ada lebih dari satu tipe evidence yang mendukung?",
    ],
  },
  {
    label: "Appropriate",
    desc: "Relevan terhadap kontrol yang ditest DAN reliable dari sumber yang dapat dipercaya.",
    icon: "🎯",
    color: "border-l-green-400 bg-green-50",
    checklist: [
      "Apakah evidence langsung relate ke kontrol objective?",
      "Apakah sumber evidence bisa diverifikasi?",
      "Apakah evidence dari periode yang benar?",
    ],
  },
];

const COMMON_MISTAKES = [
  {
    mistake: "Menerima policy saja sebagai bukti kontrol berjalan",
    fix: "Policy membuktikan kontrol EXIST. Butuh logs/screenshots/rekam jejak untuk buktikan kontrol BERJALAN (operating effectiveness).",
  },
  {
    mistake: "Tidak mencatat tanggal dan sumber evidence",
    fix: "Setiap evidence harus dicatat: siapa yang kasih, kapan diterima, untuk kontrol mana. Ini penting untuk defensibility audit.",
  },
  {
    mistake: "Bergantung penuh pada testimonial tanpa corroboration",
    fix: "'Kata auditee' bukan evidence yang cukup. Selalu minta dokumentasi atau observasi untuk corroborate.",
  },
  {
    mistake: "Evidence tidak relevan dengan periode audit",
    fix: "Policy yang dibuat 5 tahun lalu dan belum di-review bukan evidence yang valid untuk audit tahun ini.",
  },
  {
    mistake: "Menerima evidence tidak lengkap tanpa follow-up",
    fix: "Evidence yang hanya mencakup sebagian periode atau subset sistem harus di-flag. Minta yang lengkap atau jadikan finding.",
  },
];

export default function AuditEvidenceWorkflow() {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [expandedType, setExpandedType] = useState<string | null>("Documentary");

  return (
    <KnowledgeShell
      title="Audit Evidence Workflow"
      subtitle="Cara mengumpulkan, mengevaluasi, dan mendokumentasikan bukti audit yang kuat dan defensible."
      titleClassName="text-4xl"
      backHref="/knowledge"
      backLabel="Knowledge Hub"
    >
      <HowToUse
        what="Panduan lengkap untuk evidence collection dalam IT audit — mulai dari request ke auditee, cara mengevaluasi kualitas bukti, sampai dokumentasi working paper yang defensible."
        when={[
          "Sedang fieldwork dan butuh tahu evidence apa yang perlu dikumpulkan",
          "Mau tahu perbedaan antara evidence yang kuat vs lemah",
          "Interview yang nanya 'bagaimana kamu collect evidence saat audit?'",
          "Belajar konsep sufficient dan appropriate evidence dari auditing standards",
        ]}
        how={[
          "Pahami dulu 4 tipe evidence dan strength masing-masing",
          "Ikuti 5-step workflow di bawah sebagai proses standar fieldwork",
          "Gunakan checklist quality criteria untuk evaluate evidence yang sudah dikumpulkan",
          "Hindari common mistakes di bagian terakhir — ini sering jadi gap dalam audit pemula",
        ]}
      />

      {/* ── Evidence Types ── */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-2">📦 4 Tipe Bukti Audit</h2>
        <p className="text-sm text-slate-500 mb-5">
          Tidak semua evidence setara. Pahami kekuatan dan kelemahan masing-masing tipe.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {EVIDENCE_TYPES.map((t) => {
            const isOpen = expandedType === t.type;
            return (
              <div
                key={t.type}
                className={`rounded-2xl border bg-white shadow-sm overflow-hidden cursor-pointer transition-all ${isOpen ? "border-indigo-300 ring-1 ring-indigo-100" : "border-blue-200 hover:border-indigo-200"}`}
                onClick={() => setExpandedType(isOpen ? null : t.type)}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{t.icon}</span>
                      <div>
                        <p className="font-bold text-slate-800">{t.type} Evidence</p>
                        <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${t.strengthColor}`}>
                          {t.strength}
                        </span>
                      </div>
                    </div>
                    <span className="text-slate-400 text-sm">{isOpen ? "▲" : "▼"}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 leading-5">{t.description}</p>
                </div>

                {isOpen && (
                  <div className="border-t border-slate-100 p-5 bg-slate-50 space-y-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Contoh:</p>
                      <ul className="space-y-1">
                        {t.examples.map((ex) => (
                          <li key={ex} className="text-sm text-slate-600 flex gap-2">
                            <span className="text-slate-300 shrink-0">•</span> {ex}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                      <p className="text-xs font-bold text-amber-600 mb-1">💡 Catatan Penting</p>
                      <p className="text-xs text-amber-800">{t.note}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 5-Step Workflow ── */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-slate-800 mb-2">🔄 5-Step Evidence Workflow</h2>
        <p className="text-sm text-slate-500 mb-5">
          Proses standar dari perencanaan sampai dokumentasi. Klik tiap langkah untuk lihat detail.
        </p>
        <div className="space-y-3">
          {WORKFLOW_STEPS.map((step) => {
            const isOpen = expandedStep === step.num;
            return (
              <div
                key={step.num}
                className={`rounded-2xl border bg-white shadow-sm overflow-hidden ${isOpen ? "border-indigo-200" : "border-blue-200"}`}
              >
                <button
                  onClick={() => setExpandedStep(isOpen ? null : step.num)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${step.color}`}>
                    {step.num}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{step.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
                  </div>
                  <span className="text-slate-400 shrink-0">{isOpen ? "▲" : "▼"}</span>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 p-5 bg-slate-50 grid gap-4 md:grid-cols-[1.5fr_1fr]">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Langkah-langkah:</p>
                      <ul className="space-y-2.5">
                        {step.actions.map((a, i) => (
                          <li key={i} className="flex gap-2.5 text-sm text-slate-700">
                            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${step.color}`}>
                              {i + 1}
                            </span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4 h-fit">
                      <p className="text-xs font-bold text-indigo-600 mb-1">💡 Pro Tip</p>
                      <p className="text-xs text-indigo-800 leading-5">{step.tip}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Quality Criteria ── */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-slate-800 mb-2">✅ Kriteria Kualitas Evidence</h2>
        <p className="text-sm text-slate-500 mb-5">
          Dari standar auditing internasional: evidence harus <strong>sufficient</strong> (cukup) DAN <strong>appropriate</strong> (sesuai).
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {QUALITY_CRITERIA.map((c) => (
            <div key={c.label} className={`rounded-2xl border-l-4 ${c.color} border border-l-4 p-5`}>
              <p className="text-lg font-bold text-slate-800">{c.icon} {c.label}</p>
              <p className="mt-1.5 text-sm text-slate-600 leading-5">{c.desc}</p>
              <ul className="mt-4 space-y-2">
                {c.checklist.map((q) => (
                  <li key={q} className="flex gap-2 text-xs text-slate-600">
                    <span className="text-green-500 shrink-0">✓</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Common Mistakes ── */}
      <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-bold text-red-800 mb-4">🚩 Kesalahan Umum Auditor Pemula</h2>
        <div className="space-y-4">
          {COMMON_MISTAKES.map((m, i) => (
            <div key={i} className="rounded-xl bg-white border border-red-100 p-4">
              <p className="text-sm font-semibold text-red-700">❌ {m.mistake}</p>
              <p className="mt-1.5 text-xs text-slate-600 leading-5">✅ <strong>Fix:</strong> {m.fix}</p>
            </div>
          ))}
        </div>
      </div>
    </KnowledgeShell>
  );
}
