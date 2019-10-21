import React, { useEffect, useState } from "react";
import "./App.css";
import "font-awesome/css/font-awesome.css";
import "bootstrap/dist/css/bootstrap.css";
import { Route, Switch, Redirect } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import NewClient from "./components/Client/NewClient";
import NewProject from "./components/Project/NewProject";
import Login from "./components/User/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./components/User/Register";
import { getCurrentUser } from "./components/Services/authService";
import Logout from "./components/User/logout";
import Projects from "./components/Project/Projects";
import Project from "./components/Project/Project";
import Clients from "./components/Client/Clients";
import Client from "./components/Client/Client";
import ConnectedUser from "./components/User/ConnectedUser";
import Users from "./components/User/Users";
import User from "./components/User/User";
import EditClient from "./components/Client/EditClient";
import EditProject from "./components/Project/EditProject";
import UserRoute from "./components/common/UserRoute";
import AdminRoute from "./components/common/AdminRoute";
import ResetPassword from "./components/User/ResetPassword";
import NewPassword from "./components/User/NewPassword";

function App() {
  const [user, setUser] = useState({});
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUser(user);
    }
  }, []);
  return (
    <>
      <NavBar user={user}></NavBar>
      <ToastContainer />
      <div
        style={
          {
            // width: "100%",
            // height: "100%",
            // backgroundImage: `url(${LaFactory})`,
            // backgroundRepeat: "no-repeat",
            // backgroundSize: "cover",
            // backgroundAttachment: "fixed"
            //backgroundSize: "cover"
          }
        }
      >
        <Switch>
          <Route path="/home" component={Home}></Route>
          <Route path="/not-found" component={NotFound}></Route>

          {/* client routes */}
          <Route exact path="/clients" component={Clients}></Route>
          <UserRoute path="/client/new" component={NewClient}></UserRoute>
          <UserRoute
            path="/clients/:id/edit"
            component={EditClient}
          ></UserRoute>
          <Route path="/clients/:id" component={Client}></Route>

          {/* projects routes */}
          <Route exact path="/projects" component={Projects}></Route>
          <UserRoute path="/project/new" component={NewProject}></UserRoute>
          <UserRoute
            path="/projects/:id/edit"
            component={EditProject}
          ></UserRoute>
          <Route path="/projects/:id" component={Project}></Route>

          {/* user Routes */}
          <Route path="/login" component={Login}></Route>
          <Route exact path="/forgetPassword" component={ResetPassword}></Route>
          <Route path="/forgetPassword/:jwt" component={NewPassword}></Route>
          <AdminRoute path="/register" component={Register}></AdminRoute>
          <UserRoute path="/logout" component={Logout}></UserRoute>
          <AdminRoute exact path="/users" component={Users}></AdminRoute>
          <AdminRoute exact path="/users/:id" component={User}></AdminRoute>
          <UserRoute
            path="/profile"
            component={() => <ConnectedUser user={user}></ConnectedUser>}
          ></UserRoute>

          {/* redirects */}
          <Redirect from="/" to="/home"></Redirect>
          <Redirect to="/not-found"></Redirect>
        </Switch>
      </div>
    </>
  );
}

export default App;
