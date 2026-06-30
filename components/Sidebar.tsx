import Link from "next/link";

const menu = [
  { label: "🏠 Dashboard", href: "/" },
  { label: "📚 Knowledge Hub", href: "/knowledge" },
  { label: "📝 Audit Toolkit", href: "/audit-toolkit" },
  { label: "📋 Evidence Library", href: "/evidence-library" },
  { label: "📊 Risk Register", href: "/risk-register" },
  { label: "🤖 AI Policy Review", href: "/ai-policy-review" },
  { label: "🎤 Interview Lab", href: "/interview-lab" },
  { label: "⚙️ Settings", href: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-gradient-to-b from-indigo-50 to-blue-50 border-r border-blue-200 p-6">
      <h1 className="text-3xl font-bold text-indigo-700">
        Polaris
      </h1>

      <p className="mt-2 text-sm text-slate-600">
        Think Like an Auditor
      </p>

      <nav className="mt-10 space-y-3">
        {menu.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="block w-full rounded-2xl px-4 py-3 text-left text-slate-700 transition hover:bg-indigo-100 hover:text-indigo-700"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}