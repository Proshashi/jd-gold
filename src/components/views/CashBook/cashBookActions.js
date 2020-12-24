import firebase, { cashbook, expanses } from "../../../app/firebase";
import { setCashBookLoading, setCashBookError } from "./cashBookSlice";

export const addCashBook = (data, resetForm) => async (dispatch) => {
  try {
    dispatch(setCashBookLoading(true));
    await cashbook.add({
      ...data,
      date: firebase.firestore.Timestamp.fromDate(new Date()),
    });

    // cost
    // date
    // description
    // remark

    if (data.category === "expenditure") {
      await expanses.add({
        cost: data.amount,
        date: firebase.firestore.Timestamp.fromDate(new Date()),
        description: `${data.description} (${data.type})`,
        remark: data.description,
      });
    }

    resetForm();
    dispatch(setCashBookLoading(false));
  } catch (err) {
    setCashBookError(err.message);
  }
};
