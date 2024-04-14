"use client";

import Image from "next/image";
import styles from "./chatsNav.module.scss";
import { User } from "@/stores/userStore";
import { Room } from "@/stores/roomStore";
import { useEffect, useState } from "react";
import socket from "@/socket";
import useMessageStore, {
  Message,
  UnseenMessages,
} from "@/stores/messageStore";

interface ChatListProps {
  e: User;
  handleClick: Function;
  active: Room | null;
  unseenMessages: Array<UnseenMessages>;
  rooms: Room[];
}

const ChatList: React.FC<ChatListProps> = ({
  e,
  handleClick,
  active,
  unseenMessages,
  rooms,
}) => {
  const [time, setTime] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [latestMsg, setLatestMsg] = useState<Message | null>();
  const { setUnseenMessages } = useMessageStore();

  const room = rooms.find((r) => r.users.includes(e._id)) || null;
  const unseen = unseenMessages.find((e) => e.room?._id == room?._id);

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");

    const id = room?.messages[room.messages.length - 1];
    if (id) {
      fetch(process.env.NEXT_PUBLIC_SERVER_URI + `/messages/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            setLatestMsg(data.message);
            const time = new Date(data.message.created_at);
            const today = new Date();
            if (today.getDate() == time.getDate()) {
              setTime(
                time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              );
            } else {
              setTime(time.toLocaleDateString());
            }
          } else {
            setLatestMsg(null);
            setTime("");
          }
        });
    }
  }, [room, token]);

  socket.on("recieve_message", (data) => {
    if (data.chat == room?._id) {
      setLatestMsg(data);
      const time = new Date(data.created_at);
      const today = new Date();
      if (today.getDate() == time.getDate()) {
        setTime(
          time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
      } else {
        setTime(time.toLocaleDateString());
      }
    }

    if (data.chat == room?._id && (!active || active._id != room?._id)) {
      setUnseenMessages(data, room);
    }
  });

  socket.on("my_message", (data) => {
    if (data.chat == room?._id) {
      setLatestMsg(data);
      const time = new Date(data.created_at);
      const today = new Date();
      if (today.getDate() == time.getDate()) {
        setTime(
          time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
      } else {
        setTime(time.toLocaleDateString());
      }
    }
  });

  return (
    <div key={e._id}>
      <div
        className={`${styles.chatPersonContainer} ${
          active?.users && active?.users.includes(e._id)
            ? styles.selectedChat
            : ""
        }`}
        onClick={() => handleClick(room)}
      >
        <div className={styles.chatPerson}>
          <div className={styles.nameAndAvatar}>
            <Image
              width={50}
              className={styles.avatar}
              height={50}
              src={e.pic}
              alt=""
            />
            <div className={styles.nameAndMessage}>
              <p className={styles.chatName}>{e.username}</p>
              <p className={styles.latestMessage}>{latestMsg?.content}</p>
            </div>
          </div>
          <div className={styles.timeAndNotify}>
            <span className={styles.chatTime}>{time}</span>
            {unseen && <div className={styles.notify}>{unseen.messages.length}</div>}
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default ChatList;
