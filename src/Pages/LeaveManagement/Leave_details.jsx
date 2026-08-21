import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./leave_details.scss";

const Leave_details = () => {
  const navigate = useNavigate();

  const employee = {
    name: "Shubhangi Bhise",
    employeeId: "ABCD12345678",
    department: "Development",
    designation: "React Developer",
    joiningDate: "12 Jan 2024",
    totalPaidLeaves: 24,
    usedLeaves: 8,
    pendingLeaves: 2,
  };

  const remainingLeaves =
    employee.totalPaidLeaves - employee.usedLeaves;

  const leaveHistory = [
    {
      id: 1,
      type: "Casual Leave",
      from: "12 Aug 2026",
      to: "14 Aug 2026",
      days: 3,
      reason: "Personal work",
      status: "Approved",
    },
    {
      id: 2,
      type: "Sick Leave",
      from: "02 Aug 2026",
      to: "03 Aug 2026",
      days: 2,
      reason: "Health issue",
      status: "Rejected",
    },
    {
      id: 3,
      type: "Casual Leave",
      from: "20 Aug 2026",
      to: "21 Aug 2026",
      days: 2,
      reason: "Family function",
      status: "Pending",
    },
  ];

  return (
    <div className="leave-details-page">
      <div className="leave-details-header">
        <div>
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftOutlined />
            Back
          </button>

          <h1>Leave Details</h1>
          <p>Employee leave summary and history</p>
        </div>
      </div>

      <div className="employee-card">
        <div className="employee-profile">
          <div className="employee-avatar">
            <UserOutlined />
          </div>

          <div className="employee-info">
            <h2>{employee.name}</h2>
            <span>Employee ID: {employee.employeeId}</span>
          </div>
        </div>

        <div className="employee-details">
          <div>
            <span>Department</span>
            <strong>{employee.department}</strong>
          </div>

          <div>
            <span>Designation</span>
            <strong>{employee.designation}</strong>
          </div>

          <div>
            <span>Joining Date</span>
            <strong>{employee.joiningDate}</strong>
          </div>
        </div>
      </div>

      <div className="section-title">
        <h2>Leave Summary</h2>
        <p>Current leave balance</p>
      </div>

      <div className="leave-summary">
        <div className="summary-card total">
          <div className="summary-icon">
            <CalendarOutlined />
          </div>

          <div className="summary-content">
            <span>Total Paid Leaves</span>
            <h3>{employee.totalPaidLeaves}</h3>
            <p>Leaves available</p>
          </div>
        </div>

        <div className="summary-card used">
          <div className="summary-icon">
            <CheckCircleOutlined />
          </div>

          <div className="summary-content">
            <span>Used Leaves</span>
            <h3>{employee.usedLeaves}</h3>
            <p>Leaves used</p>
          </div>
        </div>

        <div className="summary-card remaining">
          <div className="summary-icon">
            <CalendarOutlined />
          </div>

          <div className="summary-content">
            <span>Remaining Leaves</span>
            <h3>{remainingLeaves}</h3>
            <p>Leaves remaining</p>
          </div>
        </div>

        <div className="summary-card pending">
          <div className="summary-icon">
            <ClockCircleOutlined />
          </div>

          <div className="summary-content">
            <span>Pending Requests</span>
            <h3>{employee.pendingLeaves}</h3>
            <p>Requests pending</p>
          </div>
        </div>
      </div>

      <div className="leave-history-section">
        <div className="section-title">
          <div>
            <h2>Leave History</h2>
            <p>Employee leave request history</p>
          </div>
        </div>

        <div className="leave-table-wrapper">
          <table className="leave-table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {leaveHistory.map((leave) => (
                <tr key={leave.id}>
                  <td>
                    <div className="leave-type">
                      <CalendarOutlined />
                      {leave.type}
                    </div>
                  </td>

                  <td>{leave.from}</td>

                  <td>{leave.to}</td>

                  <td>
                    <strong>{leave.days}</strong>
                  </td>

                  <td>{leave.reason}</td>

                  <td>
                    <span
                      className={`status-badge ${leave.status.toLowerCase()}`}
                    >
                      {leave.status === "Approved" && (
                        <CheckCircleOutlined />
                      )}

                      {leave.status === "Rejected" && (
                        <CloseCircleOutlined />
                      )}

                      {leave.status === "Pending" && (
                        <ClockCircleOutlined />
                      )}

                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leave_details;