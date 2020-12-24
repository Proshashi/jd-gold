import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "antd/lib/modal/Modal";
import Form from "antd/lib/form/Form";

import TableComponent from "../../includes/Table/TableComponent";
import HeaderTextComponent from "../../includes/Texts/HeaderTextComponent";
import { Table } from "antd";

import {
  SearchInput,
  InputLabelComponent,
} from "../../includes/InputComponent/InputComponent";
import { Divider, message, Popconfirm } from "antd";
import { AddItemForm } from "./AddItemForm";
import { items } from "../../../app/firebase";
import getFormattedDate from "../../../utils/getFormattedDate";
import useFetchFromDB from "../../../hooks/useFetchFromDB";
import ButtonComponent from "../../includes/Button/Button";
import { tolaToGram, tolaToLaal } from "../../../utils/unitConversions";
import { deleteItem } from "./itemsActions";
import { keywordsGenerator } from "../../../utils/keywordsGenerator";

function getColumns(handleModalVisible, itemsUnit, handleItemDelete) {
  return [
    {
      title: "SN",
      dataIndex: "sn",
      key: "sn",
    },
    {
      title: "Date",
      dataIndex: "dateAdded",
      key: "dateAdded",
      render: (date) => (date ? getFormattedDate(date) : "-"),
    },
    {
      title: "Particulars",
      dataIndex: "name",
      key: "name",
    },
    // {
    //   title: "Price per unit",
    //   dataIndex: "pricePerUnit",
    //   key: "pricePerUnit",
    // },
    {
      title: "Wage",
      key: "workerWage",
      dataIndex: "workerWage",
      render: (data) => `Rs. ${data}`,
    },
    {
      title: "Quantity",
      key: "quantity",
      dataIndex: "quantity",
    },
    {
      title: `Weight (${itemsUnit})`,
      key: "weight",
      dataIndex: "weight",
      render: (val, data) => {
        return itemsUnit === "tola" ? tolaToLaal(val) : tolaToGram(val);
      },
    },
    {
      title: "Actions",
      key: "action",
      dataIndex: "action",
      render: (item, data) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{ color: "#1d58ef", width: "5rem" }}
              onClick={() => handleModalVisible(true, data)}
            >
              Edit
            </div>
            <Popconfirm
              title={`Are you sure you want to delete ${data.name}?`}
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleItemDelete(data.id)}
            >
              <div style={{ color: "red", width: "5rem" }}>Delete</div>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
}

// Data format
// {
//   sn: "1",
//   name: "Gold ring",
//   pricePerUnit: 32,
//   quantity: 5,
//   dateAdded: "2077/04/10",
// },

function getItemsTotal(data) {
  console.log(data);
  let total = 0;
  data.forEach((d) => {
    total += d.weight;
  });

  return total;
}

const Items = () => {
  const [query, setQuery] = useState("");

  // eslint-disable-next-line
  const [data, loading, error] = useFetchFromDB(
    items
      .where("keywords", "array-contains", query[0] ? query.toLowerCase() : " ")
      .orderBy("dateAdded")
  );

  const [modalShown, setModalShown] = useState(false);
  const [addItemModalShown, setAddItemModalShown] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [itemName, setItemName] = useState("");
  const [workerWage, setWorkerWage] = useState("");
  const [totalItemWeight, setTotalItemWeight] = useState(0);

  const { itemsUnit } = useSelector((state) => state.dashboard);

  const dispatch = useDispatch();

  useEffect(() => {
    if (data && data[0]) {
      setTotalItemWeight(getItemsTotal(data));
    }
  }, [data]);

  // useEffect(() => {
  //   (async function () {
  //     const d = await workers.get();
  //     d.forEach((doc) => {
  //       const data = doc.data();
  //       const id = doc.id;
  //       workers.doc(id).update({ keywords: keywordsGenerator(data.name) });
  //     });
  //   })();
  // }, []);

  const handleModalVisible = (visisble, data) => {
    setModalShown(visisble);
    setModalData(data);
    setItemName(data.name);
    setWorkerWage(data.workerWage);
  };

  const handleItemDelete = (id) => {
    dispatch(deleteItem(id));
  };

  return (
    <div className="__jd_main-items">
      <HeaderTextComponent
        style={{
          marginBottom: "14px",
        }}
      >
        Jewelery Items
      </HeaderTextComponent>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <SearchInput
          placeholder="Search items"
          value={query}
          handleChange={setQuery}
        />

        <ButtonComponent
          text="Add item"
          onClick={() => setAddItemModalShown(true)}
        />
      </div>

      <Modal
        visible={addItemModalShown}
        onCancel={() => setAddItemModalShown(false)}
        footer={null}
        maskClosable={false}
      >
        <AddItemForm hideModal={() => setAddItemModalShown(false)} />
      </Modal>

      <Modal
        visible={modalShown}
        onCancel={() => {
          setModalShown(false);
          setModalData(null);
        }}
        footer={null}
      >
        {modalData && (
          <Form>
            <InputLabelComponent
              placeholder="Name"
              title="Item name"
              value={itemName}
              handleChange={setItemName}
              required
            />
            <InputLabelComponent
              placeholder="Worker wage"
              title="Worker wage"
              value={workerWage}
              handleChange={setWorkerWage}
              required
            />
            <ButtonComponent
              text="Update item"
              handlePress={async () => {
                setModalShown(false);
                setModalData(null);
                await items.doc(modalData.id).update({
                  name: itemName,
                  workerWage: Number(workerWage),
                  keywords: keywordsGenerator(itemName),
                });
                message.success("Item updated", 2);
              }}
            />
          </Form>
        )}
      </Modal>

      <TableComponent
        data={data}
        columns={getColumns(handleModalVisible, itemsUnit, handleItemDelete)}
        pagination={{ pageSize: 10 }}
        loading={loading}
        className="__jd_main-items--table"
        summary={() => {
          return (
            <Table.Summary.Row
              style={{
                borderTop: "5px #ccc solid !important",
              }}
            >
              <Table.Summary.Cell></Table.Summary.Cell>
              <Table.Summary.Cell></Table.Summary.Cell>
              <Table.Summary.Cell></Table.Summary.Cell>
              <Table.Summary.Cell></Table.Summary.Cell>
              <Table.Summary.Cell></Table.Summary.Cell>
              <Table.Summary.Cell>
                <div
                  style={{
                    fontSize: "1.5rem",
                    color: "#222537",
                    borderLeft: "1px #ccc solid",
                    textAlign: "center",
                    padding: "1rem 0",
                  }}
                >
                  <strong> Total weight:</strong>{" "}
                  {itemsUnit === "tola"
                    ? `${tolaToLaal(totalItemWeight)} laal`
                    : `${tolaToGram(totalItemWeight)} gram`}
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell></Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />

      <Divider />
      {/* <UpdateItemForm /> */}
    </div>
  );
};

export default Items;
