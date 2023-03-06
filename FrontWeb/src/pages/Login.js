import React from "react";
import Logo from "../components/Logo";
import Login_user from "../components/Login";
import { NavLink } from "react-router-dom";

const Login = () => {
  return (
    <div>
      <Logo />
      <div className="center">
        <Login_user />
      </div>
      <div className="container">
        <div className="not-a-member">
          <ul>Not a member yet ?</ul>
        </div>
        <div className="navigation">
          <ul>
            <NavLink
              to="/register"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              <li>Register</li>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
