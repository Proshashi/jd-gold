import React from "react";
import { useFetchDocFromDb } from "../../../hooks/useFetchFromDB";
import FullScreenLoader from "../../includes/Loaders/FullScreenLoader";
import { Result, Button } from "antd";
import history from "../../../utils/history";
import { InputLabelComponent } from "../../includes/InputComponent/InputComponent";
import { Formik, Form } from "formik";

const EditItemForm = ({ match }) => {
  const { itemId } = match.params;

  // eslint-disable-next-line
  const [data, loading, error] = useFetchDocFromDb("items", itemId);

  if (loading) return <FullScreenLoader />;

  if (!data)
    return (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, you visited wrong link"
        extra={
          <Button type="primary" onClick={() => history.push("/items")}>
            Click to go back to items
          </Button>
        }
      />
    );

  return (
    <Formik>
      {({ handleChange }) => {
        return (
          <Form>
            <div>
              <InputLabelComponent
                placeholder="Item Name"
                handleChange={console.log}
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditItemForm;
