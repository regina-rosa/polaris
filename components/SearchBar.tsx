type SearchBarProps = {
  placeholder?: string;
  className?: string;
};

export default function SearchBar({
  placeholder = "Search audit lessons, frameworks, and policies...",
  className = "",
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
        🔍
      </span>
      <input
        type="search"
        placeholder={placeholder}
        className="w-full rounded-3xl border border-blue-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 outline-none ring-1 ring-indigo-100/30 transition focus:border-indigo-400 focus:ring-indigo-200"
      />
    </div>
  );
}
