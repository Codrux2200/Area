import React from "react";
import Navigation from "../components/Navigation";
import List_Workspace from "../components/Workspace";
import { Navigate } from "react-router-dom";
import GetServicesId from "../components/GetServicesId";
import GetName from "../components/GetName";

const Workspace = () => {
  return (
    <div>
      {sessionStorage.getItem("token") === null ? (
        <Navigate to="/" />
      ) : (
        <Navigation />
      )}
      {sessionStorage.getItem("name") === null ? <GetName></GetName> : null}
      {sessionStorage.getItem("id_select") === null && sessionStorage.getItem("name") != null ? (
        <GetServicesId page="1"></GetServicesId>
      ) : null}
      {sessionStorage.getItem("id_select_reaction") === null &&
      sessionStorage.getItem("id_select") != null ? (
        <GetServicesId page="2"></GetServicesId>
      ) : null}
      {sessionStorage.getItem("id_select_reaction") != null &&
      sessionStorage.getItem("id_select") != null ? (
        <GetServicesId page="3"></GetServicesId>
      ) : null}
    </div>
  );
};

export default Workspace;
