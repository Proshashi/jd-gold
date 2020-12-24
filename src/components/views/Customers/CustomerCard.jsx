import React from "react";
import getFormattedDate from "../../../utils/getFormattedDate";
import history from "../../../utils/history";

const CustomerCard = ({ data }) => {
  // eslint-disable-next-line
  const { name, phoneNumber, id, sn, dateAdded, address, sales } = data;

  return (
    <div className="__jd_main-customers--cards__item">
      <div
        className="__jd_main-customers--cards__item_name"
        onClick={() => history.push(`/customers/${id}`)}
      >
        {name}
      </div>
      <div className="__jd_main-customers--cards__item_detail">
        <div className="__jd_main-customers--cards__item_detail-date">
          {getFormattedDate(dateAdded)}
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;
