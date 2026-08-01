import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    note_text: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

const ticketSchema = new mongoose.Schema(
  {
    ticket_id: { type: String, required: true, unique: true, index: true },
    customer_name: { type: String, required: true, trim: true },
    customer_email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },
    notes: [noteSchema],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

ticketSchema.index({
  customer_name: "text",
  customer_email: "text",
  subject: "text",
  description: "text",
});

export default mongoose.model("Ticket", ticketSchema);
