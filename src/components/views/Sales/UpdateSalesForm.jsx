import React from "react";
import { Formik, Form } from "formik";
import { InputLabelComponent } from "../../includes/InputComponent/InputComponent";

const UpdateSalesForm = () => {
  return (
    <Formik>
      {({}) => {
        return (
          <Form>
            <InputLabelComponent
              placeholder="Item Name"
              handleChange={console.log}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default UpdateSalesForm;
