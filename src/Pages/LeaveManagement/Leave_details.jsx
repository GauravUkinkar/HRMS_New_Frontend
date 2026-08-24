import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Table } from "antd";
import "./leave_details.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import { MdAttachEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { LuWarehouse } from "react-icons/lu";
import { SiMaterialdesign } from "react-icons/si";
import { FaUserTie } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";

import maleUser from "../../assets/manuser.webp";
import femaleUser from "../../assets/women_user.png";

const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;
const BASE_URL1 = import.meta.env.VITE_SALARY_BACKEND_URL;

const Leave_details = () => {
  const { employeeId } = useParams();

  const [employee, setEmployee] = useState(null);
  const [leaveData, setLeaveData] = useState(null);
  const [leaveSummary, setLeaveSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  const getEmployee = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}Admin/GetEmployeeById/${employeeId}`,
        {
          withCredentials: true,
        }
      );

      const employeeData = res.data.data;

      console.log("Employee Response:", employeeData);

      setImageError(false);
      setEmployee(employeeData);

      if (employeeData?.uid) {
        await getEmployeeLeaveSummary(employeeData.uid);
      }
    } catch (error) {
      console.error("Get Employee Error:", error);

      setError(
        error?.response?.data?.message ||
          "Unable to fetch employee details."
      );
    }
  };

  const getEmployeeleave = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL1}admin/getLeaveRecordbyEmployeeId`,
        {
          params: {
            employeeId,
          },
          withCredentials: true,
        }
      );

      console.log("Leave Balance Response:", res.data);

      setLeaveData(res.data.data);
    } catch (error) {
      console.error("Get Leave Balance Error:", error);
    }
  };

  const getEmployeeLeaveSummary = async (uid) => {
    try {
      const res = await axios.get(
        `${BASE_URL1}AuthController/getAllLeaveRequestByuid`,
        {
          params: {
            uId: uid,
          },
          withCredentials: true,
        }
      );

      console.log("Leave History Response:", res.data);

      const historyData = res.data.data;

      if (Array.isArray(historyData)) {
        setLeaveSummary(historyData);
      } else if (historyData) {
        setLeaveSummary([historyData]);
      } else {
        setLeaveSummary([]);
      }
    } catch (error) {
      console.error("Get Leave History Error:", error);
      setLeaveSummary([]);
    }
  };

  useEffect(() => {
    if (!employeeId) {
      setError("Employee ID not found.");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        await Promise.all([
          getEmployee(),
          getEmployeeleave(),
        ]);
      } catch (error) {
        console.error("Page Load Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [employeeId]);

  if (loading) {
    return (
      <MainPanel
        title="Leave Profile"
        breadcrumbs={[
          {
            label: "Dashboard",
            link: "/dashboard",
          },
          {
            label: "Leave Management",
            link: "/leaveManagement",
          },
          {
            label: "Leave Profile",
          },
        ]}
      >
        <div className="leave-details-page">
          <div className="loading-box">
            <p>Loading employee details...</p>
          </div>
        </div>
      </MainPanel>
    );
  }

  if (error) {
    return (
      <MainPanel
        title="Leave Profile"
        breadcrumbs={[
          {
            label: "Dashboard",
            link: "/dashboard",
          },
          {
            label: "Leave Management",
            link: "/leaveManagement",
          },
          {
            label: "Leave Profile",
          },
        ]}
      >
        <div className="leave-details-page">
          <div className="error-box">
            <p>{error}</p>
          </div>
        </div>
      </MainPanel>
    );
  }

  if (!employee) {
    return (
      <MainPanel
        title="Leave Profile"
        breadcrumbs={[
          {
            label: "Dashboard",
            link: "/dashboard",
          },
          {
            label: "Leave Management",
            link: "/leaveManagement",
          },
          {
            label: "Leave Profile",
          },
        ]}
      >
        <div className="leave-details-page">
          <div className="error-box">
            <p>Employee details not found.</p>
          </div>
        </div>
      </MainPanel>
    );
  }

  const name = employee.employeeName || "N/A";

  const empId = employee.employeeId || employeeId;

  const department = employee.department || "N/A";

  const designation = employee.designation || "N/A";

  const email =
    employee.email ||
    employee.emailAddress ||
    "";

  const phone =
    employee.contactNumber ||
    "";

  const joiningDate =
    employee.dateOfJoining ||
    "N/A";

  const role =
    employee.role ||
    "Employee";

  const status =
    employee.employeeStatus ||
    employee.status ||
    "Active";

  const profileImage =
    employee.image || "";

  const gender =
    employee.gender?.toLowerCase() || "";

  const fallbackImage =
    gender === "female"
      ? femaleUser
      : maleUser;

  const totalPaidLeaves =
    Number(leaveData?.paidLeaves) || 0;

  const usedLeaves =
    Number(leaveData?.usedLeaves) || 0;

  const remainingLeaves =
    Number(leaveData?.remainingLeaves) || 0;

  const getLeaveStatus = (leave) => {
    if (typeof leave.approved === "string") {
      const value = leave.approved
        .trim()
        .toLowerCase();

      if (value === "approved") {
        return "Approved";
      }

      if (value === "rejected") {
        return "Rejected";
      }

      return "Pending";
    }

    if (
      leave.approved === true ||
      leave.approved === 1
    ) {
      return "Approved";
    }

    if (
      leave.rejected === true ||
      leave.rejected === 1
    ) {
      return "Rejected";
    }

    if (
      typeof leave.status === "string"
    ) {
      const value = leave.status
        .trim()
        .toLowerCase();

      if (value === "approved") {
        return "Approved";
      }

      if (value === "rejected") {
        return "Rejected";
      }

      if (value === "pending") {
        return "Pending";
      }
    }

    if (
      typeof leave.leaveStatus === "string"
    ) {
      const value = leave.leaveStatus
        .trim()
        .toLowerCase();

      if (value === "approved") {
        return "Approved";
      }

      if (value === "rejected") {
        return "Rejected";
      }

      if (value === "pending") {
        return "Pending";
      }
    }

    return "Pending";
  };

  const leaveHistory = leaveSummary.map(
    (leave, index) => {
      const status = getLeaveStatus(leave);

      return {
        id:
          leave.lid ||
          leave.leaveId ||
          index + 1,

        from:
          leave.leaveDates?.length
            ? leave.leaveDates[0]?.date || "-"
            : "-",

        to:
          leave.leaveDates?.length
            ? leave.leaveDates[
                leave.leaveDates.length - 1
              ]?.date || "-"
            : "-",

        days:
          leave.totalleaveDays ||
          0,

        reason:
          leave.leaveReason ||
          "N/A",

        status,
      };
    }
  );

  const pendingLeaves =
    leaveHistory.filter(
      (leave) =>
        leave.status === "Pending"
    ).length;

  const leaveColumns = [
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      width: 280,

      render: (reason) => (
        <span
          title={reason}
          style={{
            display: "inline-block",
            maxWidth: "250px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {reason || "-"}
        </span>
      ),
    },

    {
      title: "From Date",
      dataIndex: "from",
      key: "from",
      width: 150,
    },

    {
      title: "To Date",
      dataIndex: "to",
      key: "to",
      width: 150,
    },

    {
      title: "Days",
      dataIndex: "days",
      key: "days",
      width: 100,
      align: "center",

      render: (days) => (
        <strong>{days}</strong>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 180,
      align: "center",

      render: (status) => {
        const currentStatus = status
          ?.toString()
          .trim()
          .toLowerCase();

        if (currentStatus === "approved") {
          return (
            <span className="approved-status">
              <CheckCircleOutlined />
              Approved
            </span>
          );
        }

        if (currentStatus === "rejected") {
          return (
            <span className="rejected-status">
              <CloseCircleOutlined />
              Rejected
            </span>
          );
        }

        return (
          <span className="pending-status">
            <ClockCircleOutlined />
            Pending
          </span>
        );
      },
    },
  ];

  return (
    <MainPanel
      title="Leave Profile"
      breadcrumbs={[
        {
          label: "Dashboard",
          link: "/dashboard",
        },
        {
          label: "Leave Management",
          link: "/leaveManagement",
        },
        {
          label: "Leave Profile",
        },
      ]}
    >
      <div className="leave-details-page">

        <div className="leave-details-header">
          <h1>Leave Details</h1>
        </div>

        <div className="employee-card">

          <div className="left-side">

            <div className="employee-profile">

              <div className="employee-avatar">
                <img
                  src={
                    !imageError && profileImage
                      ? profileImage
                      : fallbackImage
                  }
                  alt={name}
                  onError={() => {
                    setImageError(true);
                  }}
                />
              </div>

              <div className="employee-info">

                <h2>
                  {name}

                  <span className="status">
                    {status}
                  </span>
                </h2>

                <div className="eid">
                  Employee ID:
                  <span>{empId}</span>
                </div>

                {email && (
                  <div className="mail">
                    <MdAttachEmail />

                    <a
                      href={`mailto:${email}`}
                    >
                      {email}
                    </a>
                  </div>
                )}

                {phone && (
                  <div className="phone">
                    <FaPhoneAlt />

                    <a
                      href={`tel:${phone}`}
                    >
                      {phone}
                    </a>
                  </div>
                )}

              </div>

            </div>

          </div>

          <div className="right-side">

            <div className="department">
              <LuWarehouse />

              <span>
                Department: {department}
              </span>
            </div>

            <div className="designation">
              <SiMaterialdesign />

              <span>
                Designation: {designation}
              </span>
            </div>

            <div className="j-date">
              <FaCalendarAlt />

              <span>
                Joining Date: {joiningDate}
              </span>
            </div>

            <div className="role">
              <FaUserTie />

              <span>
                Role: {role}
              </span>
            </div>

          </div>

        </div>

        <div className="section-title">

          <h2>
            Leave Summary
          </h2>

          <p>
            Current leave balance
          </p>

        </div>

        <div className="leave-summary">

          <div className="summary-card total">

            <div className="summary-icon">
              <CalendarOutlined />
            </div>

            <div className="summary-content">

              <span>
                Total Paid Leaves
              </span>

              <h3>
                {totalPaidLeaves}
              </h3>

              <p>
                Leaves available
              </p>

            </div>

          </div>

          <div className="summary-card used">

            <div className="summary-icon">
              <CheckCircleOutlined />
            </div>

            <div className="summary-content">

              <span>
                Used Leaves
              </span>

              <h3>
                {usedLeaves}
              </h3>

              <p>
                Leaves used
              </p>

            </div>

          </div>

          <div className="summary-card remaining">

            <div className="summary-icon">
              <CalendarOutlined />
            </div>

            <div className="summary-content">

              <span>
                Remaining Leaves
              </span>

              <h3>
                {remainingLeaves}
              </h3>

              <p>
                Leaves remaining
              </p>

            </div>

          </div>

          <div className="summary-card pending">

            <div className="summary-icon">
              <ClockCircleOutlined />
            </div>

            <div className="summary-content">

              <span>
                Pending Requests
              </span>

              <h3>
                {pendingLeaves}
              </h3>

              <p>
                Requests pending
              </p>

            </div>

          </div>

        </div>

        <div className="leave-history-section">

          <div className="section-title">

            <div>

              <h2>
                Leave History
              </h2>

              <p>
                Employee leave request history
              </p>

            </div>

          </div>

          <div className="leave-table-wrapper">

            <Table
              columns={leaveColumns}
              dataSource={leaveHistory}
              rowKey={(record) => record.id}
              loading={loading}
              bordered
              scroll={{
                x: "max-content",
              }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: [
                  "10",
                  "20",
                  "50",
                  "100",
                ],
              }}
              rowClassName={
                (_record, index) =>
                  index % 2 === 0
                    ? "table-row-light"
                    : "table-row-dark"
              }
              locale={{
                emptyText:
                  "No leave history found.",
              }}
            />

          </div>

        </div>

      </div>
    </MainPanel>
  );
};

export default Leave_details;