"use client";

import { useState, useEffect, useMemo } from "react";
import KnowledgeShell from "@/components/KnowledgeShell";

// ─── BIBLE VERSES ────────────────────────────────────────────────────────────

const VERSES = [
  { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", ref: "Jeremiah 29:11" },
  { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
  { text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", ref: "Joshua 1:9" },
  { text: "Commit to the Lord whatever you do, and he will establish your plans.", ref: "Proverbs 16:3" },
  { text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.", ref: "Isaiah 40:31" },
  { text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.", ref: "Proverbs 3:5-6" },
  { text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", ref: "Romans 8:28" },
  { text: "She is clothed with strength and dignity; she can laugh at the days to come.", ref: "Proverbs 31:25" },
  { text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.", ref: "Philippians 4:6" },
  { text: "The Lord himself goes before you and will be with you; he will never leave you nor forsake you. Do not be afraid; do not be discouraged.", ref: "Deuteronomy 31:8" },
];

// ─── TYPES ───────────────────────────────────────────────────────────────────

type Status = "wishlist" | "applied" | "interview" | "offer" | "rejected";

type Job = {
  id: string;
  company: string;
  role: string;
  url: string;
  location: string;
  status: Status;
  dateAdded: string;
  dateApplied: string;
  salary: string;
  requirements: string;
  notes: string;
};

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; order: number }> = {
  wishlist:  { label: "Wishlist",   color: "text-slate-600",  bg: "bg-slate-100 border-slate-200",   order: 0 },
  applied:   { label: "Applied",    color: "text-blue-700",   bg: "bg-blue-100 border-blue-200",     order: 1 },
  interview: { label: "Interview",  color: "text-amber-700",  bg: "bg-amber-100 border-amber-200",   order: 2 },
  offer:     { label: "Offer 🎉",   color: "text-green-700",  bg: "bg-green-100 border-green-200",   order: 3 },
  rejected:  { label: "Rejected",   color: "text-red-600",    bg: "bg-red-100 border-red-200",       order: 4 },
};

const EMPTY_JOB: Omit<Job, "id" | "dateAdded"> = {
  company: "", role: "", url: "", location: "", status: "wishlist",
  dateApplied: "", salary: "", requirements: "", notes: "",
};

// ─── KEYWORD MATCHING ────────────────────────────────────────────────────────

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "and", "or", "the", "a", "an", "in", "on", "at", "to", "for", "of", "with",
    "is", "are", "be", "have", "has", "will", "can", "must", "should", "may",
    "yang", "dan", "atau", "di", "ke", "dari", "dengan", "untuk", "adalah",
    "akan", "dapat", "harus", "bisa", "serta", "dalam", "pada", "ini", "itu",
    "as", "by", "from", "this", "that", "we", "you", "our", "your", "they",
  ]);

  return [...new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s\-\/]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !stopWords.has(w))
  )];
}

function matchKeywords(cv: string, requirements: string) {
  const reqKeywords = extractKeywords(requirements);
  const cvLower = cv.toLowerCase();
  const found = reqKeywords.filter((kw) => cvLower.includes(kw));
  const missing = reqKeywords.filter((kw) => !cvLower.includes(kw));
  return { found, missing, total: reqKeywords.length };
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function BibleVerse() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(Math.floor(Math.random() * VERSES.length));
  }, []);

  const verse = VERSES[idx];

  return (
    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white shadow-md">
      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200">✝ Daily Reminder</p>
      <p className="mt-3 text-base leading-7 italic">"{verse.text}"</p>
      <p className="mt-3 text-sm font-bold text-indigo-200">— {verse.ref}</p>
      <button
        onClick={() => setIdx((i) => (i + 1) % VERSES.length)}
        className="mt-4 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold hover:bg-white/25 transition"
      >
        Verse berikutnya →
      </button>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function JobTracker() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [cv, setCv] = useState("");
  const [cvSaved, setCvSaved] = useState(false);
  const [showCvPanel, setShowCvPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_JOB);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [matchResult, setMatchResult] = useState<{ jobId: string; found: string[]; missing: string[]; total: number } | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("polaris-jobs");
      if (stored) setJobs(JSON.parse(stored));
      const storedCv = localStorage.getItem("polaris-cv");
      if (storedCv) setCv(storedCv);
    } catch { /* ignore */ }
  }, []);

  function saveJobs(updated: Job[]) {
    setJobs(updated);
    localStorage.setItem("polaris-jobs", JSON.stringify(updated));
  }

  function saveCv() {
    localStorage.setItem("polaris-cv", cv);
    setCvSaved(true);
    setTimeout(() => setCvSaved(false), 2000);
  }

  function addJob() {
    if (!form.company || !form.role) return;
    const newJob: Job = {
      ...form,
      id: crypto.randomUUID(),
      dateAdded: new Date().toISOString().split("T")[0],
    };
    saveJobs([newJob, ...jobs]);
    setForm(EMPTY_JOB);
    setShowForm(false);
  }

  function updateStatus(id: string, status: Status) {
    saveJobs(jobs.map((j) => (j.id === id ? { ...j, status } : j)));
  }

  function deleteJob(id: string) {
    saveJobs(jobs.filter((j) => j.id !== id));
    if (expanded === id) setExpanded(null);
    if (matchResult?.jobId === id) setMatchResult(null);
  }

  function updateJobField(id: string, field: keyof Job, value: string) {
    saveJobs(jobs.map((j) => (j.id === id ? { ...j, [field]: value } : j)));
  }

  function runMatch(job: Job) {
    if (!cv.trim()) {
      alert("CV kamu belum diisi. Buka panel CV dulu dan paste CV kamu.");
      return;
    }
    if (!job.requirements.trim()) {
      alert("Requirements untuk job ini belum diisi. Expand job-nya dan isi bagian Requirements.");
      return;
    }
    const result = matchKeywords(cv, job.requirements);
    setMatchResult({ jobId: job.id, ...result });
    setExpanded(job.id);
  }

  const filtered = useMemo(() =>
    filterStatus === "all" ? jobs : jobs.filter((j) => j.status === filterStatus),
    [jobs, filterStatus]
  );

  const stats = useMemo(() => ({
    total: jobs.length,
    applied: jobs.filter((j) => j.status === "applied").length,
    interview: jobs.filter((j) => j.status === "interview").length,
    offer: jobs.filter((j) => j.status === "offer").length,
    wishlist: jobs.filter((j) => j.status === "wishlist").length,
  }), [jobs]);

  return (
    <KnowledgeShell
      title="Job Tracker"
      subtitle="Track semua lamaran kerja kamu — dari wishlist sampai offer, lengkap dengan cek kecocokan CV."
      titleClassName="text-4xl"
    >
      {/* ── Bible Verse ── */}
      <BibleVerse />

      {/* ── Stats ── */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: "Total", value: stats.total, color: "text-slate-700" },
          { label: "Wishlist", value: stats.wishlist, color: "text-slate-500" },
          { label: "Applied", value: stats.applied, color: "text-blue-600" },
          { label: "Interview", value: stats.interview, color: "text-amber-600" },
          { label: "Offer", value: stats.offer, color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-blue-200 bg-white p-4 text-center shadow-sm">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── CV Panel ── */}
      <div className="mt-6 rounded-2xl border border-blue-200 bg-white shadow-sm overflow-hidden">
        <button
          onClick={() => setShowCvPanel((p) => !p)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">📄</span>
            <div>
              <p className="font-semibold text-slate-800">CV Kamu</p>
              <p className="text-xs text-slate-400">
                {cv.trim() ? `${cv.trim().split(/\s+/).length} kata tersimpan — siap untuk cek kecocokan` : "Belum ada CV — paste di sini untuk unlock fitur keyword matching"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cv.trim() && <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">✓ Tersimpan</span>}
            <span className="text-slate-400">{showCvPanel ? "▲" : "▼"}</span>
          </div>
        </button>

        {showCvPanel && (
          <div className="border-t border-slate-100 p-5">
            <p className="text-xs text-slate-500 mb-3">
              Paste isi CV kamu di sini (copy dari Word/PDF). Dipakai untuk cek kecocokan keyword dengan requirements job.
            </p>
            <textarea
              value={cv}
              onChange={(e) => setCv(e.target.value)}
              placeholder="Paste CV kamu di sini..."
              rows={10}
              className="w-full rounded-xl border border-slate-200 p-4 text-sm text-slate-700 placeholder:text-slate-300 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200 resize-y font-mono leading-6"
            />
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={saveCv}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${cvSaved ? "bg-green-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
              >
                {cvSaved ? "✓ Tersimpan!" : "Simpan CV"}
              </button>
              {cv.trim() && (
                <p className="text-xs text-slate-400">{cv.trim().split(/\s+/).length} kata</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Actions & Filter ── */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["all", "wishlist", "applied", "interview", "offer", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all ${
                filterStatus === s
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              {s === "all" ? `Semua (${jobs.length})` : `${STATUS_CONFIG[s].label} (${jobs.filter(j => j.status === s).length})`}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm((p) => !p)}
          className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
        >
          {showForm ? "✕ Batal" : "+ Tambah Job"}
        </button>
      </div>

      {/* ── Add Job Form ── */}
      {showForm && (
        <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 shadow-sm">
          <p className="font-semibold text-indigo-800 mb-4">📌 Tambah Lamaran Baru</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Perusahaan *</label>
              <input
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                placeholder="Nama perusahaan"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Posisi *</label>
              <input
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                placeholder="IT Auditor, GRC Analyst, ..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Link Job</label>
              <input
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="https://linkedin.com/jobs/..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Lokasi</label>
              <input
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="Jakarta / Remote / Hybrid"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Status }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none"
              >
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Estimasi Gaji</label>
              <input
                value={form.salary}
                onChange={(e) => setForm((f) => ({ ...f, salary: e.target.value }))}
                placeholder="Rp 8–12 juta / bulan"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Requirements / Job Description
              <span className="ml-1 text-indigo-500">(paste dari job posting — untuk keyword matching)</span>
            </label>
            <textarea
              value={form.requirements}
              onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))}
              placeholder="Paste requirements atau job description dari postingan..."
              rows={5}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none resize-y"
            />
          </div>
          <div className="mt-3">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Catatan Pribadi</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Kenapa tertarik, siapa kontak di sana, hal yang perlu dipersiapkan, dll."
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none resize-y"
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={addJob}
              disabled={!form.company || !form.role}
              className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Simpan Job
            </button>
            <button
              onClick={() => { setShowForm(false); setForm(EMPTY_JOB); }}
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* ── Job List ── */}
      <div className="mt-5 space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-blue-200 p-12 text-center">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-sm font-semibold text-slate-600">Belum ada lamaran di sini</p>
            <p className="text-xs text-slate-400 mt-1">
              {jobs.length === 0 ? "Klik '+ Tambah Job' untuk mulai tracking." : "Coba filter yang lain."}
            </p>
          </div>
        )}

        {filtered.map((job) => {
          const isOpen = expanded === job.id;
          const st = STATUS_CONFIG[job.status];
          const match = matchResult?.jobId === job.id ? matchResult : null;

          return (
            <div
              key={job.id}
              className={`rounded-2xl border bg-white shadow-sm overflow-hidden transition-all ${isOpen ? "border-indigo-300 ring-1 ring-indigo-100" : "border-blue-200"}`}
            >
              {/* ── Job Header ── */}
              <div className="flex items-center gap-4 p-5">
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => setExpanded(isOpen ? null : job.id)}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${st.bg} ${st.color}`}>
                      {st.label}
                    </span>
                    {job.location && (
                      <span className="text-xs text-slate-400">📍 {job.location}</span>
                    )}
                    {job.salary && (
                      <span className="text-xs text-slate-400">💰 {job.salary}</span>
                    )}
                    <span className="text-xs text-slate-300">{job.dateAdded}</span>
                  </div>
                  <p className="font-bold text-slate-800">{job.role}</p>
                  <p className="text-sm text-slate-500">{job.company}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {job.url && (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Buka Job ↗
                    </a>
                  )}
                  <button
                    onClick={() => runMatch(job)}
                    className="rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-200 transition"
                    title="Cek kecocokan CV dengan requirements"
                  >
                    🔍 Cek CV
                  </button>
                  <button
                    onClick={() => setExpanded(isOpen ? null : job.id)}
                    className="text-slate-400 px-1"
                  >
                    {isOpen ? "▲" : "▼"}
                  </button>
                </div>
              </div>

              {/* ── Expanded Detail ── */}
              {isOpen && (
                <div className="border-t border-slate-100 p-5 bg-slate-50 space-y-5">

                  {/* Status updater */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                      {(Object.entries(STATUS_CONFIG) as [Status, typeof STATUS_CONFIG[Status]][]).map(([k, v]) => (
                        <button
                          key={k}
                          onClick={() => updateStatus(job.id, k)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                            job.status === k ? `${v.bg} ${v.color}` : "border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CV Match Result */}
                  {match && (
                    <div className="rounded-xl border border-indigo-200 bg-white p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-slate-800">🔍 Hasil Keyword Matching</p>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                          match.total === 0 ? "bg-slate-100 text-slate-500" :
                          (match.found.length / match.total) >= 0.6 ? "bg-green-100 text-green-700" :
                          (match.found.length / match.total) >= 0.4 ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {match.total === 0 ? "N/A" : `${Math.round((match.found.length / match.total) * 100)}% match`}
                        </span>
                      </div>

                      {match.total === 0 ? (
                        <p className="text-xs text-slate-400">Requirements belum diisi untuk job ini.</p>
                      ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold text-green-600 mb-2">✅ Ada di CV ({match.found.length})</p>
                            <div className="flex flex-wrap gap-1.5">
                              {match.found.length > 0
                                ? match.found.map((kw) => (
                                    <span key={kw} className="rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-xs text-green-700">{kw}</span>
                                  ))
                                : <span className="text-xs text-slate-400">Tidak ada keyword yang match</span>
                              }
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-red-600 mb-2">❌ Tidak ada di CV ({match.missing.length})</p>
                            <div className="flex flex-wrap gap-1.5">
                              {match.missing.length > 0
                                ? match.missing.map((kw) => (
                                    <span key={kw} className="rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs text-red-700">{kw}</span>
                                  ))
                                : <span className="text-xs text-green-600 font-semibold">Semua keyword ada ✓</span>
                              }
                            </div>
                          </div>
                        </div>
                      )}

                      {match.missing.length > 0 && (
                        <div className="mt-3 rounded-lg bg-amber-50 border border-amber-100 p-3">
                          <p className="text-xs font-semibold text-amber-700 mb-1">💡 Tips</p>
                          <p className="text-xs text-amber-800">
                            Keyword yang tidak ada di CV tapi ada di requirements — kalau kamu punya pengalaman relevan,
                            coba tambahkan ke CV dengan bahasa yang sesuai. Jangan tambahkan yang tidak benar-benar kamu kuasai.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Requirements */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Requirements / Job Description
                    </p>
                    <textarea
                      value={job.requirements}
                      onChange={(e) => updateJobField(job.id, "requirements", e.target.value)}
                      placeholder="Paste requirements dari job posting..."
                      rows={5}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:border-indigo-400 focus:outline-none resize-y"
                    />
                    {job.requirements && (
                      <button
                        onClick={() => runMatch(job)}
                        className="mt-2 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition"
                      >
                        🔍 Cek kecocokan dengan CV
                      </button>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Catatan Pribadi</p>
                    <textarea
                      value={job.notes}
                      onChange={(e) => updateJobField(job.id, "notes", e.target.value)}
                      placeholder="Kenapa tertarik, siapa yang bisa dihubungi, apa yang perlu disiapkan..."
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:border-indigo-400 focus:outline-none resize-y"
                    />
                  </div>

                  {/* Date Applied */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Tanggal Apply</label>
                      <input
                        type="date"
                        value={job.dateApplied}
                        onChange={(e) => updateJobField(job.id, "dateApplied", e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1" />
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                    >
                      Hapus Job
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Bottom encouragement ── */}
      {jobs.length > 0 && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            {stats.offer > 0
              ? `🎉 Ada ${stats.offer} offer! Selamat — kerja kerasmu terbayar.`
              : stats.interview > 0
              ? `💪 ${stats.interview} interview — kamu sudah di jalur yang benar. Stay focused.`
              : `🌱 ${stats.applied} lamaran terkirim. Satu langkah sekaligus — His timing is perfect.`
            }
          </p>
        </div>
      )}
    </KnowledgeShell>
  );
}
