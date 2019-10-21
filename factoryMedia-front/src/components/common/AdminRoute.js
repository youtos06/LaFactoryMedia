import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getCurrentUser } from "../Services/authService";
export default function AdminRoute({
  path,
  component: Component,
  render,
  ...rest
}) {
  const user = getCurrentUser();
  return (
    <Route
      {...rest}
      render={props => {
        if (!user || !user.role) return <Redirect to="/" />;
        return Component ? <Component {...props} /> : render(props);
      }}
    ></Route>
  );
}
