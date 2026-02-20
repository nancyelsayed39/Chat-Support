import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true
  },
  senderType: {
    type: String,
    enum: ["guest", "admin"],
    required: true
  },
  senderId: {
    type: String // guestId أو adminId
  },
  messageType: {
    type: String,
    enum: ["text", "image", "document"],
    default: "text"
  },
  content: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    default: null
  },
  fileSize: {
    type: Number,
    default: null
  },
  seen: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model("Message", messageSchema);
