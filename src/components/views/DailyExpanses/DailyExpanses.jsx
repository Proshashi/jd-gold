import React from "react";
import HeaderTextComponent from "../../includes/Texts/HeaderTextComponent";
import TableComponent from "../../includes/Table/TableComponent";
import getFormattedDate from "../../../utils/getFormattedDate";
import DailyExpansesForm from "./DailyExpansesForm";
import { Divider } from "antd";
import useFetchFromDb from "../../../hooks/useFetchFromDB";
import { expanses } from "../../../app/firebase";
import moment from "moment";

// SN
// Date
// Description
// Cash
// Remark

const columns = [
  {
    title: "SN",
    dataIndex: "sn",
    key: "sn",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (date) => (date ? getFormattedDate(date) : "-"),
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },

  {
    title: "Cost",
    key: "cost",
    dataIndex: "cost",
    render: (cost) => `Rs. ${cost}`,
  },
  {
    title: "Remark",
    key: "remark",
    dataIndex: "remark",
  },
];

function getTodaysData(data) {
  const todayDate = moment(new Date()).format("MMM Do YY");
  let arr = [];

  let counter = 1;

  data.forEach((data) => {
    if (moment(data.date.toDate()).format("MMM Do YY") === todayDate) {
      arr.push({ ...data, sn: counter });
      counter += 1;
    }
  });

  return arr;
}

const CashBook = () => {
  // eslint-disable-next-line
  const [data, loading, error] = useFetchFromDb(expanses);

  return (
    <div className="__jd_main-dailyExpanses">
      <HeaderTextComponent>Daily Expenses</HeaderTextComponent>
      <br />
      <TableComponent
        columns={columns}
        loading={loading}
        data={data && getTodaysData(data)}
      />
      <Divider />
      <DailyExpansesForm />
    </div>
  );
};

export default CashBook;
