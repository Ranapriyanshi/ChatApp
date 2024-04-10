import Message from "../models/messageModel.js";
import Chat from "../models/chatModel.js";

async function getMessages(req, res) {
  const { chatid } = req.headers;

  if (chatid == "") {
    return res.status(400).json({ msg: "Chat ID required" });
  }

  const chat = await Chat.findById(chatid);

  if (!chat) {
    return res.status(404).json({ msg: "Chat not found" });
  }

  const messages = await Message.find({ chat: chatid });

  return res.status(200).json({ messages });
}

async function getMessage(req, res) {
  const { id } = req.params;

  if (id == "") {
    return res.status(400).json({ msg: "Message ID required" });
  }

  const message = await Message.findById(id);

  if (!message) {
    return res.status(404).json({ msg: "Message not found" });
  }

  return res.status(200).json({ message });
}

export { getMessages, getMessage };
