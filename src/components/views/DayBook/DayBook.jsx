import React, { useState, useEffect } from "react";
import HeaderTextComponent from "../../includes/Texts/HeaderTextComponent";
import { useSelector } from "react-redux";
import useFetchFromDb from "../../../hooks/useFetchFromDB";
import moment from "moment";
import { sales } from "../../../app/firebase";
import TableComponent from "../../includes/Table/TableComponent";
import getFormattedDate from "../../../utils/getFormattedDate";
import Modal from "antd/lib/modal/Modal";
import { tolaToGram, tolaToLaal } from "../../../utils/unitConversions";
import { Tooltip } from "antd";

function getColumns(stockData, itemsUnit) {
  return [
    {
      title: "SN",
      dataIndex: "sn",
      key: "sn",
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Particular",
      dataIndex: "itemName",
      key: "itemName",
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
      title: "Date",
      dataIndex: "dateAdded",
      key: "dateAdded",
      render: (date) => (date ? getFormattedDate(date) : "-"),
    },
    {
      title: `Wastage (${itemsUnit})`,
      dataIndex: "wastage",
      key: "wastage",
      render: (val, data) => {
        return itemsUnit === "tola" ? tolaToLaal(val) : tolaToGram(val);
      },
    },

    {
      title: "Wage",
      key: "workerWage",
      dataIndex: "workerWage",
      render: (cost) => `Rs. ${cost}`,
    },
    {
      title: "Profit",
      key: "profit",
      dataIndex: "profit",
      render: (data, extra) => {
        let profit = 0;

        extra.finalSales.forEach((sale) => {
          const wastage = sale.wastage;
          const workerWage = sale.workerWage;
          profit +=
            Number(wastage) * stockData[sale.itemType].stockPricePerUnit -
            Number(workerWage);
        });

        return (
          <div>
            Rs.
            {Number(profit).toFixed(4)}
          </div>
        );
      },
    },
  ];
}

function getSimplifiedData(sales) {
  let result = [];

  sales.forEach((sale) => {
    let wastage = 0;
    let stone = 0;
    let workerWage = 0;
    let itemName = [];
    let arr = { ...sale };
    sale.finalSales.forEach((data, index) => {
      wastage += data.wastage;
      stone += data.stone;
      workerWage += data.workerWage;
      itemName.push(data.itemName);
    });
    arr = { ...arr, wastage, stone, itemName, workerWage };
    result.push(arr);
  });
  return result;
}

const getTodaysData = (data) => {
  const todayDate = moment(new Date()).format("MMM Do YY");
  let arr = [];

  let counter = 1;
  data.forEach((data) => {
    if (moment(data.dateAdded.toDate()).format("MMM Do YY") === todayDate) {
      arr.push({ ...data, sn: counter });
      counter += 1;
    }
  });

  return getSimplifiedData(arr);
};

const calculateTotalProfit = (data, stockData, itemsUnit) => {
  let profit = 0;

  // data.forEach((item) => {
  //   profit += Number(item.wastage) * Number(gold) - Number(item.workerWage);
  // });
  data.forEach((item) => {
    item.finalSales.forEach((sale) => {
      profit +=
        Number(sale.wastage) *
          Number(stockData[sale.itemType].stockPricePerUnit) -
        Number(sale.workerWage);
    });
  });
  return profit;
};

const ModalListItem = ({ title, value }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        margin: "2rem  0 0 0",
        borderBottom: "1px #ccc solid",
      }}
    >
      <div style={{ fontSize: "1.75rem", width: "15rem", marginRight: "5rem" }}>
        {title}
      </div>
      <div style={{ fontSize: "1.5rem" }}>{value}</div>
    </div>
  );
};

const DayBook = () => {
  const [todaysData, setTodaysData] = useState();

  // eslint-disable-next-line
  const [salesData, loading, error] = useFetchFromDb(
    sales.orderBy("dateAdded", "desc")
  );

  const { itemsUnit, stockData } = useSelector((state) => state.dashboard);

  const columns = getColumns(stockData, itemsUnit);

  const [modalShown, setModalShown] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    if (salesData) {
      setTodaysData(getTodaysData(salesData));
    }
  }, [salesData]);

  function showModalData() {
    if (modalData) {
      const {
        customerName,
        itemName,
        wastage,
        workerWage,
        dateAdded,
        stone,
        total,
        paid,
      } = modalData;
      return (
        <div>
          <ModalListItem title="Customer name" value={customerName} />
          <ModalListItem
            title="Sale date"
            value={getFormattedDate(dateAdded)}
          />
          <ModalListItem title="Item name" value={itemName} />

          <ModalListItem title="Wastage" value={wastage} />
          <ModalListItem title="Stone" value={`Rs. ${stone}`} />
          <ModalListItem title="Worker wage" value={`Rs. ${workerWage}`} />
          <ModalListItem title="Total" value={`Rs. ${total}`} />
          <ModalListItem title="Paid" value={`Rs. ${paid}`} />
        </div>
      );
    }
  }

  return (
    <div className="__jd_main-daybook">
      <HeaderTextComponent>Day Book</HeaderTextComponent>

      <Modal
        visible={modalShown}
        onCancel={() => setModalShown(false)}
        footer={null}
        className="__jd_main-daybook--modal"
      >
        <HeaderTextComponent style={{ textAlign: "center", fontSize: "2rem" }}>
          Daybook detail
        </HeaderTextComponent>
        {showModalData()}
      </Modal>

      <TableComponent
        columns={columns}
        loading={loading}
        data={todaysData}
        footer={() => (
          <div
            style={{
              textAlign: "right",
              marginRight: "2rem",
              fontSize: "1.75rem",
            }}
          >
            Total profit: &nbsp;&nbsp;&nbsp;
            {stockData &&
              todaysData &&
              calculateTotalProfit(todaysData, stockData, itemsUnit)}
          </div>
        )}
        onRowPress={(data) => {
          setModalShown(true);
          setModalData(data);
        }}
      />
    </div>
  );
};

export default DayBook;
