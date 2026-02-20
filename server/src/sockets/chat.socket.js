
import Conversation from "../../db/models/Conversation.model.js";
import Message from "../../db/models/message.model.js";
import Admin from "../../db/models/admin.model.js";

export const initSocket = (io) => {
io.on("connection", (socket) => {

  // Guest joins
  socket.on("guest-join", ({ guestId }) => {
    socket.join(guestId);
    console.log(`Guest ${guestId} joined`);
  });

  // Admin joins
  socket.on("admin-join", async ({ adminId }) => {
    socket.join("admins");
    socket.adminId = adminId;

    await Admin.findByIdAndUpdate(adminId, {
      online: true,
      socketId: socket.id
    });
    console.log(`Admin ${adminId} joined`);
  });

  // Guest message (supports text, images, documents)
  socket.on("guest-message", async ({ guestId, content, messageType, fileName, fileSize }) => {
    try {
      const conversation = await Conversation.findOneAndUpdate(
        { guestId },
        { $setOnInsert: { guestId } },
        { upsert: true, new: true }
      );

      const message = await Message.create({
        conversationId: conversation._id,
        senderType: "guest",
        senderId: guestId,
        messageType: messageType || "text",
        content,
        fileName: fileName || null,
        fileSize: fileSize || null
      });

      if (conversation.assignedAdmin) {
        // Send to assigned admin
        io.to(conversation._id.toString()).emit("new-message", message);
        io.to(conversation.assignedAdmin.toString()).emit("new-message", message);
      } else {
        // Send to all admins
        io.to("admins").emit("new-message", {
          conversationId: conversation._id,
          message,
          guestId
        });
      }
    } catch (err) {
      console.error("Error handling guest message:", err);
    }
  });

  // Assign admin to conversation
  socket.on("assign-conversation", async ({ conversationId, adminId }) => {
    try {
      const convo = await Conversation.findOneAndUpdate(
        { _id: conversationId, assignedAdmin: null },
        { assignedAdmin: adminId },
        { new: true }
      );

      if (convo) {
        socket.join(conversationId.toString());
        io.to("admins").emit("conversation-assigned", convo);
        console.log(`Conversation ${conversationId} assigned to admin ${adminId}`);
      }
    } catch (err) {
      console.error("Error assigning conversation:", err);
    }
  });

  // Admin message reply
  socket.on("admin-message", async ({ conversationId, adminId, content, messageType = "text", fileName, fileSize }) => {
    try {
      const message = await Message.create({
        conversationId,
        senderType: "admin",
        senderId: adminId,
        content,
        messageType,
        fileName: fileName || null,
        fileSize: fileSize || null
      });

      const convo = await Conversation.findById(conversationId);

      if (convo) {
        // Send to guest
        io.to(convo.guestId).emit("admin-message", message);
        // Send to admin room
        io.to(conversationId.toString()).emit("admin-message", message);
      }
      console.log(`Admin message sent in conversation ${conversationId}`);
    } catch (err) {
      console.error("Error handling admin message:", err);
    }
  });

  // Close conversation
  socket.on("close-conversation", async ({ conversationId, adminId }) => {
    try {
      await Conversation.findByIdAndUpdate(conversationId, {
        closed: true,
        closedAt: new Date(),
        closedBy: adminId
      });
      io.to(conversationId.toString()).emit("conversation-closed");
      console.log(`Conversation ${conversationId} closed`);
    } catch (err) {
      console.error("Error closing conversation:", err);
    }
  });

  // Admin marks conversation as read
  socket.on("conversation-read", ({ conversationId, adminId }) => {
    console.log(`Admin ${adminId} marked conversation ${conversationId} as read`);
    // Broadcast to all admins (except the one who triggered it) that this conversation is now read
    socket.broadcast.to("admins").emit("conversation-read", {
      conversationId,
      adminId
    });
  });

  socket.on("disconnect", async () => {
    try {
      await Admin.findOneAndUpdate(
        { socketId: socket.id },
        { online: false }
      );
      console.log("Admin disconnected");
    } catch (err) {
      console.error("Error on disconnect:", err);
    }
  });
});
}
