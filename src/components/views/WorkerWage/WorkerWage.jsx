import React, { useState } from "react";
import { Divider } from "antd";

import HeaderTextComponent from "../../includes/Texts/HeaderTextComponent";
import { SearchInput } from "../../includes/InputComponent/InputComponent";
import TableComponent from "../../includes/Table/TableComponent";
import { WorkerAddForm } from "./WorkerAddForm";
import { workers } from "../../../app/firebase";
import getFormattedDate from "../../../utils/getFormattedDate";
import history from "../../../utils/history";
import useFetchFromDB from "../../../hooks/useFetchFromDB";

const columns = [
  {
    title: "SN",
    dataIndex: "sn",
    key: "sn",
  },
  {
    title: "Worker Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Phone no.",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
  {
    title: "Last paid",
    dataIndex: "lastPaid",
    key: "lastPaid",
    render: (date) => (date ? getFormattedDate(date) : "July 15"),
  },
];

const WorkerWage = () => {
  const [query, setQuery] = useState("");

  // eslint-disable-next-line
  const [data, loading, error] = useFetchFromDB(
    workers.where(
      "keywords",
      "array-contains",
      query[0] ? query.toLowerCase() : " "
    )
  );

  return (
    <div className="__jd_main-workerWage">
      <HeaderTextComponent>Employer wage</HeaderTextComponent>
      <SearchInput
        placeholder="Search worker"
        value={query}
        handleChange={setQuery}
      />
      <TableComponent
        columns={columns}
        data={data}
        onRowPress={(data) => history.push(`worker-wage/${data.id}`)}
        loading={loading}
      />
      <Divider />
      <WorkerAddForm />
    </div>
  );
};

export default WorkerWage;
