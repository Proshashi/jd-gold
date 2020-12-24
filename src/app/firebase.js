import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBojvd3PWNPHs7ReWP_-stH3xz0olhAVso",
  authDomain: "jd-gold-de5d8.firebaseapp.com",
  databaseURL: "https://jd-gold-de5d8.firebaseio.com",
  projectId: "jd-gold-de5d8",
  storageBucket: "jd-gold-de5d8.appspot.com",
  messagingSenderId: "496273232300",
  appId: "1:496273232300:web:1843f2ebe9699ee599ea09",
  measurementId: "G-ZD8E42NLGH",
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
