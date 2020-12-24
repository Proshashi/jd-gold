import React from "react";
import { Result } from "antd";
import ButtonComponent from "../../includes/Button/Button";
import { Link } from "react-router-dom";

const Lost = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Link to="/">
            <ButtonComponent type="primary" text=" Back Home" />
          </Link>
        </div>
      }
    />
  );
};

export default Lost;
