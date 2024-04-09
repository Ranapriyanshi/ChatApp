'use client'

import Image from "next/image";
import image from "@/public/channels4_profile.jpg";
import styles from "./chatsNav.module.scss";
import { User } from "@/app/stores/userStore";
import { Room } from "@/app/stores/roomStore";

function ChatList(e: User, handleClick: Function, active: Room | null, rooms: Room[]) {
  const room = rooms.find((r) => r.users.includes(e._id));

  return (
    <div key={e._id}>
      <div
        className={`${styles.chatPersonContainer} ${
          active?.users && active?.users.includes(e._id) ? styles.selectedChat : ""
        }`}
        onClick={() => handleClick(room)}
      >
        <div className={styles.chatPerson}>
          <div className={styles.nameAndAvatar}>
            <Image
              width={50}
              className={styles.avatar}
              height={50}
              src={image}
              alt=""
            />
            <div className={styles.nameAndMessage}>
              <p className={styles.chatName}>{e.username}</p>
              <p className={styles.newMessage}>Hey there! I am using ChatApp</p>
            </div>
          </div>
          <span className={styles.chatTime}>11:58 pm</span>
        </div>
      </div>
      <hr />
    </div>
  );
}

export default ChatList;
