import React from "react";

const HeaderTextComponent = ({ children, style }) => {
  return (
    <div className="__jd_texts-headerTextComponent" style={style}>
      {children}
    </div>
  );
};

export default HeaderTextComponent;
