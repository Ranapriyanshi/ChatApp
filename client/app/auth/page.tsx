"use client";

import React, { useState, useEffect } from "react";
import useUserStore from "@/stores/userStore";
import styles from "./login.module.scss";
import { toaster } from "../../utils";
import Input from "@/components/Input/Input";
import usernameImage from "@/public/Account.png";
import passwordImage from "@/public/Password.png";
import emailImage from "@/public/Email.png";
import eyeImage from "@/public/Eye.png";
import closedEyeImage from "@/public/Closed Eye.png";
import { PulseLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [eye, setEye] = useState<Record<string, boolean>>({
    pass1: true,
    pass2: true,
    pass3: true,
  });
  const { setUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchData() {
      const resp = await fetch(process.env.NEXT_PUBLIC_SOCKET_URI + "", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      if (resp.ok) router.push("/");
    }

    if (token) {
      fetchData();
    }
  }, [router]);

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
    setLoading(true);

    if (password !== confirmPassword) {
      toaster("error", "Passwords do not match");
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

    if (!resp.ok) {
      toaster("error", data.msg);
      setLoading(false);
    } else {
      toaster("success", "Account created successfully!");
      setUser(data.user);
      localStorage.setItem("token", data.token);
      router.push("/");
      setLoading(false);
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
    setLoading(true);
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

    if (resp.status == 400) {
      toaster("error", data.msg);
      setLoading(false);
    } else {
      setUser(data.user);
      setLoading(false);
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
      <ToastContainer />
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
              prefixImg={usernameImage}
            />
            <Input
              type={eye["pass1"] ? "password" : "text"}
              placeholder="Password"
              onChange={handlePassword}
              value={password}
              prefixImg={passwordImage}
              suffixImg={eye["pass1"] ? eyeImage : closedEyeImage}
              onEyeClick={() => handleEyeClick("pass1")}
            />
            <button onClick={handleLoginSubmit} disabled={loading}>
              {!loading ? "Login" : <PulseLoader color="white" size={10} />}
            </button>
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
                prefixImg={usernameImage}
              />
              <Input
                type="text"
                placeholder="Last Name (Optional)"
                value={lastName}
                onChange={(e) => handleChange(e, "lastName")}
                prefixImg={usernameImage}
              />
            </div>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => handleChange(e, "username")}
              prefixImg={usernameImage}
            />
            <Input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => handleChange(e, "email")}
              prefixImg={emailImage}
            />
            <div className={styles.split}>
              <Input
                type={eye["pass2"] ? "password" : "text"}
                placeholder="Password"
                value={password}
                onChange={(e) => handleChange(e, "password")}
                prefixImg={passwordImage}
                suffixImg={eye["pass2"] ? eyeImage : closedEyeImage}
                onEyeClick={() => handleEyeClick("pass2")}
              />
              <Input
                type={eye["pass3"] ? "password" : "text"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => handleChange(e, "confirmPassword")}
                prefixImg={passwordImage}
                suffixImg={eye["pass3"] ? eyeImage : closedEyeImage}
                onEyeClick={() => handleEyeClick("pass3")}
              />
            </div>
            <button onClick={handleSignupSubmit} disabled={loading}>
              Signup
            </button>
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
