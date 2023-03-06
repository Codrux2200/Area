import React from "react";
import Auth from "../components/Auth";
import Logo from "../components/Logo";
import { NavLink } from "react-router-dom";

const Register = () => {
  return (
    <div>
      <Logo />
      <div className="center"><Auth Text="Sign Up" /></div>
      <div className="container">
        <div className="not-a-member">
          <ul>Already a member ?</ul>
        </div>
        <div className="navigation">
          <ul>
            <NavLink
              to="/"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              <li>Login</li>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;
