"use client";

import useUserStore from "@/stores/userStore";
import Image from "next/image";
import styles from "./profile.module.scss";
import React, { useEffect, useState } from "react";
import EditItems from "./editItems";
import DetailsItems from "./detailsItems";

const ProfilePage = () => {
  const [token, setToken] = useState<string>("");
  const [edit, setEdit] = useState<boolean>(false);
  const { user, setUser } = useUserStore();

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
  }, [token]);

  function handleEdit() {
    setEdit(!edit);
  }

  return (
    <div>
      {edit
        ? user && <EditItems user={user} setUser={setUser} token={token} handleEdit={handleEdit} />
        : user && <DetailsItems user={user} handleEdit={handleEdit} />}
    </div>
  );
};

export default ProfilePage;
