import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import InputComponent from "../../includes/InputComponent/InputComponent";
import ButtonComponent from "../../includes/Button/Button";
import { useDispatch } from "react-redux";
import { addCustomer } from "./customerActions";
import { Persist } from "formik-persist";
import { getCapitalName } from "../../../utils/getCapitalName";

// const phoneRegExp = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;

const customersSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  phoneNumber: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
});

const CustomerAddForm = () => {
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={{
        name: "",
        phoneNumber: "",
        address: "",
      }}
      validationSchema={customersSchema}
      onSubmit={(val, { resetForm }) => {
        dispatch(
          addCustomer(
            {
              ...val,
              phoneNumber: Number(val.phoneNumber),
              name: getCapitalName(val.name),
            },
            resetForm
          )
        );
      }}
    >
      {({ values, errors, touched, handleChange, handleSubmit }) => {
        return (
          <Form className="__jd_main-customers--form">
            <InputComponent
              placeholder="Customer name"
              style={{ width: "20vw" }}
              value={values.name}
              error={errors.name}
              touched={touched.name}
              handleChange={handleChange("name")}
              inputStyle={{ textTransform: "capitalize" }}
            />
            <InputComponent
              placeholder="Phone number"
              style={{ width: "15vw" }}
              type="number"
              value={values.phoneNumber}
              error={errors.phoneNumber}
              touched={touched.phoneNumber}
              handleChange={handleChange("phoneNumber")}
            />
            <InputComponent
              placeholder="Customer address"
              style={{ width: "20vw" }}
              value={
                values.address.substr(0, 1).toUpperCase() +
                values.address.substr(1)
              }
              error={errors.address}
              touched={touched.address}
              handleChange={handleChange("address")}
            />
            <ButtonComponent text="Add customer" />
            <Persist name="customersAdd-form" isSessionStorage={true} />
          </Form>
        );
      }}
    </Formik>
  );
};

export default CustomerAddForm;
