import React, { useState } from "react";
import Joi from "joi-browser";
import {
  validateProperty,
  RenderInput,
  RenderButton,
  RenderRadio,
  validate
} from "../common/FormHolder";
import logo from "../../logo.png";
import * as userService from "../Services/userService";
import { toast } from "react-toastify";

export default function Register(props) {
  const [allData, setData] = useState({
    email: "",
    password: "",
    name: "",
    role: false
  });
  const [inputErrors, setErrors] = useState({});

  const schema = {
    email: Joi.string()
      .email()
      .required()
      .label("email"),
    password: Joi.string()
      .required()
      .min(5)
      .label("Password"),
    name: Joi.string()
      .required()
      .min(5)
      .label("Full Name"),
    role: Joi.label("User Role")
  };

  const values = [
    { value: false, name: "Simple Media User" },
    { value: true, name: "admin" }
  ];
  const handleChange = ({ currentTarget: input }) => {
    const errors = { ...inputErrors };
    const errorMessage = validateProperty(input.name, input.value, schema);
    if (errorMessage) {
      errors[input.name] = errorMessage;
      setErrors(errors);
    } else delete errors[input.name];
    const data = { ...allData };
    data[input.name] = input.value;
    setData(data);
    setErrors(errors);
  };
  const handleSubmit = e => {
    e.preventDefault();
    const errors = validate(allData, schema);
    setErrors(errors || {});
    if (errors) return;
    //console.log("---")
    doSubmit();
  };
  const doSubmit = async () => {
    try {
      const response = await userService.register(allData);
      props.history.push("/users/" + response.data);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...inputErrors };
        errors.name = ex.response.data;
        setErrors(errors);
      } else {
        toast.error("server down");
        props.history.push("/");
      }
    }
  };

  return (
    <div className="container" style={{ width: 500, margin: "auto" }}>
      <div style={{ margin: 40 }}>
        <img
          style={{ width: 420, height: 80 }}
          className="img-fluid"
          src={logo}
          alt=""
        />
        <h3 style={{ textAlign: "center" }}>Register a New User</h3>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          border: "solid",
          borderRadius: 20,
          borderWidth: 0.2,
          padding: 40
        }}
      >
        {RenderInput("name", "Full Name", allData, inputErrors, handleChange)}
        {RenderInput(
          "email",
          "Email",
          allData,
          inputErrors,
          handleChange,
          "email"
        )}
        {RenderInput(
          "password",
          "Password",
          allData,
          inputErrors,
          handleChange,
          "password"
        )}
        {RenderRadio(
          "role",
          "User Role",
          values,
          allData,
          inputErrors,
          handleChange
        )}
        {RenderButton("Register", allData, schema)}
      </form>
    </div>
  );
}
