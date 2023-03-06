import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  const logout = async () => {
    sessionStorage.clear();
  };

  return (
    <div>
      <div class="logout-img">
        <a class="logout-button" href="/" onClick={logout}>
          <img src="https://cdn-icons-png.flaticon.com/512/4400/4400828.png" />
          <div class="logout">LOGOUT</div>
        </a>
      </div>
      <div className="services-navig">
        <ul>
          <NavLink
            to="/home"
            className={(nav) => (nav.isActive ? "nav-active" : "")}
          >
            <li>Services enabled</li>
          </NavLink>
          <NavLink
            to="/all"
            className={(nav) => (nav.isActive ? "nav-active" : "")}
          >
            <li>All services</li>
          </NavLink>
          <NavLink
            to="/Workspace"
            className={(nav) => (nav.isActive ? "nav-active" : "")}
          >
            <li>Create workflow</li>
          </NavLink>
          <NavLink
            to="/My_Workflow"
            className={(nav) => (nav.isActive ? "nav-active" : "")}
          >
            <li>My Workflow</li>
          </NavLink>
        </ul>
      </div>
    </div>
  );
};

export default Navigation;
