type BadgeVariant = "soft" | "accent" | "outline";

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
  className?: string;
};

const variantStyles: Record<BadgeVariant, string> = {
  soft: "bg-indigo-100 text-indigo-700",
  accent: "bg-indigo-600 text-white",
  outline: "border border-indigo-300 text-indigo-700",
};

export default function Badge({
  label,
  variant = "soft",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] ${variantStyles[variant]} ${className}`}
    >
      {label}
    </span>
  );
}
