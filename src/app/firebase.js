import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};

firebase.initializeApp(firebaseConfig);

firebase.firestore();

firebase.storage();

firebase.firestore().enablePersistence({ synchronizeTabs: true });

const db = firebase.firestore();

export const user = db.collection("user");
export const stocks = db.collection("stocks");
export const items = db.collection("items");
export const sales = db.collection("sales");
export const imports = db.collection("imports");
export const exports = db.collection("exports");
export const workers = db.collection("workers");
export const customers = db.collection("customers");
export const expanses = db.collection("expanses");
export const numbersCollection = db.collection("numbers");
export const cashbook = db.collection("cashbook");

export default firebase;
