const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  listTickets: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return fetch(`${BASE_URL}/api/tickets${qs ? `?${qs}` : ""}`).then(handle);
  },

  getTicket: (ticketId) =>
    fetch(`${BASE_URL}/api/tickets/${ticketId}`).then(handle),

  createTicket: (data) =>
    fetch(`${BASE_URL}/api/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handle),

  updateTicket: (ticketId, data) =>
    fetch(`${BASE_URL}/api/tickets/${ticketId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handle),

  suggestReply: (ticketId) =>
    fetch(`${BASE_URL}/api/tickets/${ticketId}/suggest-reply`, {
      method: "POST",
    }).then(handle),
};
