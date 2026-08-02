import { Link } from "react-router-dom";
import StatusTag from "./StatusTag.jsx";

const EDGE_COLOR = {
  Open: "bg-signal-open",
  "In Progress": "bg-signal-progress",
  Closed: "bg-signal-closed",
};

export default function TicketRow({ ticket }) {
  return (
    <Link
      to={`/tickets/${ticket.ticket_id}`}
      className="group flex items-stretch bg-white/60 hover:bg-white border border-ink/10 rounded-md overflow-hidden transition-colors"
    >
      <div className={`w-2.5 shrink-0 stub-edge ${EDGE_COLOR[ticket.status] || "bg-ink/20"}`} />

      <div className="flex-1 min-w-0 grid grid-cols-[auto_1fr_auto_auto] sm:grid-cols-[100px_1fr_auto_auto] items-center gap-4 px-4 py-3">
        <span className="font-mono text-xs text-ink/60">{ticket.ticket_id}</span>

        <div className="min-w-0">
          <p className="font-medium truncate">{ticket.subject}</p>
          <p className="text-sm text-ink/60 truncate">{ticket.customer_name}</p>
        </div>

        <StatusTag status={ticket.status} />

        <span className="hidden sm:inline text-xs font-mono text-ink/40 whitespace-nowrap">
          {new Date(ticket.created_at).toLocaleDateString()}
        </span>
      </div>
    </Link>
  );
}
