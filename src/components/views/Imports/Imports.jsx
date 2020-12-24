import React, { useEffect, useState } from "react";
import HeaderTextComponent from "../../includes/Texts/HeaderTextComponent";
import {
  SearchInput,
  InputLabelComponent,
} from "../../includes/InputComponent/InputComponent";
import TableComponent from "../../includes/Table/TableComponent";
import { getFormattedTimeDate } from "../../../utils/getFormattedDate";
import ButtonComponent from "../../includes/Button/Button";
import history from "../../../utils/history";
import useFetchFromDb from "../../../hooks/useFetchFromDB";
import firebase, { imports } from "../../../app/firebase";

import {
  GRAM_VALUE,
  tolaToGram,
  tolaToLaal,
} from "../../../utils/unitConversions";
import { useSelector } from "react-redux";
import Form from "antd/lib/form/Form";
import Modal from "antd/lib/modal/Modal";
import { Popconfirm, Popover } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function getColumns(itemsUnit, handleEdit) {
  return [
    {
      title: "SN",
      dataIndex: "sn",
      key: "sn",
    },
    {
      title: "Particular",
      dataIndex: "itemName",
      key: "itemName",
      render: (data, rowData) => {
        const popOverData = (
          <div>
            {rowData.creditHistory &&
              rowData.creditHistory.map(({ paid, date }) => {
                return (
                  <div key={paid + date}>
                    <strong style={{ fontSize: "1.5rem" }}>Paid:</strong> Rs.{" "}
                    {paid} &nbsp;
                    <strong style={{ fontSize: "1.5rem" }}>Date:</strong>{" "}
                    {getFormattedTimeDate(date)}
                  </div>
                );
              })}
          </div>
        );
        return (
          <Popover title={data} content={popOverData}>
            <div>{data}</div>
          </Popover>
        );
      },
    },
    {
      title: "C. Name",
      dataIndex: "customerName",
      key: "customerName",
      render: (data, rowData) => {
        return <div className="__jd_table-rowOverflow">{data}</div>;
      },
    },
    {
      title: "Date added",
      dataIndex: "dateAdded",
      key: "dateAdded",
      render: (date) => (date ? getFormattedTimeDate(date) : "-"),
    },
    {
      title: `Quantity (${itemsUnit})`,
      key: "quantity",
      dataIndex: "quantity",
      render: (data) =>
        itemsUnit === "tola"
          ? Number(tolaToLaal(data)).toFixed(4)
          : Number(tolaToGram(data)).toFixed(4),
    },
    {
      title: "Price per unit",
      dataIndex: "pricePerUnit",
      key: "pricePerUnit",
      render: (data) =>
        itemsUnit === "tola"
          ? `Rs. ${data}`
          : `Rs. ${Number(data / GRAM_VALUE).toFixed(4)}`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (data) => `Rs. ${data}`,
    },
    {
      title: "Paid",
      dataIndex: "paid",
      key: "paid",
      render: (data) => `Rs. ${data}`,
    },
    {
      title: "Remaining",
      dataIndex: "remaining",
      key: "remaining",
      render: (data) => `Rs. ${data}`,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      render: (data, row) => (
        <div style={{ color: "blue" }} onClick={() => handleEdit(row)}>
          Edit
        </div>
      ),
    },
  ];
}

const Imports = () => {
  const [query, setQuery] = useState("");
  const { itemsUnit } = useSelector((state) => state.dashboard);
  const [importData, setImportData] = useState();

  // eslint-disable-next-line
  const [data, loading, error] = useFetchFromDb(
    imports
      .where("keywords", "array-contains", query[0] ? query.toLowerCase() : " ")
      .orderBy("dateAdded", "desc")
  );

  const [modalShown, setModalShown] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [paid, setPaid] = useState(0);

  useEffect(() => {
    if (data) {
      setImportData(data);
    }
  }, [data]);

  const handleEdit = (data) => {
    setModalShown(true);
    setModalData(data);
    setPaid(0);
  };

  return (
    <div className="__jd_main-imports">
      <HeaderTextComponent>Imports</HeaderTextComponent>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <SearchInput
          placeholder="Search imports by customer"
          value={query}
          handleChange={setQuery}
        />
        <ButtonComponent
          text="Add import +"
          handlePress={() => history.push("/imports/add")}
        />
      </div>
      <Modal
        visible={modalShown}
        footer={null}
        onCancel={() => {
          setModalShown(false);
          setModalData(null);
        }}
      >
        <h1>Imports edit</h1>
        <div>Remaining amount: Rs: {modalData && modalData.remaining}</div>
        <Form>
          <InputLabelComponent
            title="Remaining Paid"
            placeholder="Eg. Rs. 5000"
            style={{ width: "30vw" }}
            value={paid}
            handleChange={setPaid}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <ButtonComponent
              text="Update"
              handlePress={async () => {
                setModalShown(false);
                await imports.doc(modalData.id).update({
                  paid: firebase.firestore.FieldValue.increment(Number(paid)),
                  remaining: firebase.firestore.FieldValue.increment(
                    -1 * Number(paid)
                  ),
                  creditHistory: firebase.firestore.FieldValue.arrayUnion({
                    paid: Number(paid),
                    date: firebase.firestore.Timestamp.fromDate(new Date()),
                  }),
                });
                setModalData(null);
                setPaid(0);
              }}
            />
            <Popconfirm
              title="Are you sure you want to delete this?"
              onConfirm={async () => {
                setModalShown(false);
                await imports.doc(modalData.id).delete();
                setModalData(null);
                setPaid(0);
              }}
            >
              <DeleteOutlined color="red" style={{ fontSize: "2rem" }} />
            </Popconfirm>
          </div>
        </Form>
      </Modal>
      <TableComponent
        columns={getColumns(itemsUnit, handleEdit)}
        data={importData}
        loading={loading}
        scroll={{ x: "max-content" }}
        sticky
      />
    </div>
  );
};

export default Imports;
