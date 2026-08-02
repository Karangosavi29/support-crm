const STATUSES = ["All", "Open", "In Progress", "Closed"];

export default function SearchFilterBar({ search, onSearch, status, onStatus }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by name, email, ID, or keyword…"
        className="flex-1 px-4 py-2.5 rounded-md border border-ink/15 bg-white/70 focus:bg-white outline-none focus:ring-2 focus:ring-ink/20 transition"
      />
      <div className="flex gap-1 bg-white/60 border border-ink/15 rounded-md p-1">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => onStatus(s === "All" ? "" : s)}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              (status === "" && s === "All") || status === s
                ? "bg-ink text-paper"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
