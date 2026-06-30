import Link from "next/link";
import Badge from "@/components/Badge";

type LearningCardProps = {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  time: string;
  status: string;
  completion: number;
  href?: string;
};

export default function LearningCard({
  title,
  description,
  category,
  difficulty,
  time,
  status,
  completion,
  href,
}: LearningCardProps) {
  return (
    <article className="group rounded-[2rem] border border-blue-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge label={category} variant="outline" />
        <Badge label={difficulty} variant="accent" />
      </div>

      <h3 className="mt-5 text-xl font-semibold text-slate-800 transition group-hover:text-indigo-700">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
        <span className="inline-flex items-center gap-2">⏱ {time}</span>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-indigo-700">
          {status}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        <div className="h-2 overflow-hidden rounded-full bg-blue-100">
          <div className="h-full rounded-full bg-indigo-600 transition-all duration-500" style={{ width: `${completion}%` }} />
        </div>
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-500">
          <span>{completion}% complete</span>
          <span>Learning pace</span>
        </div>
      </div>

      {href ? (
        <Link
          href={href}
          className="mt-6 inline-flex rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Continue
        </Link>
      ) : null}
    </article>
  );
}
