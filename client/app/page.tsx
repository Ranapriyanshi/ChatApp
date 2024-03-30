'use client'

import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import socket from "@/socket";
import ChatSpace from "@/components/chatSpace/ChatSpace";

export default function Home() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected')
    })

    return () => {
      socket.on('disconnect', () => {
        console.log("disconnected")
      })
    }
  }, [])

  socket.on('recieve_message', (msg) => {
    setMessage(msg)
  })

  function handleChange (e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value)
  }

  function handleClick () {
    socket.emit('send_message', input)
    console.log('onClick')
    setInput("")
  }

  return (
    <main className={styles.main}>
      {/* <input type="text" onChange={handleChange} value={input} />
      <button onClick={handleClick}>Send</button>
      <div>{message}</div> */}
      <ChatSpace />
    </main>
  );
}
