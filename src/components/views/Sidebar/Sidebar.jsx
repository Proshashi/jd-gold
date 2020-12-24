import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  StockOutlined,
  ProfileOutlined,
  BookOutlined,
  FileSearchOutlined,
  DoubleLeftOutlined,
} from "@ant-design/icons";
import { Select } from "antd";
import moment from "moment";
import Clock from "react-live-clock";

import {
  DashboardIcon,
  CreditsIcon,
  GoldStockIcon,
  SalesIcon,
  ItemsIcon,
  ImportsIcon,
  CustomersIcon,
  CashBookIcon,
  CashBookIconNepali,
} from "../../includes/Icons/Icons";
import firebase from "../../../app/firebase";
import { setDashboardStockUnit } from "../Dashboard/dashboardSlice";
import { useFetchDocFromDb } from "../../../hooks/useFetchFromDB";
// import { numbersCollection } from "../../../app/firebase";
import { setCashBookCash } from "../CashBook/cashBookSlice";
import Calculator from "../Dashboard/Calculator";

const { Option } = Select;

const routeLists = (userData) => [
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    route: "/",
    exact: true,
    hidden: false,
  },
  {
    title: "Items",
    icon: <ItemsIcon />,
    route: "/items",
    hidden: userData === "root@jagatradevi.com" ? true : false,
  },
  {
    title: "All time Sales",
    icon: <SalesIcon />,
    route: "/sales",
    hidden: userData === "root@jagatradevi.com" ? true : false,
  },
  {
    title: "Credits",
    icon: <CreditsIcon />,
    route: "/credits",
    hidden: userData === "root@jagatradevi.com" ? true : false,
  },
  {
    title: "Imports",
    icon: <ImportsIcon />,
    route: "/imports",
    hidden: userData === "root@jagatradevi.com" ? true : false,
  },
  {
    title: "Customers",
    icon: <CustomersIcon />,
    route: "/customers",
    hidden: false,
  },
  {
    title: "Employer Stocks",
    icon: <StockOutlined />,
    route: "/worker-stock",
    hidden: false,
  },
  {
    title: "Employer Wages",
    icon: <StockOutlined />,
    route: "/worker-wage",
    hidden: false,
  },
  {
    title: "Items Stock",
    icon: <GoldStockIcon />,
    route: "/goldstock",
    hidden: userData === "root@jagatradevi.com" ? true : false,
  },
  {
    title: "Daily Expenses",
    icon: <CashBookIcon />,
    route: "/dailyexpenses",
    hidden: false,
  },
  {
    title: "Audit",
    icon: <FileSearchOutlined />,
    route: "/audit",
    hidden: userData === "root@jagatradevi.com" ? true : false,
  },
  {
    title: "Billing",
    icon: <ProfileOutlined />,
    route: "/bill",
    hidden: false,
  },
  {
    title: "Cash Book",
    icon: <CashBookIconNepali />,
    route: "/cashbook",
    hidden: false,
  },
  {
    title: "Day Book",
    icon: <BookOutlined />,
    route: "/daybook",
    hidden: false,
  },
];

const LinkItem = ({ title, path, icon, exact, collapsed, hidden }) => {
  if (hidden) {
    return null;
  }
  return (
    <NavLink
      className="__jd_sidebar-menu--item"
      to={path}
      activeClassName="__jd_sidebar-menu--item__active"
      exact={exact}
    >
      <div className="__jd_sidebar-menu--item__icon">{icon}</div>
      <div
        className="__jd_sidebar-menu--item__title"
        style={{ opacity: collapsed && 0 }}
      >
        {title}
      </div>
    </NavLink>
  );
};

const Sidebar = ({ setSidebarCollapsed }) => {
  const unit = localStorage.getItem("dataUnit");
  const [collapsed, setCollapsed] = useState(false);
  const [totalCash, setTotalCash] = useState();
  const [userData, setUserData] = useState();

  // eslint-disable-next-line
  const [data, loading, error] = useFetchDocFromDb("numbers", "cashbook");

  // eslint-disable-next-line
  const [user, userLoading, userError] = useAuthState(firebase.auth());

  const dispatch = useDispatch();

  useEffect(() => {
    if (unit) {
      dispatch(setDashboardStockUnit(unit));
    } else {
      dispatch(setDashboardStockUnit("tola"));
      localStorage.setItem("dataUnit", "tola");
    }

    if (data) {
      setTotalCash(data.cash);
      dispatch(setCashBookCash(totalCash));
    }

    if (user) {
      setUserData(user.email);
    }
  }, [unit, data, totalCash, user, dispatch]);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
    setSidebarCollapsed(!collapsed);
  };

  const handleUnitChange = (data) => {
    dispatch(setDashboardStockUnit(data));
    localStorage.setItem("dataUnit", data);
  };

  return (
    <div className="__jd_sidebar" style={{ width: collapsed && "60px" }}>
      <div className="__jd_sidebar-header">
        <div className="__jd_sidebar-header--logo">
          <img
            src="./images/logo2.png"
            alt="Logo"
            style={{
              height: collapsed && "60px",
              paddingTop: collapsed && "2rem",
            }}
          />
        </div>
        <div
          className="__jd_sidebar-header--date"
          style={{ opacity: collapsed && 0 }}
        >
          {moment(new Date()).format("LL")}
          <br />
          {/* {moment(new Date()).format("LTS")} */}
          <Clock format={"LT"} ticking={true} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: collapsed && 0,
          transition: "all ease-in-out 0.25s",
        }}
      >
        <div className="__jd_sidebar-header--unit">
          <Select
            defaultValue={localStorage.getItem("dataUnit") || "tola"}
            style={{ width: "10rem", marginLeft: "1rem" }}
            onChange={handleUnitChange}
          >
            <Option value="tola">Tola</Option>
            <Option value="gram">Gram</Option>
          </Select>
        </div>
        <Calculator />
      </div>

      <div className="__jd_sidebar-menu">
        {routeLists(userData).map(
          ({ title, icon, route, exact, hidden }, key) => (
            <LinkItem
              title={title}
              path={route}
              icon={icon}
              key={key}
              exact={exact || false}
              collapsed={collapsed}
              hidden={hidden}
            />
          )
        )}
      </div>
      <div className="__jd_sidebar-collapse" onClick={handleCollapse}>
        <DoubleLeftOutlined
          style={{ transform: collapsed && "rotateY(180deg)" }}
          className="__jd_sidebar-collapse--icon"
        />
      </div>
    </div>
  );
};

export default Sidebar;
