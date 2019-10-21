import React, { useState, useEffect } from "react";
import { allClients, deleteClient } from "../Services/clientService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../Services/authService";
function Clients(props) {
  const [clients, setClients] = useState([]);
  const [user, setUser] = useState(null);
  const deleteThisClient = async _id => {
    try {
      const { data: client } = await deleteClient(_id);
      const allclients = clients.filter(
        arrayclient => arrayclient._id !== client._id
      );
      setClients(allclients);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error(ex.response.message.data);
      } else {
        toast.error("no server connxion");
      }
    }
  };

  useEffect(() => {
    const fillClients = async () => {
      try {
        const { data: allclients } = await allClients();

        if (allclients) {
          for (let index = 0; index < allclients.length; index++) {
            if (allclients[index].medias.length > 0) {
              allclients[index].medias.filter(media => media.type === "logo");
              allclients[index].medias[0].url = allclients[
                index
              ].medias[0].url.replace("\\", "/");
            }
          }
          setUser(getCurrentUser());
          setClients(allclients);
        }
      } catch (ex) {
        if (ex.response && ex.response.status === 404) {
          toast.error(ex.response.data);
          props.history.push("/not-found");
        } else {
          toast.error("no server connxion");
          props.history.push("/");
        }
      }
      return false;
    };
    fillClients();
  }, [props]);

  return (
    <React.Fragment>
      <h2 style={{ textAlign: "center" }}>
        la liste de nos clients
        {user && (
          <Link to="/client/new">
            <button className="btn btn-info" style={{ marginLeft: 10 }}>
              {" "}
              créer un nouveau utilisateur
            </button>
          </Link>
        )}
      </h2>

      {clients &&
        clients.map(client => (
          <div
            className="card text-center"
            key={client._id}
            style={{ maxWidth: 900, margin: "auto", marginTop: 50 }}
          >
            <div className="card-header">{client.name}</div>
            <div className="card-body">
              <h5 className="card-title">Special title treatment</h5>
              {client.medias.length > 0 && (
                <img
                  src={client.medias[0].url}
                  className="mr-3"
                  style={{ width: 64, height: 64 }}
                  alt={client.title}
                />
              )}
              <p className="card-text">{client.description}</p>
              <a href={`/clients/${client._id}`} style={{ marginLeft: 10 }}>
                consulter
              </a>
              {user && (
                <>
                  <a href={`/clients/${client._id}/edit`}>
                    <button className="btn btn-info" style={{ marginLeft: 10 }}>
                      modifier
                    </button>
                  </a>
                  <button
                    className="btn btn-danger"
                    onClick={e => deleteThisClient(client._id)}
                    style={{ marginLeft: 10 }}
                  >
                    supprimer
                  </button>
                </>
              )}
            </div>
            <div className="card-footer text-muted">{client.created_at}</div>
          </div>
        ))}
    </React.Fragment>
  );
}
export default Clients;
