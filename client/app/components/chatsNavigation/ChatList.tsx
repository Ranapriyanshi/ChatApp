import Image from "next/image";
import image from "@/public/channels4_profile.jpg";
import styles from "./chatsNav.module.scss";

type user = {
  id: number;
  name: string;
};

function ChatList(e: user, handleClick: Function, active: number) {
  return (
    <div key={e.id}>
      <div
        className={`${styles.chatPersonContainer} ${
          e.id == active ? styles.selectedChat : ""
        }`}
        onClick={() => handleClick(e.id)}
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

export default ChatList
