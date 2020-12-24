import React, { useEffect } from "react";
import { Switch, Route, Router, Redirect } from "react-router-dom";

import { useAuthState } from "react-firebase-hooks/auth";

import history from "../utils/history";

import Sidebar from "./views/Sidebar/Sidebar";
import Auth from "./views/Auth/Auth";
import Imports from "./views/Imports/Imports";
import firebase, {
  items as itemsCollection,
  stocks as stocksCollection,
} from "../app/firebase";
import GlowLoader from "./includes/Loaders/GlowLoader";
import Lost from "./views/404/Lost";
import useFetchFromDb from "../hooks/useFetchFromDB";
import { useDispatch } from "react-redux";
import { setItemsData } from "./views/Items/itemsSlice";
import CustomerDetail from "./views/Customers/CustomerDetail";
import ImportsAddForm from "./views/Imports/ImportsAddForm";
import Bill from "./views/Bill/Bill";
import DayBook from "./views/DayBook/DayBook";

import { setDashboardStockData } from "./views/Dashboard/dashboardSlice";
import { useState } from "react";

// import { AddItemForm } from "./views/Items/AddItemForm";
import WorkerStockDetail from "./views/WorkerStock/WorkerStockDetail";
import WorkerWageDetail from "./views/WorkerWage/WorkerWageDetail";

import EditItemForm from "./views/Items/EditItemForm";
import Dashboard from "./views/Dashboard/Dashboard";
import Items from "./views/Items/Items";
import Sales from "./views/Sales/Sales";
import Customers from "./views/Customers/Customers";
import Credits from "./views/Credits/Credits";
import WorkerStock from "./views/WorkerStock/WorkerStock";
import WorkerWage from "./views/WorkerWage/WorkerWage";
import DailyExpanses from "./views/DailyExpanses/DailyExpanses";
import GoldStock from "./views/GoldStock/GoldStock";
import Audit from "./views/Audit/Audit";
import CashBook from "./views/CashBook/CashBook";
import StockList from "./views/GoldStock/StockList";

const App = () => {
  const dispatch = useDispatch();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userData, setUserData] = useState();

  // eslint-disable-next-line
  const [user, loading, error] = useAuthState(firebase.auth());

  // eslint-disable-next-line
  const [items, itemsLoading, itemsError] = useFetchFromDb(itemsCollection);

  // eslint-disable-next-line
  const [stocks, stocksLoading, stocksError] = useFetchFromDb(stocksCollection);

  useEffect(() => {
    if (items) {
      dispatch(setItemsData(items));
    }
    if (stocks) {
      let obj = {};
      stocks.forEach((stock) => {
        obj = {
          ...obj,
          [stock.name.toLowerCase()]: stock,
        };
      });
      dispatch(setDashboardStockData(obj));
    }
    if (user) {
      setUserData(user.email);
    }
  }, [items, stocks, dispatch, user]);

  if (loading || stocksLoading) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GlowLoader />
      </div>
    );
  }

  return (
    <Router history={history}>
      <div className="__jd">
        {!user ? (
          <Switch>
            <Route path="/auth" component={Auth} />
            <Route component={() => <Redirect to="/auth" />} />
          </Switch>
        ) : (
          <>
            <div className="wrapper">
              <Sidebar setSidebarCollapsed={setSidebarCollapsed} />

              <div
                className="__jd_main"
                style={{
                  maxWidth: sidebarCollapsed && `calc(100vw - 60px)`,
                  marginLeft: sidebarCollapsed && "60px",
                }}
              >
                <Switch>
                  <Route exact path="/" component={Dashboard} />

                  {userData && userData === "root@jagatradevi.com" ? null : (
                    <Route exact path="/items" component={Items} />
                  )}

                  {userData && userData === "root@jagatradevi.com" ? null : (
                    <Route path="/items/:itemId" component={EditItemForm} />
                  )}

                  {userData && userData === "root@jagatradevi.com" ? null : (
                    <Route exact path="/sales" component={Sales} />
                  )}

                  {userData && userData === "root@jagatradevi.com" ? null : (
                    <Route path="/credits" component={Credits} />
                  )}

                  {userData && userData === "root@jagatradevi.com" ? null : (
                    <Route exact path="/imports" component={Imports} />
                  )}

                  {userData && userData === "root@jagatradevi.com" ? null : (
                    <Route path="/imports/add" component={ImportsAddForm} />
                  )}

                  <Route path="/audit" component={Audit} />

                  <Route exact path="/customers" component={Customers} />
                  <Route path="/customers/:id" component={CustomerDetail} />
                  <Route exact path="/worker-stock" component={WorkerStock} />
                  <Route
                    path="/worker-stock/:worker"
                    component={WorkerStockDetail}
                  />
                  <Route exact path="/worker-wage" component={WorkerWage} />
                  <Route
                    path="/worker-wage/:worker"
                    component={WorkerWageDetail}
                  />
                  <Route path="/dailyexpenses" component={DailyExpanses} />
                  <Route exact path="/goldstock" component={GoldStock} />
                  <Route path="/goldstock/:id" component={StockList} />
                  <Route path="/bill" component={Bill} />
                  <Route path="/cashbook" component={CashBook} />
                  <Route path="/daybook" component={DayBook} />
                  <Route component={Lost} />
                </Switch>
              </div>
            </div>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
