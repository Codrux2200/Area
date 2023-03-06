// import React from "react";
import BigCard from "./BigCard";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import GetName from "./GetName";

const Workspace = ({ items, id, page, area, data, action_id }) => {
  const [action, setAction] = useState(0);
  const [reaction, setReaction] = useState(0);
  const [action_is_set, setIsSet] = useState(0);
  const [args_value, setArguments] = useState([]);
  const navigate = useNavigate();

  const Set_Area = async () => {
    const res = await fetch("http://localhost:8080/area", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: sessionStorage.getItem("name"),
        user_id: sessionStorage.getItem("id"),
        action_id: sessionStorage.getItem("action_id"),
        action_arg: sessionStorage.getItem("actions_arg"),
        reaction_id: area[reaction]._id,
        reaction_arg: args_value,
      }),
    });
    navigate("/My_Workflow");
  };

  useEffect(() => {
    console.log("action_is_set = " + action_is_set);
  }, [action_is_set]);

  const updateFieldChanged = (index) => (e) => {
    let newArr = [...args_value];
    newArr[index] = e.target.value;
    setArguments(newArr);
    if (page === "2") {
      sessionStorage.setItem("actions_arg", newArr);
      sessionStorage.setItem("action_id", area[action]._id);
      console.log(sessionStorage.getItem("actions_arg"));
    }
    console.log(sessionStorage.getItem("actions_arg"));
  };

  return (
    <li className="big-card">
      <div className="actions">
        <h1>Actions</h1>
      </div>
      <div className="vl"></div>
      <div className="reactions">
        <h1>Reactions</h1>
      </div>
      {console.log(action_is_set)}
      {page != "2" && page != "3"
        ? items.map((item, index) => (
            <BigCard
              name={item.name}
              img_url={item.img_url}
              id={item._id}
              index={index}
            />
          ))
        : null}
      {page === "3"
        ? action_id.map((item, index) => (
            <BigCard
              name={item.name}
              img_url={item.img_url}
              id={item._id}
              index={index}
              reaction={3}
            />
          ))
        : null}
      {page === "3" ? (
        <div style={{ marginLeft: 900 + "px" }}>
          <li className="single-big-card">
            {data.length != 0 ? <h1 className="selected-service">{data[0].name}</h1> : null}
            {data.length != 0 ? <img className="logo-img" src={data[0].img_url}></img> : null}
            {area.length != 0 ? (
              <p className="description">{area[reaction].description}</p>
            ) : null}
            <div className="form-group">
              <label>Action :</label>
              <select
                style={{ marginLeft: 10 + "px" }}
                name="idaction"
                id="idaction"
                className="form-control"
                value={reaction}
                onChange={(e) => setReaction(e.target.value)}
              >
                <option disabled selected>
                  -- Select Reaction --
                </option>
                {area.map((item, index) => (
                  <option value={index}>{item.name}</option>
                ))}
              </select>
              {console.log(action)}
              <div className="list_args">
                {area.length != 0
                  ? area[reaction].args.map((arg, index) => (
                      <input
                        placeholder={arg}
                        onChange={updateFieldChanged(index)}
                      ></input>
                    ))
                  : null}
              </div>
              <div className="infos">
                <a
                  style={{ fontSize: 17 + "px" }}
                  class="select"
                  onClick={Set_Area}
                >
                  Set Reaction
                </a>
              </div>
              {console.log("Ligne 95" + action_is_set)}
            </div>
          </li>
        </div>
      ) : null}
      <div>
        {action_is_set === 0 && page === "2" ? (
          <li className="single-big-card">
            <h1 className="selected-service">{items[0].name}</h1>
            <img className="logo-img" src={items[0].img_url}></img>
            {area.length != 0 ? (
              <p className="description">{area[action].description}</p>
            ) : null}
            <div className="form-group">
              <label>Action :</label>
              <select
                style={{ marginLeft: 10 + "px" }}
                name="idaction"
                id="idaction"
                className="form-control"
                value={action}
                onChange={(e) => setAction(e.target.value)}
              >
                <option disabled selected>
                  -- Select Action --
                </option>
                {area.map((item, index) => (
                  <option value={index}>{item.name}</option>
                ))}
              </select>
              <div className="list_args">
                {area.length != 0
                  ? area[action].args.map((arg, index) => (
                      <input
                        placeholder={arg}
                        onChange={updateFieldChanged(index)}
                      ></input>
                    ))
                  : null}
              </div>
              <div className="infos">
                <a class="select" onClick={() => setIsSet(action_is_set + 1)}>
                  Set Action
                </a>
              </div>
              {console.log("Ligne 95" + action_is_set)}
            </div>
          </li>
        ) : null}
        {action_is_set === 1
          ? items.map((item, index) => (
              <BigCard
                name={item.name}
                img_url={item.img_url}
                id={item._id}
                index={index}
                reaction={2}
              />
            ))
          : null}
        {action_is_set === 1
          ? data.map((item, index) => (
              <BigCard
                name={item.name}
                img_url={item.img_url}
                id={item._id}
                index={index}
                reaction={1}
                area={area}
              />
            ))
          : null}
      </div>
    </li>
  );
};

export default Workspace;
