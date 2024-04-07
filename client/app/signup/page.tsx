"use client";

import React, { useState } from "react";
import { Bounce, toast } from "react-toastify";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //   const notify = (msg: string) => toast(msg);

  async function handleSubmit() {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const resp = await fetch(
      process.env.NEXT_PUBLIC_SERVER_URI + "/users/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          f_name: firstName,
          l_name: lastName,
          username,
          email,
          password,
        }),
      }
    );

    const data = await resp.json();

    if (data.msg) {
      toast.error(data.msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else {
      toast.success("Account created successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, type: string) {
    if (type === "firstName") setFirstName(e.target.value);
    if (type === "lastName") setLastName(e.target.value);
    if (type === "username") setUsername(e.target.value);
    if (type === "email") setEmail(e.target.value);
    if (type === "password") setPassword(e.target.value);
    if (type === "confirmPassword") setConfirmPassword(e.target.value);
  }

  return (
    <div>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => handleChange(e, "firstName")}
      />
      <input
        type="text"
        placeholder="Last Name (Optional)"
        value={lastName}
        onChange={(e) => handleChange(e, "lastName")}
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => handleChange(e, "username")}
      />
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => handleChange(e, "email")}
      />
      <input
        type="text"
        placeholder="Password"
        value={password}
        onChange={(e) => handleChange(e, "password")}
      />
      <input
        type="text"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => handleChange(e, "confirmPassword")}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Signup;
