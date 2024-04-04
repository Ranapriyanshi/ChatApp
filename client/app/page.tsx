import ChatsNav from "@/app/components/chatsNavigation/ChatsNav";
import styles from "./page.module.scss";
import ChatSpace from "@/app/components/chatSpace/ChatSpace";
import { RoomContextProvider } from "./context/RoomContext";

export default function Home() {
  return (
    <main className={styles.main}>
      <RoomContextProvider>
        <ChatsNav />
        <hr />
        <ChatSpace />
      </RoomContextProvider>
    </main>
  );
}
