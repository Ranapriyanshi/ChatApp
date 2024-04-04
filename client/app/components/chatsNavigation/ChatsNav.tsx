"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "./chatsNav.module.scss";
import ChatList from "./ChatList";
import { useRoomContext } from "@/app/context/RoomContext";
import socket from "@/socket";

const ChatsNav = () => {
  const [active, setActive] = useState(0);
  const [search, setSearch] = useState({});
  const { state, dispatch } = useRoomContext();

  const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Golu Singh" },
    { id: 3, name: "Titu Mama" },
    { id: 4, name: "Happy Oye" },
    { id: 5, name: "Sad Oyo" },
  ];

  function handleClick(i: number) {
    if (active != i) {
      setActive(i);
      socket.emit("join_room", `${i}`);
      dispatch({ type: "SET_CURRENT_ROOM", rooms: [], currentRoom: `${i}` });
      console.log(state.currentRoom)
    }
    else {
      setActive(0);
      socket.emit("join_room", '0');
      dispatch({ type: "SET_CURRENT_ROOM", rooms: [], currentRoom: '0' })
    }
  }

  useEffect(() => {
    console.log(search)
  }, [search])

  const cb = (func: Function) => {
    let timeout: NodeJS.Timeout;
    return (args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(args)
      }, 1000);
    }
  }
  const debounce = useCallback(cb(handleChange), []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nameToSearch = e.target.value.toLowerCase();
    if (nameToSearch != "") {
      const user = users.filter(u => u.name.toLowerCase().includes(nameToSearch));
      if (user) setSearch(user)
    }
  }
  

  return (
    <div className={styles.messageNavContainer}>
      <div className={styles.messageHeader}>
        <h3>Messages</h3>
        <button>+</button>
      </div>

      <div className={styles.chatWrapper}>
        <div className={styles.searchBox}>
          <input type="text" placeholder="Search chats" onChange={debounce} />
        </div>
        {users.map((e) => ChatList(e, handleClick, active))}
      </div>
    </div>
  );
};

export default ChatsNav;
