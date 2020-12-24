import React from "react";
import { Formik, Form } from "formik";
import InputComponent, {
  InputLabelComponent,
} from "../../includes/InputComponent/InputComponent";
import ButtonComponent from "../../includes/Button/Button";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { updateItem, addItem } from "./itemsActions";
import InputSearchSelect from "../../includes/InputComponent/InputSearchSelect";
import InputSelect from "../../includes/InputComponent/InputSelect";
import {
  GRAM_VALUE,
  laalToTola,
  tolaToLaal,
} from "../../../utils/unitConversions";
import { Persist } from "formik-persist";
import { getCapitalName } from "../../../utils/getCapitalName";

const itemSchema = Yup.object().shape({
  item: Yup.object().nullable().required("Required"),
  quantity: Yup.number().required("Required"),
  weight: Yup.number().required("Required"),
});

export const UpdateItemForm = () => {
  const dispatch = useDispatch();
  const { itemsLoading, itemsData, itemsError } = useSelector(
    (state) => state.items
  );

  const { itemsUnit } = useSelector((state) => state.dashboard);

  return (
    <Formik
      initialValues={{
        item: "",
        quantity: "",
        weight: "",
      }}
      onSubmit={(values, { resetForm }) => {
        const finalValues = {
          ...values,
          quantity: Number(values.quantity),
          weight:
            itemsUnit === "tola"
              ? tolaToLaal(values.weight)
              : Number(values.weight / GRAM_VALUE),
        };
        dispatch(updateItem(finalValues, resetForm));
      }}
      validationSchema={itemSchema}
    >
      {({
        values,
        handleChange,
        handleSubmit,
        errors,
        touched,
        setFieldValue,
        setFieldError,
      }) => {
        return (
          <>
            <Form className="__jd_main-items--form">
              <InputSearchSelect
                placeholder="Item name"
                options={itemsData}
                value={values.item && values.item.name}
                handleChange={(data, extraprops) => {
                  if (extraprops.data) {
                    setFieldValue("item", JSON.parse(extraprops.data));
                  } else {
                    setFieldValue("item", { name: data, id: data });
                    setFieldError(
                      "item",
                      "The item with this name not found in your inventory"
                    );
                  }
                }}
                error={errors.name}
                touched={touched.name}
              />

              <InputComponent
                placeholder="Item quantity"
                type="number"
                value={values.quantity}
                handleChange={handleChange("quantity")}
                error={errors.quantity}
                touched={touched.quantity}
              />
              <InputComponent
                placeholder={`Item weight (${itemsUnit})`}
                type="number"
                value={values.weight}
                handleChange={handleChange("weight")}
                error={errors.weight}
                touched={touched.weight}
              />
              <ButtonComponent
                text="Update item"
                handlePress={handleSubmit}
                loading={itemsLoading}
              />
              <Persist name="updateItem-form" isSessionStorage={true} />
            </Form>
            {itemsError && <div style={{ color: "red" }}>{itemsError}</div>}
          </>
        );
      }}
    </Formik>
  );
};

const addItemSchema = Yup.object().shape({
  name: Yup.string().required("required"),
  type: Yup.object().required("required"),
  weight: Yup.number().required("required"),
  quantity: Yup.number().required("required"),
});

export const AddItemForm = ({ hideModal }) => {
  const dispatch = useDispatch();
  const { itemsLoading } = useSelector((state) => state.items);
  const { itemsUnit } = useSelector((state) => state.dashboard);

  return (
    <Formik
      initialValues={{
        name: "",
        type: "",
        weight: "",
        quantity: "",
        workerWage: "",
      }}
      onSubmit={async (values, { resetForm }) => {
        dispatch(
          addItem(
            {
              ...values,
              name: getCapitalName(values.name),
              weight:
                itemsUnit === "tola"
                  ? Number(laalToTola(values.weight))
                  : Number(values.weight / GRAM_VALUE),
              quantity: Number(values.quantity),
              workerWage: Number(values.workerWage),
            },
            resetForm,
            hideModal
          )
        );
      }}
      validationSchema={addItemSchema}
    >
      {({ values, errors, touched, handleChange, setFieldValue }) => {
        return (
          <Form className="__jd_main-items--form__add">
            <InputLabelComponent
              title="Item name"
              placeholder="Eg. Gold ring"
              style={{ width: "30vw" }}
              inputStyle={{ textTransform: "capitalize" }}
              value={values.name}
              handleChange={handleChange("name")}
              error={errors.name}
              touched={touched.name}
            />

            <InputLabelComponent
              title="Worker wage"
              placeholder="Eg. 500"
              style={{ width: "30vw" }}
              value={values.workerWage}
              handleChange={handleChange("workerWage")}
              error={errors.workerWage}
              touched={touched.workerWage}
            />

            <span
              style={{
                fontWeight: "bold",
                color: "#222537",
                fontSize: "1.5rem",
                marginLeft: "1rem",
              }}
            >
              Item type
            </span>
            <InputSelect
              placeholder="Select input type"
              options={[
                { value: "gold", name: "Gold" },
                { value: "silver", name: "Silver" },
                { value: "diamond", name: "Diamond" },
              ]}
              style={{ margin: "0 0 0 1rem" }}
              handleChange={(val, b) =>
                setFieldValue("type", JSON.parse(b.data))
              }
              value={values.type.value}
              error={errors.type}
              touched={touched.type}
            />

            <InputLabelComponent
              title="Item Weight"
              placeholder={`Eg. 50 (${itemsUnit})`}
              style={{ width: "30vw" }}
              value={values.weight}
              handleChange={handleChange("weight")}
              type="number"
              error={errors.weight}
              touched={touched.weight}
            />
            <InputLabelComponent
              title="Item Quantity"
              placeholder="Eg. 2"
              style={{ width: "30vw" }}
              value={values.quantity}
              handleChange={handleChange("quantity")}
              type="number"
              error={errors.quantity}
              touched={touched.quantity}
            />
            <ButtonComponent
              text="Add item"
              style={{ width: "30vw", marginLeft: 0 }}
              loading={itemsLoading}
            />
            <Persist name="addItem-form" isSessionStorage={true} />
          </Form>
        );
      }}
    </Formik>
  );
};
