import React, { useEffect } from "react";
import { Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChartOutlined,
  FieldNumberOutlined,
  EditOutlined,
} from "@ant-design/icons";

import HeaderTextComponent from "../../includes/Texts/HeaderTextComponent";
import { signOut } from "../Auth/authActions";
import Chart from "../../includes/Chart/Chart";
import useFetchFromDb from "../../../hooks/useFetchFromDB";
import { sales, items, stocks } from "../../../app/firebase";
import DashboarCard from "./DashboarCard";
import moment from "moment";
import { useState } from "react";
import Modal from "antd/lib/modal/Modal";
import InputComponent from "../../includes/InputComponent/InputComponent";
import ButtonComponent from "../../includes/Button/Button";
import { GRAM_VALUE } from "../../../utils/unitConversions";
// import { setDashboardStockUnit } from "./dashboardSlice";

// const { Option } = Select;

const getTodaysData = (data) => {
  const todayDate = moment(new Date()).format("MMM Do YY");

  let todaysSales = 0;
  let todaysEarning = 0;
  data.forEach((data) => {
    if (moment(data.dateAdded.toDate()).format("MMM Do YY") === todayDate) {
      todaysSales += data.finalSales.length;
      todaysEarning += data.paid;
    }
  });

  return [todaysSales, todaysEarning];
};

const Dashboard = () => {
  const dispatch = useDispatch();

  const [todaysData, setTodaysData] = useState();

  // eslint-disable-next-line
  const [salesData, loading, error] = useFetchFromDb(
    sales.orderBy("dateAdded", "desc")
  );

  // eslint-disable-next-line
  const [lowStockData, stockLoading, stockError] = useFetchFromDb(
    items.where("quantity", "<", 5)
  );

  const [modalShown, setModalShown] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [itemPrice, setItemPrice] = useState(null);

  const { stockData, itemsUnit } = useSelector((state) => state.dashboard);

  const { gold, silver, diamond } = stockData;

  // function handleUnitChange(data) {
  //   dispatch(setDashboardStockUnit(data));
  //   localStorage.setItem("dataUnit", data);
  // }

  useEffect(() => {
    if (salesData) {
      setTodaysData(getTodaysData(salesData));
    }
  }, [salesData]);

  const PriceItem = ({ icon, name, price, style }) => {
    return (
      <div className="__jd_main-dashboard--chart__prices_item" style={style}>
        <div className="__jd_main-dashboard--chart__prices_item-label">
          <div className="__jd_main-dashboard--chart__prices_item-label--icon">
            {icon}
          </div>
          <div className="__jd_main-dashboard--chart__prices_item-label--name">
            {name}
          </div>
        </div>
        <div className="__jd_main-dashboard--chart__prices_item-detail">
          Rs. {price}
        </div>
        <EditOutlined
          className="__jd_main-dashboard--chart__prices_item-edit"
          onClick={() => {
            setModalData({ name, price });
            setModalShown(true);
          }}
        />
      </div>
    );
  };

  return (
    <div className="__jd_main-dashboard">
      <Modal
        visible={modalShown}
        onCancel={() => setModalShown(false)}
        closable
        maskClosable
        destroyOnClose
        footer={null}
      >
        <div>
          <h2>{modalData && modalData.name}</h2>
          <div>Previous rate: {modalData && modalData.price}</div>
          <InputComponent
            placeholder="New price"
            type="number"
            style={{ width: "15rem" }}
            inputStyle={{ fontSize: "12px" }}
            handleChange={(value) => {
              setItemPrice({
                item: modalData && modalData.name.toLowerCase(),
                price:
                  itemsUnit === "tola"
                    ? Number(value)
                    : Number(value / GRAM_VALUE),
              });
            }}
          />
          <ButtonComponent
            handlePress={async () => {
              try {
                const res = await stocks
                  .where("name", "==", modalData.name.toLowerCase())
                  .limit(1)
                  .get();

                res.forEach(async (doc) => {
                  stocks.doc(doc.id).update({
                    stockPricePerUnit: itemPrice.price,
                  });
                });
                setModalShown(false);
                message.success("Stock updated", 2);
              } catch (error) {
                console.log(error);
              }
            }}
            text="Update price"
            style={{
              fontSize: "12px",
              width: "15rem",
              margin: 0,
              padding: "1rem",
            }}
          />
        </div>
      </Modal>
      <HeaderTextComponent style={{ fontSize: "25px" }}>
        Today
      </HeaderTextComponent>
      <Button
        type="link"
        className="__jd_main-dashboard--logout"
        onClick={() => dispatch(signOut())}
      >
        Log Out
      </Button>
      <div className="__jd_main-dashboard--cards">
        <DashboarCard
          value={lowStockData && lowStockData.length}
          label="Low  Stocks"
          colorPrimary="#ff7675"
          icon={<LineChartOutlined />}
          tootltipTitle="For items less then 5"
        />

        <DashboarCard
          value={todaysData && todaysData[0]}
          label="Sales today"
          colorPrimary="#F0D500"
          icon={<FieldNumberOutlined />}
        />
        <DashboarCard
          value={todaysData && todaysData[1]}
          label="Total earninigs today"
          colorPrimary="gray"
          icon={
            <img
              src="./images/icons/rupeeDashboard.png"
              alt="Earnings"
              height="50px"
              width="50px"
            />
          }
          tootltipTitle={todaysData && `Rs. ${todaysData[1]}`}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <HeaderTextComponent
          style={{ fontSize: "2rem", margin: "5rem 0 2rem 2rem" }}
        >
          Weekly Sales Chart
        </HeaderTextComponent>
        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "2rem 0 0 0",
          }}
        >
          <div style={{ fontSize: "2rem" }}>Unit in:</div>
          <Select
            defaultValue={localStorage.getItem("dataUnit") || "tola"}
            style={{ width: "10rem", marginLeft: "1rem" }}
            onChange={handleUnitChange}
          >
            <Option value="tola">Tola</Option>
            <Option value="gram">Gram</Option>
          </Select>
        </div> */}
      </div>

      <div className="__jd_main-dashboard--chart">
        <div className="__jd_main-dashboard--chart__graph">
          <Chart />
        </div>
        {/* <div className="__jd_main-dashboard--chart__labeling">
          <div className="__jd_main-dashboard--chart__labeling_item">
            <div className="__jd_main-dashboard--chart__labeling_item-label">
              Sales
            </div>
            <div className="__jd_main-dashboard--chart__labeling_item-box sales"></div>
          </div>
          <div className="__jd_main-dashboard--chart__labeling_item">
            <div className="__jd_main-dashboard--chart__labeling_item-label">
              Imports
            </div>
            <div className="__jd_main-dashboard--chart__labeling_item-box imports"></div>
          </div>
        </div> */}
        <div className="__jd_main-dashboard--chart__prices">
          <h3 className="__jd_main-dashboard--chart__prices_heading">
            Prices today
          </h3>
          {/* Gold */}
          <Modal />
          <PriceItem
            icon={<img src="./images/icons/gold.svg" alt="" height="50" />}
            name="Gold"
            price={
              gold &&
              (itemsUnit === "tola"
                ? gold.stockPricePerUnit
                : Number(gold.stockPricePerUnit / GRAM_VALUE).toFixed(4))
            }
            style={{ color: "#e2b754" }}
          />

          {/* Silver */}
          <PriceItem
            icon={<img src="./images/icons/silver.svg" alt="" height="50" />}
            name="Silver"
            price={
              silver &&
              (itemsUnit === "tola"
                ? silver.stockPricePerUnit
                : Number(silver.stockPricePerUnit / GRAM_VALUE).toFixed(4))
            }
            style={{ color: "#c0c0c0" }}
          />

          {/* Diamond */}
          <PriceItem
            icon={<img src="./images/icons/diamond.png" alt="" height="50" />}
            name="Diamond"
            price={diamond && diamond.stockPricePerUnit}
            style={{ color: "#9ac5db" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
