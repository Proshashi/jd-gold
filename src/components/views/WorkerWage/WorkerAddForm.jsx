import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import InputComponent from "../../includes/InputComponent/InputComponent";
import ButtonComponent from "../../includes/Button/Button";
import { addWorker } from "./workerActions";
import { Persist } from "formik-persist";
import { getCapitalName } from "../../../utils/getCapitalName";

const phoneRegExp = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;

const itemSchema = Yup.object().shape({
  name: Yup.string().trim().required("Required"),
  phoneNumber: Yup.string()
    .matches(phoneRegExp, "Not valid number")
    .required("Required"),
});

export const WorkerAddForm = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.workers);

  return (
    <Formik
      initialValues={{ name: "", phoneNumber: "" }}
      onSubmit={(value, { resetForm }) => {
        dispatch(
          addWorker(
            {
              ...value,
              phoneNumber: Number(value.phoneNumber),
              name: getCapitalName(value.name),
            },
            resetForm
          )
        );
      }}
      validationSchema={itemSchema}
    >
      {({ handleChange, values, handleSubmit, errors, touched }) => {
        return (
          <Form className="__jd_main-workerWage--form">
            <InputComponent
              placeholder="Worker name"
              handleChange={handleChange("name")}
              value={values.name}
              error={errors.name}
              touched={touched.name}
              inputStyle={{ textTransform: "capitalize" }}
            />
            <InputComponent
              type="number"
              placeholder="Worker phone"
              handleChange={handleChange("phoneNumber")}
              value={values.phoneNumber}
              error={errors.phoneNumber}
              touched={touched.phoneNumber}
            />
            <ButtonComponent
              text="Add worker"
              handlePress={handleSubmit}
              loading={loading}
            />
            <Persist name="workerAdd-form" isSessionStorage={true} />
          </Form>
        );
      }}
    </Formik>
  );
};
