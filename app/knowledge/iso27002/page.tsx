"use client";

import { useState } from "react";
import KnowledgeShell from "@/components/KnowledgeShell";
import HowToUse from "@/components/HowToUse";

type Domain = {
  id: string;
  name: string;
  controls: number;
  what: string;
  keyControls: string[];
  auditQuestions: string[];
  ciaTruth: string;
};

const DOMAINS: Domain[] = [
  {
    id: "A.5",
    name: "Information Security Policies",
    controls: 2,
    what: "Kebijakan keamanan informasi harus ada, disetujui manajemen, dikomunikasikan, dan di-review secara berkala.",
    keyControls: ["A.5.1.1 Policies for information security", "A.5.1.2 Review of policies"],
    auditQuestions: [
      "Apakah kebijakan sudah ditandatangani manajemen senior?",
      "Kapan terakhir di-review? (standar: maks 12 bulan)",
      "Apakah semua karyawan sudah menerima dan acknowledge?",
    ],
    ciaTruth: "Fondasi C-I-A: tanpa kebijakan, tidak ada standar untuk mengukur kontrol.",
  },
  {
    id: "A.6",
    name: "Organization of Information Security",
    controls: 7,
    what: "Mendefinisikan roles, responsibilities, dan struktur governance untuk keamanan informasi — termasuk akses remote dan mobile.",
    keyControls: [
      "A.6.1.1 Information security roles and responsibilities",
      "A.6.1.2 Segregation of duties",
      "A.6.2.1 Mobile device policy",
      "A.6.2.2 Teleworking",
    ],
    auditQuestions: [
      "Siapa yang bertanggung jawab atas tiap kontrol keamanan? (RACI matrix)",
      "Apakah ada pemisahan tugas di sistem kritis (SOD)?",
      "Apakah ada kebijakan BYOD atau mobile device?",
    ],
    ciaTruth: "Segregation of duties melindungi Integrity — satu orang tidak bisa create sekaligus approve transaksi.",
  },
  {
    id: "A.7",
    name: "Human Resource Security",
    controls: 6,
    what: "Kontrol keamanan sebelum, selama, dan setelah karyawan bergabung — dari background check sampai offboarding.",
    keyControls: [
      "A.7.1.1 Screening (background check)",
      "A.7.2.2 Security awareness training",
      "A.7.3.1 Termination responsibilities",
    ],
    auditQuestions: [
      "Apakah background check dilakukan sebelum onboarding?",
      "Berapa % karyawan yang sudah selesai security awareness training?",
      "Berapa lama akses dicabut setelah karyawan resign/dipecat?",
    ],
    ciaTruth: "HR Security melindungi semua aspek CIA — manusia adalah vektor serangan terbesar (phishing, insider threat).",
  },
  {
    id: "A.8",
    name: "Asset Management",
    controls: 10,
    what: "Identifikasi, klasifikasi, dan penanganan semua aset informasi — termasuk labeling dan penghapusan data yang aman.",
    keyControls: [
      "A.8.1.1 Inventory of assets",
      "A.8.2.1 Classification of information",
      "A.8.2.2 Labeling of information",
      "A.8.3.1 Management of removable media",
    ],
    auditQuestions: [
      "Apakah ada asset inventory yang up-to-date?",
      "Bagaimana cara data diklasifikasikan (Public/Internal/Confidential/Secret)?",
      "Bagaimana cara media penyimpanan dihapus dengan aman?",
    ],
    ciaTruth: "Tidak bisa melindungi aset yang tidak kamu ketahui keberadaannya — inventory adalah fondasi Confidentiality.",
  },
  {
    id: "A.9",
    name: "Access Control",
    controls: 14,
    what: "Kontrol paling sering diaudit — mengatur siapa yang bisa akses apa, kapan, dan bagaimana. Mencakup MFA, password, dan privileged access.",
    keyControls: [
      "A.9.1.1 Access control policy",
      "A.9.2.1 User registration & de-registration",
      "A.9.2.3 Management of privileged access",
      "A.9.4.2 Secure log-on procedures (MFA)",
      "A.9.4.3 Password management",
    ],
    auditQuestions: [
      "Apakah MFA diterapkan untuk semua privileged account dan remote access?",
      "Berapa lama akses dicabut saat karyawan off-board?",
      "Apakah ada user access review minimal setiap 6 bulan?",
      "Apakah ada akun shared/generic yang masih aktif?",
    ],
    ciaTruth: "Domain terkuat untuk Confidentiality — akses kontrol yang lemah adalah root cause dari 80% breach.",
  },
  {
    id: "A.10",
    name: "Cryptography",
    controls: 2,
    what: "Kebijakan penggunaan enkripsi untuk melindungi data — termasuk key management, algoritma yang diizinkan, dan data in transit vs at rest.",
    keyControls: [
      "A.10.1.1 Policy on the use of cryptographic controls",
      "A.10.1.2 Key management",
    ],
    auditQuestions: [
      "Apakah ada enkripsi untuk data sensitif at rest (database, storage)?",
      "Apakah semua komunikasi menggunakan TLS 1.2+ (bukan SSL/TLS 1.0)?",
      "Bagaimana encryption keys dirotasi dan siapa yang punya akses?",
    ],
    ciaTruth: "Enkripsi adalah kontrol utama Confidentiality — bahkan jika data dicuri, tidak bisa dibaca.",
  },
  {
    id: "A.11",
    name: "Physical & Environmental Security",
    controls: 15,
    what: "Keamanan fisik untuk fasilitas dan peralatan — dari akses server room, clear desk policy, sampai proteksi terhadap bencana alam.",
    keyControls: [
      "A.11.1.1 Physical security perimeter",
      "A.11.1.2 Physical entry controls",
      "A.11.2.6 Security of equipment off-premises",
      "A.11.3.1 Clear desk and clear screen policy",
    ],
    auditQuestions: [
      "Siapa yang punya akses fisik ke server room? Ada log-nya?",
      "Apakah ada CCTV dan access control di area kritis?",
      "Apakah ada clean desk policy dan apakah dipatuhi?",
    ],
    ciaTruth: "Physical access = root access — physical security adalah last line of defense untuk semua CIA.",
  },
  {
    id: "A.12",
    name: "Operations Security",
    controls: 14,
    what: "Keamanan operasional sehari-hari: patch management, malware protection, logging, backup, dan pengelolaan kerentanan teknis.",
    keyControls: [
      "A.12.1.1 Documented operating procedures",
      "A.12.2.1 Controls against malware",
      "A.12.3.1 Information backup",
      "A.12.4.1 Event logging",
      "A.12.6.1 Management of technical vulnerabilities",
    ],
    auditQuestions: [
      "Kapan terakhir patching dilakukan? Ada SLA untuk critical vulnerability?",
      "Apakah backup ditest restore secara berkala?",
      "Apakah ada audit logs dan berapa lama retensinya?",
      "Apakah ada vulnerability scanning rutin?",
    ],
    ciaTruth: "Ops Security melindungi Availability (backup/patching) dan Integrity (change management/logging).",
  },
  {
    id: "A.13",
    name: "Communications Security",
    controls: 7,
    what: "Keamanan jaringan dan transfer informasi — network segmentation, firewall, dan perjanjian kerahasiaan untuk transfer data dengan pihak ketiga.",
    keyControls: [
      "A.13.1.1 Network controls",
      "A.13.1.3 Segregation in networks",
      "A.13.2.1 Information transfer policies",
      "A.13.2.3 Electronic messaging",
    ],
    auditQuestions: [
      "Apakah jaringan production dipisah dari jaringan development/guest?",
      "Apakah ada firewall rules yang di-review secara berkala?",
      "Apakah ada NDA/DTA untuk transfer data ke pihak ketiga?",
    ],
    ciaTruth: "Network segmentation melindungi Confidentiality dan membatasi blast radius saat terjadi breach.",
  },
  {
    id: "A.14",
    name: "System Acquisition, Development & Maintenance",
    controls: 13,
    what: "Keamanan dalam siklus pengembangan sistem — security requirements, secure coding, testing, dan perubahan sistem produksi.",
    keyControls: [
      "A.14.1.1 Information security requirements analysis",
      "A.14.2.2 System change control procedures",
      "A.14.2.8 System security testing",
      "A.14.3.1 Protection of test data",
    ],
    auditQuestions: [
      "Apakah security requirements didefinisikan sejak awal SDLC?",
      "Apakah ada change management process sebelum deploy ke production?",
      "Apakah data production dipakai untuk testing? (harusnya tidak)",
    ],
    ciaTruth: "Mencegah kerentanan masuk ke kode produksi = melindungi Integrity sejak akarnya.",
  },
  {
    id: "A.15",
    name: "Supplier Relationships",
    controls: 5,
    what: "Manajemen risiko dari vendor dan pihak ketiga — kontrak keamanan, SLA, dan monitoring supplier.",
    keyControls: [
      "A.15.1.1 Information security policy for supplier relationships",
      "A.15.1.2 Addressing security within supplier agreements",
      "A.15.2.1 Monitoring and review of supplier services",
    ],
    auditQuestions: [
      "Apakah ada security assessment sebelum vendor onboarding?",
      "Apakah kontrak vendor include security requirements dan right to audit?",
      "Apakah ada mekanisme monitoring kinerja keamanan vendor?",
    ],
    ciaTruth: "Vendor breach = breach organisasi — supply chain risk adalah salah satu risiko tertinggi saat ini.",
  },
  {
    id: "A.16",
    name: "Information Security Incident Management",
    controls: 7,
    what: "Perencanaan, deteksi, respons, dan pembelajaran dari insiden keamanan — dari phishing biasa sampai major breach.",
    keyControls: [
      "A.16.1.1 Responsibilities and procedures",
      "A.16.1.2 Reporting events",
      "A.16.1.5 Response to incidents",
      "A.16.1.6 Learning from incidents",
    ],
    auditQuestions: [
      "Apakah ada Incident Response Plan yang terdokumentasi?",
      "Kapan terakhir dilakukan tabletop exercise?",
      "Apakah ada incident log dan apakah di-review secara berkala?",
      "Berapa lama rata-rata time-to-detect dan time-to-contain?",
    ],
    ciaTruth: "Incident management melindungi Availability (respons cepat = downtime minimal) dan CIA pasca-incident.",
  },
  {
    id: "A.17",
    name: "Business Continuity Management",
    controls: 4,
    what: "Memastikan operasional bisnis tetap berjalan saat terjadi gangguan — disaster recovery, BCP, dan testing secara berkala.",
    keyControls: [
      "A.17.1.1 Planning information security continuity",
      "A.17.1.2 Implementing ICT continuity",
      "A.17.2.1 Availability of IT facilities",
    ],
    auditQuestions: [
      "Berapa RTO dan RPO untuk sistem kritikal? Apakah sudah ditest?",
      "Apakah ada Business Continuity Plan (BCP)?",
      "Kapan terakhir DR drill dilakukan?",
    ],
    ciaTruth: "BCM adalah tulang punggung Availability — organisasi harus bisa recovery setelah insiden apapun.",
  },
  {
    id: "A.18",
    name: "Compliance",
    controls: 8,
    what: "Kepatuhan terhadap regulasi, hukum, dan kebijakan internal — dari GDPR/UU PDP sampai software licensing dan audit internal.",
    keyControls: [
      "A.18.1.1 Identification of applicable legislation",
      "A.18.1.3 Protection of records",
      "A.18.1.4 Privacy and protection of personal data",
      "A.18.2.1 Independent review of information security",
    ],
    auditQuestions: [
      "Apakah ada register peraturan yang berlaku dan siapa PIC-nya?",
      "Apakah organisasi comply dengan UU PDP (Indonesia) / GDPR?",
      "Apakah ada internal audit IS yang independen?",
    ],
    ciaTruth: "Compliance memastikan seluruh C-I-A sesuai dengan standar eksternal yang bindeing.",
  },
];

const CIA_CARDS = [
  {
    letter: "C",
    name: "Confidentiality",
    color: "bg-blue-50 border-blue-200",
    accent: "text-blue-700",
    def: "Informasi hanya bisa diakses oleh pihak yang berwenang.",
    example: "Enkripsi data, access control, MFA, klasifikasi informasi.",
    controls: ["A.9 Access Control", "A.10 Cryptography", "A.8 Asset Mgmt"],
  },
  {
    letter: "I",
    name: "Integrity",
    color: "bg-green-50 border-green-200",
    accent: "text-green-700",
    def: "Informasi akurat, lengkap, dan tidak dimodifikasi tanpa otorisasi.",
    example: "Change management, digital signature, audit logs, version control.",
    controls: ["A.12 Operations Security", "A.14 System Dev", "A.6 Org Controls"],
  },
  {
    letter: "A",
    name: "Availability",
    color: "bg-orange-50 border-orange-200",
    accent: "text-orange-700",
    def: "Informasi dan sistem tersedia saat dibutuhkan oleh pengguna yang berwenang.",
    example: "Backup, redundancy, patch management, disaster recovery.",
    controls: ["A.12 Operations Security", "A.17 BCM", "A.13 Network Security"],
  },
];

export default function ISO27002() {
  const [expanded, setExpanded] = useState<string | null>("A.9");
  const [search, setSearch] = useState("");

  const filtered = DOMAINS.filter(
    (d) =>
      !search ||
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.what.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <KnowledgeShell
      title="ISO 27002"
      subtitle="Panduan lengkap 14 domain kontrol keamanan informasi — referensi wajib untuk setiap IT auditor."
      titleClassName="text-5xl"
      backHref="/knowledge"
      backLabel="Knowledge Hub"
    >
      <HowToUse
        what="ISO 27002 adalah panduan implementasi kontrol keamanan yang mendukung ISO 27001. Berisi 114 kontrol di 14 domain — ini adalah referensi utama auditor saat menentukan apa yang harus ditest dan dibuktikan."
        when={[
          "Melakukan audit ISO 27001 — 27002 menjelaskan cara implementasi setiap kontrol di Annex A",
          "Ingin tahu kontrol mana yang relevan untuk domain tertentu (access control, incident management, dll)",
          "Mempersiapkan Evidence Request List (ERL) untuk fieldwork",
          "Interview IT auditor yang menanyakan tentang ISO framework",
        ]}
        how={[
          "Mulai dari CIA Triad di atas — ini fondasi semua kontrol",
          "Expand tiap domain untuk lihat kontrol kunci dan pertanyaan audit",
          "Gunakan pertanyaan audit sebagai template saat fieldwork nyata",
          "Domain A.9 (Access Control) dan A.12 (Operations) adalah yang paling sering diaudit — pelajari duluan",
        ]}
      />

      {/* ── CIA Triad ── */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4">🔺 CIA Triad — Fondasi Semua Kontrol</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {CIA_CARDS.map((c) => (
            <div key={c.letter} className={`rounded-2xl border p-5 ${c.color}`}>
              <div className={`text-4xl font-black ${c.accent}`}>{c.letter}</div>
              <p className={`mt-1 text-lg font-bold ${c.accent}`}>{c.name}</p>
              <p className="mt-2 text-sm text-slate-600 leading-6">{c.def}</p>
              <p className="mt-3 text-xs font-semibold text-slate-500">Contoh kontrol:</p>
              <p className="mt-0.5 text-xs text-slate-600">{c.example}</p>
              <div className="mt-3 flex flex-col gap-1">
                {c.controls.map((ctrl) => (
                  <span key={ctrl} className="rounded-full bg-white/70 px-2.5 py-0.5 text-xs text-slate-600 w-fit">
                    {ctrl}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Domain Overview ── */}
      <div className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold text-slate-800">📋 14 Domain Kontrol (A.5 – A.18)</h2>
          <input
            type="search"
            placeholder="Cari domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm text-slate-600 placeholder:text-slate-300 focus:border-indigo-400 focus:outline-none"
          />
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Total: 114 kontrol di 14 domain. Klik domain untuk lihat detail dan pertanyaan audit.
        </p>

        <div className="space-y-2">
          {filtered.map((d) => {
            const isOpen = expanded === d.id;
            return (
              <div
                key={d.id}
                className={`rounded-2xl border bg-white shadow-sm overflow-hidden transition-all ${isOpen ? "border-indigo-300 ring-1 ring-indigo-100" : "border-blue-200 hover:border-indigo-200"}`}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : d.id)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="shrink-0 rounded-xl bg-indigo-100 px-3 py-1.5 font-mono text-sm font-bold text-indigo-700">
                      {d.id}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800">{d.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{d.what.substring(0, 80)}…</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                      {d.controls} kontrol
                    </span>
                    <span className="text-slate-400">{isOpen ? "▲" : "▼"}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 p-5 bg-slate-50 grid gap-5 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">📌 Apa yang dicakup</p>
                        <p className="text-sm text-slate-700 leading-6">{d.what}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">🔑 Kontrol Kunci</p>
                        <ul className="space-y-1.5">
                          {d.keyControls.map((kc) => (
                            <li key={kc} className="flex gap-2 text-sm">
                              <span className="text-indigo-400 shrink-0">•</span>
                              <span className="font-mono text-xs text-indigo-700">{kc.split(" ")[0]}</span>
                              <span className="text-slate-600">{kc.split(" ").slice(1).join(" ")}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">❓ Pertanyaan Audit</p>
                        <ul className="space-y-2">
                          {d.auditQuestions.map((q, i) => (
                            <li key={i} className="flex gap-2 text-sm text-slate-700">
                              <span className="text-indigo-400 shrink-0">{i + 1}.</span>
                              {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3">
                        <p className="text-xs font-bold text-indigo-600 mb-1">🔺 CIA Connection</p>
                        <p className="text-xs text-indigo-800">{d.ciaTruth}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Key Takeaways ── */}
      <div className="mt-10 rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">💡 Yang Paling Penting untuk Dipahami</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "27001 vs 27002",
              body: "ISO 27001 = standar yang bisa disertifikasi (menyatakan WHAT harus dilakukan). ISO 27002 = panduan implementasi (menjelaskan HOW). Auditor menguji terhadap 27001, menggunakan 27002 sebagai referensi cara implementasi.",
            },
            {
              title: "Annex A Controls",
              body: "114 kontrol di Annex A ISO 27001 = sama persis dengan domain A.5–A.18 di ISO 27002. Statement of Applicability (SoA) mendokumentasikan kontrol mana yang applicable dan mana yang di-exclude (beserta justifikasinya).",
            },
            {
              title: "Control ≠ Implemented",
              body: "Punya kebijakan (design) ≠ kebijakan dipatuhi (operating effectiveness). Auditor harus membuktikan keduanya: kontrol ada DAN berfungsi. Policy saja bukan evidence yang cukup.",
            },
            {
              title: "Domain Prioritas",
              body: "A.9 (Access Control) dan A.12 (Operations Security) adalah dua domain yang paling sering jadi fokus audit karena paling banyak temuan. Pelajari keduanya lebih dalam daripada domain lain.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
              <p className="mt-1.5 text-xs leading-5 text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </KnowledgeShell>
  );
}
