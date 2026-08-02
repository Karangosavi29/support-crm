import { useEffect, useState } from "react";
import { api } from "../api.js";
import TicketRow from "../components/TicketRow.jsx";
import SearchFilterBar from "../components/SearchFilterBar.jsx";

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      api
        .listTickets({ search, status })
        .then(setTickets)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [search, status]);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Tickets</h1>
        <span className="text-sm font-mono text-ink/50">
          {loading ? "…" : `${tickets.length} shown`}
        </span>
      </div>

      <SearchFilterBar
        search={search}
        onSearch={setSearch}
        status={status}
        onStatus={setStatus}
      />

      {error && (
        <p className="text-sm text-signal-open bg-signal-open/10 border border-signal-open/30 rounded-md px-4 py-3 mb-4">
          Couldn't load tickets: {error}
        </p>
      )}

      {!error && !loading && tickets.length === 0 && (
        <div className="text-center py-16 text-ink/50">
          <p className="font-medium">No tickets match here.</p>
          <p className="text-sm mt-1">Try a different search or clear the filter.</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {tickets.map((t) => (
          <TicketRow key={t.ticket_id} ticket={t} />
        ))}
      </div>
    </div>
  );
}
