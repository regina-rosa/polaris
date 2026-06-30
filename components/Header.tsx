"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [name, setName] = useState("");
  const [targetRole, setTargetRole] = useState("IT Auditor");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("polaris-profile");
      if (stored) {
        const p = JSON.parse(stored);
        if (p.name) setName(p.name);
        if (p.targetRole) setTargetRole(p.targetRole);
      }
    } catch {
      // ignore
    }
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const displayName = name ? `, ${name.split(" ")[0]}` : "";

  return (
    <header className="flex flex-col gap-4 rounded-[2rem] border border-blue-200 bg-gradient-to-r from-indigo-50 via-blue-50 to-slate-50 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-indigo-500">Polaris — Think Like an Auditor</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-800">
          {greeting}{displayName} 👋
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Kamu lagi dalam perjalanan jadi <span className="font-semibold text-indigo-600">{targetRole}</span>. Keep going.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs text-slate-400">Career switch progress</p>
          <p className="text-sm font-semibold text-indigo-600">In progress 🚀</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 font-bold text-white text-lg shadow-sm">
          {name ? name[0].toUpperCase() : "?"}
        </div>
      </div>
    </header>
  );
}
