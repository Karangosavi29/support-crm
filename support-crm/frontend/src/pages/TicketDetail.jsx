import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api.js";
import StatusTag from "../components/StatusTag.jsx";

const STATUSES = ["Open", "In Progress", "Closed"];

export default function TicketDetail() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState(null);

  function load() {
    api.getTicket(ticketId).then(setTicket).catch((e) => setError(e.message));
  }

  useEffect(load, [ticketId]);

  async function changeStatus(status) {
    setSavingStatus(true);
    try {
      await api.updateTicket(ticketId, { status });
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSavingStatus(false);
    }
  }

  async function addNote(e) {
    e.preventDefault();
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      await api.updateTicket(ticketId, { notes: noteText });
      setNoteText("");
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSavingNote(false);
    }
  }

  async function suggestReply() {
    setSuggesting(true);
    setSuggestError(null);
    try {
      const { suggestion } = await api.suggestReply(ticketId);
      setNoteText(suggestion);
    } catch (e) {
      setSuggestError(e.message);
    } finally {
      setSuggesting(false);
    }
  }

  if (error) {
    return (
      <p className="text-sm text-signal-open bg-signal-open/10 border border-signal-open/30 rounded-md px-4 py-3">
        {error}
      </p>
    );
  }

  if (!ticket) return <p className="text-ink/50">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <Link to="/" className="text-sm text-ink/50 hover:text-ink mb-6 inline-block">
        ← All tickets
      </Link>

      <div className="flex items-start justify-between gap-4 mb-1">
        <h1 className="text-2xl font-semibold tracking-tight">{ticket.subject}</h1>
        <StatusTag status={ticket.status} />
      </div>
      <p className="font-mono text-sm text-ink/50 mb-6">{ticket.ticket_id}</p>

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <p className="text-ink/50">Customer</p>
          <p className="font-medium">{ticket.customer_name}</p>
        </div>
        <div>
          <p className="text-ink/50">Email</p>
          <p className="font-medium">{ticket.customer_email}</p>
        </div>
      </div>

      <div className="bg-white/60 border border-ink/10 rounded-md p-4 mb-6">
        <p className="text-sm text-ink/50 mb-1">Description</p>
        <p className="whitespace-pre-wrap">{ticket.description}</p>
      </div>

      <div className="mb-6">
        <p className="text-sm text-ink/50 mb-2">Update status</p>
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              disabled={savingStatus || s === ticket.status}
              onClick={() => changeStatus(s)}
              className={`px-3 py-1.5 text-sm rounded-md border transition-colors disabled:cursor-default ${
                s === ticket.status
                  ? "bg-ink text-paper border-ink"
                  : "border-ink/15 hover:border-ink/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-ink/50">
            Notes {ticket.notes?.length ? `(${ticket.notes.length})` : ""}
          </p>
          <button
            type="button"
            onClick={suggestReply}
            disabled={suggesting}
            className="text-xs font-medium px-2.5 py-1 rounded-md border border-ink/15 hover:border-ink/40 disabled:opacity-50 transition-colors flex items-center gap-1"
          >
            {suggesting ? "Drafting…" : "✨ Suggest reply"}
          </button>
        </div>

        {suggestError && (
          <p className="text-xs text-signal-open bg-signal-open/10 border border-signal-open/30 rounded-md px-3 py-2 mb-3">
            {suggestError}
          </p>
        )}

        <div className="flex flex-col gap-2 mb-3">
          {ticket.notes?.length ? (
            [...ticket.notes].reverse().map((n) => (
              <div key={n._id} className="bg-white/60 border border-ink/10 rounded-md px-3.5 py-2.5">
                <p className="text-sm whitespace-pre-wrap">{n.note_text}</p>
                <p className="text-xs font-mono text-ink/40 mt-1">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-ink/40">No notes yet.</p>
          )}
        </div>

        <form onSubmit={addNote} className="flex flex-col gap-2">
          <textarea
            rows={noteText.length > 80 ? 4 : 1}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add an internal note, or click Suggest reply for an AI draft…"
            className="px-3.5 py-2 rounded-md border border-ink/15 bg-white/70 focus:bg-white outline-none focus:ring-2 focus:ring-ink/20 transition resize-y"
          />
          <button
            type="submit"
            disabled={savingNote}
            className="self-end px-4 py-2 rounded-md bg-ink text-paper text-sm font-medium hover:bg-ink/90 disabled:opacity-50 transition-colors"
          >
            Add note
          </button>
        </form>
      </div>
    </div>
  );
}
