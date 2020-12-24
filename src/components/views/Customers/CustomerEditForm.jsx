import React from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, FieldArray, ErrorMessage } from "formik";
import { DeleteOutlined } from "@ant-design/icons";
import * as Yup from "yup";

import InputComponent, {
  InputLabelComponent,
} from "../../includes/InputComponent/InputComponent";
import ButtonComponent from "../../includes/Button/Button";
import { updateCustomer } from "./customerActions";
import { Persist } from "formik-persist";

const customerSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  phoneNumbers: Yup.array().of(Yup.string().required("Required")),
});

const CustomerEditForm = ({ customerData, hideModal }) => {
  const dispatch = useDispatch();

  if (!customerData) {
    return null;
  }

  const { name, address, phoneNumbers: numbers } = customerData;

  return (
    <div className="__jd_main-customers--edit">
      <Formik
        initialValues={{
          name: name,
          address: address,
          phoneNumbers: [...numbers],
        }}
        onSubmit={(data, { resetForm }) => {
          dispatch(
            updateCustomer(
              { ...data, id: customerData.id },
              resetForm,
              hideModal
            )
          );
          console.log(data);
        }}
        validationSchema={customerSchema}
      >
        {({ handleChange, values, errors, touched }) => {
          return (
            <Form className="__jd_main-customers--edit__form">
              <InputLabelComponent
                title="Name"
                placeholder="Eg. Kamal Pandey"
                value={values.name}
                handleChange={handleChange("name")}
                error={errors.name}
                touched={touched.name}
              />
              <InputLabelComponent
                title="Address"
                placeholder="Eg. Butwal, Kalikanagar"
                value={values.address}
                handleChange={handleChange("address")}
                error={errors.address}
                touched={touched.address}
              />
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginLeft: "1rem",
                  color: "#222537",
                }}
              >
                Phone numbers
              </div>
              <FieldArray
                name="phoneNumbers"
                render={(arrayHelpers) => {
                  return (
                    <>
                      {values.phoneNumbers.map((phone, i) => {
                        const ErrorComponent = ({ name }) => {
                          return (
                            <ErrorMessage name={name}>
                              {(msg) => <div className="error">{msg}</div>}
                            </ErrorMessage>
                          );
                        };
                        return (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              paddingLeft: "1rem",
                            }}
                            key={i}
                          >
                            <div>
                              <InputComponent
                                key={i}
                                placeholder="Phone number"
                                value={phone}
                                handleChange={handleChange(
                                  `phoneNumbers[${i}]`
                                )}
                                style={{ width: "20vw" }}
                              />
                              <ErrorComponent name={`phoneNumbers[${i}]`} />
                            </div>
                            <DeleteOutlined
                              style={{ fontSize: "2rem" }}
                              onClick={() =>
                                values.phoneNumbers.length > 1
                                  ? arrayHelpers.remove(i)
                                  : null
                              }
                            />
                          </div>
                        );
                      })}
                      <div
                        className="__jd_main-customers--edit__form_addPhoneButton"
                        onClick={() => arrayHelpers.push("")}
                      >
                        + Add phone number
                      </div>
                    </>
                  );
                }}
              />
              <ButtonComponent
                text="Update information"
                style={{ width: "20vw", marginLeft: "1rem" }}
              />
              <Persist name="customersEdit-form" isSessionStorage={true} />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default CustomerEditForm;
