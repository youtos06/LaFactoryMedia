import React from "react";
const isSelected = (select, id) => {
  return select === id;
};

const Select = ({ name, label, options, select, error, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select className="form-control" id={name} name={name} {...rest}>
        {options.map(option => (
          <option
            key={option._id}
            value={option._id}
            selected={isSelected(select, option._id) ? "selected" : ""}
          >
            {option.name}
          </option>
        ))}
      </select>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};
export default Select;
