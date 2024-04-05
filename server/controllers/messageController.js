import Message from "../models/messageModel.js";
import Chat from "../models/chatModel.js";

async function getMessages(req, res) {
  const { chatId } = req.body;

  if (!chatId) {
    return res.status(400).json({ msg: "Chat ID required" });
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).json({ msg: "Chat not found" });
  }

  const messages = await Message.find({ chat: chatId });

  return res.json({ messages });
}


export { getMessages };
