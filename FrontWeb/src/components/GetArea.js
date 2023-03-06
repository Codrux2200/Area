import React from "react";
import WorflowCard from "./WorflowCard";

class GetArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      isLoaded: false,
    };
  }

  componentDidMount() {
    fetch(
      "http://localhost:8080/user/" + sessionStorage.getItem("id") + "/area",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          items: json,
          isLoaded: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { isLoaded, items } = this.state;

    if (!isLoaded) return;

    return (
      <div className="test">
        {items.map((area, index) => (
          <WorflowCard
            key={index}
            name={area.name}
            actif={area.actif === true ? "disable" : "enable"}
            id={area._id}
          />
        ))}
      </div>
    );
  }
}

export default GetArea;
