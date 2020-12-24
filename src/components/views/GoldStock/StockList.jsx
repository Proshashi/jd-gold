import { Popconfirm } from "antd";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { exports } from "../../../app/firebase";
import useFetchFromDb from "../../../hooks/useFetchFromDB";
import { getFormattedTimeDate } from "../../../utils/getFormattedDate";
import { tolaToGram, tolaToLaal } from "../../../utils/unitConversions";
import GoBack from "../../includes/GoBack/GoBack";
import TableComponent from "../../includes/Table/TableComponent";
import Lost from "../404/Lost";

function getColumns(itemsUnit, handleDelete) {
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
      render: (date) => (date ? getFormattedTimeDate(date) : "-"),
    },
    {
      title: "Worker",
      dataIndex: "worker",
      key: "worker",
      render: (data) => <div> {data.workerName}</div>,
    },

    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: `Weight (${itemsUnit === "tola" ? "laal" : "gram"})`,
      key: "amount",
      dataIndex: "amount",
      render: (data) =>
        itemsUnit === "tola"
          ? Number(tolaToLaal(data)).toFixed(4)
          : Number(tolaToGram(data)).toFixed(4),
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
      fixed: "right",
      render: (data, row) => (
        <Popconfirm
          title="Are you sure?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleDelete(row)}
        >
          <div style={{ color: "red" }}>Delete</div>
        </Popconfirm>
      ),
    },
  ];
}

const handleDelete = async (data) => {
  try {
    await exports.doc(data.id).delete();
  } catch (err) {
    console.log(err);
  }
};

const StockList = ({ match }) => {
  const stockItem = ["gold", "silver", "diamond"];
  const itemName = match.params.id;
  const { itemsUnit } = useSelector((state) => state.dashboard);
  const [data, setData] = useState();

  // eslint-disable-next-line
  const [exportsData, exportsLoading, exportsError] = useFetchFromDb(
    exports.where("givenMaterial", "==", itemName).orderBy("date", "desc")
  );

  useEffect(() => {
    if (exportsData) {
      setData(exportsData);
    }
  }, [exportsData]);

  if (!stockItem.includes(itemName)) {
    return <Lost />;
  }

  return (
    <div className="__jd_main-goldStock--detail">
      <GoBack />
      <div className="__jd_main-goldStock--detail__title">
        <span className="__jd_main-goldStock--detail__title_name">
          {itemName}
        </span>
        {"  "}exports
      </div>
      <TableComponent
        data={data}
        loading={exportsLoading}
        columns={getColumns(itemsUnit, handleDelete)}
      />
    </div>
  );
};

export default StockList;
