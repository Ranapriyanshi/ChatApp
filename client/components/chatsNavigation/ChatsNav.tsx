"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "./chatsNav.module.scss";
import ChatList from "./ChatList";
import useRoomStore, { Room } from "@/stores/roomStore";
import useUserStore, { User } from "@/stores/userStore";
import useUsersStore from "@/stores/usersStore";
import { debounceCallback as cb, toaster } from "@/utils";
import SearchModal from "../searchModal/SearchModal";
import useMessageStore from "@/stores/messageStore";

const ChatsNav = () => {
  const [active, setActive] = useState<Room | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState<Array<User>>([]);
  const [token, setToken] = useState<string>("");
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const { rooms, setCurrentRoom, setRooms } = useRoomStore();
  const { unseenMessages, removeUnseenMessages } = useMessageStore();
  const { users, setUsers } = useUsersStore();
  const { user } = useUserStore();

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");

    async function fetchUsers(arr: Array<string>) {
      const resp = await fetch(process.env.NEXT_PUBLIC_SERVER_URI + "/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          users: arr.join(","),
        },
      });

      const data = await resp.json();

      if (!data.msg) {
        setUsers(data.users);
      } else {
        toaster("error", data.msg);
      }
    }
    async function fetchChats() {
      const resp = await fetch(process.env.NEXT_PUBLIC_SERVER_URI + "/chats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          user: user ? user._id : "",
        },
      });
      const data = await resp.json();

      if (resp.ok) {
        setRooms(data.chats);
        if (data.chats.length > 0) {
          let arr: string[] = [];
          data.chats.forEach((e: any) => {
            arr.push(e.users.filter((e: string) => e != user?._id));
          });
          fetchUsers(arr);
        } else {
          setUsers([]);
        }
      } else {
        toaster("error", data.msg);
      }
    }
    if (user && token) {
      fetchChats();
    }
  }, [user, setRooms, setUsers, token]);

  function handleClick(i: Room | null) {
    if (active != i) {
      setActive(i);
      removeUnseenMessages(i);
      setCurrentRoom(i);
    } else {
      setActive(null);
      setCurrentRoom(null);
    }
  }

  const debounce = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => cb(handleChange, 1000)(e),
    [users]
  );

  function handleModal() {
    setModalOpen(!modalOpen);
  }

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
      <div className={styles.messageHeader} onClick={handleModal}>
        <h3>Messages</h3>
        <button className={modalOpen ? styles.closeBtn : ''}>+</button>
      </div>
      <div className={`${styles.modalContainer} ${!modalOpen ? styles.close : styles.open}`}>
        <SearchModal />
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
        ) : search.length == 0 ? (
          users &&
          users.map((e, i) => (
            <ChatList
              key={i}
              e={e}
              rooms={rooms}
              active={active}
              unseenMessages={unseenMessages}
              handleClick={handleClick}
            />
          ))
        ) : searchedUsers.length == 0 && search.length > 0 ? (
          <h2>No Users Found</h2>
        ) : (
          searchedUsers &&
          searchedUsers.map((e, i) => (
            <ChatList
              key={i}
              e={e}
              rooms={rooms}
              unseenMessages={unseenMessages}
              active={active}
              handleClick={handleClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ChatsNav;
