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
  const { user } = req.headers;

  if (user == "") {
    return res.status(400).json({ msg: "User required" });
  }

  const chats = await Chat.find({ users: user });

  return res.json({ chats });
}

async function updateChat(req, res) {
  const { roomId, messageContent, userId } = req.body;

  if (!roomId || !messageContent) {
    return res
      .status(400)
      .json({ msg: "Chat ID and message content required" });
  }

  const chat = await Chat.findOne({ users: userId, room: roomId });

  if (!chat) {
    return res.status(404).json({ msg: "Chat not found" });
  }

  const message = await Message.create({
    content: messageContent,
    sender: userId,
    chat: chat._id,
  });

  chat.updateOne({ $push: { messages: message._id } }).exec();

  return res.json({ message });
}

export { createChat, getChats, updateChat };
