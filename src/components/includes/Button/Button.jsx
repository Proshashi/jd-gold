import React from "react";
import { Button } from "antd";

const ButtonComponent = ({ text, loading, handlePress, style, ...props }) => {
  return (
    <Button
      className="__jd_button"
      style={style}
      loading={loading}
      onClick={handlePress}
      {...props}
      htmlType="submit"
    >
      {text}
    </Button>
  );
};

export default ButtonComponent;
