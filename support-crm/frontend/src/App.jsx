import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import NewTicket from "./pages/NewTicket.jsx";
import TicketDetail from "./pages/TicketDetail.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-ink/10 bg-paper/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-signal-open" />
            <span className="font-semibold tracking-tight text-lg">Support Desk</span>
          </Link>
          <Link
            to="/new"
            className="text-sm font-medium px-4 py-2 rounded bg-ink text-paper hover:bg-ink/90 transition-colors"
          >
            New ticket
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewTicket />} />
          <Route path="/tickets/:ticketId" element={<TicketDetail />} />
        </Routes>
      </main>

      <footer className="border-t border-ink/10">
        <div className="max-w-5xl mx-auto px-6 py-4 text-xs text-ink/50 font-mono">
          Support Desk — internal ticketing
        </div>
      </footer>
    </div>
  );
}
