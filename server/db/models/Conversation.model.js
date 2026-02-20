import mongoose from "mongoose";


const conversationSchema = new mongoose.Schema({
  guestId: {
    type: String,
    required: true
  },
  assignedAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null
  },
  status: {
    type: String,
    enum: ["open", "closed", "pending"],
    default: "open"
  }
}, {
  timestamps: true
});

export default mongoose.model("Conversation", conversationSchema);
