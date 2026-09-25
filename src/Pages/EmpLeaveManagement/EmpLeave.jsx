
import React, { useContext, useEffect, useRef, useState } from "react";
import { Table, Space, Input, Button, message } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import "./EmpLeave.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../Context";
import { IoMdArrowBack } from "react-icons/io";


const BASE_URL = import.meta.env.VITE_SALARY_BACKEND_URL;

const LeaveManagement = () => {
  const { user } = useContext(UserContext);

  const navigate = useNavigate();
  const searchInput = useRef(null);

  const [loading, setLoading] = useState(false);
  const [leaveData, setLeaveData] = useState([]);

  const normalizeStatus = (status) => {
    if (!status) {
      return "Pending";
    }

    const value = status.toString().trim().toLowerCase();

    if (value === "pending") {
      return "Pending";
    }

    if (value === "approved") {
      return "Approved";
    }

    if (value === "rejected") {
      return "Rejected";
    }

    return status;
  };

  const getAllLeaves = async () => {
    try {
      if (!user?.uid) return;

      setLoading(true);

      const response = await axios.get(
        `${BASE_URL}AuthController/getAllLeaveRequestByuid?uId=${user.uid}`,
        {
          withCredentials: true,
        }
      );

      console.log("Employee Leaves:", response.data);

      const leaves = response.data?.data || [];

      const formattedData = leaves.map((item) => ({
        key: item.lid,
        lid: item.lid,

        employeeName: item.employeeName || "-",
        employeeId: item.employeeId || "-",

        leaveType: item.leaveReason || "-",
        reason: item.leaveReason || "-",

        days: item.totalleaveDays || 0,

        from: item.leaveDates?.length
          ? item.leaveDates[0]?.date || "-"
          : "-",

        to: item.leaveDates?.length
          ? item.leaveDates[item.leaveDates.length - 1]?.date || "-"
          : "-",

        leaveDates: item.leaveDates || [],

        entryDate: item.entryDate || null,

        status: normalizeStatus(item.approved),
      }));

      console.log("FORMATTED LEAVE DATA:", formattedData);

      setLeaveData(formattedData);
    } catch (error) {
      console.error(
        "GET ALL LEAVES ERROR:",
        error.response?.data || error
      );

      message.error("Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      getAllLeaves();
    }
  }, [user?.uid]);

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    confirm();
  };

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
              e.target.value ? [e.target.value] : []
            );
          }}
          onPressEnter={() =>
            handleSearch(selectedKeys, confirm)
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
              handleSearch(selectedKeys, confirm)
            }
            icon={<SearchOutlined />}
            size="small"
          >
            Search
          </Button>

          <Button
            onClick={() =>
              handleReset(clearFilters, confirm)
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
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),

    onFilter: (value, record) => {
      const recordValue = record[dataIndex];

      if (
        recordValue === undefined ||
        recordValue === null
      ) {
        return false;
      }

      return recordValue
        .toString()
        .toLowerCase()
        .includes(value.toString().toLowerCase());
    },

    filterDropdownProps: {
      onOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => {
            searchInput.current?.select();
          }, 100);
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
      width: 160,
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
      width: 160,
      ...getColumnSearchProps(
        "leaveType",
        "Search leave type"
      ),
    },

    {
      title: "From",
      dataIndex: "from",
      key: "from",
      width: 140,
    },

    {
      title: "To",
      dataIndex: "to",
      key: "to",
      width: 140,
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
      width: 220,

      render: (reason) => (
        <span
          title={reason}
          style={{
            display: "inline-block",
            maxWidth: "200px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {reason || "-"}
        </span>
      ),

      ...getColumnSearchProps(
        "reason",
        "Search reason"
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      align: "center",

      render: (status) => {
        const currentStatus = status
          ?.toString()
          .trim()
          .toLowerCase();

        if (currentStatus === "pending") {
          return (
            <span className="pending-status">
              Pending
            </span>
          );
        }

        if (currentStatus === "approved") {
          return (
            <span className="approved-status">
              Approved
            </span>
          );
        }

        if (currentStatus === "rejected") {
          return (
            <span className="rejected-status">
              Rejected
            </span>
          );
        }

        return "-";
      },
    },


  ];

  return (
    <MainPanel
                  breadcrumbs={[
          { label: "Dashboard", link: "/" },
          { label: "Leave Management" },
        ]}
        
        title={
          String(user?.role || user?.crmRole || "")
            .trim()
            .toUpperCase() === "EMPLOYEE"
            ? "Employee Dashboard"
            : "Admin Dashboard"
        }
    >
              <Link to="/">
              <button className="btn1"><IoMdArrowBack />Back</button></Link>
      <div className="leave-list">
        <div className="page-header">
          <h2>Leave Management</h2>
          <Link to="/leaveApplication">
            <button className="btn" >Apply Leave</button>
            </Link>
        
        </div>

        <Table
          loading={loading}
          columns={columns}
          dataSource={leaveData}
          bordered
          scroll={{
            x: "max-content",
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          rowClassName={(_record, index) =>
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

