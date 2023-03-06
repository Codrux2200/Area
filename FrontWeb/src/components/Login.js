import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Home from "../pages/Home";

const Login_user = () => {
  const [mail, setMail] = useState([]);
  const [password, setPassword] = useState([]);
  const [Invalid_credentials, setInvalidCredentials] = useState([]);
  const navigate = useNavigate();

  const login = async () => {
    setInvalidCredentials("");
    if (mail.length === 0 || password.length === 0) {
      setInvalidCredentials("Invalid credentials");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/login", {
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
      if (response.message === "username doesnt exist")
        setInvalidCredentials("Username doesnt exist");
      else if (response.message === "password incorrect")
        setInvalidCredentials("Password incorrect");
      else {
        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem("id", response.userId);
        console.log(sessionStorage.getItem("token"));
        navigate("/all");
      }
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
        <h1>{Invalid_credentials}</h1>
      </div>
      <div className="login"></div>
      <a class="button" onClick={login}>
        Login
      </a>
      <h2 class="hr-lines"> OR </h2>
    </div>
  );
};

export default Login_user;
