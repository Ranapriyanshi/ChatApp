"use client";

import React, { useState } from "react";
import useUserStore from "../stores/userStore";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUserStore();

  function handleUsername(e: React.ChangeEvent<HTMLInputElement>) {
    setUsernameOrEmail(e.target.value);
  }

  function handlePassword(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  async function handleSubmit() {
    fetch(process.env.NEXT_PUBLIC_SERVER_URI + "/users/login", {
      method: "POST",
      body: JSON.stringify({ usernameOrEmail, password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (!data.msg) {
          setUser(data.user);
        } else {
          console.log("Failed to log in.");
        }
      })
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Username or Email"
        onChange={handleUsername}
        value={usernameOrEmail}
      />
      <input
        type="text"
        placeholder="Password"
        onChange={handlePassword}
        value={password}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Login;
