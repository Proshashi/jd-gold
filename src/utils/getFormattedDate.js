import moment from "moment";

export default (date) => {
  return moment(date.toDate()).format("MMM DD YYYY");
};

export const getFormattedTimeDate = (date) => {
  return moment(date.toDate()).format("MMM Do YY, h:mm:ss a");
};
