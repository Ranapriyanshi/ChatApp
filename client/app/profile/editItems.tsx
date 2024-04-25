import React, { useState } from "react";
import Input from "@/components/Input/Input";
import usernameImg from "@/public/Account.png";
import styles from "./profile.module.scss";
import emailImg from "@/public/Email.png";
import passwordImg from "@/public/Password.png";
import { User } from "@/stores/userStore";
import Image from "next/image";
import { toaster } from "@/utils";
import { ToastContainer } from "react-toastify";

interface Props {
  user: User;
  token: string;
  setUser: (user: User) => void;
  handleEdit: () => void;
}

const EditItems: React.FC<Props> = ({ user, token, setUser, handleEdit }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [picFile, setPicFile] = useState<File>();
  const [pic, setPic] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    switch (field) {
      case "username":
        setUsername(e.target.value);
        break;
      case "email":
        setEmail(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      case "firstName":
        setFirstName(e.target.value);
        break;
      case "lastName":
        setLastName(e.target.value);
        break;
      case "profilePic":
        e.target.files && setPicFile(e.target.files[0]);
        break;
    }
  };

  const inputs = [
    {
      placeholder: "First Name",
      img: usernameImg,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        handleChange(e, "firstName"),
    },
    {
      placeholder: "Last Name",
      img: usernameImg,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        handleChange(e, "lastName"),
    },
    {
      placeholder: "Username",
      img: usernameImg,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        handleChange(e, "username"),
    },
    {
      placeholder: "Email",
      img: emailImg,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        handleChange(e, "email"),
    },
    {
      placeholder: "Password",
      img: passwordImg,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        handleChange(e, "password"),
    },
  ];

  const handleSubmit = () => {
    function uploadImage() {
      if (picFile) {
        const imageData = new FormData();
        imageData.append("file", picFile as Blob);
        imageData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_UPLOAD_PRESET as string
        );
        imageData.append(
          "cloud_name",
          process.env.NEXT_PUBLIC_CLOUD_NAME as string
        );

        fetch(process.env.NEXT_PUBLIC_IMAGE_URI as string, {
          method: "POST",
          body: imageData,
        })
          .then((res) => res.json())
          .then((res) => {
            setPic(res.url);
          });
      }
    }

    const userData = {
      username,
      email,
      password,
      f_name: firstName,
      l_name: lastName,
      pic: pic,
    };

    if (!username && !email && !firstName && !lastName) {
      return toaster("error", "Please fill in the field to update or click Cancel to exit");
    }

    async function updateUser() {
      const resp = await fetch(
        process.env.NEXT_PUBLIC_SERVER_URI + `/users/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await resp.json();

      if (!data.msg) {
        setUser(data.user);
        handleEdit();
      } else {
        toaster("error", data.msg);
      }
    }

    if (!password) {
      return toaster("error", "Password is required");
    }
    uploadImage();
    updateUser();
  };

  return (
    <div className={styles.editableContainer}>
      <ToastContainer />
      <div className={styles.imageContainer}>
        <Image src={user.pic} alt="profile pic" width={100} height={100} />
        <input
          type="file"
          placeholder="Profile Picture"
          onChange={(e) => handleChange(e, "profilePic")}
        />
      </div>
      {inputs.map((input, i) => (
        <div className={styles.inputContainer} key={i}>
          <span>{input.placeholder}: </span>
          <Input
            prefixImg={input.img}
            placeholder={
              input.placeholder == "Password"
                ? input.placeholder + " (required for confirmation`)"
                : input.placeholder
            }
            onChange={input.onChange}
          />
        </div>
      ))}
      <div className={styles.btnContainer}>
        <button className={styles.btn} onClick={handleEdit}>
          Cancel
        </button>
        <button className={styles.btn} onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditItems;
