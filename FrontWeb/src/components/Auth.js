import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = ({ Text }) => {
  const [mail, setMail] = useState([]);
  const [password, setPassword] = useState([]);
  const [already_exist_error, setAlready] = useState([]);
  const navigate = useNavigate();

  const register = async () => {
    setAlready("");
    if (mail.length === 0 || password.length === 0) {
      setAlready("Invalid credentials");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: mail,
          password: password,
        }),
      });
      const response = await res.json();
      console.log(response.message);
      if (response.message === "user already exists")
        setAlready("User already exists");
      else navigate("/");
    } catch (error) {
      throw new Error("Issue with Register", error.message);
    }
  };

  return (
    <div className="auth">
      <div className="center">
        <input
          type="text"
          placeholder="Email"
          className="email"
          onChange={(e) => setMail(e.target.value)}
        />
      </div>
      <div className="second-input"></div>
      <div className="center">
        <input
          type="password"
          placeholder="Password"
          className="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="already-exist">
        <h1>{already_exist_error}</h1>
      </div>
      <div className="login"></div>
      <a class="button" onClick={register}>
        Sign Up
      </a>
      <h2 class="hr-lines"> OR </h2>
    </div>
  );
};

export default Auth;
