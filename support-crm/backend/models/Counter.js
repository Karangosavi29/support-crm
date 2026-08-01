import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

export async function nextTicketId() {
  const counter = await Counter.findByIdAndUpdate(
    "ticket",
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `TKT-${String(counter.seq).padStart(3, "0")}`;
}
