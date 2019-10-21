import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUser } from "./../Services/userService";
import { toast } from "react-toastify";
import { getCurrentUser } from "../Services/authService";

export default function User(props) {
  const [user, setUser] = useState({});
  const [currentUser] = useState(getCurrentUser);
  useEffect(() => {
    const fillUser = async () => {
      try {
        const { data: theUser } = await getUser(props.match.params.id);
        setUser(theUser);
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
    fillUser();
  }, [props]);

  if (user) {
    return (
      <div>
        <div
          className="card"
          style={{ maxWidth: 900, marginTop: 100, margin: "auto" }}
        >
          <div className="card-body">
            <h5 className="card-title">Full Name : {user.name}</h5>
            <h6 className="card-subtitle mb-2 text-muted">
              Role : {user.role ? <strong>Admin</strong> : "Media team"}
            </h6>
            <p className="card-text">Mail : {user.email}</p>

            {currentUser.role && (
              <Link to="/users" className="card-link">
                See All User
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}
