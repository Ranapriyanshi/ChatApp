"use client";

import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch } = useAuthContext();

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
          dispatch({ type: "LOGIN", payload: data.user})
          console.log(state);
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
