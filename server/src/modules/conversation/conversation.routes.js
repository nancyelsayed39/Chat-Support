import express from "express";
import { getConversationMessages, getConversationHistory } from "./conversation.controller.js";

const router = express.Router();

router.get("/messages/:conversationId", getConversationMessages);
router.post("/history", getConversationHistory);

export default router;
