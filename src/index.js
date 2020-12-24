import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "antd/dist/antd.css";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import firebase from "firebase/app";

import App from "./components/App";
import "./index.scss";
import store from "./store/store";
import "./app/firebase";

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
};

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
};

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <App />
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.querySelector("#root")
);
