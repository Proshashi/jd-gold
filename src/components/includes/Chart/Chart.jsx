import React from "react";
import { Line } from "@ant-design/charts";

const Chart = () => {
  const data = [
    { week: "Sunday", data: 3, type: "sales" },
    { week: "Monday", data: 15, type: "sales" },
    { week: "Tuesday", data: 10, type: "sales" },
    { week: "Wednesday", data: 8, type: "sales" },
    { week: "Thirsday", data: 15, type: "sales" },
    { week: "Friday", data: 6, type: "sales" },
    { week: "Saturday", data: 20, type: "sales" },

    { week: "Sunday", data: 10, type: "imports" },
    { week: "Monday", data: 0, type: "imports" },
    { week: "Tuesday", data: 2, type: "imports" },
    { week: "Wednesday", data: 0, type: "imports" },
    { week: "Thirsday", data: 18, type: "imports" },
    { week: "Friday", data: 2, type: "imports" },
    { week: "Saturday", data: 0, type: "imports" },
  ];
  const config = {
    data,
    forceFit: true,
    seriesField: "type",
    xField: "week",
    yField: "data",
    color: ["#e2b754", "#ad00ff"],
  };
  return <Line {...config} style={{ height: "30rem", width: "50vw" }} />;
};

export default Chart;
