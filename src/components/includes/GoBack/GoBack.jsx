import React from "react";
import { useHistory } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const GoBack = () => {
  const history = useHistory();
  return (
    <div
      onClick={() => history.goBack()}
      style={{
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        fontSize: "18px",
        color: "#1D58EF",
      }}
    >
      <ArrowLeftOutlined
        size="large"
        style={{ marginRight: "18px" }}
        color="#1D58EF"
      />
      <div>Back</div>
    </div>
  );
};

export default GoBack;
