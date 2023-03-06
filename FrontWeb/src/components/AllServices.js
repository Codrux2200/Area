import React, { useEffect, useState } from "react";
import Card from "./Card";

const AllServices = () => {
  const [response, setResponse] = useState([]);

  useEffect(() => {
    const getServicesName = async () => {
      const res = await fetch("http://localhost:8080/service", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      });
      setResponse(await res.json());
      console.log(response);
    };
    getServicesName();
  }, []);
  return (
    <>
      {response.map((service, index) => (
        <Card key={index} name={service.name} img_url={service.img_url} url={service.connection_url} service_id={service._id}/>
      ))}
    </>
  );
};

export default AllServices;
