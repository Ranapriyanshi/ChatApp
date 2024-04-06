import ChatsNav from "@/app/components/chatsNavigation/ChatsNav";
import styles from "./page.module.scss";
import ChatSpace from "@/app/components/chatSpace/ChatSpace";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  return (
    <>
      <ToastContainer />
      <main className={styles.main}>
        <ChatsNav />
        <hr />
        <ChatSpace />
      </main>
    </>
  );
}
