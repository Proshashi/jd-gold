import React from "react";
import { PhoneOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTty } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { Divider } from "antd";
import { getCapitalName } from "../../../utils/getCapitalName";
import { useSelector } from "react-redux";

const BillLayout = ({ formData, billNumber }) => {
  // console.log(formData);
  // itemName
  // netweight
  // wastage
  // grossWeight
  // workerWage
  // stone
  // total
  // remaining
  // paid
  const { itemsUnit } = useSelector((state) => state.dashboard);
  const { finalSales, remaining, paid, grandTotal, customerName } = formData;

  return (
    <div className="__jd_main-bill--layout">
      <div className="top">
        <div className="__jd_main-bill--layout__shopLogo">
          <img src="./images/logoBlack.png" alt="" />
        </div>
        <div>
          <div className="__jd_main-bill--layout__shopInfo">
            <div className="__jd_main-bill--layout__shopInfo_addresses">
              <div className="item name">Jagatradevi Gold Mart Pvt. Ltd.</div>
              <div className="item">Butwal-6,Amarpath</div>
              <div className="item">(Below Sanima Bank)</div>
            </div>
          </div>
          <div className="__jd_main-bill--layout__phones">
            <span className="item">
              <FontAwesomeIcon
                icon={faTty}
                className="__jd_main-bill--layout__phones_icon"
              />
              {/* <PhoneOutlined className="__jd_main-bill--layout__phones_icon" />{" "} */}
              <span>071-540242 </span>
            </span>
            <br />
            <span className="item">
              <PhoneOutlined className="__jd_main-bill--layout__phones_icon" />{" "}
              <span>9857075264 </span>
            </span>
            <br />
            <span className="item">
              <PhoneOutlined className="__jd_main-bill--layout__phones_icon" />{" "}
              <span>9816475264 </span>
            </span>
          </div>
        </div>
      </div>
      <Divider
        type="horizontal"
        dashed
        style={{ borderWidth: "0..5rem", borderColor: "#222537" }}
      />
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          textDecoration: "underline",
        }}
      >
        DIRECT SALES VOUCHER
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>Customer name: {getCapitalName(customerName)}</div>

        <div>
          <div className="__jd_main-bill--layout__date">
            Date: {moment(new Date()).format("YYYY / MM / DD")}
          </div>
          <div className="__jd_main-bill--layout__number">
            Bill number: {billNumber}{" "}
          </div>
        </div>
      </div>

      <div className="__jd_main-bill--layout__table">
        <table>
          <thead>
            <tr>
              <th>SN</th>
              <th>Particular</th>
              <th>Quantity</th>
              <th>Net wt.</th>
              <th>Wastage</th>
              <th>Gross wt.</th>
              <th>Wages</th>
              <th>Stone</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {finalSales.map((sale, index) => {
              const {
                itemName,
                quantity,
                netWeight,
                wastage,
                grossWeight,
                workerWage,
                stone,
                total,
              } = sale;

              return (
                <tr key={index + quantity + netWeight}>
                  <td>{index + 1}</td>
                  <td>{itemName}</td>
                  <td>{quantity}</td>
                  <td>
                    {itemsUnit === "tola"
                      ? `${Number(netWeight).toFixed(2)} laal`
                      : `${Number(netWeight).toFixed(2)} gram`}
                  </td>
                  <td>
                    {itemsUnit === "tola"
                      ? `${Number(wastage).toFixed(2)} laal`
                      : `${Number(wastage).toFixed(2)} gram`}
                  </td>
                  <td>
                    {itemsUnit === "tola"
                      ? `${Number(grossWeight).toFixed(2)} laal`
                      : `${Number(grossWeight).toFixed(2)} gram`}
                  </td>
                  <td>{workerWage}</td>
                  <td>{stone}</td>
                  <td>{total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <footer style={{ display: "flex", justifyContent: "flex-end" }}>
          <table>
            <tbody>
              <tr>
                <td>Total</td>
                <td>Rs. {Number(grandTotal).toFixed(4)}</td>
              </tr>
              <tr>
                <td>Adv. Balance</td>
                <td>Rs. {Number(paid).toFixed(4)}</td>
              </tr>
              <tr>
                <td>Remaining</td>
                <td>Rs. {Number(remaining).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </footer>
      </div>
      <div className="__jd_main-bill--layout__footer">
        <div className="__jd_main-bill--layout__footer_item">Recieved by</div>
        <div className="__jd_main-bill--layout__footer_item">Checked by</div>
        <div className="__jd_main-bill--layout__footer_item">Prepared by</div>
        <div className="__jd_main-bill--layout__footer_item">
          Authorized Signature
        </div>
      </div>
    </div>
  );
};

export default BillLayout;
