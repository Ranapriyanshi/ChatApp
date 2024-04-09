"use client";

import ChatsNav from "@/components/chatsNavigation/ChatsNav";
import styles from "./page.module.scss";
import ChatSpace from "@/components/chatSpace/ChatSpace";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!user || !token) {
      window.location.href = "/auth";
    }

    async function tokenLogin(token: string) {
      const resp = await fetch(
        process.env.NEXT_PUBLIC_SERVER_URI + "/users/tokenLogin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + token,
          },
        }
      );
      const data = await resp.json();
      if (data.msg) {
        router.push("/auth");
      } else {
        router.push("/");
      }
    }

    token && tokenLogin(token);
  }, [router]);

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
