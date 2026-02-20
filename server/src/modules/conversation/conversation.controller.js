import Conversation from "../../../db/models/Conversation.model.js";
import Message from "../../../db/models/message.model.js";
import { catchError } from "../../middleware/catchError.js";

export const getConversationMessages = catchError(
  async (req, res, next) => {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: messages
    });
  }
);

export const getConversationHistory = catchError(
  async (req, res, next) => {
    // Fetch ALL conversations, not just assigned ones
    // So admins can see all guest conversations
    const conversations = await Conversation.aggregate([
      {
        $sort: { updatedAt: -1 }
      },
      {
        $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "conversationId",
          as: "messages"
        }
      },
      {
        $addFields: {
          lastMessage: { $arrayElemAt: ["$messages", -1] }
        }
      },
      {
        $project: {
          messages: 0
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: conversations
    });
  }
);
