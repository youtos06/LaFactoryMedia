import React from "react";
import { useState } from "react";
import Joi from "joi-browser";
import {
  validateProperty,
  RenderInput,
  RenderButton,
  validate
} from "../common/FormHolder";
import logo from "../../logo.png";
import { toast } from "react-toastify";
import { resetPassword } from "../Services/userService";

export default function NewPassword(props) {
  const [allData, setData] = useState({ password: "" });
  const [inputErrors, setErrors] = useState({});

  const schema = {
    password: Joi.string()
      .required()
      .min(5)
      .label("Password")
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
      const data = { ...allData };
      const { data: text } = await resetPassword(
        data.password,
        props.match.params.jwt
      );
      toast.info(text);
      props.history.push("/login");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...inputErrors };
        errors.email = ex.response.data;
        toast.error("invalid data");
        setErrors(inputErrors);
      } else {
        toast.error("no Server side");
        props.history.push("/");
      }
    }
  };

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
  return (
    <div className="container" style={{ width: 500, margin: "auto" }}>
      <div style={{ margin: 40 }}>
        <img
          style={{ width: 420, height: 80 }}
          className="img-fluid"
          src={logo}
          alt=""
        />
        <h3 style={{ textAlign: "center" }}>enter new password</h3>
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
        {RenderInput(
          "password",
          "Password",
          allData,
          inputErrors,
          handleChange,
          "password"
        )}
        {RenderButton("new password", allData, schema)}
      </form>
    </div>
  );
}
