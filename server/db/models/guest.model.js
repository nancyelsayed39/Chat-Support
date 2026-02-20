import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
  guestId: {
    type: String,
    required: true,
    unique: true
  },
  socketId: String,
  isActive: {
    type: Boolean,
    default: true
  },
  lastSeen: Date
}, {
  timestamps: true
});

export default mongoose.model("Guest", guestSchema);
