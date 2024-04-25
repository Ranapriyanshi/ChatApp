import { User } from "@/stores/userStore";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "./profile.module.scss";

interface Props {
  user: User;
  handleEdit: () => void;
}

const DetailsItems: React.FC<Props> = ({ user, handleEdit }) => {
  const router = useRouter();

  const details = [
    { label: "First Name", value: user.f_name },
    { label: "Last Name", value: user.l_name },
    { label: "Username", value: user.username },
    { label: "Email", value: user.email },
  ];

  return (
    <div className={styles.detailsContainer}>
      <Image src={user.pic} alt="profile picture" width={100} height={100} />
      {details.map((detail, index) => (
        <div key={index} className={styles.details}>
          <span>{detail.label}: </span>
          <h4>{detail.value}</h4>
        </div>
      ))}
      <div className={styles.btnContainer}>
        <button className={styles.btn} onClick={() => router.push("/")}>Back</button>
        <button className={styles.btn} onClick={handleEdit}>Edit</button>
      </div>
    </div>
  );
};

export default DetailsItems;
