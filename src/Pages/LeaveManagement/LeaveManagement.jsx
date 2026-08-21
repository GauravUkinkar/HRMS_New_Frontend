import React, { useRef, useState } from "react";
import { Table, Tag, Space, Input, Button } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./LeaveManagement.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";

const leaveData = [
  {
    key: 1,
    employeeName: "Rahul Patil",
    employeeId: "EMP001",
    leaveType: "Sick Leave",
    from: "Jan 14 2025",
    to: "Jan 19 2025",
    days: 5,
    reason: "Not feeling well",
    status: "Pending",
  },
  {
    key: 2,
    employeeName: "Priya Sharma",
    employeeId: "EMP002",
    leaveType: "Sick Leave",
    from: "Jan 14 2025",
    to: "Jan 19 2025",
    days: 5,
    reason: "Medical reason",
    status: "Pending",
  },
  {
    key: 3,
    employeeName: "Amit Deshmukh",
    employeeId: "EMP003",
    leaveType: "Personal Leave",
    from: "March 04 2024",
    to: "March 07 2024",
    days: 3,
    reason: "Personal work",
    status: "Rejected",
  },
  {
    key: 4,
    employeeName: "Sneha Joshi",
    employeeId: "EMP004",
    leaveType: "Paid Leave",
    from: "June 10 2024",
    to: "June 24 2024",
    days: 14,
    reason: "Family vacation",
    status: "Approved",
  },
  {
    key: 5,
    employeeName: "Akash Jadhav",
    employeeId: "EMP005",
    leaveType: "Sick Leave",
    from: "Dec 24 2025",
    to: "Dec 26 2025",
    days: 2,
    reason: "Health issue",
    status: "Rejected",
  },
  {
    key: 6,
    employeeName: "Neha Kulkarni",
    employeeId: "EMP006",
    leaveType: "Personal Leave",
    from: "Feb 07 2025",
    to: "Feb 14 2025",
    days: 7,
    reason: "Personal work",
    status: "Pending",
  },
];

const LeaveManagement = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const searchInput = useRef(null);

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();

    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  // ==========================================
  // RESET SEARCH
  // ==========================================

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText("");
    setSearchedColumn("");

    confirm();
  };

  // ==========================================
  // SEARCH DROPDOWN
  // ==========================================

  const getColumnSearchProps = (dataIndex, placeholder) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={placeholder}
          value={selectedKeys[0] || ""}
          onChange={(e) => {
            setSelectedKeys(
              e.target.value
                ? [e.target.value]
                : []
            );
          }}
          onPressEnter={() =>
            handleSearch(
              selectedKeys,
              confirm,
              dataIndex
            )
          }
          style={{
            marginBottom: 8,
            display: "block",
            width: 220,
          }}
        />

        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(
                selectedKeys,
                confirm,
                dataIndex
              )
            }
            icon={<SearchOutlined />}
            size="small"
          >
            Search
          </Button>

          <Button
            onClick={() =>
              handleReset(
                clearFilters,
                confirm
              )
            }
            size="small"
          >
            Reset
          </Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered
            ? "#1677ff"
            : undefined,
        }}
      />
    ),

    onFilter: (value, record) => {
      const recordValue =
        record[dataIndex];

      if (!recordValue) {
        return false;
      }

      return recordValue
        .toString()
        .toLowerCase()
        .includes(
          value.toString().toLowerCase()
        );
    },

    filterDropdownProps: {
      onOpenChange: (visible) => {
        if (visible) {
          setTimeout(
            () =>
              searchInput.current?.select(),
            100
          );
        }
      },
    },
  });

  const columns = [
    {
      title: "Employee Name",

      dataIndex: "employeeName",
      key: "employeeName",

      width: 220,
      fixed: "left",

      ...getColumnSearchProps(
        "employeeName",
        "Search employee name"
      ),
    },

    {
      title: "Employee ID",

      dataIndex: "employeeId",
      key: "employeeId",

      width: 150,
      fixed: "left",

      ...getColumnSearchProps(
        "employeeId",
        "Search employee ID"
      ),
    },

    {
      title: "Leave Type",

      dataIndex: "leaveType",
      key: "leaveType",

      width: 180,

      ...getColumnSearchProps(
        "leaveType",
        "Search leave type"
      ),
    },

    {
      title: "From",

      dataIndex: "from",
      key: "from",

      width: 150,

      ...getColumnSearchProps(
        "from",
        "Search from date"
      ),
    },

    {
      title: "To",

      dataIndex: "to",
      key: "to",

      width: 150,

      ...getColumnSearchProps(
        "to",
        "Search to date"
      ),
    },

    {
      title: "Days",

      dataIndex: "days",
      key: "days",

      width: 100,
      align: "center",
    },

    {
      title: "Reason",

      dataIndex: "reason",
      key: "reason",

      width: 250,

      render: (reason) => (
        <span
          title={reason}
          style={{
            display: "inline-block",
            maxWidth: "25ch",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {reason || "N/A"}
        </span>
      ),

      ...getColumnSearchProps(
        "reason",
        "Search reason"
      ),
    },

    // ==========================================
    // STATUS FILTER
    // ==========================================

    {
      title: "Status",

      dataIndex: "status",
      key: "status",

      width: 130,
      align: "center",

      filters: [
        {
          text: "Pending",
          value: "Pending",
        },
        {
          text: "Approved",
          value: "Approved",
        },
        {
          text: "Rejected",
          value: "Rejected",
        },
      ],

      onFilter: (value, record) =>
        record.status === value,

      render: (status) => {
        let color = "default";

        if (status === "Approved") {
          color = "success";
        }

        if (status === "Pending") {
          color = "warning";
        }

        if (status === "Rejected") {
          color = "error";
        }

        return (
          <Tag color={color}>
            {status || "N/A"}
          </Tag>
        );
      },
    },

    // ==========================================
    // ACTIONS
    // ==========================================

    {
      title: "Actions",

      key: "actions",

      width: 150,

      fixed: "right",

      render: (_, record) => (
        <Space size="middle">

          <EyeOutlined
            className="view"
            onClick={() => {
              console.log(
                "View Leave:",
                record
              );
            }}
          />

          <EditOutlined
            className="edit"
            onClick={() => {
              console.log(
                "Edit Leave:",
                record
              );
            }}
          />

          <DeleteOutlined
            className="delete"
            onClick={() => {
              console.log(
                "Delete Leave:",
                record
              );
            }}
          />

        </Space>
      ),
    },
  ];

  return (
    <MainPanel>

      <div className="leave-list">
        <div className="page-header">
          <h2>Leave Management</h2>
          <div className="btn-group">
            <div className="count">
              Total Number Of Leaves:
              <span>{leaveData.length}</span>
            </div>
            <div className="count1">Pending Leaves</div>
            <div className="count1">Approved Leaves</div>
            <div className="count1">Rejected Leaves</div>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={leaveData}
          bordered
          scroll={{
            x: "max-content",
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
          rowClassName={(_, index) =>
            index % 2 === 0
              ? "table-row-light"
              : "table-row-dark"
          }
        />

      </div>

    </MainPanel>
  );
};

export default LeaveManagement;