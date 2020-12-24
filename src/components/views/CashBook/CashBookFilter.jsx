import React from "react";
import { Select } from "antd";

const { Option } = Select;

const CashBookFilter = ({ handleQueryChange, query, handleDateChange }) => {
  return (
    <div className="__jd_main-cashbook--filter">
      <Select
        defaultValue={query}
        style={{ width: 150, marginRight: "2rem" }}
        onChange={handleQueryChange}
        value={query}
      >
        <Option value="all">All</Option>
        <Option value="expenditure">Expenditures</Option>
        <Option value="wages">Wages</Option>
        <Option value="sales">Sales</Option>
      </Select>
      {/* <DatePicker onChange={handleDateChange} /> */}
    </div>
  );
};

export default CashBookFilter;
