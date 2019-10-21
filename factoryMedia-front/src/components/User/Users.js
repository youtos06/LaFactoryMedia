import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getUsers, deleteUser } from "../Services/userService";
import { Link } from "react-router-dom";

export default function Users(props) {
  const [users, setUsers] = useState({});
  const [userDelte, setUserDelete] = useState(1); //  variable to keep useState update when deleting a user
  const deleteThisUser = async _id => {
    try {
      const { data: user } = await deleteUser(_id);
      const allUsers = users.filter(selUser => selUser._id !== user._id);
      setUsers(allUsers);
      setUserDelete(1);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error(ex.response.message.data);
      } else {
        toast.error("no server connxion");
      }
    }
  };

  useEffect(() => {
    const fillUsers = async () => {
      try {
        const { data: allUsers } = await getUsers();
        setUsers(allUsers);
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
    if (users.length > 0 || userDelte === 0) {
    } else {
      //console.log(users)
      if (userDelte === 1) {
        setUserDelete(0);
      }
      fillUsers();
    }
  }, [props, users, userDelte]);

  //this function verify if the there is only one admin in db if thats the case you won't be able to see delete button for that admin
  const numberOfAdmin = user => {
    if (user.role) {
      const admins = users.filter(u => u.role);
      if (admins.length > 1) {
        return true;
      }
      return false;
    }
    return true;
  };

  if (users.length > 0) {
    return (
      <div style={{ margin: "auto" }}>
        <h1 style={{ textAlign: "center" }}>
          Table of users{" "}
          <Link to="/register">
            <button className="btn btn-info">
              {" "}
              créer un nouveau utilisateur
            </button>
          </Link>
        </h1>
        <div style={{ margin: "auto", maxWidth: 900 }}>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">email</th>
                <th scope="col">role</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role ? <strong>Admin</strong> : "media"}</td>
                  <td>
                    <Link to={"/users/" + user._id}>
                      <button className="btn btn-primary">see user</button>
                    </Link>{" "}
                    {numberOfAdmin(user) && (
                      <button
                        className="btn btn-danger"
                        onClick={e => deleteThisUser(user._id)}
                      >
                        delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}
