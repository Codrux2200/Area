import React from "react";
import ConnectedCard from "./ConnectedCard";
import List_Workspace from "../components/Workspace";
import BigCard from "../components/BigCard";

class GetServicesData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      area: [],
      data: [],
      action_id: [],
      isLoaded: false,
    };
  }
  componentDidMount() {
    // const id = "";
    // if (this.props.page === 2)
    //   id = this.props.id
    // else
    if (
      this.props.page != "2" &&
      this.props.page != "3" &&
      this.props.page != "4"
    ) {
      if (this.props.id.services.length != 0) {
        for (let i = 0; i < this.props.id.services.length; i++) {
          fetch(
            "http://localhost:8080/user/" +
              sessionStorage.getItem("id") +
              "/service",
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
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    }
    if (this.props.page === "2") {
      fetch("http://localhost:8080/service/" + this.props.id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((json) => {
          this.setState({
            items: this.state.items.concat(json),
          });
        })
        .catch((err) => {
          console.log(err);
        });
      fetch("http://localhost:8080/service/" + this.props.id + "/action", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((json) => {
          this.setState({
            area: json,
          });
        })
        .catch((err) => {
          console.log(err);
        });
      for (let i = 0; i < this.props.data.services.length; i++) {
        fetch(
          "http://localhost:8080/user/" +
            sessionStorage.getItem("id") +
            "/service",
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
              data: json,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    if (this.props.page === "3") {
      fetch("http://localhost:8080/service/" + this.props.id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((json) => {
          this.setState({
            data: this.state.data.concat(json),
          });
        })
        .catch((err) => {
          console.log(err);
        });
      fetch("http://localhost:8080/service/" + this.props.id + "/reaction", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((json) => {
          this.setState({
            area: json,
          });
        })
        .catch((err) => {
          console.log(err);
        });
      fetch(
        "http://localhost:8080/service/" + sessionStorage.getItem("id_select"),
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
            action_id: this.state.action_id.concat(json),
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    this.state.isLoaded = true;
  }

  render() {
    const { isLoaded, items, area, data, action_id } = this.state;

    if (!this.state.isLoaded) return;

    return (
      <div className="test">
        {console.log(data)}
        {this.props.page === "0"
          ? items.map((item, index) => (
              <ConnectedCard
                name={item.name}
                img_url={item.img_url}
                id={item._id}
              />
            ))
          : null}
        {this.props.page === "1" ? (
          <List_Workspace items={items} id={this.props.id.services} />
        ) : null}
        {this.props.page === "2" ? (
          <List_Workspace
            items={items}
            id={items}
            page={this.props.page}
            area={area}
            data={data}
          />
        ) : null}
        {this.props.page === "3" ? (
          <List_Workspace
            id={items}
            page={this.props.page}
            area={area}
            data={data}
            action_id={action_id}
          />
        ) : null}
      </div>
    );
  }
}

export default GetServicesData;
