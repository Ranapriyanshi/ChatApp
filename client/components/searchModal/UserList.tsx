import useUserStore, { User } from "@/app/stores/userStore";
import React from "react";
import Image from "next/image";
import image from "@/public/channels4_profile.jpg";
import styles from "./searchModal.module.scss";
import useRoomStore from "@/app/stores/roomStore";
import { toaster } from "@/app/utils";
import useUsersStore from "@/app/stores/usersStore";

interface UserListProps {
  user: User;
}

const UserList: React.FC<UserListProps> = ({ user }) => {
  const { user: currUser } = useUserStore();
  const { setRooms, rooms } = useRoomStore();
  const { setUsers, users } = useUsersStore();

  async function handleClick() {
    const resp = await fetch(
      process.env.NEXT_PUBLIC_SERVER_URI + "/chats/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          users: [user._id, currUser?._id],
        }),
      }
    );

    const data = await resp.json();

    if (data.msg) {
      toaster("error", data.msg);
    } else {
      setRooms([...rooms, data.chat]);
      setUsers([...users, user]);
    }
  }

  return (
    <div className={styles.user}>
      <div className={styles.details}>
        <Image src={image} alt="" height={30} width={30} />
        <p>{user.username}</p>
        <button onClick={handleClick}>+</button>
      </div>
    </div>
  );
};

export default UserList;
