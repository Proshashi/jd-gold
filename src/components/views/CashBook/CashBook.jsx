import React, { useEffect, useState } from "react";
import { Divider, Popconfirm } from "antd";

import { cashbook } from "../../../app/firebase";
import useFetchFromDb, {
  useFetchDocFromDb,
} from "../../../hooks/useFetchFromDB";
import CashBookFilter from "./CashBookFilter";
import getFormattedDate from "../../../utils/getFormattedDate";
import TableComponent from "../../includes/Table/TableComponent";
import HeaderTextComponent from "../../includes/Texts/HeaderTextComponent";
import CashBookAdd from "./CashBookAdd";

function getColumns(handleOptionDelete) {
  return [
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
      title: "Debit amount",
      dataIndex: "debit",
      key: "debit",
      render: (data) => (data ? data : "-"),
    },
    {
      title: "Credit amount",
      dataIndex: "credit",
      key: "credit",
      render: (data) => (data ? data : "-"),
    },
    {
      title: "Balance amount",
      dataIndex: "balance",
      key: "balance",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      fixed: "right",
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
      fixed: "right",

      render: (text, record) => {
        return (
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => {
              handleOptionDelete(record.id);
            }}
          >
            {" "}
            <div style={{ color: "red" }}>Delete</div>
          </Popconfirm>
        );
      },
    },
  ];
}

function getParsedData(data, cashData) {
  let arr = [];
  let balanceAmount = 0;
  data.forEach((item) => {
    balanceAmount =
      item.type === "debit"
        ? balanceAmount + item.amount
        : balanceAmount - item.amount;
    arr.push({ ...item, [item.type]: item.amount, balance: balanceAmount });
  });

  return arr;
}

const CashBook = () => {
  const [query, setQuery] = useState("all");
  // eslint-disable-next-line
  const [date, setDate] = useState(null);
  const [cashBook, setCashBook] = useState([]);

  // eslint-disable-next-line
  const [data, loading, error] = useFetchFromDb(
    !query || query === "all"
      ? cashbook.orderBy("date", "desc")
      : cashbook.where("category", "==", query).orderBy("date", "desc")
  );

  // eslint-disable-next-line
  const [
    cashCollectionData,
    cashCollectionLoading,
    cashCollectionError,
  ] = useFetchDocFromDb("numbers", "cashbook");

  console.log(cashCollectionLoading, cashCollectionError);

  useEffect(() => {
    if (data && cashCollectionData) {
      setCashBook(getParsedData(data, cashCollectionData));
    }
  }, [data, cashCollectionData]);

  const handleSelectChange = (data) => {
    setQuery(data);
  };

  const handleOptionDelete = async (id) => {
    await cashbook.doc(id).delete();
  };

  return (
    <div className="__jd_main-cashbook">
      <HeaderTextComponent>Cash Book</HeaderTextComponent>

      <div style={{ fontSize: "1.75rem", textAlign: "right" }}>
        Total cash in stock: &nbsp;
        <span style={{ fontWeight: "bold" }}>
          Rs. {cashBook[0] && cashBook[cashBook.length - 1].balance}
        </span>
      </div>
      <CashBookFilter query={query} handleQueryChange={handleSelectChange} />
      <TableComponent
        columns={getColumns(handleOptionDelete)}
        loading={loading}
        data={data && cashBook}
        scroll={{ x: "max-content" }}
        sticky
      />
      <Divider />
      <CashBookAdd />
    </div>
  );
};

export default CashBook;
