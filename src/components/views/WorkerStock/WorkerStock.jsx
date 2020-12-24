import React, { useState } from "react";
import HeaderTextComponent from "../../includes/Texts/HeaderTextComponent";
import { SearchInput } from "../../includes/InputComponent/InputComponent";
import TableComponent from "../../includes/Table/TableComponent";
import history from "../../../utils/history";
import WorkerStockForm from "./WorkerStockForm";
import { workers } from "../../../app/firebase";
import useFetchFromDB from "../../../hooks/useFetchFromDB";
import { Divider } from "antd";
import { useEffect } from "react";

const columns = [
  {
    title: "SN",
    dataIndex: "sn",
    key: "sn",
  },
  {
    title: "Worker name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Total credit",
    dataIndex: "totalCredit",
    key: "totalCredit",
    render: (value, record) => {
      return record.stockcredit && record.stockcredit.length;
    },
  },
  {
    title: "Total debit",
    dataIndex: "totalDebit",
    key: "totalDebit",
    render: (value, record) => {
      return record.stockdebit && record.stockdebit.length;
    },
  },
];

const getWorkersWithStock = (workers) => {
  let arr = [];
  let counter = 1;
  workers.forEach((worker) => {
    // if (worker.stockcredit && worker.stockcredit[0]) {
    arr.push({ ...worker, sn: counter });
    counter += 1;
    // }
  });

  return arr;
};

const WorkerStock = () => {
  const [query, setQuery] = useState("");
  const [workersWithStock, setWorkersWithStock] = useState();

  // eslint-disable-next-line
  const [data, loading, error] = useFetchFromDB(
    workers.where(
      "keywords",
      "array-contains",
      query[0] ? query.toLowerCase() : " "
    )
  );

  useEffect(() => {
    if (data) {
      setWorkersWithStock(getWorkersWithStock(data));
    }
  }, [data]);

  return (
    <>
      <div className="__jd_main-workerStock">
        <HeaderTextComponent style={{ marginBottom: "14px" }}>
          Employer stocks
        </HeaderTextComponent>
        <SearchInput
          placeholder="Search worker"
          value={query}
          handleChange={setQuery}
        />
        <TableComponent
          columns={columns}
          data={workersWithStock}
          onRowPress={(data) => {
            history.push(`/worker-stock/${data.id}`, {
              stockData: data.stock,
            });
          }}
          loading={loading}
        />
        <Divider />
        {loading ? null : <WorkerStockForm workers={data} />}
      </div>
    </>
  );
};

export default WorkerStock;
