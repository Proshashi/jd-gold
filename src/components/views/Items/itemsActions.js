import { message } from "antd";

import { setItemsLoading, setItemsError } from "./itemsSlice";
import firebase, { items, stocks } from "../../../app/firebase";
import { keywordsGenerator } from "../../../utils/keywordsGenerator";

export const addItem = (itemDetail, resetForm, hideModal) => async (
  dispatch
) => {
  try {
    dispatch(setItemsLoading(true));
    await items.add({
      ...itemDetail,
      keywords: keywordsGenerator(itemDetail.name),
      dateAdded: firebase.firestore.Timestamp.fromDate(new Date()),
    });
    resetForm();
    hideModal();
    message.success("Data added sucessfully", 2);
    resetForm();
    dispatch(setItemsLoading(false));
  } catch (err) {
    dispatch(setItemsError(err.message));
  }
};
export const updateItem = ({ item, quantity, weight }, resetForm) => async (
  dispatch
) => {
  try {
    dispatch(setItemsLoading(true));
    const docExists = await items.doc(item.id).get();
    if (!docExists) {
      throw new Error({
        message: "You don't have the given item in inventory",
      });
    }

    await items.doc(item.id).update({
      quantity: firebase.firestore.FieldValue.increment(quantity),
      weight: firebase.firestore.FieldValue.increment(weight),
    });

    message.success(`${item.name} updated sucessfully`, 2);
    dispatch(setItemsError(null));
    resetForm();
    dispatch(setItemsLoading(false));
  } catch (err) {
    console.log(err);
    dispatch(setItemsError(err.message));
  }
};

export const deleteItem = (id) => async (dispatch) => {
  try {
    dispatch(setItemsLoading(true));
    const data = (await items.doc(id).get()).data();
    await items.doc(id).delete();

    const stocksInfo = await stocks
      .where("name", "==", data.type.value)
      .limit(1)
      .get();

    stocksInfo.forEach(async (doc) => {
      await stocks.doc(doc.id).update({
        stockQuantity: firebase.firestore.FieldValue.increment(
          data.weight * -1
        ),
      });
    });

    message.success("Sucessfully deleted item");
    dispatch(setItemsLoading(false));
  } catch (err) {
    dispatch(setItemsError(err.message));
  }
};
