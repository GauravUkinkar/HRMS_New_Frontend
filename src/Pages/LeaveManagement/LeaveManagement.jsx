import React, { useState } from "react";
import { Table, Tag, Button, Pagination } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { FaTimes } from "react-icons/fa";
import "./LeaveManagement.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";

const leaveData = [
  {
    key: 2,
    leaveType: "Sick Leave",
    from: "Jan 14 2025",
    to: "Jan 19 2025",
    days: 5,
    status: "Pending",
  },
  {
    key: 3,
    leaveType: "Personal Leave",
    from: "March 04 2024",
    to: "March 07 2024",
    days: 3,
    status: "Rejected",
  },
  {
    key: 4,
    leaveType: "paid Leave",
    from: "June 10 2024",
    to: "June 24 2024",
    days: 14,
    status: "Approved",
  },
  {
    key: 5,
    leaveType: "Sick Leave",
    from: "Dec 24 2025",
    to: "Dec 26 2025",
    days: 2,
    status: "Rejected",
  },
  {
    key: 6,
    leaveType: "Personal Leave",
    from: "Feb 07 2025",
    to: "Feb 14 2025",
    days: 7,
    status: "Pending",
  },
];

export default function LeaveManagement() {
  const [activeTab, setActiveTab] = useState("All Requests");
  const [page, setPage] = useState(1);

  const filteredData =
    activeTab === "All Requests"
      ? leaveData
      : leaveData.filter((item) => item.status === activeTab);

  const columns = [
    {
      title: "Leave Type",
      dataIndex: "leaveType",
    },
    {
      title: "From",
      dataIndex: "from",
    },
    {
      title: "To",
      dataIndex: "to",
    },
    {
      title: "Days",
      dataIndex: "days",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (status) => {
        let color = "";

        if (status === "Approved") color = "green";
        if (status === "Pending") color = "orange";
        if (status === "Rejected") color = "red";

        return (
          <Tag color={color} className="status-tag">
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      align: "center",
      render: () => (
        <>
          <Button type="text" icon={<EditOutlined />} />

          <Button type="text" icon={<DeleteOutlined />} />
        </>
      ),
    },
  ];

  return (
    <MainPanel>
      <div className="leave-container">
        <h2>Leave Management</h2>

        <div className="tab-header">
          {["All Requests", "Pending", "Approved", "Rejected"].map((tab) => (
            <div
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
            >
              {tab}
            </div>
          ))}

          <Button shape="circle" className="close-btn" icon={<FaTimes />} />
        </div>

        <Table
          columns={columns}
          dataSource={filteredData.slice((page - 1) * 5, page * 5)}
          pagination={false}
          bordered
        />

        <div className="pagination">
          <Pagination
            current={page}
            pageSize={5}
            total={filteredData.length}
            onChange={(p) => setPage(p)}
            size="small"
          />
        </div>
      </div>
    </MainPanel>
  );
}
