import type { ReactNode } from "react";

type KnowledgeShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  titleClassName?: string;
  subtitleClassName?: string;
  className?: string;
};

export default function KnowledgeShell({
  title,
  subtitle,
  children,
  titleClassName = "text-5xl",
  subtitleClassName = "text-slate-600 mt-3 mb-10",
  className = "",
}: KnowledgeShellProps) {
  return (
    <main className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-800 p-10 ${className}`}>
      <div className="max-w-6xl">
        <div className="mb-10">
          <h1 className={`font-bold text-slate-800 ${titleClassName}`}>{title}</h1>
          <p className={subtitleClassName}>{subtitle}</p>
        </div>

        {children}
      </div>
    </main>
  );
}
