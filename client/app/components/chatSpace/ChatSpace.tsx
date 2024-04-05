"use client";

import React, { createRef, use, useRef } from "react";
import styles from "./chatSpace.module.scss";
import { useEffect, useState } from "react";
import socket from "@/socket";
import useRoomStore from "@/app/stores/roomStore";
import useUserStore from "@/app/stores/userStore";
import Image from "next/image";
import image from "@/public/channels4_profile.jpg";

type MessageObj = {
  _id: string;
  content: string;
  sender: string;
  chat: string;
  createdAt: string;
};

const ChatSpace = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<MessageObj>>([]);
  const { currentRoom, rooms, users } = useRoomStore();
  const { user } = useUserStore();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    return () => {
      socket.on("disconnect", () => {
        console.log("disconnected", socket.id);
      });
    };
  }, []);

  useEffect(() => {
    async function fetchMessages() {
      const resp = await fetch(process.env.NEXT_PUBLIC_SERVER_URI + "/messages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          chatId: currentRoom ? currentRoom._id : "",
        },
      });

      const data = await resp.json();

      if (!data.msg) {
        setMessages(data.messages);
      } else {
        console.log(data.msg);
      }
    }

    if (currentRoom) {
      fetchMessages();
    }
  }, [currentRoom]);

  socket.on("recieve_message", (msg: MessageObj) => {
    setMessages([...messages, msg]);
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  async function postMessage(msg: string) {
    const resp = await fetch(
      process.env.NEXT_PUBLIC_SERVER_URI + "/chats/update",
      {
        method: "POST",
        body: JSON.stringify({
          messageContent: msg,
          roomId: currentRoom?._id,
          userId: user?._id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await resp.json();

    if (!data.msg) {
      setMessages([...messages, data.message]);
      setInput("");
    } else {
      console.log(data.msg);
    }
  }
  
  function handleClick() {
    if (input.length > 0) {
      socket.emit("send_message", { input, id: currentRoom?.room });
      postMessage(input);
    } else {
      console.error("message can't be empty");
    }
  }

  const display = function (e: MessageObj, i: number) {
    return (
      <div
        key={i}
        className={e.sender == user?._id ? styles.sent : styles.recieved}
      >
        {e.content}
      </div>
    );
  };

  const chatUser = users.find(
    (e) => e._id == currentRoom?.users?.filter((usr) => usr != user?._id)[0]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerContainer}>
        <h1>Chat Space</h1>
        <div className={styles.profileContainer}>
          <h4>Hi, {user ? user.username : "Login"}</h4>
          <Image src={image} alt=""></Image>
        </div>
      </div>
      {currentRoom ? (
        <div className={styles.container}>
          <div className={styles.chatInfo}>
            <h3>{chatUser?.f_name}</h3>
          </div>

          <hr className={styles.infoDivider} />

          <div className={styles.chatsContainer}>{messages && messages.map(display)}</div>

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
      ) : (
        <div>Lets start chatting</div>
      )}
    </div>
  );
};

export default ChatSpace;
