import firebase, { expanses } from "../../../app/firebase";
import {
  setDailyExpansesError,
  setDailyExpansesLoading,
} from "./dailyExpansesSlice";

export const addDailyExpanses = (data, resetForm) => async (dispatch) => {
  try {
    dispatch(setDailyExpansesLoading(true));
    await expanses.add({
      ...data,
      date: firebase.firestore.Timestamp.fromDate(new Date()),
    });

    resetForm();
    dispatch(setDailyExpansesLoading(false));
  } catch (err) {
    console.log(err.message);
    dispatch(setDailyExpansesError(err.message));
  }
};
