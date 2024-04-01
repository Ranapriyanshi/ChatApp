import styles from "./page.module.scss";
import ChatSpace from "@/components/chatSpace/ChatSpace";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* <input type="text" onChange={handleChange} value={input} />
      <button onClick={handleClick}>Send</button>
      <div>{message}</div> */}
      <ChatSpace />
    </main>
  );
}
