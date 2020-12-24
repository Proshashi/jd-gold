import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import InputSearchSelect from "../../includes/InputComponent/InputSearchSelect";
import useFetchFromDb from "../../../hooks/useFetchFromDB";
import { customers } from "../../../app/firebase";
import InputComponent from "../../includes/InputComponent/InputComponent";
import ButtonComponent from "../../includes/Button/Button";
import GoBack from "../../includes/GoBack/GoBack";
import HeaderTextComponent from "../../includes/Texts/HeaderTextComponent";
import { useDispatch, useSelector } from "react-redux";
import { addImport } from "./ImportsAction";
import { Persist } from "formik-persist";

const itemSchema = Yup.object().shape({
  item: Yup.object().nullable().required("Required"),
  customer: Yup.string().required("Required"),
  pricePerUnit: Yup.string().nullable().required("Required"),
  quantity: Yup.string().nullable().required("Required"),
  paid: Yup.string().nullable().required("Required"),
});

const ImportsAddForm = () => {
  // eslint-disable-next-line
  const [customer, customerLoading, customerError] = useFetchFromDb(
    customers.orderBy("name")
  );
  const dispatch = useDispatch();

  const { itemsUnit } = useSelector((state) => state.dashboard);

  return (
    <>
      <GoBack />
      <HeaderTextComponent
        style={{ margin: "1rem 0 0 5rem", fontSize: "3rem" }}
      >
        Add new import
      </HeaderTextComponent>

      <Formik
        initialValues={{
          item: "",
          customer: "",
          pricePerUnit: "",
          quantity: "",
          paid: "",
        }}
        validationSchema={itemSchema}
        onSubmit={(data, { resetForm, setFieldError }) => {
          // eslint-disable-next-line
          const { pricePerUnit, quantity, paid } = data;
          if (Number(pricePerUnit) * Number(quantity.value) < paid) {
            setFieldError("paid", "You paid more then the total price");
          }

          dispatch(addImport(data, itemsUnit, resetForm));
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
        }) => {
          return (
            <Form className="__jd_main-imports--form">
              <div
                style={{
                  cursor: "pointer",
                  width: "fit-content",
                  marginLeft: "auto",
                  color: "red",
                }}
                onClick={resetForm}
              >
                Reset form
              </div>
              <div className="__jd_main-imports--form__item">
                <InputSearchSelect
                  placeholder="Item type"
                  options={[
                    { name: "Silver", id: "silver" },
                    { name: "Gold", id: "gold" },
                    { name: "Diamond", id: "diamond" },
                  ]}
                  value={values.item && values.item.name}
                  handleChange={(data, extraprops) => {
                    if (extraprops.data) {
                      setFieldValue("item", JSON.parse(extraprops.data));
                    } else {
                      setFieldValue("item", { name: data, id: data });
                    }
                  }}
                  style={{ width: "30vw" }}
                />
                {errors.item && touched.item && (
                  <div className="error">{errors.item}</div>
                )}
              </div>

              <div className="__jd_main-imports--form__item">
                <InputComponent
                  placeholder="Customer name"
                  handleChange={handleChange("customer")}
                  value={values.customer}
                  style={{ width: "30vw" }}
                  inputStyle={{ textTransform: "capitalize" }}
                />
                {errors.customer && touched.customer && (
                  <div className="error">{errors.customer}</div>
                )}
              </div>

              <div className="__jd_main-imports--form__item">
                <InputComponent
                  placeholder={`Quantity (${itemsUnit})`}
                  type="number"
                  handleChange={handleChange("quantity")}
                  value={values.quantity}
                  style={{ width: "30vw" }}
                />
                {errors.quantity && touched.quantity && (
                  <div className="error">{errors.quantity}</div>
                )}
              </div>

              <div className="__jd_main-imports--form__item">
                <InputComponent
                  placeholder="Price per unit"
                  type="number"
                  handleChange={handleChange("pricePerUnit")}
                  value={values.pricePerUnit}
                  style={{ width: "30vw" }}
                />
                {errors.pricePerUnit && touched.pricePerUnit && (
                  <div className="error">{errors.pricePerUnit}</div>
                )}
              </div>

              <div className="__jd_main-imports--form__item">
                <InputComponent
                  placeholder="Total"
                  type="number"
                  value={
                    values.quantity &&
                    values.pricePerUnit &&
                    Number(values.quantity) * Number(values.pricePerUnit)
                  }
                  style={{ width: "30vw", backgroundColor: "#fafafa" }}
                  inputStyle={{ backgroundColor: "#fafafa", cursor: "default" }}
                  disabled
                  readOnly={true}
                />
              </div>

              <div className="__jd_main-imports--form__item">
                <InputComponent
                  placeholder="Paid"
                  type="number"
                  handleChange={handleChange("paid")}
                  value={values.paid}
                  style={{ width: "30vw" }}
                />
                {errors.paid && touched.paid && (
                  <div className="error">{errors.paid}</div>
                )}
              </div>

              <div className="__jd_main-imports--form__item">
                <InputComponent
                  placeholder="Remaining"
                  type="number"
                  value={
                    values.quantity &&
                    values.pricePerUnit &&
                    values.paid &&
                    Number(values.quantity) * Number(values.pricePerUnit) -
                      Number(values.paid)
                  }
                  style={{ width: "30vw", backgroundColor: "#fafafa" }}
                  inputStyle={{ backgroundColor: "#fafafa", cursor: "default" }}
                  disabled
                  readOnly={true}
                />
              </div>
              <ButtonComponent
                text="Add import"
                style={{ width: "30vw", margin: "1rem 0" }}
              />
              <Persist name="importsAdd-form" isSessionStorage={true} />
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default ImportsAddForm;
