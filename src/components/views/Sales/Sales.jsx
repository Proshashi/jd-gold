import React, { useState, useEffect } from "react";
import { Modal, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import HeaderTextComponent from "../../includes/Texts/HeaderTextComponent";
import { SearchInput } from "../../includes/InputComponent/InputComponent";
import TableComponent from "../../includes/Table/TableComponent";
import useFetchFromDb from "../../../hooks/useFetchFromDB";
import { sales } from "../../../app/firebase";
import { getFormattedTimeDate } from "../../../utils/getFormattedDate";
import { useSelector } from "react-redux";
import { tolaToGram, tolaToLaal } from "../../../utils/unitConversions";
import SalesDetail from "./SalesDetail";
import { getCapitalName } from "../../../utils/getCapitalName";

function getColumns(itemsUnit) {
  return [
    {
      title: "SN",
      dataIndex: "sn",
      key: "sn",
    },
    {
      title: "Item Name",
      dataIndex: "name",
      key: "name",
      render: (data) => {
        return (
          <Tooltip title={data}>
            {data &&
              data.map((item, index) => {
                return <span key={item + index}> {index < 3 && item} </span>;
              })}
            {data[2] ? ` and ${data.length - 3} other ` : ""}
          </Tooltip>
        );
      },
    },
    {
      title: "C. Name",
      dataIndex: "customerName",
      key: "customerName",

      render: (data) => (
        <Tooltip title={data}>
          <div className="__jd_table-rowOverflow">{getCapitalName(data)}</div>
        </Tooltip>
      ),
    },
    {
      title: "Date",
      dataIndex: "dateAdded",
      key: "dateAdded",
      width: 300,
      render: (date) => <div>{date ? getFormattedTimeDate(date) : "-"}</div>,
    },
    // {
    //   title: "Price per unit",
    //   dataIndex: "itemPricePerUnit",
    //   key: "itemPricePerUnit",
    // },

    {
      title: `Wastage (${itemsUnit})`,
      dataIndex: "wastage",
      key: "wastage",
      render: (val, data) =>
        itemsUnit === "tola" ? tolaToLaal(val) : tolaToGram(val),
    },
    {
      title: "Stone",
      key: "stone",
      dataIndex: "stone",
      render: (data) => <div>Rs. {data}</div>,
    },

    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (data) => <div>Rs. {data}</div>,
    },
    {
      title: "Paid",
      dataIndex: "paid",
      key: "paid",
      render: (data) => <div>Rs. {data}</div>,
    },
    {
      title: "Remaining",
      dataIndex: "remaining",
      key: "remaining",
      render: (data) => <div>Rs. {data}</div>,
    },
  ];
}

// eslint-disable-next-line
const ModalListItem = ({ title, value }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", margin: "1rem 0" }}>
      <div style={{ fontSize: "1.75rem", width: "15rem" }}>{title}</div>
      <div style={{ fontSize: "1.5rem" }}>{value}</div>
    </div>
  );
};

function getSimplifiedData(sales) {
  let result = [];
  sales.forEach((sale) => {
    let wastage = 0;
    let stone = 0;
    let name = [];
    let arr = { ...sale };
    sale.finalSales &&
      sale.finalSales.forEach((data, index) => {
        wastage += data.wastage;
        stone += data.stone;
        name.push(data.itemName);
      });
    arr = { ...arr, wastage, stone, name };
    result.push(arr);
  });
  return result;
}

const Sales = () => {
  const [query, setQuery] = useState("");
  const [salesData, setSalesData] = useState();

  // eslint-disable-next-line
  const [data, loading, error] = useFetchFromDb(
    sales
      .where("keywords", "array-contains", query[0] ? query.toLowerCase() : " ")
      .orderBy("dateAdded", "desc")
  );

  const [modalShown, setModalShown] = useState(false);
  const [modalData, setModalData] = useState(null);

  const { itemsUnit } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (data) {
      setSalesData(data);
    }
  }, [data]);

  return (
    <div className="__jd_main-sales">
      <HeaderTextComponent style={{ marginBottom: "14px" }}>
        All time sales
      </HeaderTextComponent>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <SearchInput
          placeholder="Search customers"
          value={query}
          handleChange={setQuery}
        />
      </div>
      <Modal
        visible={modalShown}
        onCancel={() => {
          setModalShown(false);
          setModalData(null);
        }}
        footer={null}
        className="__jd_main-sales--modal"
      >
        <Popconfirm
          title="Are you sure you want to delete this?"
          onConfirm={async () => {
            await sales.doc(modalData.id).delete();
          }}
        >
          {" "}
          <div style={{ color: "red", cursor: "pointer" }}>
            <DeleteOutlined /> Delete
          </div>
        </Popconfirm>
        <SalesDetail modalData={modalData} />
        {/* <HeaderTextComponent
          style={{ fontSize: "2.5rem", textAlign: "center" }}
        >
          Sale Detail
        </HeaderTextComponent>

        {modalData && (
          <>
            <ModalListItem
              title="Customer name"
              value={modalData.customerName}
            />
            <ModalListItem
              title="Sale date"
              value={getFormattedTimeDate(modalData.dateAdded)}
            />
            <ModalListItem title="Item name" value={modalData.itemName} />
            <ModalListItem
              title="Price per unit"
              value={modalData.itemPricePerUnit}
            />
            <ModalListItem title="Wastage" value={modalData.wastage} />
            <ModalListItem title="Stone" value={`Rs. ${modalData.stone}`} />
            <ModalListItem title="Net weight" value={modalData.netWeight} />
            <ModalListItem title="Gross weight" value={modalData.grossWeight} />
            <ModalListItem title="Total" value={`Rs. ${modalData.total}`} />
            <ModalListItem title="Paid" value={`Rs. ${modalData.paid}`} />
          </>
        )} */}
      </Modal>

      <TableComponent
        data={salesData && getSimplifiedData(salesData)}
        columns={getColumns(itemsUnit)}
        pagination={{ pageSize: 10 }}
        loading={loading}
        onRowPress={(data) => {
          setModalShown(true);
          setModalData(data);
        }}
        scroll={{ x: "max-content" }}
        sticky
      />
    </div>
  );
};

export default Sales;
