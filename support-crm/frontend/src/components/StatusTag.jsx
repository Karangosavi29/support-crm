const STYLES = {
  Open: "text-signal-open border-signal-open/40 bg-signal-open/10",
  "In Progress": "text-signal-progress border-signal-progress/40 bg-signal-progress/10",
  Closed: "text-signal-closed border-signal-closed/40 bg-signal-closed/10",
};

export default function StatusTag({ status }) {
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded border ${STYLES[status] || ""}`}
    >
      {status}
    </span>
  );
}
