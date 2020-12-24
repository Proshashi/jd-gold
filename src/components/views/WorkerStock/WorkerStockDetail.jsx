import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// eslint-disable-next-line
import { Modal, Divider, Popconfirm } from "antd";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import GoBack from "../../includes/GoBack/GoBack";
import HeaderTextComponent from "../../includes/Texts/HeaderTextComponent";
import TableComponent from "../../includes/Table/TableComponent";
import getFormattedDate from "../../../utils/getFormattedDate";
import { useFetchDocFromDb } from "../../../hooks/useFetchFromDB";
import InputComponent from "../../includes/InputComponent/InputComponent";
import ButtonComponent from "../../includes/Button/Button";
import { updateStockFromState } from "../WorkerWage/workerActions";
import {
  tolaToGram,
  gramToTola,
  tolaToLaal,
  laalToTola,
} from "../../../utils/unitConversions";
import InputSearchSelect from "../../includes/InputComponent/InputSearchSelect";
import CreditFooter from "./CreditFooter";
import Lost from "../404/Lost";
import FullScreenLoader from "../../includes/Loaders/FullScreenLoader";
import { workers } from "../../../app/firebase";

const getCreditColumns = (
  modalShown,
  handleOptionClick,
  itemsUnit,
  handleOptionDelete
) => {
  return [
    {
      title: "SN",
      dataIndex: "sn",
      key: "sn",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Given material",
      dataIndex: "givenMaterial",
      key: "givenMaterial",
    },
    {
      title: "Date",
      dataIndex: "dateAdded",
      key: "dateAdded",
      render: (date) => {
        return date ? getFormattedDate(date) : "-";
      },
    },
    {
      title: `Credit (${itemsUnit})`,
      dataIndex: "credit",
      key: "credit",
      render: (data) =>
        itemsUnit === "tola" ? tolaToLaal(data) : tolaToGram(data),
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => {
        return (
          <div
            className="__jd_main-workerStock--detail__table_action"
            onClick={() => handleOptionClick(record)}
          >
            Complete
          </div>
        );
      },
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
      render: (text, record) => {
        return (
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => {
              handleOptionDelete("stockcredit", record.id);
            }}
          >
            {" "}
            <div style={{ color: "red" }}>Delete</div>
          </Popconfirm>
        );
      },
    },
  ];
};

const getCreditHistoryColumns = (itemsUnit, handleOptionDelete) => {
  return [
    {
      title: "SN",
      dataIndex: "sn",
      key: "sn",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Given material",
      dataIndex: "givenMaterial",
      key: "givenMaterial",
    },
    {
      title: "Date",
      dataIndex: "dateAdded",
      key: "dateAdded",
      render: (date) => {
        return date ? getFormattedDate(date) : "-";
      },
    },
    {
      title: `Credit (${itemsUnit})`,
      dataIndex: "credit",
      key: "credit",
      render: (data) =>
        itemsUnit === "tola" ? tolaToLaal(data) : tolaToGram(data),
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
      render: (text, record) => {
        return (
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => {
              handleOptionDelete("creditHistory", record.id);
            }}
          >
            {" "}
            <div style={{ color: "red" }}>Delete</div>
          </Popconfirm>
        );
      },
    },
  ];
};

// eslint-disable-next-line
const getDebitColumns = (itemsUnit, handleOptionDelete) => {
  return [
    {
      title: "SN",
      dataIndex: "sn",
      key: "sn",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Given material",
      dataIndex: "givenMaterial",
      key: "givenMaterial",
    },
    {
      title: "Date",
      dataIndex: "dateAdded",
      key: "dateAdded",
      render: (date) => {
        return date ? getFormattedDate(date) : "-";
      },
    },
    {
      title: `Debit (${itemsUnit})`,
      dataIndex: "debit",
      key: "debit",
      render: (data) =>
        itemsUnit === "tola" ? tolaToLaal(data) : tolaToGram(data),
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
      render: (text, record) => {
        return (
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => {
              handleOptionDelete("stockdebit", record.id);
            }}
          >
            {" "}
            <div style={{ color: "red" }}>Delete</div>
          </Popconfirm>
        );
      },
    },
  ];
};

const getStockFromType = (stockData, type) => {
  let arr = [];
  let counter = 1;
  // eslint-disable-next-line

  const sortedData = stockData.sort(function (a, b) {
    return new Date(b.dateAdded.toDate()) - new Date(a.dateAdded.toDate());
  });

  // eslint-disable-next-line
  sortedData.map(function (data) {
    arr.push({ ...data, sn: counter });
    counter++;
  });

  return arr;
};

const stockSchema = Yup.object().shape({
  finalWeight: Yup.number().nullable().required("Required"),
  quantity: Yup.number().nullable().required("Required"),
  item: Yup.object().nullable().required("Required"),
});

function modalForm(
  { givenMaterial, remark, type, debit, credit, id, stockUnit },
  itemsData,
  handleSubmit
) {
  credit =
    stockUnit === "tola"
      ? Number(tolaToLaal(credit))
      : Number(tolaToGram(credit));
  return (
    <>
      <h1>Stock information</h1>
      <div className="_jd_main-workerStock--detail__modal_info">
        <div className="description">
          <div className="title">Description:</div>

          {givenMaterial}
        </div>
        <div className="remark">
          <div className="title"> Remark:</div>
          {remark}
        </div>
        <div className="amount">
          <div className="title"> Amount Given:</div>
          {credit} {stockUnit === "tola" ? "laal" : "gram"}
        </div>
      </div>

      <h1>Stock complete Form</h1>

      <Formik
        initialValues={{
          finalWeight: credit,
          quantity: "",
          item: "",
        }}
        validationSchema={stockSchema}
        onSubmit={(data, { setFieldError, resetForm }) => {
          if (Number(data.finalWeight) > Number(credit)) {
            setFieldError(
              "finalWeight",
              "Value cannot be greater than initial stock"
            );
          } else if (!data.item.dateAdded) {
            setFieldError(
              "item",
              "This item is not available in your stock. Please select the proper item"
            );
          } else if (
            Number(data.quantity) % 1 !== 0 ||
            Number(data.quantity) < 0
          ) {
            setFieldError(
              "quantity",
              "Quantity should be positive whole number"
            );
          } else {
            const dataToSubmit = {
              ...data,
              finalWeight:
                stockUnit === "tola"
                  ? Number(laalToTola(data.finalWeight))
                  : Number(gramToTola(data.finalWeight)),
              creditId: id,
              givenMaterial,
              remark: `${remark} (${Number(data.quantity)} pieces)`,
              quantity: Number(data.quantity),
              weightRemaining:
                stockUnit === "tola"
                  ? Number(laalToTola(credit - data.finalWeight))
                  : Number(gramToTola(credit - data.finalWeight)),
              totalWeight:
                stockUnit === "tola"
                  ? Number(laalToTola(credit))
                  : Number(gramToTola(credit)),
              // stockUnit,
            };
            handleSubmit(dataToSubmit, resetForm);
          }
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          setFieldValue,
          errors,
          touched,
        }) => {
          console.log(Number(values.finalWeight), Number(credit));
          return (
            <Form
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <InputComponent
                placeholder="Weight needed"
                type="number"
                handleChange={handleChange("finalWeight")}
                style={{ width: "15vw" }}
                value={values.finalWeight}
                error={errors.finalWeight}
                touched={touched.finalWeight}
              />
              <InputComponent
                placeholder="Quantity"
                type="number"
                handleChange={handleChange("quantity")}
                style={{ width: "15vw" }}
                value={values.quantity}
                error={errors.quantity}
                touched={touched.quantity}
              />
              <InputSearchSelect
                placeholder="Item name"
                handleChange={(value, extraProps) => {
                  if (extraProps.data) {
                    setFieldValue("item", JSON.parse(extraProps.data));
                  } else {
                    setFieldValue("item", { name: value, id: value });
                  }
                }}
                style={{ width: "15vw", marginRight: "2rem" }}
                value={values.item && values.item.name}
                error={errors.item}
                touched={touched.item}
                options={itemsData}
              />
              <div style={{ marginTop: "3rem" }}>
                <ButtonComponent
                  text="Mark completed"
                  handlePress={handleSubmit}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}

const WorkerStockDetail = ({ match }) => {
  const { worker: workerId } = match.params;
  // eslint-disable-next-line
  const [creditHistory, setCreditHistory] = useState([]);
  const [creditStock, setCreditStock] = useState([]);
  const [debitStock, setDebitStock] = useState([]);
  const { itemsData } = useSelector((state) => state.items);
  const { itemsUnit } = useSelector((state) => state.dashboard);

  // eslint-disable-next-line
  const [data, loading, error] = useFetchDocFromDb("workers", workerId);
  const [modalShown, setModalShown] = useState(false);
  const [modalData, setModalData] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      setCreditHistory(data.creditHistory || []);
      setCreditStock(data.stockcredit || []);
      setDebitStock(data.stockdebit || []);
    }
  }, [data]);

  const handleOptionClick = (data) => {
    setModalShown(true);
    setModalData({
      ...data,
      stockUnit: itemsUnit,
      debit: itemsUnit === "tola" ? data.debit : tolaToGram(data.debit),
    });
  };

  const handleOptionDelete = async (type, id) => {
    try {
      const cData = (await workers.doc(workerId).get()).data();
      await workers.doc(workerId).update({
        [type]: cData[type].filter((d) => d.id !== id),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (formData, resetForm) => {
    const parsedData = {
      ...formData,
      workerId: data.id,
    };
    dispatch(updateStockFromState(parsedData, resetForm));
    setModalShown(false);
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!loading && !data) {
    return <Lost />;
  }

  return (
    <div className="_jd_main-workerStock--detail">
      <GoBack />
      <Modal
        className="_jd_main-workerStock--detail__modal"
        title={modalData && modalData.remark}
        visible={modalShown}
        onOk={() => {
          setModalShown(false);
          setModalData(null);
        }}
        onCancel={() => {
          setModalShown(false);
          setModalData(null);
        }}
        footer={false}
      >
        {modalData &&
          itemsData &&
          modalForm(modalData, itemsData, handleSubmit)}
      </Modal>
      <div className="__jd_main-workerStock--detail__credit">
        <HeaderTextComponent style={{ fontSize: "30px" }}>
          Current credits
        </HeaderTextComponent>
        <TableComponent
          columns={getCreditColumns(
            modalShown,
            handleOptionClick,
            itemsUnit,
            handleOptionDelete
          )}
          data={getStockFromType(creditStock, "credit")}
          loading={loading}
          footer={() => <CreditFooter data={data} itemsUnit={itemsUnit} />}
        />

        <HeaderTextComponent style={{ fontSize: "30px" }}>
          Credit History
        </HeaderTextComponent>
        <TableComponent
          columns={getCreditHistoryColumns(itemsUnit, handleOptionDelete)}
          data={getStockFromType(creditHistory, "creditHistory")}
          loading={loading}
        />
      </div>

      <Divider />

      <div className="__jd_main-workerStock--detail__debit">
        <HeaderTextComponent style={{ fontSize: "30px" }}>
          Debit History
        </HeaderTextComponent>
        <TableComponent
          columns={getDebitColumns(itemsUnit, handleOptionDelete)}
          data={getStockFromType(debitStock, "debit")}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default WorkerStockDetail;
