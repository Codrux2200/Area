import React, { useEffect, useState } from "react";

const WorflowCard = ({ name, actif, id }) => {
  var button_state = actif;
  const [change, setChange] = useState(0);

  const ChangeAreaState = async () => {
    const res = await fetch("http://localhost:8080/area/" + id + "/state", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    });
    window.location.reload(false);
    setChange(change + 1);
  };

  const DeleteArea = async () => {
    const res = await fetch("http://localhost:8080/area/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    });
    window.location.reload(false);
  };

  useEffect(() => {
    console.log(change);
  }, [change]);

  return (
    <div>
      <div className="card-4">
        <div className="service-logo">
          <a onClick={DeleteArea}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/5028/5028066.png"
              width="5%"
            />
          </a>
        </div>
        <div className="service-name">
          <h1>{name}</h1>
        </div>
        <div className="infos">
          <a class={button_state} onClick={() => ChangeAreaState()}>
            {button_state}
          </a>
        </div>
      </div>
    </div>
  );
};

export default WorflowCard;
