"use client";

import { useState } from "react";
import KnowledgeShell from "@/components/KnowledgeShell";
import HowToUse from "@/components/HowToUse";

type RiskStatus = "Open" | "Mitigating" | "Accepted" | "Closed";

type Risk = {
  id: number;
  asset: string;
  threat: string;
  vulnerability: string;
  likelihood: number;
  impact: number;
  controls: string;
  owner: string;
  status: RiskStatus;
};

function riskScore(r: Risk) {
  return r.likelihood * r.impact;
}

function scoreMeta(score: number): { label: string; color: string; bg: string } {
  if (score >= 15) return { label: "Critical", color: "text-red-700", bg: "bg-red-100 text-red-700" };
  if (score >= 10) return { label: "High", color: "text-orange-700", bg: "bg-orange-100 text-orange-700" };
  if (score >= 5)  return { label: "Medium", color: "text-yellow-700", bg: "bg-yellow-100 text-yellow-700" };
  return { label: "Low", color: "text-green-700", bg: "bg-green-100 text-green-700" };
}

const statusColors: Record<RiskStatus, string> = {
  Open: "bg-red-50 text-red-700 border-red-200",
  Mitigating: "bg-amber-50 text-amber-700 border-amber-200",
  Accepted: "bg-blue-50 text-blue-700 border-blue-200",
  Closed: "bg-green-50 text-green-700 border-green-200",
};

const initialRisks: Risk[] = [
  {
    id: 1,
    asset: "Customer Database",
    threat: "SQL Injection",
    vulnerability: "Unsanitized user inputs in legacy endpoints",
    likelihood: 3,
    impact: 5,
    controls: "WAF, input validation, parameterized queries",
    owner: "App Security",
    status: "Mitigating",
  },
  {
    id: 2,
    asset: "Active Directory",
    threat: "Brute force / credential stuffing",
    vulnerability: "No MFA on privileged accounts",
    likelihood: 4,
    impact: 5,
    controls: "Account lockout policy",
    owner: "IAM Team",
    status: "Open",
  },
  {
    id: 3,
    asset: "Backup Storage",
    threat: "Ransomware encryption",
    vulnerability: "Backups on same network segment as prod",
    likelihood: 3,
    impact: 4,
    controls: "Offline backups, tested recovery procedures",
    owner: "Infra Team",
    status: "Mitigating",
  },
  {
    id: 4,
    asset: "Email System",
    threat: "Phishing / BEC",
    vulnerability: "No DMARC enforcement",
    likelihood: 4,
    impact: 3,
    controls: "Security awareness training, spam filter",
    owner: "IT Operations",
    status: "Open",
  },
  {
    id: 5,
    asset: "Cloud Storage (S3)",
    threat: "Data exposure via misconfiguration",
    vulnerability: "Public access not blocked by default",
    likelihood: 2,
    impact: 5,
    controls: "Bucket policies reviewed quarterly, S3 Block Public Access enabled",
    owner: "Cloud Security",
    status: "Accepted",
  },
  {
    id: 6,
    asset: "VPN Gateway",
    threat: "Unauthorized remote access",
    vulnerability: "Outdated SSL VPN with known CVEs",
    likelihood: 3,
    impact: 4,
    controls: "Certificate-based auth, network segmentation",
    owner: "Network Team",
    status: "Mitigating",
  },
];

const blankForm = {
  asset: "",
  threat: "",
  vulnerability: "",
  likelihood: 3,
  impact: 3,
  controls: "",
  owner: "",
  status: "Open" as RiskStatus,
};

export default function RiskRegisterPage() {
  const [risks, setRisks] = useState<Risk[]>(initialRisks);
  const [filterStatus, setFilterStatus] = useState<RiskStatus | "All">("All");
  const [filterSeverity, setFilterSeverity] = useState<string>("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blankForm);
  const [nextId, setNextId] = useState(initialRisks.length + 1);

  const filtered = risks.filter((r) => {
    const meta = scoreMeta(riskScore(r));
    const statusOk = filterStatus === "All" || r.status === filterStatus;
    const severityOk = filterSeverity === "All" || meta.label === filterSeverity;
    return statusOk && severityOk;
  });

  const counts = {
    total: risks.length,
    critical: risks.filter((r) => riskScore(r) >= 15).length,
    high: risks.filter((r) => riskScore(r) >= 10 && riskScore(r) < 15).length,
    open: risks.filter((r) => r.status === "Open").length,
  };

  function addRisk() {
    if (!form.asset || !form.threat) return;
    setRisks((prev) => [...prev, { ...form, id: nextId }]);
    setNextId((n) => n + 1);
    setForm(blankForm);
    setShowForm(false);
  }

  function deleteRisk(id: number) {
    setRisks((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <KnowledgeShell
      title="📊 Risk Register"
      subtitle="Track, score, and manage information security risks with audit-grade rigor."
    >
      <HowToUse
        what="Risk Register adalah daftar terstruktur semua risiko keamanan informasi yang diidentifikasi dalam sebuah organisasi. Setiap risiko di-score berdasarkan Likelihood × Impact untuk menentukan prioritas mitigasi."
        when={[
          "Saat audit planning — identifikasi risiko sebelum menentukan scope pengujian",
          "Saat risk assessment — dokumentasikan temuan ancaman dan kelemahan",
          "Saat monitoring berkala — update status mitigasi setelah kontrol diimplementasikan",
          "Saat laporan ke manajemen — tunjukkan risk landscape secara visual",
        ]}
        how={[
          "Klik '+ Add Risk' untuk menambah risiko baru",
          "Isi asset, ancaman, dan kelemahan yang diidentifikasi",
          "Set Likelihood (1–5) dan Impact (1–5) — sistem otomatis hitung score",
          "Assign risk owner dan set status (Open/Mitigating/Accepted/Closed)",
          "Gunakan filter untuk fokus ke risiko Critical atau Open saja",
        ]}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {[
          { label: "Total Risks", value: counts.total, accent: "indigo" },
          { label: "Critical", value: counts.critical, accent: "red" },
          { label: "High", value: counts.high, accent: "orange" },
          { label: "Open", value: counts.open, accent: "amber" },
        ].map(({ label, value, accent }) => (
          <div
            key={label}
            className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">{label}</p>
            <p className={`mt-2 text-4xl font-bold text-${accent}-600`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters + Add button */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-2 flex-wrap">
          {(["All", "Open", "Mitigating", "Accepted", "Closed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                filterStatus === s
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-blue-200 bg-white text-slate-700 hover:border-indigo-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["All", "Critical", "High", "Medium", "Low"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterSeverity(s)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                filterSeverity === s
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-blue-200 bg-white text-slate-700 hover:border-indigo-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="ml-auto rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
        >
          {showForm ? "Cancel" : "+ Add Risk"}
        </button>
      </div>

      {/* Add risk form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-indigo-700">New Risk Entry</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Asset / System *</label>
              <input
                className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none"
                placeholder="e.g. Customer Database"
                value={form.asset}
                onChange={(e) => setForm((f) => ({ ...f, asset: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Threat *</label>
              <input
                className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none"
                placeholder="e.g. SQL Injection"
                value={form.threat}
                onChange={(e) => setForm((f) => ({ ...f, threat: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Vulnerability</label>
              <input
                className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none"
                placeholder="e.g. Unsanitized inputs"
                value={form.vulnerability}
                onChange={(e) => setForm((f) => ({ ...f, vulnerability: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Current Controls</label>
              <input
                className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none"
                placeholder="e.g. WAF, input validation"
                value={form.controls}
                onChange={(e) => setForm((f) => ({ ...f, controls: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Risk Owner</label>
              <input
                className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none"
                placeholder="e.g. App Security"
                value={form.owner}
                onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
              <select
                className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as RiskStatus }))}
              >
                {(["Open", "Mitigating", "Accepted", "Closed"] as const).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Likelihood (1–5): <span className="font-bold text-indigo-700">{form.likelihood}</span>
              </label>
              <input
                type="range" min={1} max={5} step={1}
                className="w-full accent-indigo-600"
                value={form.likelihood}
                onChange={(e) => setForm((f) => ({ ...f, likelihood: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Impact (1–5): <span className="font-bold text-indigo-700">{form.impact}</span>
              </label>
              <input
                type="range" min={1} max={5} step={1}
                className="w-full accent-indigo-600"
                value={form.impact}
                onChange={(e) => setForm((f) => ({ ...f, impact: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm text-slate-600">
              Risk Score: <strong className={scoreMeta(form.likelihood * form.impact).color}>{form.likelihood * form.impact} — {scoreMeta(form.likelihood * form.impact).label}</strong>
            </span>
            <button
              onClick={addRisk}
              className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
            >
              Save Risk
            </button>
          </div>
        </div>
      )}

      {/* Risk table */}
      <div className="overflow-x-auto rounded-2xl border border-blue-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-blue-100 bg-slate-50">
            <tr>
              {["Asset", "Threat", "Vulnerability", "L", "I", "Score", "Controls", "Owner", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-6 py-8 text-center text-slate-400">
                  No risks match the current filter.
                </td>
              </tr>
            )}
            {filtered.map((r) => {
              const score = riskScore(r);
              const meta = scoreMeta(score);
              return (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{r.asset}</td>
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{r.threat}</td>
                  <td className="px-4 py-3 text-slate-500 max-w-[200px]">{r.vulnerability}</td>
                  <td className="px-4 py-3 text-center font-mono text-slate-700">{r.likelihood}</td>
                  <td className="px-4 py-3 text-center font-mono text-slate-700">{r.impact}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${meta.bg}`}>
                      {score} {meta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 max-w-[180px]">{r.controls}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{r.owner}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusColors[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteRisk(r.id)}
                      className="text-slate-300 hover:text-red-500 transition text-lg leading-none"
                      title="Delete risk"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Risk Score = Likelihood × Impact (1–25). Critical ≥15 · High ≥10 · Medium ≥5 · Low &lt;5
      </p>
    </KnowledgeShell>
  );
}
