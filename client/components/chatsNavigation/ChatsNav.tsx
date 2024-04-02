import React from "react";
import styles from "./chatsNav.module.scss";
import Image from "next/image";
import image from "@/public/channels4_profile.jpg";

type user = {
  name: string;
  active: boolean;
};

const ChatsNav = () => {
  const users = [
    { name: "John Doe", active: true },
    { name: "John Doe", active: false },
    { name: "John Doe", active: false },
    { name: "John Doe", active: false },
    { name: "John Doe", active: false },
  ];

  function userMap(e: user, i: number) {
    return (
      <div key={i}>
        <div
          className={`${styles.chatPersonContainer} ${
            e.active ? styles.selectedChat : ""
          }`}
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
                <p className={styles.chatName}>{e.name}</p>
                <p className={styles.newMessage}>
                  Hey there! I am using ChatApp
                </p>
              </div>
            </div>
            <span className={styles.chatTime}>11:58 pm</span>
          </div>
        </div>
        <hr />
      </div>
    );
  }

  return (
    <div className={styles.messageNavContainer}>
      <div className={styles.messageHeader}>
        <h3>Messages</h3>
        <button>Add</button>
      </div>

      <div>
        <input type="text" />
      </div>

      <div className={styles.chatWrapper}>{users.map(userMap)}</div>
    </div>
  );
};

export default ChatsNav;
