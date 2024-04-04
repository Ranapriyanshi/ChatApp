import mongoose from "mongoose";
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

async function createChat(req, res) {
  const { users } = req.body;

  // Users validation
  if (users.length < 2) {
    return res.status(400).json({ msg: "At least 2 users are required" });
  }

  const existingChat = await Chat.findOne({ users });

  if (existingChat) {
    return res.status(200).json({ chat: existingChat });
  }

  const room = users.join("");

  const chat = await Chat.create({
    users,
    room,
  });

  return res.status(201).json({ chat });
}

async function getChats(req, res) {
  const { user } = req.body;

  if (!user) {
    return res.status(400).json({ msg: "User required" });
  }

  const chats = await Chat.find({ users: user });

  return res.json({ chats });
}

async function updateChat(req, res) {
  const { chatId, messageContent, userId } = req.body;

  if (!chatId || !messageContent) {
    return res
      .status(400)
      .json({ msg: "Chat ID and message content required" });
  }

  const message = await Message.create({
    content: messageContent,
    sender: userId,
    chat: chatId,
  });

  const chat = await Chat.findById(chatId).and({ users: userId });

  if (!chat) {
    return res.status(404).json({ msg: "Chat not found" });
  }

  chat.updateOne({ $push: { messages: message._id } });

  res.json({ chat });
}

export { createChat, getChats, updateChat };
