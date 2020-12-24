import React from "react";
import { Select } from "antd";

const { Option } = Select;

const InputSelect = ({
  handleChange,
  value,
  options,
  optionsFrom,
  placeholder,
  style,
  error,
  touched,
  ...props
}) => {
  return (
    <div style={{ position: "relative" }}>
      {error && touched && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "5%",
            color: "red",
          }}
          className="__jd_input-select--error"
        >
          * {error}
        </div>
      )}
      <Select
        className="__jd_input-select"
        placeholder={placeholder || "Select a person"}
        style={{
          ...style,
          border: error && touched ? "1px solid red" : "1px solid #736363",
        }}
        optionFilterProp="children"
        value={value}
        onChange={handleChange}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        {...props}
      >
        {options ? (
          options.map((option) => {
            const { name, id } = option;
            return (
              <Option
                value={name}
                data={JSON.stringify(option)}
                key={id}
                style={{ backgroundColor: "#fff" }}
              >
                {name}
              </Option>
            );
          })
        ) : (
          <>
            <Option value="jack" data={JSON.stringify({ id: 1, name: "Jack" })}>
              Jack
            </Option>
            <Option value="lucy" data={JSON.stringify({ id: 2, name: "Lucy" })}>
              Lucy
            </Option>
            <Option value="tom" data={JSON.stringify({ id: 3, name: "Tom" })}>
              Tom
            </Option>
          </>
        )}
      </Select>
    </div>
  );
};

export default InputSelect;
