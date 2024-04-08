"use client";

import ChatsNav from "@/components/chatsNavigation/ChatsNav";
import styles from "./page.module.scss";
import ChatSpace from "@/components/chatSpace/ChatSpace";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!user || !token) {
      window.location.href = "/auth";
    }

    async function tokenLogin() {
      const resp = await fetch(
        process.env.NEXT_PUBLIC_SERVER_URI + "/users/tokenLogin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + token,
          },
          body: JSON.stringify({ token }),
        }
      );

      const data = await resp.json();
      if (data.msg) {
        window.location.href = "/auth";
      } else {
        window.location.href = "/";
      }
    }

    if (!user && !token) {
      tokenLogin();
    }
  }, []);

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
