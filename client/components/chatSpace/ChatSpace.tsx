"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./chatSpace.module.scss";
import socket from "@/socket";
import useRoomStore from "@/stores/roomStore";
import useUserStore, { User } from "@/stores/userStore";
import Image from "next/image";
import logoutImg from "@/public/Logout.png";
import { toaster } from "@/utils";
import useUsersStore from "@/stores/usersStore";
import { Message } from "@/stores/messageStore";

type MessageTimings = {
  time: string;
  messages: Array<Message>;
};

const ChatSpace = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [token, setToken] = useState<string>("");
  const [chatUser, setChatUser] = useState<User>();
  const [messageTiminigs, setMessageTimings] = useState<Array<MessageTimings>>(
    []
  );

  const { currentRoom, rooms } = useRoomStore();
  const { users } = useUsersStore();
  const { user } = useUserStore();

  const chatRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");

    async function fetchHome() {
      const resp = await fetch(process.env.NEXT_PUBLIC_SOCKET_URI + "", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      if (!resp.ok) {
        router.push("/auth");
      }
    }

    if (token) {
      fetchHome();
    }

    socket.on("connect", () => {
      toaster("success", "Ready to Chat");
    });
    socket.emit("join_room", user?._id);

    return () => {
      socket.on("disconnect", () => {
        toaster("error", "Disconnected! can not send messages");
      });
    };
  }, [user, router, token]);

  useEffect(() => {
    async function fetchMessages() {
      const resp = await fetch(
        process.env.NEXT_PUBLIC_SERVER_URI + "/messages",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
            chatId: currentRoom ? currentRoom._id : "",
          },
        }
      );

      const data = await resp.json();

      if (resp.ok) {
        setMessages(data.messages);
      } else {
        toaster("error", data.msg);
      }
    }

    if (currentRoom && token) {
      fetchMessages();
    }
  }, [currentRoom, token]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  });

  useEffect(() => {
    const updatedTimings = [...messageTiminigs];
    messages.forEach((msg) => {
      const msgTime = new Date(msg.created_at);

      const idx = updatedTimings.findIndex(
        (e) =>
          e.time ==
          msgTime
            .toLocaleDateString("en-IN", {
              day: "numeric",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, "-")
      );

      if (idx != -1) {
        updatedTimings[idx].messages.push(msg);
      } else {
        updatedTimings.push({
          time: msgTime
            .toLocaleDateString("en-IN", {
              day: "numeric",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, "-"),
          messages: [msg],
        });
      }
    });

    setMessageTimings(updatedTimings);
  }, [messages]);

  socket.on("recieve_message", (data: Message) => {
    if (data.chat == currentRoom?._id) setMessages([...messages, data]);
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
          content: msg,
          roomid: currentRoom?.room,
          userid: user?._id,
        }),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await resp.json();

    if (resp.ok) {
      setMessages([...messages, data.message]);
      socket.emit("send_message", {
        input: data.message,
        id: chatUser?._id,
      });
      setInput("");
    } else {
      toaster("error", data.msg);
    }
  }

  useEffect(() => {
    if (user && currentRoom && users) {
      const userId = currentRoom.users.find((e) => e != user._id);
      setChatUser(users.find((usr) => usr._id == userId));
    }
  }, [currentRoom, users, user]);

  function handleClick() {
    if (input.length > 0) {
      postMessage(input);
    } else {
      toaster("error", "Message can't be empty");
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleClick();
    }
  }

  function handleErrorClick() {
    toaster("error", "Please select a room");
  }

  function handleLogout() {
    localStorage.clear();
    router.push("/auth");
  }

  function profileClick() {
    router.push("/profile");
  }

  return (
    <div className={styles.wrapper}>
      {user && (
        <div className={styles.headerContainer}>
          <h1>Hi, {user.f_name}</h1>
          <div className={styles.profileContainer}>
            <Image
              className={styles.avatar}
              src={user.pic}
              alt=""
              width={50}
              height={50}
              onClick={profileClick}
            />
            <button className={styles.logout} onClick={handleLogout}>
              Logout
              <Image src={logoutImg} alt="" width={25} height={25} />
            </button>
          </div>
        </div>
      )}
      {currentRoom ? (
        <div className={styles.container}>
          {chatUser && (
            <div className={styles.chatInfo}>
              <Image src={chatUser.pic} alt="" width={50} height={50} />
              <h3 style={{ color: "black" }}>{chatUser.f_name}</h3>
            </div>
          )}

          <hr className={styles.infoDivider} />

          <div className={styles.chatsContainer} ref={chatRef}>
            {messageTiminigs &&
              messageTiminigs.map((e, i) => (
                <div key={i} className={styles.chatTimings}>
                  <h4>{e.time}</h4>
                  {e.messages.map((e, i) => {
                    const time = new Date(e.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <div
                        key={i}
                        className={
                          e.sender == user?._id ? styles.sentContainer : ""
                        }
                      >
                        <span>{time}</span>
                        <div
                          className={
                            e.sender == user?._id
                              ? styles.sent
                              : styles.recieved
                          }
                        >
                          {e.content}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
          </div>

          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Type something here"
              onChange={handleChange}
              value={input}
              onKeyDown={handleKeyPress}
            />
            <button onClick={currentRoom ? handleClick : handleErrorClick}>
              Send
            </button>
          </div>
        </div>
      ) : (
        <h1 className={styles.noChatMsg}>Lets start chatting</h1>
      )}
    </div>
  );
};

export default ChatSpace;
