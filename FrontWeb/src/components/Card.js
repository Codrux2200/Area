import React, { useEffect, useState } from "react";

const Card = ({ name, img_url, url, service_id }) => {
  const EnableService = async () => {
    window.location.href =
      url +
      "?token=" +
      sessionStorage.getItem("id") +
      "&service_id=" +
      service_id;
    console.log(sessionStorage.getItem("token"));
  };
  return (
    <li className="card">
      <div className="service-logo">
        <div className="back"></div>
        <img src={img_url} alt={name} text={name} />
      </div>
      <div className="service-name">
        <h1>{name}</h1>
      </div>
      <div className="infos" style={{ height:  + "px" }}>
        <div>
          <a
            class="select"
            style={{ marginLeft: 27 + "px" }}
            onClick={EnableService}
          >
            Connect
          </a>
        </div>
        <div className="separator"></div>
      </div>
    </li>
  );
};

export default Card;
