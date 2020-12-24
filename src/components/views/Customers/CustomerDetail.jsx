import React, { useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";

import GoBack from "../../includes/GoBack/GoBack";
import { useFetchDocFromDb } from "../../../hooks/useFetchFromDB";
import HeaderTextComponent from "../../includes/Texts/HeaderTextComponent";
import CustomerEditForm from "./CustomerEditForm";
import { Modal } from "antd";
// import TableComponent from "../../includes/Table/TableComponent";
// import getFormattedDate from "../../../utils/getFormattedDate";
// import { Tooltip } from "antd";

// const columns = [
//   {
//     title: "SN",
//     dataIndex: "sn",
//     key: "sn",
//   },
//   {
//     title: "Item name",
//     dataIndex: "itemName",
//     key: "itemName",
//     render: (data) => {
//       let name = [];
//       console.log(data.length, data);
//       data[0] &&
//         data.forEach((n, index) => {
//           name.push(`"${n}" `);
//         });
//       return (
//         <Tooltip title={name}>
//           {name} {data.length > 2 ? `and ${data.length - 2} more` : ""}
//         </Tooltip>
//       );
//     },
//   },
//   {
//     title: "Date",
//     dataIndex: "date",
//     key: "date",
//     render: (date) => (date ? getFormattedDate(date) : "-"),
//   },

//   {
//     title: "Total",
//     dataIndex: "total",
//     key: "total",
//     render: (data) => `Rs. ${data}`,
//   },
//   {
//     title: "Paid",
//     dataIndex: "paid",
//     key: "paid",
//     render: (data) => `Rs. ${data}`,
//   },
//   {
//     title: "Remaining",
//     dataIndex: "remaining",
//     key: "remaining",
//     render: (data) => `Rs. ${data}`,
//   },
// ];

// function getTabularData(sales) {
//   let result = [];
//   sales.forEach((sale) => {
//     let wastage = 0;
//     let stone = 0;
//     let itemName = [];
//     let arr = { ...sale };
//     sale.finalSales &&
//       sale.finalSales.forEach((data, index) => {
//         wastage += data.wastage;
//         stone += data.stone;
//         itemName.push(data.itemName);
//       });
//     arr = { ...arr, wastage, stone, itemName };
//     result.push(arr);
//   });
//   return result;
// }

// function getSimplifiedData(customers) {
//   let counter = 1;
//   let arr = [];
//   // eslint-disable-next-line
//   customers.sales.map((customer) => {
//     arr.push({ ...customer, sn: counter });
//     counter++;
//   });
//   return getTabularData(arr);
// }

const CustomerDetail = ({ match }) => {
  const { id: customerId } = match.params;

  // eslint-disable-next-line
  const [data, loading, error] = useFetchDocFromDb("customers", customerId);

  // eslint-disable-next-line
  const [customerData, setCustomerData] = useState();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (data) {
      setCustomerData(data);
    }
  }, [data]);

  return (
    <div className="__jd_main-customers--detail">
      <div>
        <GoBack />
      </div>
      <div className="__jd_main-customers--detail__info">
        <HeaderTextComponent style={{ fontSize: "3rem" }}>
          User information
        </HeaderTextComponent>
        <Modal
          visible={visible}
          onCancel={() => setVisible(false)}
          footer={null}
        >
          <CustomerEditForm
            customerData={customerData}
            hideModal={() => setVisible(false)}
          />
        </Modal>
        {customerData && (
          <div className="__jd_main-customers--detail__info_data">
            <div className="__jd_main-customers--detail__info_data-item">
              {customerData.name}
            </div>
            <div className="__jd_main-customers--detail__info_data-item">
              {customerData.address}
            </div>
            <div className="__jd_main-customers--detail__info_data-item">
              {customerData.phoneNumbers.map((p) => {
                return <div key={p}>{p}</div>;
              })}
            </div>
            <div
              className="__jd_main-customers--detail__info_data-item __jd_main-customers--detail__info_data-item--edit"
              onClick={() => setVisible(true)}
            >
              <EditOutlined /> Edit
            </div>
          </div>
        )}
      </div>
      <br />
      {/* <TableComponent
        columns={columns}
        loading={loading}
        data={
          customerData && customerData.sales && getSimplifiedData(customerData)
        }
      /> */}
    </div>
  );
};

export default CustomerDetail;
