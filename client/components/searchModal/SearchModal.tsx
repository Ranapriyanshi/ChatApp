import React, { useCallback, useEffect, useState } from "react";
import Input from "../Input/Input";
import image from "@/public/channels4_profile.jpg";
import styles from "./searchModal.module.scss";
import { debounceCallback } from "@/app/utils";

const SearchModal = () => {
  const [search, setSearch] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  const debounce = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      debounceCallback(handleChange, 1000)(e),
    []
  );

  useEffect(() => {
    async function fetchUsers() {
      const resp = await fetch(
        process.env.NEXT_PUBLIC_SERVER_URI + `/users/search?username=${search}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await resp.json();

      if (!data.msg) {
        console.log(data.users);
      } else {
        console.log(data.msg);
      }
    }

    if (search && search.length > 2) {
      fetchUsers();
    }
  }, [search]);

  return (
    <div className={styles.searchContainer}>
      <Input
        type="text"
        placeholder="Search Users"
        prefix={image}
        onChange={debounce}
      />
      <div></div>
    </div>
  );
};

export default SearchModal;
