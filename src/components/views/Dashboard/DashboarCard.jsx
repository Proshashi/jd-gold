import React from "react";
import { Tooltip } from "antd";

const DashboarCard = ({
  value,
  label,
  icon,
  colorPrimary,
  colorSecondary,
  tootltipTitle,
  ...props
}) => {
  return (
    <Tooltip placement="top" title={tootltipTitle} color={colorPrimary}>
      <div
        className="__jd_main-dashboard--cards__item"
        style={{ borderLeftColor: colorPrimary }}
        {...props}
      >
        <div
          className="__jd_main-dashboard--cards__item_logo"
          style={{
            backgroundColor: colorPrimary,
          }}
        >
          {icon}
        </div>
        <div className="__jd_main-dashboard--cards__item_detail">
          <div className="__jd_main-dashboard--cards__item_detail-value">
            {value}
          </div>
          <div
            className="__jd_main-dashboard--cards__item_detail-label"
            style={{ color: colorPrimary }}
          >
            {label}
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

export default DashboarCard;
