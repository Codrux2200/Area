import React, { useEffect, useState } from "react";
import Workspace from "./Workspace";
import { useNavigate } from "react-router-dom";

const BigCard = ({ name, img_url, id, index, reaction, area }) => {
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const [action, setAction] = useState(0);
  const [action_is_set, setIsSet] = useState(0);
  const [args_value, setArguments] = useState([]);
  var button_state = "select";

  const updateFieldChanged = (index) => (e) => {
    let newArr = [...args_value];
    newArr[index] = e.target.value;
    setArguments(newArr);
  };

  const ChangeValue = () => {
    if (button_state === "remove") {
      {
        sessionStorage.removeItem("id_select");
      }
      {
        sessionStorage.removeItem("id_select_reaction");
      }
      {
        sessionStorage.removeItem("name");
      }
      window.location.reload(false);
    }
    if (reaction != 1 && reaction != 2 && reaction != 900 && reaction != 3) {
      sessionStorage.setItem("id_select", id);
      window.location.reload(false);
    } else {
      sessionStorage.setItem("id_select_reaction", id);
      window.location.reload(false);
    }
  };

  const setMargin = () => {
    if (reaction === 1) reaction = 900;
    if (reaction === 2 || reaction === 3) button_state = "remove";
  };

  useEffect(
    () => {
      console.log(sessionStorage.getItem("id_select_reaction"));
      console.log(select);
    },
    [select],
    sessionStorage.getItem("id_select_reaction")
  );
  return (
    <div>
      {reaction === 1 || reaction === 2 || reaction === 3 ? setMargin() : null}
      <div className="divv" style={{ marginLeft: reaction + "px" }}>
        {sessionStorage.getItem("id_select_reaction") === null ||
        reaction === 3 ? (
          index === 3 || index === 6 ? (
            <div className="card-3">
              <div className="service-logo">
                <div className="back"></div>
                <img src={img_url} alt={name} text={name} />
              </div>
              <div className="service-name">
                <h1>{name}</h1>
              </div>
              <div className="infos">
                <a class="select" onClick={ChangeValue}>
                  Select
                </a>
              </div>{" "}
            </div>
          ) : (
            <div className="card-2">
              <div className="service-logo">
                <div className="back"></div>
                <img src={img_url} alt={name} text={name} />
              </div>
              <div className="service-name">
                <h1>{name}</h1>
              </div>
              <div className="infos">
                <a class={button_state} onClick={() => ChangeValue()}>
                  {button_state}
                </a>
              </div>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default BigCard;
