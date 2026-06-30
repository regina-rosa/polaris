import type { ReactNode } from "react";
import Link from "next/link";

type KnowledgeShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  titleClassName?: string;
  subtitleClassName?: string;
  className?: string;
  backHref?: string;
  backLabel?: string;
};

export default function KnowledgeShell({
  title,
  subtitle,
  children,
  titleClassName = "text-5xl",
  subtitleClassName = "text-slate-600 mt-3 mb-10",
  className = "",
  backHref,
  backLabel = "Back",
}: KnowledgeShellProps) {
  return (
    <main className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-800 p-10 ${className}`}>
      <div className="max-w-6xl">
        {/* Top nav */}
        <nav className="mb-8 flex items-center gap-3 text-sm">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-4 py-2 text-slate-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"
          >
            ← Dashboard
          </Link>
          {backHref && (
            <>
              <span className="text-slate-300">/</span>
              <Link
                href={backHref}
                className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-4 py-2 text-slate-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"
              >
                {backLabel}
              </Link>
            </>
          )}
          <span className="text-slate-300">/</span>
          <span className="rounded-full bg-indigo-600 px-4 py-2 text-white font-medium">
            {title}
          </span>
        </nav>

        <div className="mb-10">
          <h1 className={`font-bold text-slate-800 ${titleClassName}`}>{title}</h1>
          <p className={subtitleClassName}>{subtitle}</p>
        </div>

        {children}
      </div>
    </main>
  );
}
