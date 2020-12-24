import React from "react";
import InputComponent from "../../includes/InputComponent/InputComponent";
import Button from "../../includes/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "./authActions";
import { Formik, Form } from "formik";

const AuthForm = () => {
  const dispatch = useDispatch();
  const { authError, loading } = useSelector((state) => state.auth);

  return (
    <Formik
      initialValues={{ userName: "", password: "" }}
      onSubmit={({ userName, password }) => {
        dispatch(signIn(userName, password));
      }}
    >
      {({ values, handleChange, handleSubmit }) => {
        return (
          <Form className="__jd_main-auth--right__form">
            <InputComponent
              placeholder="User"
              icon={
                <img
                  src="./images/icons/user.svg"
                  style={{
                    height: "20px",
                    width: "20px",
                  }}
                  alt="User"
                />
              }
              value={values.userName}
              handleChange={handleChange("userName")}
            />
            <InputComponent
              placeholder="Password"
              icon={
                <img
                  src="./images/icons/password.svg"
                  style={{
                    height: "20px",
                    width: "20px",
                  }}
                  alt="Password"
                />
              }
              value={values.password}
              handleChange={handleChange("password")}
              password={true}
            />
            <Button
              text="Sign In"
              loading={loading}
              style={{ width: "30vw" }}
              handlePress={handleSubmit}
            />
            {authError && <div className="__jd_error-text">{authError}</div>}
          </Form>
        );
      }}
    </Formik>
  );
};

export default AuthForm;
