import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import Modal from "antd/lib/modal/Modal";
import * as Yup from "yup";

import {
  GRAM_VALUE,
  tolaToGram,
  tolaToLaal,
} from "../../../utils/unitConversions";
import InputComponent from "../../includes/InputComponent/InputComponent";
import ButtonComponent from "../../includes/Button/Button";
import { useDispatch } from "react-redux";
import { updateWorkerStock } from "../WorkerWage/workerActions";

const modalFormSchema = Yup.object().shape({
  stockAmount: Yup.number().required("Required"),
  remark: Yup.string().required("Required"),
});

const ModalForm = ({ data, itemsUnit, modalData, hideModal }) => {
  const dispatch = useDispatch();

  if (!modalData) {
    return (
      <div>
        <h2> Assign new task</h2>
      </div>
    );
  }

  const { obj, key } = modalData;

  const initalAmount =
    itemsUnit === "tola"
      ? Number(obj[key] * 100)
      : Number(obj[key] * GRAM_VALUE);

  return (
    <div>
      <h2> Assign new task</h2>
      <Formik
        initialValues={{
          name: data.name,
          givenMaterial: key,
          stockAmount: initalAmount,
          remark: "",
        }}
        validationSchema={modalFormSchema}
        onSubmit={async (dataa, { resetForm, setFieldError }) => {
          const dataToSubmit = {
            ...dataa,
            stockAmount: Number(dataa.stockAmount),
            id: data.id,
            type: "credit",
            stockUnit: itemsUnit,
          };

          if (dataa.stockAmount > initalAmount) {
            return setFieldError(
              "stockAmount",
              "You provided more amount then the remaining"
            );
          }

          dispatch(updateWorkerStock(dataToSubmit, resetForm, "isRemaining"));
          hideModal();
        }}
      >
        {({ values, errors, touched, handleChange }) => {
          return (
            <Form>
              <InputComponent
                placeholder="Worker name"
                value={data.name}
                readOnly
                disabled
                style={{ backgroundColor: "#fafafa", margin: "3rem 0" }}
                inputStyle={{
                  backgroundColor: "#fafafa",
                  cursor: "default",
                }}
              />
              <InputComponent
                placeholder="Given material"
                value={key}
                readOnly
                disabled
                style={{ backgroundColor: "#fafafa", margin: "3rem 0" }}
                inputStyle={{
                  backgroundColor: "#fafafa",
                  cursor: "default",
                }}
              />
              <InputComponent
                type="number"
                placeholder="Quantity"
                value={values.stockAmount}
                handleChange={handleChange("stockAmount")}
                error={errors.stockAmount}
                touched={touched.stockAmount}
                style={{ margin: "3rem 0" }}
              />
              <InputComponent
                placeholder="Remark"
                value={values.remark}
                handleChange={handleChange("remark")}
                error={errors.remark}
                touched={touched.remark}
                style={{ margin: "3rem 0" }}
              />
              <ButtonComponent
                text="Add stock"
                style={{ width: "30vw", margin: "3rem 0" }}
              />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

const CreditFooter = ({ data, itemsUnit }) => {
  const [obj, setObj] = useState({});
  const [visible, setVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    if (data && data.remainingStock) {
      setObj(data.remainingStock);
    }
  }, [data, itemsUnit]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 50px 0 0",
        justifyContent: "flex-end",
      }}
    >
      <Modal
        visible={visible}
        onCancel={() => {
          setVisible(false);
          setModalData(null);
        }}
        footer={null}
      >
        <ModalForm
          data={data}
          itemsUnit={itemsUnit}
          modalData={modalData}
          hideModal={() => {
            setVisible(false);
            setModalData(null);
          }}
        />
      </Modal>
      <div style={{ fontSize: 18, fontWeight: "bold", marginRight: "20px" }}>
        Extra raw remainings:
      </div>
      {Object.keys(obj).map((key) => {
        const name = key.charAt(0).toUpperCase() + key.slice(1);
        return (
          <div
            style={{ margin: "0 20px", cursor: "pointer", color: "blue" }}
            key={key}
            onClick={() => {
              setVisible(true);
              setModalData({ obj, key });
            }}
          >
            {name}:{" "}
            {itemsUnit === "tola"
              ? Number(tolaToLaal(obj[key]))
              : Number(tolaToGram(obj[key]))}
          </div>
        );
      })}
    </div>
  );
};

export default CreditFooter;
