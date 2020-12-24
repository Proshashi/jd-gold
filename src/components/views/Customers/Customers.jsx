import React from "react";
import { List } from "antd";

import HeaderTextComponent from "../../includes/Texts/HeaderTextComponent";
import CustomerCard from "./CustomerCard";
import CustomerAddForm from "./CustomerAddForm";
import { SearchInput } from "../../includes/InputComponent/InputComponent";
import useFetchFromDb from "../../../hooks/useFetchFromDB";
import { customers } from "../../../app/firebase";
import { useEffect } from "react";
import { useState } from "react";

const Customers = () => {
  const [query, setQuery] = useState("");
  const [customerData, setCustomerData] = useState();

  // eslint-disable-next-line
  const [data, loading, error] = useFetchFromDb(
    customers
      .where("keywords", "array-contains", query[0] ? query.toLowerCase() : " ")
      .orderBy("dateAdded")
  );

  useEffect(() => {
    if (data) {
      setCustomerData(data);
    }
  }, [data]);

  return (
    <div className="__jd_main-customers">
      <HeaderTextComponent
        style={{
          marginBottom: "14px",
        }}
      >
        Customers
      </HeaderTextComponent>

      <SearchInput
        placeholder="Search customer"
        value={query}
        handleChange={setQuery}
      />

      <List
        className="__jd_main-customers--cards"
        dataSource={customerData}
        pagination={{ pageSize: 5 }}
        loading={loading}
        renderItem={(item) => {
          return <CustomerCard data={item} />;
        }}
      />
      <CustomerAddForm />
    </div>
  );
};

export default Customers;
