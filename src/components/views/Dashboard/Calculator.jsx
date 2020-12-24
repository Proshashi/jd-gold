import React from "react";
import Iframe from "react-iframe";
import { Modal } from "antd";
import { useState } from "react";
import { CalculatorOutlined } from "@ant-design/icons";

const Calculator = ({ style }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="__jd_main-dashboard--calculator" style={style}>
      <Modal visible={visible} footer={null} onCancel={() => setVisible(false)}>
        <Iframe
          url="https://d9rs.github.io/calculator/"
          width="400px"
          height="450px"
          id="myId"
          className="myClassname"
          display="initial"
          position="relative"
          frameBorder="0"
        />
      </Modal>
      <div
        onClick={() => setVisible(true)}
        className="__jd_main-dashboard--calculator__button"
      >
        <CalculatorOutlined style={{ fontSize: "3rem" }} />
      </div>
    </div>
  );
};

export default Calculator;
