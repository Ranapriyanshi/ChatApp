"use client";

import Image from "next/image";
import image from "@/public/channels4_profile.jpg";
import styles from "./chatsNav.module.scss";
import { User } from "@/app/stores/userStore";
import { Room } from "@/app/stores/roomStore";
import { useEffect, useState } from "react";

interface ChatListProps {
  e: User;
  handleClick: Function;
  active: Room | null;
  rooms: Room[];
}

type Message = {
  content: string;
  sender: string;
  chat: string;
  created_at: string;
}

const ChatList: React.FC<ChatListProps> = ({
  e,
  handleClick,
  active,
  rooms,
}) => {
  const [latestMsg, setLatestMsg] = useState<Message>();
  const [time, setTime] = useState<string>("");
  const room = rooms.find((r) => r.users.includes(e._id));
  useEffect(() => {
    const id = room?.messages[room.messages.length - 1];

    if (id) {
      fetch(process.env.NEXT_PUBLIC_SERVER_URI + `/messages/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setLatestMsg(data.message);
          const time = new Date(data.message.created_at);
          const today = new Date();
          if (today.getDate() == time.getDate()) {
            setTime(time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
          } else {
            setTime(time.toLocaleDateString());
          }
        });
    }
  }, [room]);

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
              <p className={styles.newMessage}>{latestMsg?.content}</p>
            </div>
          </div>
          <span className={styles.chatTime}>{time}</span>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default ChatList;
