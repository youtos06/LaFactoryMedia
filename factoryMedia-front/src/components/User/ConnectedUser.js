import React from "react";
import { Link } from "react-router-dom";

export default function ConnectedUser({ user }) {
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

            {user.role && (
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
