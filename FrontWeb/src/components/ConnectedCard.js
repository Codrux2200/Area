import React, { useEffect, useState } from "react";

const ConnectedCard = ({ name, img_url, id }) => {
  const DisableService = async () => {
    const res = await fetch(
      "http://localhost:8080/user/" +
        sessionStorage.getItem("id") +
        "/service/" +
        id,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    );
    window.location.reload(false);
  };
  return (
    <li className="card-5">
      <div className="service-logo">
        <div className="back"></div>
        <img src={img_url} alt={name} text={name} />
      </div>
      <div className="service-name">
        <h1>{name}</h1>
      </div>
      <div className="infos">
        <h2 style={{ marginTop: 0 + "px" }}>Connected since:</h2>
        <a
          class="remove"
          onClick={DisableService}
          style={{ marginLeft: 27 + "px", marginTop: 3 + "px" }}
        >
          Disconnect
        </a>
        <div className="separator"></div>
      </div>
    </li>
  );
};

export default ConnectedCard;
