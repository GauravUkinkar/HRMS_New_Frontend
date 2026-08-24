import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./leave_details.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import { MdAttachEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { LuWarehouse } from "react-icons/lu";
import { SiMaterialdesign } from "react-icons/si";
import { FaUserTie } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;
const BASE_URL1 = import.meta.env.VITE_SALARY_BACKEND_URL;

const Leave_details = () => {
  const { employeeId } = useParams();

  const [employee, setEmployee] = useState(null);
  const [leaveData, setLeaveData] = useState(null);
  const [leaveSummary, setLeaveSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      console.log("Leave History Response:", res.data.data);

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

  const uid = employee.uid || "";

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

  const totalPaidLeaves =
    Number(leaveData?.paidLeaves) || 0;

  const usedLeaves =
    Number(leaveData?.usedLeaves) || 0;

  const remainingLeaves =
    Number(leaveData?.remainingLeaves) || 0;

  const pendingLeaves = leaveSummary.filter((leave) => {
    const status =
      leave.status ||
      leave.leaveStatus ||
      leave.requestStatus ||
      "";

    return status.toLowerCase() === "pending";
  }).length;

  const leaveHistory = leaveSummary.map(
    (leave, index) => {
      const status =
        leave.status ||
        leave.leaveStatus ||
        leave.requestStatus ||
        "Pending";

      return {
        id:
          leave.id ||
          leave.leaveId ||
          leave.lid ||
          index + 1,

        type:
          leave.type ||
          leave.leaveType ||
          leave.leaveName ||
          "Leave",

        from:
          leave.from ||
          leave.fromDate ||
          leave.startDate ||
          "N/A",

        to:
          leave.to ||
          leave.toDate ||
          leave.endDate ||
          "N/A",

        days:
          leave.days ||
          leave.totalDays ||
          leave.numberOfDays ||
          0,

        reason:
          leave.reason ||
          leave.leaveReason ||
          "N/A",

        status,
      };
    }
  );

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
                <UserOutlined />
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

                    <a href={`mailto:${email}`}>
                      {email}
                    </a>
                  </div>
                )}

                {phone && (
                  <div className="phone">
                    <FaPhoneAlt />

                    <a href={`tel:${phone}`}>
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

                {leaveHistory.length > 0 ? (

                  leaveHistory.map((leave) => (

                    <tr key={leave.id}>

                      <td>

                        <div className="leave-type">

                          <CalendarOutlined />

                          {leave.type}

                        </div>

                      </td>

                      <td>
                        {leave.from}
                      </td>

                      <td>
                        {leave.to}
                      </td>

                      <td>

                        <strong>
                          {leave.days}
                        </strong>

                      </td>

                      <td>
                        {leave.reason}
                      </td>

                      <td>

                        <span
                          className={`status-badge ${leave.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
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

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                      }}
                    >
                      No leave history found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </MainPanel>
  );
};

export default Leave_details;