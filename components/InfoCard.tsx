import type { ReactNode } from "react";

type InfoCardProps = {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
};

export default function InfoCard({
  title,
  description,
  children,
  className = "",
  titleClassName = "text-2xl font-semibold text-indigo-700",
}: InfoCardProps) {
  return (
    <div className={`rounded-xl border border-blue-200 bg-white p-6 shadow-sm ${className}`}>
      <h2 className={titleClassName}>{title}</h2>
      <p className="text-slate-600 mt-2">{description}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
