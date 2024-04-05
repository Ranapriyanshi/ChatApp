import Message from "../models/messageModel.js";
import Chat from "../models/chatModel.js";

async function getMessages(req, res) {
  const { chatid } = req.headers;

  if (chatid == "") {
    return res.status(400).json({ msg: "Chat ID required" });
  }

  const chat = await Chat.findById(chatid);

  console.log(chat)

  if (!chat) {
    return res.status(404).json({ msg: "Chat not found" });
  }

  const messages = await Message.find({ chat: chatid });

  return res.json({ messages });
}

export { getMessages };
