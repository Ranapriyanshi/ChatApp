"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "./chatsNav.module.scss";
import ChatList from "./ChatList";
import useRoomStore, { Room } from "@/app/stores/roomStore";
import socket from "@/socket";
import useUserStore, { User } from "@/app/stores/userStore";
import useUsersStore from "@/app/stores/usersStore";
import { debounceCallback as cb } from "@/app/utils";

const ChatsNav = () => {
  const [active, setActive] = useState<Room | null>(null);
  const [searchedUsers, setSearchedUsers] = useState<Array<User>>([]);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const { currentRoom, rooms, setCurrentRoom, setRooms } = useRoomStore();
  const { users, setUsers } = useUsersStore();
  const { user } = useUserStore();

  useEffect(() => {
    async function fetchUsers(arr: Array<string>) {
      const resp = await fetch(process.env.NEXT_PUBLIC_SERVER_URI + "/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          users: arr.join(","),
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
        let arr: string[] = [];
        data.chats.forEach((e: any) => {
          arr.push(e.users.filter((e: string) => e != user?._id));
        });
        setRooms(data.chats);
        fetchUsers(arr);
      } else {
        console.log(data.msg);
      }
    }
    if (user) {
      fetchChats();
    }
  }, [user, setRooms, setUsers]);

  function handleClick(i: Room | null) {
    console.log(i);
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

  const debounce = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => cb(handleChange, 1000)(e),
    [users]
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nameToSearch = e.target.value.toLowerCase();
    if (nameToSearch != "") {
      const usersFound = users.filter((u) =>
        u.username.toLowerCase().includes(nameToSearch)
      );
      setSearchedUsers(usersFound);
    }
    setSearch(nameToSearch);
    setSearching(false);
  }
  function searchingFn() {
    setSearching(true);
  }
  return (
    <div className={styles.messageNavContainer}>
      <div className={styles.messageHeader}>
        <h3>Messages</h3>
        <button>+</button>
      </div>

      <div className={styles.chatWrapper}>
        <div className={styles.searchBox}>
          {users ? (
            <input
              type="text"
              placeholder="Search chats"
              onChangeCapture={searchingFn}
              onChange={debounce}
            />
          ) : (
            <h2>You seem lonenly, find people to chat</h2>
          )}
        </div>
        {searching ? (
          <div>Searching...</div>
        ) : searchedUsers.length == 0 && search.length == 0 ? (
          users && users.map((e) => ChatList(e, handleClick, active, rooms))
        ) : searchedUsers.length == 0 && search.length > 0 ? (
          <h2>No Users Found</h2>
        ) : (
          searchedUsers &&
          searchedUsers.map((e) => ChatList(e, handleClick, active, rooms))
        )}
      </div>
    </div>
  );
};

export default ChatsNav;
