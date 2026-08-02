import { Router } from "express";
import Ticket from "../models/Ticket.js";
import { nextTicketId } from "../models/Counter.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { customer_name, customer_email, subject, description } = req.body;

    if (!customer_name || !customer_email || !subject || !description) {
      return res.status(400).json({
        error:
          "customer_name, customer_email, subject and description are all required",
      });
    }

    const ticket_id = await nextTicketId();
    const ticket = await Ticket.create({
      ticket_id,
      customer_name,
      customer_email,
      subject,
      description,
    });

    res.status(201).json({
      ticket_id: ticket.ticket_id,
      created_at: ticket.created_at,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && ["Open", "In Progress", "Closed"].includes(status)) {
      query.status = status;
    }

    if (search && search.trim()) {
      const re = new RegExp(search.trim(), "i");
      query.$or = [
        { customer_name: re },
        { customer_email: re },
        { ticket_id: re },
        { subject: re },
        { description: re },
      ];
    }

    const tickets = await Ticket.find(query)
      .sort({ created_at: -1 })
      .select("ticket_id customer_name subject status created_at");

    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

router.get("/:ticket_id", async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticket_id: req.params.ticket_id });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
});

router.put("/:ticket_id", async (req, res) => {
  try {
    const { status, notes } = req.body;
    const ticket = await Ticket.findOne({ ticket_id: req.params.ticket_id });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    if (status) {
      if (!["Open", "In Progress", "Closed"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
      ticket.status = status;
    }

    if (notes && notes.trim()) {
      ticket.notes.push({ note_text: notes.trim() });
    }

    await ticket.save();

    res.json({ success: true, updated_at: ticket.updated_at });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update ticket" });
  }
});

router.post("/:ticket_id/suggest-reply", async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        error: "AI reply suggestions aren't configured (missing GROQ_API_KEY)",
      });
    }

    const ticket = await Ticket.findOne({ ticket_id: req.params.ticket_id });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    const notesContext = ticket.notes.length
      ? `\n\nInternal notes so far:\n${ticket.notes.map((n) => `- ${n.note_text}`).join("\n")}`
      : "";

    const prompt = `You are a helpful customer support agent. Draft a short, empathetic reply to this customer.

Customer: ${ticket.customer_name}
Subject: ${ticket.subject}
Description: ${ticket.description}${notesContext}

Write only the reply text (no subject line, no signature placeholder). Keep it concise, friendly and specific to their issue.`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 300,
          messages: [{ role: "user", content: prompt }],
        }),
      },
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Groq API error:", errBody);
      return res.status(502).json({ error: "AI reply generation failed" });
    }

    const data = await response.json();
    const suggestion = data.choices?.[0]?.message?.content?.trim();

    if (!suggestion) {
      return res.status(502).json({ error: "AI returned an empty suggestion" });
    }

    res.json({ suggestion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate reply suggestion" });
  }
});

export default router;
