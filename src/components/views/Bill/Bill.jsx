import React, { useState } from "react";
import { Modal } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

import HeaderTextComponent from "../../includes/Texts/HeaderTextComponent";
import NewSale from "./NewSale";
import BillLayout from "./BillLayout";
import ButtonComponent from "../../includes/Button/Button";
import { useDispatch } from "react-redux";
import { addNewSale } from "../Sales/salesActions";
import { useFetchDocFromDb } from "../../../hooks/useFetchFromDB";
import { useEffect } from "react";

const Bill = () => {
  const [modalShown, setModalShown] = useState(false);
  const [formData, setFormData] = useState();
  const dispatch = useDispatch();

  // eslint-disable-next-line
  const [billingData, loading, error] = useFetchDocFromDb("numbers", "bill");
  const [billNumber, setBillNumber] = useState(null);

  const handleBillSubmit = () => {
    const { data, extraProps } = formData;

    dispatch(
      addNewSale({
        data: { ...data, billNumber },
        resetForm: extraProps.resetForm,
      })
    );
    setModalShown(false);
  };

  useEffect(() => {
    if (billingData) {
      setBillNumber(billingData.number);
    }
  }, [billingData]);

  return (
    <div className="__jd_main-bill">
      <HeaderTextComponent>Billing section</HeaderTextComponent>
      <NewSale
        setFormData={(props, extraProps) => {
          setFormData({ data: props, extraProps });
          setModalShown(true);
        }}
      />
      <Modal
        visible={modalShown}
        closable
        onCancel={() => setModalShown(false)}
        footer={null}
      >
        <BillLayout
          formData={formData && formData.data}
          billNumber={billNumber}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ButtonComponent
            text={
              <div>
                <ShoppingCartOutlined /> Cofirm checkout
              </div>
            }
            handlePress={handleBillSubmit}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Bill;
