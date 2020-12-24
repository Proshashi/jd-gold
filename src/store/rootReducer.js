import { combineReducers } from "redux";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";
import authReducer from "../components/views/Auth/authSlice";
import itemsReducer from "../components/views/Items/itemsSlice";
import workersReducer from "../components/views/WorkerWage/workerSlice";
import salesReducer from "../components/views/Sales/salesSlice";
import importsReducer from "../components/views/Imports/ImportsSlice";
import dashboardReducer from "../components/views/Dashboard/dashboardSlice";
import dailyExpansesReducer from "../components/views/DailyExpanses/dailyExpansesSlice";
import cashBookReducer from "../components/views/CashBook/cashBookSlice";

export default combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  auth: authReducer,
  items: itemsReducer,
  workers: workersReducer,
  sales: salesReducer,
  imports: importsReducer,
  dashboard: dashboardReducer,
  dailyExpanses: dailyExpansesReducer,
  cashBook: cashBookReducer,
});
