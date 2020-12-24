import React from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import InputComponent from "../../includes/InputComponent/InputComponent";
import Button from "../../includes/Button/Button";
import { addDailyExpanses } from "./dailyExpansesActions";
import { Persist } from "formik-persist";

const cashBookSchema = Yup.object().shape({
  description: Yup.string().required("Required"),
  cost: Yup.number("Value must be number").required("Required"),
  remark: Yup.string(),
});

const DailyExpansesForm = () => {
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={{ description: "", cost: "", remark: "" }}
      validationSchema={cashBookSchema}
      onSubmit={(data, { resetForm }) => {
        dispatch(
          addDailyExpanses({ ...data, cost: Number(data.cost) }, resetForm)
        );
      }}
    >
      {({ values, handleChange, errors, touched }) => {
        return (
          <Form className="__jd_main-dailyExpanses--form">
            <InputComponent
              placeholder="Description"
              style={{ width: "20vw" }}
              value={values.description}
              handleChange={handleChange("description")}
              error={errors.description}
              touched={touched.description}
            />
            <InputComponent
              type="number"
              placeholder="Cost"
              style={{ width: "15vw" }}
              value={values.cost}
              handleChange={handleChange("cost")}
              error={errors.cost}
              touched={touched.cost}
            />
            <InputComponent
              placeholder="Remark"
              style={{ width: "15vw" }}
              value={values.remark}
              handleChange={handleChange("remark")}
              error={errors.remark}
              touched={touched.remark}
            />
            <Button text="Submit" style={{ width: "10vw" }} />
            <Persist name="dailyExpanses-form" isSessionStorage={true} />
          </Form>
        );
      }}
    </Formik>
  );
};

export default DailyExpansesForm;
