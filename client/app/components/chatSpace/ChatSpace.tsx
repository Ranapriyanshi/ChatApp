"use client";

import React, { createRef, useRef } from "react";
import styles from "./chatSpace.module.scss";
import { useEffect, useState } from "react";
import socket from "@/socket";
import { useRoomContext } from "@/app/context/RoomContext";

type messageObj = {
  text: string;
  type: "recieved" | "sent";
};

const ChatSpace = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<messageObj>>([]);
  const { state } = useRoomContext();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    return () => {
      socket.on('disconnect', () => {
        console.log("disconnected", socket.id)
      })
    };
  }, []);
  
  socket.on("recieve_message", (msg: string) => {
    setMessages([...messages, { text: msg, type: "recieved" }]);
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function handleClick() {
    console.log(state.currentRoom)
    if (input.length > 0) {
      socket.emit("send_message", {input, id: state.currentRoom});
      setMessages([...messages, { text: input, type: "sent" }]);
      setInput("");
    } else {
      console.error("message can't be empty")
    }
  }

  const display = function (e: messageObj, i: number) {
    return (
      <div key={i} className={styles[e.type]}>
        {e.text}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.chatInfo}></div>

      <hr className={styles.infoDivider} />

      <div className={styles.chatsContainer}>
        {messages.map(display)}
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
