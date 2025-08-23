import express from "express";
import { chatControllers } from "./chat.controllers.js";

export const chatRoutes = express.Router();

chatRoutes
  .post("/send-message", chatControllers.sendMessage)
  .get("/chat-list", chatControllers.getChatList)
  .get("/message-list", chatControllers.getMessageList);
