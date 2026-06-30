type ProgressTrackerProps = {
  label: string;
  percentage: number;
  color?: "indigo" | "slate";
};

export default function ProgressTracker({
  label,
  percentage,
  color = "indigo",
}: ProgressTrackerProps) {
  const colors = {
    indigo: "bg-indigo-600",
    slate: "bg-slate-400",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-800">{percentage}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-blue-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
