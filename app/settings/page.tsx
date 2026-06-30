"use client";

import { useState, useEffect } from "react";
import KnowledgeShell from "@/components/KnowledgeShell";

type Profile = {
  name: string;
  currentRole: string;
  targetRole: string;
  targetTimeline: string;
  experience: string;
  focusAreas: string[];
};

const FOCUS_OPTIONS = [
  "ISO 27001 / 27002",
  "SOC 2",
  "NIST CSF",
  "Risk Assessment",
  "Evidence Collection",
  "Audit Reporting",
  "IT General Controls",
  "Cloud Security (AWS/Azure/GCP)",
  "AI Governance",
  "CISA Exam Prep",
];

const DEFAULT_PROFILE: Profile = {
  name: "",
  currentRole: "Cybersecurity Engineer",
  targetRole: "IT Auditor",
  targetTimeline: "",
  experience: "1-3 years",
  focusAreas: ["ISO 27001 / 27002", "Risk Assessment"],
};

export default function Settings() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("polaris-profile");
      if (stored) setProfile(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  function save() {
    localStorage.setItem("polaris-profile", JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleFocus(area: string) {
    setProfile((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter((a) => a !== area)
        : [...prev.focusAreas, area],
    }));
  }

  return (
    <KnowledgeShell
      title="Settings"
      subtitle="Sesuaikan profil belajar dan preferensi kamu."
      titleClassName="text-4xl"
    >
      <div className="mt-8 max-w-2xl space-y-6">

        {/* ── Profile ── */}
        <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">👤 Profil Kamu</h2>
          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Nama
              </label>
              <input
                type="text"
                placeholder="Nama kamu..."
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Role Sekarang
                </label>
                <input
                  type="text"
                  value={profile.currentRole}
                  onChange={(e) => setProfile((p) => ({ ...p, currentRole: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Target Role
                </label>
                <input
                  type="text"
                  value={profile.targetRole}
                  onChange={(e) => setProfile((p) => ({ ...p, targetRole: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Target Timeline
                </label>
                <input
                  type="text"
                  placeholder="e.g., Q2 2025"
                  value={profile.targetTimeline}
                  onChange={(e) => setProfile((p) => ({ ...p, targetTimeline: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Pengalaman Security
                </label>
                <select
                  value={profile.experience}
                  onChange={(e) => setProfile((p) => ({ ...p, experience: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200"
                >
                  <option>{"< 1 year"}</option>
                  <option>1-3 years</option>
                  <option>3-5 years</option>
                  <option>5+ years</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ── Focus Areas ── */}
        <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">🎯 Focus Area Belajar</h2>
          <p className="mt-1 text-xs text-slate-400">Pilih topik yang ingin kamu prioritaskan</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {FOCUS_OPTIONS.map((area) => {
              const isSelected = profile.focusAreas.includes(area);
              return (
                <button
                  key={area}
                  onClick={() => toggleFocus(area)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {isSelected ? "✓ " : ""}{area}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Career Progress Card ── */}
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
          <h2 className="text-lg font-semibold text-indigo-800">🚀 Career Switch Journey</h2>
          <div className="mt-4 space-y-3">
            {[
              { label: "From", value: profile.currentRole || "Cybersecurity Engineer", color: "text-slate-700" },
              { label: "To", value: profile.targetRole || "IT Auditor", color: "text-indigo-700 font-bold" },
              { label: "Target", value: profile.targetTimeline || "Not set", color: "text-slate-600" },
              { label: "Experience", value: profile.experience, color: "text-slate-600" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="w-16 text-xs font-semibold text-slate-400">{row.label}</span>
                <span className={`text-sm ${row.color}`}>{row.value}</span>
              </div>
            ))}
          </div>
          {profile.focusAreas.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-indigo-600 mb-2">Focus areas:</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.focusAreas.map((area) => (
                  <span key={area} className="rounded-full bg-white border border-indigo-200 px-2.5 py-1 text-xs text-indigo-700">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Polaris Info ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">ℹ️ Tentang Polaris</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>Polaris adalah portfolio dan learning platform yang dibangun untuk mempersiapkan career switch dari cybersecurity engineering ke IT auditing.</p>
            <div className="mt-4 grid gap-2 grid-cols-2 text-xs">
              {[
                ["Knowledge Hub", "4 modul pembelajaran"],
                ["Audit Toolkit", "ISO 27001 + NIST + SOC 2"],
                ["Risk Register", "Interactive risk management"],
                ["Audit Simulation", "End-to-end audit lifecycle"],
                ["Evidence Library", "Reference bukti audit"],
                ["AI Policy Review", "AI governance framework"],
                ["Interview Lab", "30+ Q&A persiapan interview"],
              ].map(([name, desc]) => (
                <div key={name} className="rounded-lg bg-slate-50 p-3">
                  <p className="font-semibold text-slate-700">{name}</p>
                  <p className="text-slate-400 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Save Button ── */}
        <button
          onClick={save}
          className={`w-full rounded-2xl py-4 text-sm font-semibold transition-all ${
            saved
              ? "bg-green-500 text-white"
              : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]"
          }`}
        >
          {saved ? "✓ Tersimpan!" : "Simpan Profil"}
        </button>
      </div>
    </KnowledgeShell>
  );
}
