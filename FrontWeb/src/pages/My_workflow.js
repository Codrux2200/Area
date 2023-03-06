import React from "react";
import GetArea from "../components/GetArea";
import Navigation from "../components/Navigation";
import { Navigate } from "react-router-dom";

const My_workflow = () => {
  return (
    <div>
      {sessionStorage.removeItem("id_select")}
      {sessionStorage.removeItem("id_select_reaction")}
      {sessionStorage.removeItem("name")}
      {sessionStorage.getItem("token") === null ? (
        <Navigate to="/" />
      ) : (
        <Navigation />
        // <Navigation />
      )}
      <GetArea />
    </div>
  );
};

export default My_workflow;
