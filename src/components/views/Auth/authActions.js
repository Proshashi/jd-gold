import firebase from "../../../app/firebase";
import { setAuthError, setAuthLoading } from "./authSlice";
import history from "../../../utils/history";

export const signIn = (userName, password) => async (dispatch) => {
  try {
    dispatch(setAuthLoading(true));
    await firebase.auth().signInWithEmailAndPassword(userName, password);
    history.push("/");
    dispatch(setAuthError(null));
    dispatch(setAuthLoading(false));
  } catch (err) {
    dispatch(setAuthError(err.message));
  }
};

export const signOut = () => async (dispatch) => {
  try {
    dispatch(setAuthLoading(true));
    await firebase.auth().signOut();
    history.push("/auth");
    dispatch(setAuthLoading(false));
  } catch (err) {
    dispatch(setAuthError(err.message));
  }
};
