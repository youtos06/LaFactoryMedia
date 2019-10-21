import React from "react";
import { Link } from "react-router-dom";
export default function NavBar({ user }) {
  const userExiste = Object.keys(user).length;
  return (
    <React.Fragment>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="#">
          Meida Factory
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home{" "}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/projects">
                Nos Projets
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/clients">
                Nos Clients
              </Link>
            </li>
            {userExiste !== 0 && user.role && (
              <React.Fragment>
                <li className="nav-item">
                  <Link className="nav-link" to="/users">
                    Utilisateurs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Creer Utilisateur
                  </Link>
                </li>
              </React.Fragment>
            )}
            {userExiste === 0 && (
              <React.Fragment>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    login
                  </Link>
                </li>
              </React.Fragment>
            )}
            {userExiste !== 0 && (
              <React.Fragment>
                <li className="nav-item">
                  <Link className="nav-link" to="/project/new">
                    Créer un projet
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/client/new">
                    Créer un client
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link js-scroll-trigger" to="/profile">
                    {user.name}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link js-scroll-trigger"
                    style={{
                      border: "solid",
                      borderRadius: 16,
                      borderWidth: 1
                    }}
                    to="/logout"
                  >
                    Logout
                  </Link>
                </li>
              </React.Fragment>
            )}
          </ul>
          <span className="navbar-text">website powered by LaFactory</span>
        </div>
      </nav>
    </React.Fragment>
  );
}
