import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import GoBack from "../../includes/GoBack/GoBack";
import TableComponent from "../../includes/Table/TableComponent";
import { useFetchDocFromDb } from "../../../hooks/useFetchFromDB";
import InputComponent from "../../includes/InputComponent/InputComponent";
import InputSelect from "../../includes/InputComponent/InputSelect";
import ButtonComponent from "../../includes/Button/Button";
import { useDispatch } from "react-redux";
import { addWorkerWage } from "./workerActions";
import getFormattedDate from "../../../utils/getFormattedDate";
import FullScreenLoader from "../../includes/Loaders/FullScreenLoader";
import Lost from "../404/Lost";
import { Persist } from "formik-persist";
import { Popconfirm } from "antd";
import { cashbook, workers } from "../../../app/firebase";

function getColumns(handleOptionDelete) {
  return [
    {
      title: "SN",
      dataIndex: "sn",
      key: "sn",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Date",
      dataIndex: "dateAdded",
      key: "dateAdded",
      render: (date) => (date ? getFormattedDate(date) : "July 15"),
    },
    {
      title: "Debit",
      dataIndex: "debit",
      key: "debit",
      render: (data) => (
        // eslint-disable-next-line
        <div> {data ? `Rs. ${data}` : data == "0" ? "0" : "-"}</div>
      ),
    },
    {
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      render: (data) => (
        // eslint-disable-next-line
        <div>{data ? `Rs. ${data}` : data == "0" ? "0" : "-"}</div>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (data, values) => {
        console.log(data, values);
        return <div>{data ? `Rs. ${data}` : "-"}</div>;
      },
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
      render: (text, record) => {
        return (
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => {
              handleOptionDelete(record.id);
            }}
          >
            {" "}
            <div style={{ color: "red" }}>Delete</div>
          </Popconfirm>
        );
      },
    },
  ];
}

const wageSchema = Yup.object().shape({
  subject: Yup.string().required("Required"),
  type: Yup.object().nullable().required("Required"),
  payment: Yup.string().required("Required"),
});

function getSimplifiedData(data) {
  const { paymentHistory } = data;
  let arr = [];
  let counter = 1;

  let total = 0;

  // eslint-disable-next-line
  paymentHistory.map((payment) => {
    console.log(payment);
    if (payment.type === "debit") {
      total += Number(payment.payment);
    }

    if (payment.type === "credit") {
      total -= Number(payment.payment);
    }
    console.log(total);
    arr.push({
      ...payment,
      [payment.type]: payment.payment,
      sn: counter,
      total,
    });
    counter++;
  });

  return arr;
}

const WorkerWageDetail = ({ match }) => {
  const { worker: workerId } = match.params;

  const [userData, setUserData] = useState([]);

  // eslint-disable-next-line
  const [data, loading, error] = useFetchDocFromDb("workers", workerId);

  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      setUserData(data);
    }
  }, [data]);

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!loading && !data) {
    return <Lost />;
  }

  const handleOptionDelete = async (id) => {
    const wData = (await workers.doc(workerId).get()).data();
    const cashBookData = await cashbook
      .where("paymentId", "==", id)
      .limit(1)
      .get();
    let cashBookToRemove;
    cashBookData.forEach((doc) => {
      cashBookToRemove = doc.id;
    });
    await cashbook.doc(cashBookToRemove).delete();
    await workers.doc(workerId).update({
      paymentHistory: wData.paymentHistory.filter((d) => d.id !== id),
    });
  };

  return (
    <div className="__jd_main-workerWage--detail">
      <GoBack />
      <div style={{ textAlign: "right" }}>
        <h1
          style={{
            fontWeight: "bold",
            color: "#1d58ef77",
            fontSize: "30px",
            lineHeight: "1rem",
          }}
        >
          {userData.name}
        </h1>
        <h1
          style={{ fontWeight: "bold", color: "#1d58ef77", fontSize: "20px" }}
        >
          {userData.phoneNumber}
        </h1>
      </div>

      <TableComponent
        columns={getColumns(handleOptionDelete)}
        data={userData.paymentHistory && getSimplifiedData(userData)}
        loading={loading}
      />
      <Formik
        initialValues={{
          subject: "",
          type: null,
          payment: "",
        }}
        validationSchema={wageSchema}
        onSubmit={(values, { resetForm }) => {
          const finalValues = {
            ...values,
            type: values.type.name.toLowerCase(),
            payment: Number(values.payment),
          };
          dispatch(addWorkerWage(data.id, finalValues, resetForm));
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          setFieldValue,
          handleSubmit,
        }) => {
          return (
            <Form className="__jd_main-workerWage--detail__form">
              <InputComponent
                placeholder="Subject"
                style={{ width: "25vw" }}
                handleChange={handleChange("subject")}
                value={values.subject}
                error={errors.subject}
                touched={touched.subject}
              />
              <InputComponent
                placeholder="Payment"
                style={{ width: "15vw" }}
                handleChange={handleChange("payment")}
                value={values.payment}
                error={errors.payment}
                touched={touched.payment}
                type="number"
              />
              <InputSelect
                placeholder="Payment type"
                style={{ width: "15vw" }}
                handleChange={(value, extraProps) => {
                  setFieldValue("type", JSON.parse(extraProps.data));
                }}
                options={[
                  { name: "Debit", id: 1 },
                  { name: "Credit", id: 2 },
                ]}
                value={values.type && values.type.name}
                error={errors.type}
                touched={touched.type}
              />
              <ButtonComponent text="Finish payment" />
              <Persist name="workerWageAdd-form" isSessionStorage={true} />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default WorkerWageDetail;
