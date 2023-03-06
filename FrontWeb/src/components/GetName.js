import React, { useEffect, useState } from "react";

const GetName = () => {
  const [name, setName] = useState("");

  const addName = async () => {
    sessionStorage.setItem("name", name);
    window.location.reload(false);
  };

  return (
    <div>
      <li className="big-card">
        <h1 style={{ fontSize: 50 + "px" }}>Workflow Name</h1>
        <input
          type="text"
          placeholder="Workflow Name"
          onChange={(e) => setName(e.target.value)}
        ></input>
        <a
          class="select"
          style={{ marginRight: 30 + "px", marginTop: 10 + "px" }}
          onClick={addName}
        >
          Set Name
        </a>
      </li>
    </div>
  );
};

export default GetName;
