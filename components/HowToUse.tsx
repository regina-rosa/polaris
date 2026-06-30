"use client";

import { useState } from "react";

type HowToUseProps = {
  what: string;
  when: string[];
  how: string[];
};

export default function HowToUse({ what, when, how }: HowToUseProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-8 rounded-2xl border border-indigo-200 bg-indigo-50 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-indigo-100 transition"
      >
        <span className="flex items-center gap-2 font-semibold text-indigo-700">
          💡 How to use this tool
        </span>
        <span className="text-indigo-400 text-lg">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="grid gap-6 px-6 pb-6 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-2">Apa ini?</p>
            <p className="text-sm text-slate-700 leading-relaxed">{what}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-2">Kapan dipake?</p>
            <ul className="space-y-1.5">
              {when.map((w, i) => (
                <li key={i} className="text-sm text-slate-700 flex gap-2">
                  <span className="text-indigo-400 shrink-0">→</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-2">Cara pakainya</p>
            <ol className="space-y-1.5">
              {how.map((h, i) => (
                <li key={i} className="text-sm text-slate-700 flex gap-2">
                  <span className="font-bold text-indigo-600 shrink-0">{i + 1}.</span>
                  {h}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
