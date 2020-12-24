import React from "react";
import { Table } from "antd";

const TableComponent = ({
  columns,
  data,
  onRowPress,
  pagination,
  ...props
}) => {
  return (
    <Table
      columns={columns}
      dataSource={data}
      className="__jd_table"
      rowClassName="__jd_table-row"
      rowKey="sn"
      pagination={pagination}
      onRow={(record, rowIndex) => {
        return {
          onClick: () => (onRowPress ? onRowPress(record) : null),
        };
      }}
      {...props}
    />
  );
};

export default TableComponent;
