"use client";

import React, { useState } from "react";
import useUserStore from "@/app/stores/userStore";
import styles from "./login.module.scss";
import { toaster } from "../utils";
import { toast } from "react-toastify";
import Input from "@/components/Input/Input";
import image from "@/public/channels4_profile.jpg";
import usernameImage from "@/public/Account.png";
import passwordImage from "@/public/Password.png";
import emailImage from "@/public/Email.png";
import eyeImage from "@/public/Eye.png";
import closedEyeImage from "@/public/Closed Eye.png";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [eye, setEye] = useState<Record<string, boolean>>({
    pass1: true,
    pass2: true,
    pass3: true,
  });
  const { setUser } = useUserStore();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, type: string) {
    if (type === "firstName") setFirstName(e.target.value);
    if (type === "lastName") setLastName(e.target.value);
    if (type === "username") setUsername(e.target.value);
    if (type === "email") setEmail(e.target.value);
    if (type === "password") setPassword(e.target.value);
    if (type === "confirmPassword") setConfirmPassword(e.target.value);
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (isLogin) handleLoginSubmit();
      else handleSignupSubmit();
    }
  }

  async function handleSignupSubmit() {
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
      toaster("error", data.msg);
    } else {
      toaster("success", "Account created successfully!");
      setUser(data.user);
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    }
  }

  function handleUsername(e: React.ChangeEvent<HTMLInputElement>) {
    setUsernameOrEmail(e.target.value);
  }

  function handlePassword(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  function handleEyeClick(el: string) {
    setEye((prev) => ({ ...prev, [el]: !prev[el] }));
  }

  async function handleLoginSubmit() {
    const resp = await fetch(
      process.env.NEXT_PUBLIC_SERVER_URI + "/users/login",
      {
        method: "POST",
        body: JSON.stringify({ usernameOrEmail, password }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await resp.json();

    if (data.msg) {
      toaster("error", data.msg);
    } else {
      setUser(data.user);
      localStorage.setItem("token", data.token);
      toaster("success", "Logged in successfully!");
      window.location.href = "/";
    }
  }

  function handleIsLogin() {
    setIsLogin(!isLogin);
    if (!isLogin) {
      setUsernameOrEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setUsername("");
      setEmail("");
      setConfirmPassword("");
    } else {
      setUsernameOrEmail("");
      setPassword("");
    }
  }

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.formsContainer}>
        <div className={isLogin ? styles.loginContainer : styles.disabled}>
          <div className={styles.textContainer}>
            <h1>Welcome Back!</h1>
            <h3>Please enter your credentials to login</h3>
          </div>
          <div className={styles.form} onKeyDown={handleKeyPress}>
            <Input
              type="text"
              placeholder="Username or Email"
              onChange={handleUsername}
              value={usernameOrEmail}
              prefix={usernameImage}
            />
            <Input
              type={eye["pass1"] ? "password" : "text"}
              placeholder="Password"
              onChange={handlePassword}
              value={password}
              prefix={passwordImage}
              suffix={eye["pass1"] ? eyeImage : closedEyeImage}
              onEyeClick={() => handleEyeClick("pass1")}
            />
            <button onClick={handleLoginSubmit}>Submit</button>
            <div className={styles.switch}>
              <h4>
                Don&apos;t have an account?{" "}
                <span onClick={handleIsLogin}>Sign Up</span>
              </h4>
            </div>
          </div>
        </div>

        <div className={isLogin ? styles.disabled : styles.signupContainer}>
          <div className={styles.textContainer}>
            <h1>Welcome To ChatApp!</h1>
            <h3>Fill in the details to create an account</h3>
          </div>
          <div className={styles.form} onKeyDown={handleKeyPress}>
            <div className={styles.split}>
              <Input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => handleChange(e, "firstName")}
                prefix={usernameImage}
              />
              <Input
                type="text"
                placeholder="Last Name (Optional)"
                value={lastName}
                onChange={(e) => handleChange(e, "lastName")}
                prefix={usernameImage}
              />
            </div>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => handleChange(e, "username")}
              prefix={usernameImage}
            />
            <Input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => handleChange(e, "email")}
              prefix={emailImage}
            />
            <div className={styles.split}>
              <Input
                type={eye["pass2"] ? "password" : "text"}
                placeholder="Password"
                value={password}
                onChange={(e) => handleChange(e, "password")}
                prefix={passwordImage}
                suffix={eye["pass2"] ? eyeImage : closedEyeImage}
                onEyeClick={() => handleEyeClick("pass2")}
              />
              <Input
                type={eye["pass3"] ? "password" : "text"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => handleChange(e, "confirmPassword")}
                prefix={passwordImage}
                suffix={eye["pass3"] ? eyeImage : closedEyeImage}
                onEyeClick={() => handleEyeClick("pass3")}
              />
            </div>
            <button onClick={handleSignupSubmit}>Submit</button>
          </div>
          <div className={styles.switch}>
            <h4>
              Already have an account?{" "}
              <span onClick={handleIsLogin}>Login</span>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
