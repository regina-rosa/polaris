"use client";

import { useState } from "react";
import KnowledgeShell from "@/components/KnowledgeShell";
import HowToUse from "@/components/HowToUse";

type FunctionData = {
  id: string;
  name: string;
  color: string;
  accent: string;
  tagColor: string;
  description: string;
  whyMatters: string;
  categories: { name: string; examples: string[] }[];
  auditQuestions: string[];
  isoMapping: string[];
};

const FUNCTIONS: FunctionData[] = [
  {
    id: "ID",
    name: "Identify",
    color: "bg-violet-50 border-violet-200",
    accent: "text-violet-700",
    tagColor: "bg-violet-100 text-violet-700",
    description: "Pahami konteks bisnis, aset, risiko, dan kapabilitas — sebelum bisa melindungi sesuatu, harus tahu dulu apa yang perlu dilindungi.",
    whyMatters: "Auditor sering menemukan bahwa organisasi tidak tahu aset apa yang mereka punya. Tanpa Identify, semua fungsi lain buta.",
    categories: [
      { name: "Asset Management (ID.AM)", examples: ["Inventaris hardware & software", "Data flow diagram", "Pemetaan sistem kritis"] },
      { name: "Business Environment (ID.BE)", examples: ["Identifikasi misi & layanan kritis", "Pemetaan supply chain", "Prioritas aset sesuai misi"] },
      { name: "Governance (ID.GV)", examples: ["Kebijakan keamanan informasi", "Peran & tanggung jawab CISO", "Proses manajemen risiko terdokumentasi"] },
      { name: "Risk Assessment (ID.RA)", examples: ["Threat modeling", "Penilaian kerentanan", "Risk register dengan scoring"] },
      { name: "Risk Management Strategy (ID.RM)", examples: ["Risk appetite statement", "Risk tolerance threshold", "Proses eskalasi risiko"] },
      { name: "Supply Chain Risk (ID.SC)", examples: ["Vendor risk assessment", "Kontrak keamanan dengan supplier", "Monitoring supplier"] },
    ],
    auditQuestions: [
      "Apakah ada asset inventory yang lengkap dan up-to-date?",
      "Apakah risk assessment dilakukan secara berkala?",
      "Apakah ada risk appetite yang terdefinisi oleh manajemen?",
      "Apakah supplier kritis sudah masuk dalam scope risk assessment?",
    ],
    isoMapping: ["A.8 Asset Management", "A.6 Organization", "A.15 Supplier Relationships"],
  },
  {
    id: "PR",
    name: "Protect",
    color: "bg-blue-50 border-blue-200",
    accent: "text-blue-700",
    tagColor: "bg-blue-100 text-blue-700",
    description: "Implementasikan safeguards untuk membatasi dampak potensi insiden keamanan — kontrol preventif untuk melindungi aset kritis.",
    whyMatters: "Domain paling banyak kontrol. Ini adalah 'doing security' — semua kebijakan, training, teknologi protektif ada di sini.",
    categories: [
      { name: "Identity Management & Access (PR.AC)", examples: ["MFA enforcement", "Least privilege access", "User provisioning/de-provisioning"] },
      { name: "Awareness & Training (PR.AT)", examples: ["Security awareness training", "Phishing simulation", "Role-based security training"] },
      { name: "Data Security (PR.DS)", examples: ["Enkripsi at rest & in transit", "Data classification", "DLP tools"] },
      { name: "Information Protection (PR.IP)", examples: ["Baseline security configuration", "Change management process", "Backup & recovery"] },
      { name: "Maintenance (PR.MA)", examples: ["Patch management", "Remote maintenance controls", "Hardware lifecycle"] },
      { name: "Protective Technology (PR.PT)", examples: ["Firewall & network segmentation", "Audit logs", "Endpoint protection (EDR/AV)"] },
    ],
    auditQuestions: [
      "Apakah MFA diterapkan untuk semua akun privileged dan remote access?",
      "Apakah ada patch management dengan SLA yang jelas untuk critical CVE?",
      "Apakah security awareness training dilakukan minimal setahun sekali?",
      "Apakah data sensitif dienkripsi at rest DAN in transit?",
    ],
    isoMapping: ["A.9 Access Control", "A.7 HR Security", "A.10 Cryptography", "A.12 Operations Security"],
  },
  {
    id: "DE",
    name: "Detect",
    color: "bg-amber-50 border-amber-200",
    accent: "text-amber-700",
    tagColor: "bg-amber-100 text-amber-700",
    description: "Kembangkan kapabilitas untuk mendeteksi kejadian keamanan secara tepat waktu — monitoring berkelanjutan dan anomaly detection.",
    whyMatters: "MTTD (Mean Time to Detect) adalah KPI kritis. Semakin cepat deteksi, semakin kecil dampak breach. Audit sering menemukan organisasi baru tahu setelah berbulan-bulan.",
    categories: [
      { name: "Anomalies & Events (DE.AE)", examples: ["SIEM alerting", "Baseline traffic profiling", "Correlation rules"] },
      { name: "Security Continuous Monitoring (DE.CM)", examples: ["Vulnerability scanning rutin", "Log monitoring", "Network traffic analysis", "User behavior analytics (UBA)"] },
      { name: "Detection Processes (DE.DP)", examples: ["Playbook deteksi insiden", "Uji coba deteksi (red team)", "Review efektivitas monitoring"] },
    ],
    auditQuestions: [
      "Apakah ada SIEM atau sistem monitoring terpusat?",
      "Berapa rata-rata MTTD untuk insiden security?",
      "Apakah ada vulnerability scanning rutin? Seberapa sering?",
      "Apakah log dari semua sistem kritis dikumpulkan dan dianalisis?",
    ],
    isoMapping: ["A.12.4 Logging & Monitoring", "A.16 Incident Management"],
  },
  {
    id: "RS",
    name: "Respond",
    color: "bg-red-50 border-red-200",
    accent: "text-red-700",
    tagColor: "bg-red-100 text-red-700",
    description: "Ambil tindakan saat insiden terdeteksi — containment, eradication, dan komunikasi yang terstruktur sesuai prosedur yang sudah didefinisikan.",
    whyMatters: "Organisasi yang tidak punya IRP (Incident Response Plan) terbukti mengalami downtime 3x lebih lama saat breach. Improvising during crisis = disaster.",
    categories: [
      { name: "Response Planning (RS.RP)", examples: ["Incident Response Plan (IRP)", "Eskalasi matrix", "Severity classification"] },
      { name: "Communications (RS.CO)", examples: ["Notifikasi regulator (72 jam per GDPR)", "Komunikasi ke pelanggan", "Koordinasi dengan law enforcement"] },
      { name: "Analysis (RS.AN)", examples: ["Forensic investigation", "Root cause analysis", "Indicator of Compromise (IoC) identification"] },
      { name: "Mitigation (RS.MI)", examples: ["Containment (isolasi sistem)", "Eradication (hapus malware)", "Block attacker access"] },
      { name: "Improvements (RS.IM)", examples: ["Post-incident review", "Update IRP berdasarkan lessons learned", "Track recurring issues"] },
    ],
    auditQuestions: [
      "Apakah ada Incident Response Plan yang terdokumentasi dan sudah ditest?",
      "Kapan terakhir tabletop exercise dilakukan?",
      "Apakah ada prosedur notifikasi regulator dalam 72 jam?",
      "Apakah ada incident log yang mencatat root cause dan perbaikan?",
    ],
    isoMapping: ["A.16 Incident Management", "A.6.1.3 Contact with authorities"],
  },
  {
    id: "RC",
    name: "Recover",
    color: "bg-green-50 border-green-200",
    accent: "text-green-700",
    tagColor: "bg-green-100 text-green-700",
    description: "Restore kapabilitas yang terdampak dan kembalikan operasi normal — rencana pemulihan, komunikasi, dan perbaikan pasca-insiden.",
    whyMatters: "Recovery yang terencana dapat mengurangi downtime dari minggu menjadi jam. RTO dan RPO yang tidak ditest adalah risk yang diterima tanpa sadar.",
    categories: [
      { name: "Recovery Planning (RC.RP)", examples: ["Disaster Recovery Plan (DRP)", "Business Continuity Plan (BCP)", "RTO/RPO per sistem kritis"] },
      { name: "Improvements (RC.IM)", examples: ["Update DR berdasarkan pengalaman nyata", "Tuning backup strategy", "Remediation roadmap"] },
      { name: "Communications (RC.CO)", examples: ["Update stakeholders tentang status pemulihan", "Laporan pasca-insiden untuk manajemen", "Koordinasi PR/komunikasi publik"] },
    ],
    auditQuestions: [
      "Apakah ada Disaster Recovery Plan dengan RTO dan RPO terdefinisi?",
      "Kapan terakhir DR drill atau backup restoration test dilakukan?",
      "Apakah RTO/RPO yang ditargetkan pernah dicapai saat actual incident?",
      "Apakah ada template komunikasi pasca-insiden untuk stakeholders?",
    ],
    isoMapping: ["A.17 Business Continuity", "A.12.3 Backup"],
  },
];

const MATURITY_TIERS = [
  {
    tier: "Tier 1",
    name: "Partial",
    color: "bg-red-100 text-red-700 border-red-200",
    description: "Praktik keamanan ad-hoc dan reaktif. Tidak ada proses formal, kesadaran risiko terbatas. Organisasi tidak sadar risiko mereka sendiri.",
    typical: "Startup kecil tanpa dedicated security team.",
  },
  {
    tier: "Tier 2",
    name: "Risk Informed",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    description: "Ada risk management practices tapi belum organisasi-wide. Beberapa area lebih mature dari yang lain. Kebijakan ada tapi belum konsisten dijalankan.",
    typical: "Perusahaan mid-size yang baru mulai formalisasi security.",
  },
  {
    tier: "Tier 3",
    name: "Repeatable",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    description: "Praktik keamanan terdefinisi, terdokumentasi, dan konsisten dijalankan. Management diinformasikan tentang risiko secara regular. Ada metrik.",
    typical: "Perusahaan enterprise atau yang sudah punya ISO 27001.",
  },
  {
    tier: "Tier 4",
    name: "Adaptive",
    color: "bg-green-100 text-green-700 border-green-200",
    description: "Organisasi secara aktif mengadaptasi praktik keamanan berdasarkan ancaman terbaru dan pelajaran dari insiden. Continuous improvement embedded.",
    typical: "Lembaga keuangan, infrastruktur kritis, big tech.",
  },
];

export default function NISTCSFPage() {
  const [expanded, setExpanded] = useState<string | null>("PR");

  return (
    <KnowledgeShell
      title="NIST Cybersecurity Framework"
      subtitle="5 fungsi inti untuk mengatur program cybersecurity secara menyeluruh — dari identifikasi risiko sampai pemulihan insiden."
      titleClassName="text-4xl"
      backHref="/knowledge"
      backLabel="Knowledge Hub"
    >
      <HowToUse
        what="NIST CSF adalah framework tata kelola cybersecurity yang paling banyak dipakai di industri regulasi (terutama AS dan Indonesia). Mengorganisir semua aktivitas keamanan ke dalam 5 fungsi: Identify, Protect, Detect, Respond, Recover."
        when={[
          "Audit perusahaan yang menggunakan NIST CSF sebagai framework governance mereka",
          "Mau assess maturity level keamanan sebuah organisasi secara menyeluruh",
          "Perlu mapping antara NIST CSF dan ISO 27001/27002",
          "Klien di sektor infrastruktur kritis, perbankan, atau pemerintah — sering wajib mengikuti NIST",
        ]}
        how={[
          "Pahami urutan 5 fungsi: ID → PR → DE → RS → RC (bukan siklus, tapi hirarki)",
          "Setiap fungsi punya Categories dan Subcategories — ini yang diaudit secara spesifik",
          "Gunakan maturity tiers untuk assess di level mana organisasi berada",
          "Lihat ISO Mapping di tiap fungsi untuk dual-framework audit yang efisien",
        ]}
      />

      {/* ── 5 Functions Overview ── */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-2">🏗️ 5 Fungsi Inti</h2>
        <p className="text-sm text-slate-500 mb-5">
          Framework dibagi 5 fungsi berurutan — bukan siklus, tapi pipeline dari tahu → lindungi → deteksi → respons → pulih.
        </p>

        {/* Function pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FUNCTIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => setExpanded(expanded === f.id ? null : f.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all border ${
                expanded === f.id
                  ? `${f.color} ${f.accent} border-current shadow-sm`
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              {f.id} — {f.name}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {FUNCTIONS.map((f) => {
            const isOpen = expanded === f.id;
            return (
              <div
                key={f.id}
                className={`rounded-2xl border bg-white shadow-sm overflow-hidden ${isOpen ? "border-indigo-200" : "border-blue-200"}`}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : f.id)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-black border ${f.color} ${f.accent}`}>
                    {f.id}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-base ${f.accent}`}>{f.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{f.description}</p>
                  </div>
                  <span className="text-slate-400 shrink-0">{isOpen ? "▲" : "▼"}</span>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 p-6 bg-slate-50 space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">📌 Deskripsi</p>
                        <p className="text-sm text-slate-700 leading-6">{f.description}</p>
                        <div className={`mt-3 rounded-xl border p-3 ${f.color}`}>
                          <p className={`text-xs font-semibold ${f.accent}`}>💡 Kenapa penting untuk auditor?</p>
                          <p className={`mt-1 text-xs leading-5 ${f.accent}`}>{f.whyMatters}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">❓ Pertanyaan Audit</p>
                        <ul className="space-y-2">
                          {f.auditQuestions.map((q, i) => (
                            <li key={i} className="flex gap-2 text-sm text-slate-700">
                              <span className="text-indigo-400 shrink-0">{i + 1}.</span>
                              {q}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">🔗 ISO 27001 Mapping</p>
                          <div className="flex flex-wrap gap-1.5">
                            {f.isoMapping.map((m) => (
                              <span key={m} className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs text-indigo-600 border border-indigo-100">
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">📂 Categories ({f.categories.length})</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {f.categories.map((cat) => (
                          <div key={cat.name} className="rounded-xl bg-white border border-slate-200 p-3">
                            <p className="text-xs font-bold text-slate-700">{cat.name}</p>
                            <ul className="mt-1.5 space-y-1">
                              {cat.examples.map((ex) => (
                                <li key={ex} className="text-xs text-slate-500 flex gap-1.5">
                                  <span className="text-slate-300 shrink-0">•</span>
                                  {ex}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Maturity Tiers ── */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-slate-800 mb-2">📊 Implementation Tiers — Level Maturity</h2>
        <p className="text-sm text-slate-500 mb-5">
          NIST CSF mendefinisikan 4 tier untuk menggambarkan seberapa mature program keamanan sebuah organisasi. Auditor pakai ini untuk baseline assessment.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {MATURITY_TIERS.map((t) => (
            <div key={t.tier} className={`rounded-2xl border p-5 ${t.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold">{t.tier}</span>
                <span className="font-bold text-sm">{t.name}</span>
              </div>
              <p className="text-xs leading-5">{t.description}</p>
              <p className="mt-3 text-[10px] font-semibold opacity-70">Contoh: {t.typical}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Key Concepts ── */}
      <div className="mt-10 rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">💡 Hal Penting untuk Dipahami</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "NIST CSF vs ISO 27001",
              body: "NIST CSF lebih fleksibel dan berbasis outcome (apa yang harus dicapai). ISO 27001 lebih prescriptive (apa yang harus dilakukan). Keduanya komplementer: NIST untuk governance strategis, ISO 27001 untuk implementasi operasional yang terperinci.",
            },
            {
              title: "Bukan sertifikasi",
              body: "Tidak ada sertifikasi resmi 'NIST CSF compliant'. Ini framework tata kelola, bukan standar dengan audit pass/fail. Organisasi menggunakannya untuk self-assessment dan roadmap perbaikan.",
            },
            {
              title: "Profile & Gap Analysis",
              body: "NIST CSF mendorong organisasi membuat 'Current Profile' (kondisi sekarang) dan 'Target Profile' (kondisi yang diinginkan), lalu menganalisis gap. Inilah yang sering diminta auditor: 'tunjukkan current vs target kamu'.",
            },
            {
              title: "NIST CSF 2.0 (2024)",
              body: "Versi terbaru menambahkan fungsi ke-6: Govern (GV). Ini menempatkan governance sebagai fungsi overarching yang memayungi 5 fungsi lainnya. Penting untuk interview: tunjukkan kamu tahu ada update ini.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl bg-slate-50 border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
              <p className="mt-1.5 text-xs leading-5 text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </KnowledgeShell>
  );
}
