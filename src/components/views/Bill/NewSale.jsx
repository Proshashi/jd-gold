import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Persist } from "formik-persist";
import { DeleteOutlined } from "@ant-design/icons";

import InputComponent from "../../includes/InputComponent/InputComponent";
import ButtonComponent from "../../includes/Button/Button";
import useFetchFromDb from "../../../hooks/useFetchFromDB";
import { items as itemsCollection, customers } from "../../../app/firebase";
import InputSearchSelect from "../../includes/InputComponent/InputSearchSelect";
import { GRAM_VALUE } from "../../../utils/unitConversions";

const saleSchema = Yup.object().shape({
  customer: Yup.object().nullable().required("Required"),
  salesItem: Yup.array().of(
    Yup.object().shape({
      item: Yup.object().nullable().required("Required"),
      quantity: Yup.number().required("Required"),
      wastage: Yup.number().required("Required"),
      weight: Yup.number().required("Required"),
      workerWage: Yup.number().required("Required"),
      itemPrice: Yup.number().required("Required"),
      stone: Yup.number().required("Required"),
    })
  ),
  paid: Yup.number().required("Required"),
});

const INITIAL_ITEMS = {
  item: "",
  quantity: "",
  weight: "",
  wastage: "",
  itemPrice: "",
  workerWage: "",
  stone: "",
};

function getSalesTotal(sales, stockData, itemsUnit) {
  let total = 0;
  sales[0] &&
    sales.forEach(
      ({ quantity, itemPrice, wastage, workerWage, stone, item, weight }) => {
        if (
          quantity &&
          itemPrice &&
          wastage &&
          workerWage &&
          stone &&
          item &&
          item.type
        ) {
          const numberToDivide = itemsUnit === "tola" ? 100 : GRAM_VALUE;

          const itemType = item.type.value;
          total +=
            ((Number(wastage) + Number(weight)) *
              Number(stockData[itemType].stockPricePerUnit)) /
              Number(numberToDivide) +
            Number(stone) +
            Number(workerWage);
        }
      }
    );
  return total;
}

function getIndividualTotal(values, stockData, itemsUnit) {
  let total = 0;
  if (typeof values.item === "object") {
    const { wastage, workerWage, stone, item, weight } = values;
    console.log(values);
    if (item.type) {
      const itemType = item.type.value;
      const numberToDivide = itemsUnit === "tola" ? 100 : GRAM_VALUE;

      if (stockData && stockData[itemType]) {
        total +=
          ((Number(wastage) + Number(weight)) *
            Number(stockData[itemType].stockPricePerUnit)) /
            Number(numberToDivide) +
          Number(stone) +
          Number(workerWage);
      }
    }
  }
  return total;
}

const NewSale = ({ setFormData }) => {
  // eslint-disable-next-line
  const [itemData, itemLoading, itemError] = useFetchFromDb(itemsCollection);

  // eslint-disable-next-line
  const [customerData, customerLoading, customerError] = useFetchFromDb(
    customers
  );

  const { itemsUnit, stockData } = useSelector((state) => state.dashboard);

  const [items, setItems] = useState([]);
  const [customer, setCustomer] = useState([]);
  const dispatch = useDispatch();

  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    if (itemData) {
      setItems(itemData);
    }
    if (customerData) {
      setCustomer(customerData);
    }
  }, [itemData, customerData, dispatch]);

  return (
    <div className="__jd_main-sales--new">
      <Formik
        initialValues={{
          customer: "",
          salesItem: [INITIAL_ITEMS],
          paid: "",
        }}
        onSubmit={({ customer, salesItem, paid }, extraProps) => {
          const { setFieldError } = extraProps;
          let finalSales = [];

          salesItem.forEach((i, index) => {
            const {
              item,
              quantity,
              wastage,
              itemPrice,
              workerWage,
              stone,
              weight,
            } = i;

            console.log(i);

            const itemMaterial = item.type && item.type.value;
            if (!item.type) {
              return setFieldError(
                `salesItem[${index}].item`,
                `You don't have this item in your stock`
              );
            } else if (Number(item.quantity) < Number(quantity)) {
              return setFieldError(
                `salesItem[${index}].quantity`,
                `You only have ${item.quantity} ${item.name} in stock.`
              );
            } else if (Number(totalSales) < Number(paid)) {
              return setFieldError(
                "paid",
                `You entered price greater then total price`
              );
            } else {
              const weightConverted = Number(weight);
              // itemsUnit === "tola" ? Number(weight) : Number(weight);

              const wastageConverted = Number(wastage);

              const priceConverted =
                itemsUnit === "tola"
                  ? Number(stockData[itemMaterial].stockPricePerUnit) / 100
                  : Number(stockData[itemMaterial].stockPricePerUnit) /
                    GRAM_VALUE;

              const sell = {
                itemId: item.id,
                itemName: item.name,
                itemType: item.type.value,
                itemPricePerUnit: Number(itemPrice),
                quantity: Number(quantity),
                weight: weightConverted,
                netWeight: weightConverted,
                wastage: wastageConverted,
                stone: Number(stone) || 0,
                grossWeight: wastageConverted + weightConverted,
                workerWage: Number(workerWage),
                total:
                  (wastageConverted + weightConverted) * priceConverted +
                  Number(workerWage) +
                  Number(stone),
              };

              finalSales.push(sell);
            }
            const reqData = {
              customerId: customer.id,
              customerName: customer.name,
              finalSales,
              paid: Number(paid),
              remaining: Number(totalSales) - Number(paid),
              grandTotal: Number(totalSales),
            };
            setFormData(reqData, itemsUnit, extraProps);
          });
        }}
        validationSchema={saleSchema}
        onReset={(val) => {
          localStorage.removeItem("sale-form");
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          setFieldValue,
          setFieldError,
          resetForm,
        }) => {
          return (
            <>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    textAlign: "right",
                    color: "red",
                    cursor: "pointer",
                    display: "inline-block",
                    marginLeft: "auto",
                  }}
                  onClick={() => {
                    resetForm();
                  }}
                >
                  Reset form
                </div>
              </div>

              <Form className="__jd_main-sales--new__form">
                <div className="first">
                  <div className="__jd_main-sales--new__form_item">
                    <InputSearchSelect
                      placeholder="Select customer"
                      handleChange={(val, b) => {
                        if (b.data) {
                          setFieldValue("customer", JSON.parse(b.data));
                        } else {
                          setFieldValue("customer", { name: val, id: val });
                        }
                      }}
                      value={values.customer && values.customer.name}
                      style={{ width: "30vw", textTransform: "capitalize" }}
                      options={customer}
                    />
                    {errors.customer && touched.customer && (
                      <div className="error">{errors.customer}</div>
                    )}
                  </div>
                </div>
                <FieldArray
                  name="salesItem"
                  render={(arrayHelpers) => {
                    return (
                      <>
                        {values.salesItem &&
                          values.salesItem.map((saleItem, index) => {
                            const ErrorComponent = ({ name }) => {
                              return (
                                <ErrorMessage name={name}>
                                  {(msg) => <div className="error">{msg}</div>}
                                </ErrorMessage>
                              );
                            };
                            const {
                              item,
                              itemPrice,
                              quantity,
                              stone,
                              wastage,
                              weight,
                              workerWage,
                            } = saleItem;
                            return (
                              <div
                                key={index}
                                className="second"
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  backgroundColor: "#fafafa",
                                  padding: "0 1rem",
                                }}
                              >
                                <div className="__jd_removeForm">
                                  <DeleteOutlined
                                    className="__jd_removeForm-icon"
                                    onClick={() => arrayHelpers.remove(index)}
                                  />
                                </div>
                                <div className="__jd_main-sales--new__form_item">
                                  <InputSearchSelect
                                    placeholder="Select item"
                                    style={{ width: "15vw" }}
                                    handleChange={(val, b) => {
                                      if (b.data) {
                                        const parsedData = JSON.parse(b.data);

                                        setFieldValue(
                                          `salesItem[${index}].item`,
                                          parsedData
                                        );
                                        setFieldValue(
                                          `salesItem[${index}].workerWage`,
                                          parsedData.workerWage
                                        );
                                      } else {
                                        setFieldValue(
                                          `salesItem[${index}].item`,
                                          {
                                            name: val,
                                            id: val,
                                          }
                                        );
                                      }
                                    }}
                                    value={item && item.name}
                                    options={items}
                                  />

                                  <ErrorComponent
                                    name={`salesItem[${index}].item`}
                                  />
                                </div>
                                <div className="__jd_main-sales--new__form_item">
                                  <InputComponent
                                    placeholder={`Item Weight (${itemsUnit})`}
                                    style={{
                                      width: "15vw",
                                      backgroundColor: "#fff",
                                    }}
                                    handleChange={handleChange(
                                      `salesItem[${index}].weight`
                                    )}
                                    value={weight}
                                    type="number"
                                  />

                                  <ErrorComponent
                                    name={`salesItem[${index}].weight`}
                                  />
                                </div>
                                <div className="__jd_main-sales--new__form_item">
                                  <InputComponent
                                    placeholder={`Wastage (${itemsUnit})`}
                                    style={{
                                      width: "15vw",
                                      backgroundColor: "#fff",
                                    }}
                                    handleChange={handleChange(
                                      `salesItem[${index}].wastage`
                                    )}
                                    value={wastage}
                                    type="number"
                                  />
                                  <ErrorComponent
                                    name={`salesItem[${index}].wastage`}
                                  />
                                </div>
                                <div className="__jd_main-sales--new__form_item">
                                  <InputComponent
                                    placeholder="Stone"
                                    style={{
                                      width: "15vw",
                                      backgroundColor: "#fff",
                                    }}
                                    handleChange={handleChange(
                                      `salesItem[${index}].stone`
                                    )}
                                    value={stone}
                                    type="number"
                                  />
                                  <ErrorComponent
                                    name={`salesItem[${index}].stone`}
                                  />
                                </div>
                                <div className="__jd_main-sales--new__form_item">
                                  <InputComponent
                                    placeholder="Quantity"
                                    style={{
                                      width: "15vw",
                                      backgroundColor: "#fff",
                                    }}
                                    handleChange={handleChange(
                                      `salesItem[${index}].quantity`
                                    )}
                                    value={quantity}
                                    type="number"
                                  />
                                  <ErrorComponent
                                    name={`salesItem[${index}].quantity`}
                                  />
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div className="__jd_main-sales--new__form_item">
                                    <InputComponent
                                      placeholder="Item price"
                                      style={{
                                        width: "15vw",
                                        backgroundColor: "#fff",
                                      }}
                                      handleChange={handleChange(
                                        `salesItem[${index}].itemPrice`
                                      )}
                                      value={itemPrice}
                                      type="number"
                                    />
                                    <ErrorComponent
                                      name={`salesItem[${index}].itemPrice`}
                                    />
                                  </div>
                                  <div
                                    style={{
                                      color: "blue",
                                      cursor: "pointer",
                                      marginRight: "5rem",
                                    }}
                                    onClick={() => {
                                      // setFieldValue("")
                                      if (item && !item.type) {
                                        setFieldError(
                                          `salesItem[${index}].item`,
                                          "You don't have this item on your stick"
                                        );
                                      }
                                      if (item && item.type) {
                                        const itemType = item.type.value;
                                        const currentRate =
                                          stockData[itemType].stockPricePerUnit;

                                        const finalPrice =
                                          itemsUnit === "tola"
                                            ? /* Number(weight)  *  */ currentRate /
                                              100
                                            : currentRate / GRAM_VALUE;

                                        setFieldValue(
                                          `salesItem[${index}].itemPrice`,
                                          finalPrice
                                        );
                                      }
                                    }}
                                  >
                                    Use regular price
                                  </div>
                                </div>
                                <div className="__jd_main-sales--new__form_item">
                                  <InputComponent
                                    placeholder="Worker wage"
                                    style={{
                                      width: "15vw",
                                      backgroundColor: "#fff",
                                    }}
                                    handleChange={handleChange(
                                      `salesItem[${index}].workerWage`
                                    )}
                                    value={workerWage}
                                    type="number"
                                  />
                                  <ErrorComponent
                                    name={`salesItem[${index}].workerWage`}
                                  />
                                </div>
                                <div>
                                  Rs.{" "}
                                  {getIndividualTotal(
                                    saleItem,
                                    stockData,
                                    itemsUnit
                                  )}{" "}
                                </div>
                              </div>
                            );
                          })}
                        <div
                          style={{
                            padding: "0.5rem 1rem",
                            cursor: "pointer",
                            margin: "1rem",
                            borderRadius: "5px",
                            width: "100%",
                            border: "1px #ccc dashed",
                            textAlign: "center",
                          }}
                          onClick={() => arrayHelpers.push(INITIAL_ITEMS)}
                        >
                          Add another item
                        </div>
                      </>
                    );
                  }}
                />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="__jd_main-sales--new__form_item">
                    <InputComponent
                      value={totalSales}
                      placeholder="Total"
                      readOnly
                      disabled
                      style={{ backgroundColor: "#fafafa" }}
                      inputStyle={{
                        backgroundColor: "#fafafa",
                        cursor: "default",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      color: "#fff",
                      backgroundColor: "#222537",
                      padding: "0.5rem 1rem",
                      cursor: "pointer",
                      borderRadius: "0.25rem",
                    }}
                    onClick={() => {
                      setTotalSales(
                        getSalesTotal(values.salesItem, stockData, itemsUnit)
                      );
                    }}
                  >
                    Calculate total
                  </div>
                </div>
                <div className="__jd_main-sales--new__form_item">
                  <InputComponent
                    placeholder="Total paid"
                    style={{ width: "30vw" }}
                    handleChange={handleChange("paid")}
                    value={values.paid}
                    touched={touched.paid}
                    type="number"
                  />
                  {errors.paid && touched.paid && (
                    <div className="error">{errors.paid}</div>
                  )}
                </div>
                <div className="__jd_main-sales--new__form_item">
                  <InputComponent
                    value={Number(totalSales) - Number(values.paid)}
                    placeholder="Remaining"
                    readOnly
                    disabled
                    style={{ backgroundColor: "#fafafa" }}
                    inputStyle={{
                      backgroundColor: "#fafafa",
                      cursor: "default",
                    }}
                  />
                </div>
                <ButtonComponent
                  text="Add sell"
                  style={{ width: "30vw", marginLeft: "0px" }}
                />
                <Persist name="sale-form" isSessionStorage={true} />
              </Form>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default NewSale;
