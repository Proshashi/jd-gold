import React from "react";
import { Select, Input } from "antd";
import { useState } from "react";

const { Option } = Select;

const InputComponent = ({
  icon,
  handleChange,
  placeholder,
  password,
  style,
  inputStyle,
  error,
  touched,
  value,
  ...props
}) => {
  return (
    <div style={{ position: "relative", marginRight: "1rem" }}>
      <div
        className={"__jd_input-regular"}
        style={{
          ...style,
          border: error && touched ? "1px solid red" : "1px solid #736363",
        }}
      >
        {icon && <div className="__jd_input-regular--icon">{icon}</div>}
        <input
          type={password ? "password" : "text"}
          onChange={(e) => {
            handleChange(e.target.value);
          }}
          placeholder={placeholder}
          className="__jd_input-regular--input"
          value={value}
          style={inputStyle}
          autoComplete="off"
          {...props}
        />
      </div>
      {error && touched && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "5%",
            color: "red",
          }}
        >
          * {error}
        </div>
      )}
    </div>
  );
};

export const InputWithUnitComponent = ({
  icon,
  handleChange,
  placeholder,
  password,
  style,
  inputStyle,
  selectStyle,
  error,
  touched,
  value,
  ...props
}) => {
  const [unit, setUnit] = useState("tola");
  const [data, setData] = useState();

  return (
    <div style={{ position: "relative", marginRight: "1rem" }}>
      <div className={"__jd_input-withUnit"}>
        <Input
          type={password ? "password" : "text"}
          onChange={(e) => {
            setData(e.target.value);
            handleChange({ value: e.target.value, unit });
          }}
          placeholder={`Quantity (${unit})`}
          className="__jd_input-withUnit--input"
          value={value}
          style={{
            ...inputStyle,
            ...style,
            border: error && touched ? "1px solid red" : "1px solid #736363",
          }}
          {...props}
          addonAfter={
            <Select
              defaultValue={unit}
              className="__jd_input-withUnit--input__select"
              onChange={(unit) => {
                setUnit(unit);
                handleChange({ value: data, unit });
              }}
              style={{ ...selectStyle }}
            >
              <Option value="tola">Tola</Option>
              <Option value="gram">Gram</Option>
            </Select>
          }
        />
      </div>
      {error && touched && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "5%",
            color: "red",
          }}
        >
          * {error}
        </div>
      )}
    </div>
  );
};

export const InputLabelComponent = ({
  icon,
  handleChange,
  placeholder,
  title,
  password,
  style,
  inputStyle,
  error,
  touched,
  value,
  ...props
}) => {
  return (
    <div style={{ position: "relative", margin: "3rem 1rem" }}>
      <label
        style={{ fontWeight: "bold", color: "#222537", fontSize: "1.5rem" }}
        htmlFor="withLabel--input"
      >
        {title}
      </label>
      <div
        className={"__jd_input-withLabel"}
        style={{
          ...style,
          borderBottom:
            error && touched ? "1px solid red" : "1px solid #222537",
        }}
      >
        <input
          type={password ? "password" : "text"}
          onChange={(e) => {
            handleChange(e.target.value);
          }}
          placeholder={placeholder}
          className="__jd_input-withLabel--input"
          id="withLabel--input"
          autoComplete="off"
          value={value}
          style={inputStyle}
          {...props}
        />
      </div>
      {error && touched && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "0%",
            color: "red",
          }}
        >
          * {error}
        </div>
      )}
    </div>
  );
};

export const SearchInput = ({ handleChange, placeholder, value }) => {
  return (
    <div className="__jd_input-search">
      <input
        type="text"
        value={value}
        autoComplete="off"
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export default InputComponent;
