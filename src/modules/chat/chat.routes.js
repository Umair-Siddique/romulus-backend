import express from "express";
import { chatControllers } from "./chat.controllers.js";

export const chatRoutes = express.Router();

chatRoutes
  .post("/send-message", chatControllers.sendMessage)
  .get("/chats-list", chatControllers.getChats)
  .get("/get-conversation", chatControllers.getConversation);
