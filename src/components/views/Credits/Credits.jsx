import React from "react";
import useFetchFromDb from "../../../hooks/useFetchFromDB";
import firebase, { sales, customers } from "../../../app/firebase";
import HeaderTextComponent from "../../includes/Texts/HeaderTextComponent";
import TableComponent from "../../includes/Table/TableComponent";
import { getFormattedTimeDate } from "../../../utils/getFormattedDate";
import { useState } from "react";
import { Modal, Form, message, Popover } from "antd";
import { InputLabelComponent } from "../../includes/InputComponent/InputComponent";
import ButtonComponent from "../../includes/Button/Button";
import { useSelector } from "react-redux";
import { tolaToGram, tolaToLaal } from "../../../utils/unitConversions";

const getColumns = (handleActionClick, itemsUnit) => [
  {
    title: "SN",
    dataIndex: "sn",
    key: "sn",
  },
  {
    title: "Item Name",
    dataIndex: "name",
    key: "name",
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
      console.log(rowData);
      return (
        <Popover title={data} content={popOverData}>
          {data &&
            data.map((item, index) => {
              return <span key={item + index}> {index < 3 && item} </span>;
            })}
          {data[2] ? ` and ${data.length - 3} other ` : ""}
        </Popover>
      );
    },
  },
  {
    title: "C. Name",
    dataIndex: "customerName",
    key: "customerName",

    render: (data) => (
      <div
        className="__jd_table-rowOverflow"
        style={{ textTransform: "capitalize" }}
      >
        {data}
      </div>
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
  //   title: "Price",
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
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    fixed: "right",
    render: (data, row) => (
      <div
        style={{ color: "blue" }}
        onClick={() => handleActionClick({ data: row })}
      >
        Edit
      </div>
    ),
  },
];

function getCreditsData(data) {
  const credists = data.filter((credit) => credit.remaining > 0);
  return getSimplifiedData(credists);
}

function getSimplifiedData(sales) {
  let result = [];
  let sn = 1;
  sales.forEach((sale) => {
    let wastage = 0;
    let stone = 0;
    let name = [];
    let arr = { ...sale };
    sale.finalSales.forEach((data, index) => {
      wastage += data.wastage;
      stone += data.stone;
      name.push(data.itemName);
    });
    arr = { ...arr, wastage, stone, name, sn };
    result.push(arr);
    sn += 1;
  });
  return result;
}

const Credits = () => {
  // eslint-disable-next-line
  const [data, loading, error] = useFetchFromDb(sales);

  const { itemsUnit } = useSelector((state) => state.dashboard);

  const [modalShown, setModalShown] = useState(false);
  const [modalData, setModalData] = useState(false);
  const [paid, setPaid] = useState(0);
  const [paymentError, setPaymentError] = useState(null);

  const handleActionClick = ({ data }) => {
    setModalShown(true);
    setModalData(data);
  };

  return (
    <div className="__jd_main-credits">
      <HeaderTextComponent>Credits</HeaderTextComponent>
      <Modal
        visible={modalShown}
        onCancel={() => {
          setModalShown(false);
          setModalData(null);
          setPaid(null);
        }}
        footer={null}
      >
        <Form>
          <h1>Edit credits</h1>
          <div style={{ fontSize: "1.5rem" }}>
            Customer name: {modalData && modalData.customerName}
          </div>
          <div style={{ fontSize: "1.5rem" }}>
            Date bought:{" "}
            {modalData && getFormattedTimeDate(modalData.dateAdded)}
          </div>
          <div style={{ fontSize: "1.5rem" }}>
            Items bought:{" "}
            {modalData && modalData.name.map((n) => <span> "{n}"</span>)}
          </div>
          <div style={{ fontSize: "1.5rem" }}>
            Total amount: Rs. {modalData && modalData.total}
          </div>
          <div style={{ fontSize: "1.5rem" }}>
            Paid amount: Rs. {modalData && modalData.paid}
          </div>
          <div style={{ fontSize: "1.5rem" }}>
            Remaining amount: Rs. {modalData && modalData.remaining}
          </div>
          <InputLabelComponent
            title="Remaining Paid"
            placeholder="Eg. Rs. 5000"
            style={{ width: "30vw" }}
            value={paid}
            handleChange={setPaid}
          />
          <ButtonComponent
            text="Update"
            handlePress={async () => {
              if (!modalData.remaining >= modalData.paid) {
                return setPaymentError(
                  "Paid value must be smaller then remaining"
                );
              }
              setModalShown(false);

              await sales.doc(modalData.id).update({
                remaining: firebase.firestore.FieldValue.increment(
                  -1 * Number(paid)
                ),
                paid: firebase.firestore.FieldValue.increment(Number(paid)),
                creditHistory: firebase.firestore.FieldValue.arrayUnion({
                  paid: Number(paid),
                  date: firebase.firestore.Timestamp.fromDate(new Date()),
                }),
              });

              const previousCustomerSale = (
                await customers.doc(modalData.customerId).get()
              ).data();
              await customers.doc(modalData.customerId).update({
                sales: previousCustomerSale.sales.map((sale) => {
                  if (sale.saleId === modalData.id) {
                    return {
                      ...sale,
                      remaining: modalData.remaining - Number(paid),
                      paid: sale.paid + Number(paid),
                    };
                  } else {
                    return sale;
                  }
                }),
              });
              setModalData(null);
              setPaid(0);
              message.success("Credits data updated sucessfully!", 2);
            }}
          />
          {paymentError ? (
            <div style={{ color: "red", fontSize: "14px" }}>{paymentError}</div>
          ) : null}
        </Form>
      </Modal>
      <TableComponent
        data={data && getCreditsData(data)}
        loading={loading}
        columns={getColumns(handleActionClick, itemsUnit)}
        scroll={{ x: "max-content" }}
        sticky
      />
    </div>
  );
};

export default Credits;
