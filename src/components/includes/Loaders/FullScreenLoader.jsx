import React from "react";

import { Spin } from "antd";

const FullScreenLoader = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <Spin size="large" />
    </div>
  );
};

export default FullScreenLoader;
