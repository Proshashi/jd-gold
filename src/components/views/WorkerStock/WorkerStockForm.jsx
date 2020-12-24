import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";

// import InputSelect from "../../includes/InputComponent/InputSelect";
import InputComponent from "../../includes/InputComponent/InputComponent";
import ButtonComponent from "../../includes/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { updateWorkerStock } from "../WorkerWage/workerActions";
import InputSearchSelect from "../../includes/InputComponent/InputSearchSelect";
import { Persist } from "formik-persist";

const workerSchema = Yup.object().shape({
  worker: Yup.object().nullable().required("Required"),
  stockAmount: Yup.number().nullable().required("Required"),
  givenMaterial: Yup.object().required("Required"),
  remark: Yup.string().required("Required"),
});

const WorkerStockForm = ({ workers }) => {
  const { itemsUnit } = useSelector((state) => state.dashboard);

  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={{
        worker: "",
        stockAmount: "",
        givenMaterial: "",
        remark: "",
      }}
      onSubmit={(
        { worker, stockAmount, remark, givenMaterial },
        { resetForm }
      ) => {
        resetForm();
        const parseData = {
          id: worker.id,
          remark,
          stockAmount: Number(stockAmount),
          stockUnit: itemsUnit,
          givenMaterial: givenMaterial.name,
          type: "credit",
          name: worker.name,
        };
        dispatch(updateWorkerStock(parseData, resetForm));
      }}
      validationSchema={workerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue,
      }) => {
        return (
          <Form className="__jd_main-workerStock--form">
            <InputSearchSelect
              options={workers}
              optionsFrom="name"
              placeholder="Select worker"
              style={{ width: "15vw" }}
              handleChange={(data, extraProps) => {
                if (extraProps.data) {
                  setFieldValue("worker", JSON.parse(extraProps.data));
                } else {
                  setFieldValue("worker", { name: data, id: data });
                }
              }}
              value={values.worker ? values.worker.name : ""}
              error={errors.worker}
              touched={touched.worker}
            />

            <InputComponent
              placeholder="Quantity"
              type="number"
              style={{ width: "15vw" }}
              handleChange={handleChange("stockAmount")}
              value={values.stockAmount}
              error={errors.stockAmount}
              touched={touched.stockAmount}
            />
            <InputSearchSelect
              placeholder="Given Material"
              style={{ width: "12vw" }}
              options={[
                { id: "gold ", name: "Gold" },
                { id: "silver", name: "Silver" },
              ]}
              handleChange={(data, extraProps) => {
                if (extraProps.data) {
                  setFieldValue("givenMaterial", JSON.parse(extraProps.data));
                } else {
                  setFieldValue("givenMaterial", { name: data, id: data });
                }
              }}
              value={values.givenMaterial.name}
              error={errors.givenMaterial}
              touched={touched.givenMaterial}
            />
            <InputComponent
              placeholder="Remark"
              style={{ width: "15vw" }}
              handleChange={handleChange("remark")}
              value={values.remark}
              error={errors.remark}
              touched={touched.remark}
            />
            <ButtonComponent text="Add stock" handlePress={handleSubmit} />
            <Persist name="workerStock-form" isSessionStorage={true} />
          </Form>
        );
      }}
    </Formik>
  );
};

export default WorkerStockForm;
