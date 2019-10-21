import React from "react";
import Joi from "joi-browser";
import Input from "./Input";
import Select from "./Select";
import Textarea from "./Textarea";
import Radio from "./Radio";
import Upload from "./Upload";

export function validateProperty(name, value, schema) {
  const obj = { [name]: value };
  const minischema = { [name]: schema[name] };
  const { error } = Joi.validate(obj, minischema);
  return error ? error.details[0].message : null;
}

export function validate(data, schema) {
  const option = { abortEarly: false };
  const result = Joi.validate(data, schema, option);
  if (!result.error) return null;

  const errors = {};
  const items = result.error.details;
  for (let index = 0; index < items.length; index++) {
    errors[items[index].path[0]] = items[index].message;
  }
  return errors;
}

export function RenderButton(label, data, schema) {
  //console.log(validate(data,schema))
  return (
    <button
      type="submit"
      className="btn btn-success"
      style={{ width: "100%" }}
      disabled={validate(data, schema)}
    >
      {label}
    </button>
  );
}
export function RenderInput(
  name,
  label,
  data,
  errors,
  handleChange,
  type = "text"
) {
  return (
    <Input
      type={type}
      name={[name]}
      value={data[name]}
      label={label}
      onChange={handleChange}
      error={errors[name]}
    ></Input>
  );
}
export function RenderUpload(
  name,
  label,
  errors,
  handleFileChange,
  multiple = false,
  type = "file"
) {
  return (
    <Upload
      type={type}
      name={[name]}
      label={label}
      onChange={handleFileChange}
      error={errors[name]}
      multiple={multiple}
    ></Upload>
  );
}
export function RenderTextarea(name, label, data, errors, handleChange) {
  return (
    <Textarea
      name={[name]}
      value={data[name]}
      label={label}
      onChange={handleChange}
      error={errors[name]}
    ></Textarea>
  );
}
export function RenderSelect(name, label, options, data, errors, handleChange) {
  return (
    <Select
      name={name}
      value={data[name]}
      select={data[name]}
      label={label}
      options={options}
      onChange={handleChange}
      error={errors[name]}
    ></Select>
  );
}
export function RenderRadio(name, label, values, data, errors, handleChange) {
  return (
    <Radio
      name={name}
      value={data[name]}
      // variable 'select' to decide the client in edit
      label={label}
      values={values}
      onChange={handleChange}
      error={errors[name]}
    ></Radio>
  );
}
