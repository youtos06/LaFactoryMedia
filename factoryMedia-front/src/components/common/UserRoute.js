import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getCurrentUser } from "../Services/authService";
export default function UserRoute({
  path,
  component: Component,
  render,
  ...rest
}) {
  //console.log(getCurrentUser());
  return (
    <Route
      {...rest}
      render={props => {
        if (!getCurrentUser()) return <Redirect to="/login" />;
        return Component ? <Component {...props} /> : render(props);
      }}
    ></Route>
  );
}
