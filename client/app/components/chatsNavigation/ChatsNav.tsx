"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "./chatsNav.module.scss";
import ChatList from "./ChatList";
import useRoomStore, { Room } from "@/app/stores/roomStore";
import socket from "@/socket";
import useUserStore from "@/app/stores/userStore";

const ChatsNav = () => {
  const [active, setActive] = useState<Room | null>(null);
  const [search, setSearch] = useState({});
  const { currentRoom, rooms, users, setCurrentRoom, setRooms, setUsers } =
    useRoomStore();
  const { user } = useUserStore();

  useEffect(() => {
    async function fetchUsers(users: Array<string>) {
      const resp = await fetch(process.env.NEXT_PUBLIC_SERVER_URI + "/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          users: users.join(","),
        },
      });

      const data = await resp.json();

      if (!data.msg) {
        setUsers(data.users);
      } else {
        console.log(data.msg);
      }
    }
    async function fetchChats() {
      const resp = await fetch(process.env.NEXT_PUBLIC_SERVER_URI + "/chats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          user: user ? user._id : "",
        },
      });
      const data = await resp.json();

      if (resp.ok) {
        let users: string[] = [];
        data.chats.forEach((e: any) => {
          users.push(e.users.filter((e: string) => e != user?._id));
        });

        setRooms(data.chats);
        fetchUsers(users);
      } else {
        console.log(data.msg);
      }
    }
    if (user) {
      fetchChats();
    }
  }, [user, setRooms, setUsers]);

  function handleClick(i: Room | null) {
    console.log(i)
    if (active != i) {
      setActive(i);
      socket.emit("join_room", i?.room);
      setCurrentRoom(i);
    } else {
      setActive(null);
      socket.emit("join_room", "0");
      setCurrentRoom(null);
    }
  }

  const cb = (func: Function) => {
    let timeout: NodeJS.Timeout;
    return (args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(args);
      }, 1000);
    };
  };
  const debounce = useCallback(cb(handleChange), []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nameToSearch = e.target.value.toLowerCase();
    if (nameToSearch != "") {
      const user = users.filter((u) =>
        u.username.toLowerCase().includes(nameToSearch)
      );
      if (user) setSearch(user);
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
        {users && users.map((e) => ChatList(e, handleClick, active, rooms))}
      </div>
    </div>
  );
};

export default ChatsNav;
