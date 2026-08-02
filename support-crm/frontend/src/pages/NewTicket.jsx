import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

const FIELDS = [
  { name: "customer_name", label: "Customer name", type: "text" },
  { name: "customer_email", label: "Customer email", type: "email" },
  { name: "subject", label: "Subject", type: "text" },
];

export default function NewTicket() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { ticket_id } = await api.createTicket(form);
      navigate(`/tickets/${ticket_id}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">New ticket</h1>

      {error && (
        <p className="text-sm text-signal-open bg-signal-open/10 border border-signal-open/30 rounded-md px-4 py-3 mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {FIELDS.map((f) => (
          <label key={f.name} className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ink/70">{f.label}</span>
            <input
              type={f.type}
              required
              value={form[f.name]}
              onChange={(e) => update(f.name, e.target.value)}
              className="px-3.5 py-2.5 rounded-md border border-ink/15 bg-white/70 focus:bg-white outline-none focus:ring-2 focus:ring-ink/20 transition"
            />
          </label>
        ))}

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink/70">Description</span>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="px-3.5 py-2.5 rounded-md border border-ink/15 bg-white/70 focus:bg-white outline-none focus:ring-2 focus:ring-ink/20 transition resize-none"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 px-4 py-2.5 rounded-md bg-ink text-paper font-medium hover:bg-ink/90 disabled:opacity-50 transition-colors"
        >
          {submitting ? "Creating…" : "Create ticket"}
        </button>
      </form>
    </div>
  );
}
