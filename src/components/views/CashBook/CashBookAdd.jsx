import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputComponent from "../../includes/InputComponent/InputComponent";
import InputSelect from "../../includes/InputComponent/InputSelect";
import ButtonComponent from "../../includes/Button/Button";
import { useDispatch } from "react-redux";
import { addCashBook } from "./cashBookActions";
import { Persist } from "formik-persist";

const cashBookSchema = Yup.object().shape({
  description: Yup.string().required("required"),
  category: Yup.string().required("required"),
  type: Yup.string().required("required"),
  amount: Yup.number().required("required"),
});

const CashBookAdd = () => {
  const dispatch = useDispatch();
  return (
    <div className="__jd_main-cashbook--add">
      <Formik
        validationSchema={cashBookSchema}
        initialValues={{ description: "", type: "", amount: "", category: "" }}
        onSubmit={({ description, amount, type, category }, { resetForm }) => {
          const valueToSubmit = {
            description,
            amount: Number(amount),
            type: type.value,
            category: category.value,
          };
          dispatch(addCashBook(valueToSubmit, resetForm));
        }}
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => {
          return (
            <Form className="__jd_main-cashbook--add__form">
              <InputComponent
                value={values.description}
                placeholder="Description"
                handleChange={handleChange("description")}
                error={errors.description}
                touched={touched.description}
                style={{ width: "25vw" }}
              />
              <InputComponent
                placeholder="Amount"
                type="number"
                value={values.amount}
                handleChange={handleChange("amount")}
                error={errors.amount}
                touched={touched.amount}
                style={{ width: "10vw" }}
              />
              <InputSelect
                placeholder="Category"
                options={[
                  { value: "others", name: "Others" },
                  { value: "expenditure", name: "Expenditure" },
                ]}
                handleChange={(val, b) => {
                  setFieldValue("category", JSON.parse(b.data));
                }}
                value={values.category.value}
                error={errors.category}
                touched={touched.category}
                style={{ width: "10vw", textTransform: "capitalize" }}
              />
              <InputSelect
                placeholder="Type"
                options={[
                  { value: "debit", name: "Debit" },
                  { value: "credit", name: "Credit" },
                ]}
                handleChange={(val, b) =>
                  setFieldValue("type", JSON.parse(b.data))
                }
                value={values.type.value}
                error={errors.type}
                touched={touched.type}
                style={{ width: "10vw", textTransform: "capitalize" }}
              />
              <ButtonComponent text="Complete" />
              <Persist name="cashbook-form" isSessionStorage={true} />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default CashBookAdd;
