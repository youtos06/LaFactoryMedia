import React, { useState, useEffect } from "react";
import { getClient } from "../Services/clientService";
import { toast } from "react-toastify";
import listMinProjectClient from "./../ReUseFonctions/listMinProjectClient";

export default function Client(props) {
  const [client, setClient] = useState(null);
  const [cover, setCover] = useState(null);
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    const fillClient = async () => {
      try {
        const { data: theClient } = await getClient(props.match.params.id);
        //console.log(theClient);
        setClient(theClient);
        if (theClient.medias.length > 0) {
          const Thelogo = theClient.medias.filter(
            media => media.type === "logo"
          );
          Thelogo[0].url = Thelogo[0].url.replace("\\", "/");
          setLogo(Thelogo);
          //console.log(Thelogo)
          const Thecover = theClient.medias.filter(
            media => media.type === "cover"
          );
          Thecover[0].url = Thecover[0].url.replace("\\", "/");
          setCover(Thecover);
        }
      } catch (ex) {
        if (ex.response && ex.response.status === 404) {
          toast.error(ex.response.message.data);
          props.history.push("/not-found");
        } else {
          toast.error("no server connxion");
          props.history.push("/");
        }
      }
    };
    fillClient();
  }, [props]);

  if (client && logo && cover) {
    return (
      <div>
        <React.Fragment>
          <header
            className="masthead"
            style={{
              backgroundImage: `url(${cover[0].url})`,
              padding: 10,
              width: "100%",
              height: 500,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover"
            }}
          >
            <div className="container h-100">
              <div className="row h-100 align-items-center justify-content-center text-center">
                <div
                  className="col-lg-10 align-self-end"
                  style={{
                    backgroundColor: "black",
                    opacity: "0.7",
                    margin: "auto",
                    borderRadius: 20
                  }}
                >
                  <h1 className="text-uppercase text-white font-weight-bold">
                    {client.name}
                  </h1>
                  <p className="text-white font-weight-bold">
                    {client.description}
                  </p>
                  <hr className="divider my-4"></hr>
                </div>
              </div>
            </div>
          </header>
        </React.Fragment>
        <div className="d-flex    bg-info text-white " style={{ padding: 5 }}>
          <img
            className="mr-3"
            src={logo[0].url}
            alt={logo[0].type}
            width="100"
            height="48"
          />
          <div>
            <h2 style={{ textAlign: "middle", width: "100%" }}>
              client : {client.name}
            </h2>
          </div>
        </div>
        {listMinProjectClient(client.projects)}
      </div>
    );
  } else {
    return <div></div>;
  }
}
