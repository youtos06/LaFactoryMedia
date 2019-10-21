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
import { forgetPassword } from "../Services/userService";

export default function ResetPassword(props) {
  const [allData, setData] = useState({ email: "" });
  const [inputErrors, setErrors] = useState({});
  const schema = {
    email: Joi.string()
      .email()
      .required()
      .label("email")
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
      const result = await forgetPassword(data.email);
      if (result) {
        toast.info("check your mail for link");
        props.history.push("/");
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        const errors = { ...inputErrors };
        errors.email = ex.response.data;
        toast.error(ex.response.data);
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
        <h3 style={{ textAlign: "center" }}>Enter mail of account</h3>
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
          "email",
          "Email",
          allData,
          inputErrors,
          handleChange,
          "email"
        )}
        {RenderButton("send me help", allData, schema)}
      </form>
    </div>
  );
}
