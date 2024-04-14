import React, { useCallback, useEffect, useState } from "react";
import Input from "../Input/Input";
import image from "@/public/channels4_profile.jpg";
import styles from "./searchModal.module.scss";
import { debounceCallback, toaster } from "@/utils";
import useUserStore, { User } from "@/stores/userStore";
import ChatList from "../chatsNavigation/ChatList";
import UserList from "./UserList";

const SearchModal = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<Array<User>>([]);
  const [token, setToken] = useState<string>("");
  const { user } = useUserStore();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  const debounce = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      debounceCallback(handleChange, 1000)(e),
    []
  );

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");

    async function fetchUsers() {
      const resp = await fetch(
        process.env.NEXT_PUBLIC_SERVER_URI + `/users/search?username=${search}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
            user: user ? user._id : "",
          },
        }
      );

      const data = await resp.json();

      if (!data.msg) {
        setUsers(data.users);
      } else {
        toaster("error", data.msg);
      }
    }

    if (search.length > 0) {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [search, user, token]);

  return (
    <div className={styles.searchContainer}>
      <Input
        type="text"
        placeholder="Search for users..."
        prefixImg={image}
        onChange={debounce}
        divClass={styles.searchInput}
      />
      <div className={styles.usersContainer}>
        {search.length > 0 && users.length == 0 ? (
          <h3>No Users Found</h3>
        ) : (
          users.map((e, i) => <UserList key={i} user={e} token={token} />)
        )}
      </div>
    </div>
  );
};

export default SearchModal;
