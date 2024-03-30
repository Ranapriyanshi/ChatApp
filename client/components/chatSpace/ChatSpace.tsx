"use client";

import React from "react";
import styles from "./chatSpace.module.scss";
import { useEffect, useState } from "react";
import socket from "@/socket";

type messageObj = {
  text: string;
  type: "recieved" | "sent";
};

const ChatSpace = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<messageObj>>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    return () => {
      socket.on("disconnect", () => {
        console.log("disconnected");
      });
    };
  }, []);

  socket.on("recieve_message", (msg) => {
    setMessages([...messages, { text: msg, type: "recieved" }]);
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function handleClick() {
    socket.emit("send_message", input);
    setMessages([...messages, { text: input, type: "sent" }]);
    setInput("");
  }
  return (
    <div className={styles.container}>
      <div className={styles.chatInfo}></div>

      <hr className={styles.infoDivider} />

      <div className={styles.chatsContainer}>
        {messages.map((e, i) => (
          <div key={i} className={styles[e.type]}>
            {e.text}
          </div>
        ))}
      </div>

      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type something here"
          onChange={handleChange}
          value={input}
        />
        <button onClick={handleClick}>Send</button>
      </div>
    </div>
  );
};

export default ChatSpace;
