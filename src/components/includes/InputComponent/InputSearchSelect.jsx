import React from "react";
import { AutoComplete } from "antd";

const { Option } = AutoComplete;

const InputSearchSelect = ({
  handleChange,
  handleSelect,
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
        >
          * {error}
        </div>
      )}
      <AutoComplete
        className="__jd_input-autocomplete"
        placeholder={placeholder || "Select a person"}
        style={{
          ...style,
          border: error && touched ? "1px solid red" : "1px solid #736363",
        }}
        optionFilterProp="children"
        value={value}
        onChange={handleChange}
        filterOption={(input, option) => {
          return (
            option.children
              .toLowerCase()
              .trim()
              .indexOf(input.toLowerCase().trim()) >= 0
          );
        }}
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
            <Option
              value="tommy"
              data={JSON.stringify({ id: 3, name: "Tommy" })}
            >
              Tommy
            </Option>
          </>
        )}
      </AutoComplete>
    </div>
  );
};

export default InputSearchSelect;
