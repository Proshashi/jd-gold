import React from "react";
import AuthForm from "./AuthForm";

const Auth = () => {
  return (
    <div className="__jd_main-auth">
      <div className="__jd_main-auth--left">
        <img
          src="./images/logo2.png"
          alt=""
          className="__jd_main-auth--left-logo"
        />
        <div className="__jd_main-auth--left-title">
          Jagatradevi Gold Mart Pvt. Ltd.
        </div>
        <div className="__jd_main-auth--left-description">
          An exclusive mart for golden jewellery
        </div>
        <div className="__jd_main-auth--left-pan">Pan:</div>
      </div>
      <div className="__jd_main-auth--right">
        <div className="__jd_main-auth--right__logo">
          <img
            src="./images/user-large.svg"
            alt=""
            style={{ height: "20rem" }}
          />
        </div>
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
