import { useState, useEffect } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import firebase from "../app/firebase";

const useFetchFromDb = (collection) => {
  const getSimplifiedData = (value) => {
    let data = [];
    let counter = 1;
    value.forEach((doc) => {
      data.push({
        ...doc.data(),
        id: doc.id,
        sn: counter,
      });
      counter = counter + 1;
    });
    return data;
  };

  const [data, setData] = useState();
  const [values, loading, error] = useCollection(collection);
  useEffect(() => {
    if (values) {
      setData(getSimplifiedData(values));
    }
  }, [values]);

  return [data, loading, error];
};

export default useFetchFromDb;

export const useFetchDocFromDb = (collection, doc, orderBy) => {
  const getSimplifiedData = (value) => {
    const data = value.data();
    return {
      ...data,
      id: value.id,
    };
  };

  const [data, setData] = useState();
  const [value, loading, error] = useDocument(
    firebase.firestore().doc(`${collection}/${doc}`)
  );

  useEffect(() => {
    if (value && value.data()) {
      setData(getSimplifiedData(value));
    }
  }, [value]);

  return [data, loading, error];
};
