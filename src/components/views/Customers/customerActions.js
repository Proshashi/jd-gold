import firebase, { customers } from "../../../app/firebase";
import { setCustomerError, setCustomerLoading } from "./customerSlice";
import { keywordsGenerator } from "../../../utils/keywordsGenerator";

export const addCustomer = (data, resetForm) => async (dispatch) => {
  try {
    dispatch(setCustomerLoading(true));
    await customers.add({
      ...data,
      keywords: keywordsGenerator(data.name),
      dateAdded: firebase.firestore.Timestamp.fromDate(new Date()),
      phoneNumbers: [data.phoneNumber],
    });
    resetForm();
    dispatch(setCustomerLoading(false));
  } catch (err) {
    dispatch(setCustomerError(err.message));
  }
};

export const updateCustomer = (
  { name, address, phoneNumbers, id },
  resetForm,
  hideModal
) => async (dispatch) => {
  try {
    const dataToSubmit = {
      name,
      address,
      phoneNumbers,
    };
    hideModal();
    resetForm();
    dispatch(setCustomerLoading(true));
    await customers.doc(id).update(dataToSubmit);
    resetForm();
    dispatch(setCustomerLoading(false));
  } catch (err) {
    dispatch(setCustomerError(err.message));
  }
};
