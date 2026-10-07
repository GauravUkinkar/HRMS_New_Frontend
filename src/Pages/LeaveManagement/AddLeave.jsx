import React, { useContext, useEffect, useState } from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import "./AddLeave.scss";
import { UserContext } from "../../../Context";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Select } from "antd";

const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

const AddLeave = () => {
  const { user } = useContext(UserContext);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [leaveSummary, setLeaveSummary] = useState([]);
  const [addLeaves, setAddLeaves] = useState("");
  const [removeLeaves, setRemoveLeaves] = useState("");
  const [submittingLeaves, setSubmittingLeaves] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const [leaveData, setLeaveData] = useState(null);

  const navigate = useNavigate();

  const handleEmployeeChange = async (values) => {
    setSelectedEmployees(values);

    if (!values.length) {
      setLeaveData(null);
      return;
    }

    const selectedEmployeesData = employees.filter((employee) =>
      values.includes(String(employee.uid)),
    );

    console.log("Selected Employees:", selectedEmployeesData);

    // Single employee
    if (selectedEmployeesData.length === 1) {
      const employeeId = selectedEmployeesData[0]?.employeeId;

      if (employeeId) {
        await getEmployeeLeaveData(employeeId);
      }

      return;
    }

    // Multiple employees
    const leaveResponses = await Promise.all(
      selectedEmployeesData.map(async (employee) => {
        try {
          const res = await axios.get(
            "https://salaryandleaveservice.pandozasolutions.com/admin/getLeaveRecordbyEmployeeId",
            {
              params: {
                employeeId: employee.employeeId,
              },
              withCredentials: true,
            },
          );

          if (res?.data?.status === "OK") {
            return res.data.data;
          }

          return null;
        } catch (error) {
          console.error(`Leave API Error for ${employee.employeeId}:`, error);
          return null;
        }
      }),
    );

    const validLeaveData = leaveResponses.filter(Boolean);

    // Combine leave data
    const combinedLeaveData = {
      paidLeaves: validLeaveData.reduce(
        (total, item) => total + (Number(item.paidLeaves) || 0),
        0,
      ),
      usedLeaves: validLeaveData.reduce(
        (total, item) => total + (Number(item.usedLeaves) || 0),
        0,
      ),
      remainingLeaves: validLeaveData.reduce(
        (total, item) => total + (Number(item.remainingLeaves) || 0),
        0,
      ),
    };

    setLeaveData(combinedLeaveData);
  };

  useEffect(() => {
    getAllEmployee();
  }, []);

  const getAllEmployee = async () => {
    try {
      setLoadingEmployees(true);

      console.log("Employee API URL:", `${BASE_URL}Admin/GetAllEmployee`);

      const res = await axios.get(`${BASE_URL}Admin/GetAllEmployee`, {
        withCredentials: true,
      });

      console.log("All Employee API Response:", res.data);

      const employeeData = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      const employeeList = employeeData
        .map((item) => {
          const employee = item?.data || item;

          if (!employee) {
            return null;
          }

          return {
            uid: employee.uid,
            employeeName: employee.employeeName,
            employeeId: employee.employeeId,
          };
        })
        .filter((employee) => employee?.uid && employee?.employeeId);

      setEmployees(employeeList);

      console.log("Employee List:", employeeList);
    } catch (error) {
      console.error("Get Employee Error:", error);
      console.error("Status:", error?.response?.status);
      console.error("Response:", error?.response?.data);

      setEmployees([]);

      toast.error("Unable to load employees.");
    } finally {
      setLoadingEmployees(false);
    }
  };
  const getLeaveStatus = (leave) => {
    if (typeof leave.approved === "string") {
      const value = leave.approved.trim().toLowerCase();

      if (value === "approved") {
        return "Approved";
      }

      if (value === "rejected") {
        return "Rejected";
      }

      return "Pending";
    }

    if (leave.approved === true || leave.approved === 1) {
      return "Approved";
    }

    if (leave.rejected === true || leave.rejected === 1) {
      return "Rejected";
    }

    if (typeof leave.status === "string") {
      const value = leave.status.trim().toLowerCase();

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

    if (typeof leave.leaveStatus === "string") {
      const value = leave.leaveStatus.trim().toLowerCase();

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
  const getEmployeeLeaveData = async (employeeId) => {
    try {
      const res = await axios.get(
        `https://salaryandleaveservice.pandozasolutions.com/admin/getLeaveRecordbyEmployeeId`,
        {
          params: {
            employeeId: employeeId,
          },
          withCredentials: true,
        },
      );

      console.log("Employee Leave API Response:", res.data);

      if (res?.data?.status === "OK") {
        setLeaveData(res.data.data);
      } else {
        setLeaveData(null);
        toast.info("No leave record found for this employee.");
      }
    } catch (error) {
      console.error("Employee Leave API Error:", error);
      console.error("Response:", error?.response?.data);

      setLeaveData(null);
      toast.error("Unable to load employee leave details.");
    }
  };
  const leaveHistory = leaveSummary.map((leave, index) => {
    const status = getLeaveStatus(leave);

    return {
      id: leave.lid || leave.leaveId || index + 1,

      from: leave.leaveDates?.length ? leave.leaveDates[0]?.date || "-" : "-",

      to: leave.leaveDates?.length
        ? leave.leaveDates[leave.leaveDates.length - 1]?.date || "-"
        : "-",

      days: leave.totalleaveDays || 0,

      reason: leave.leaveReason || "N/A",

      status,
    };
  });
  const pendingLeaves = leaveHistory.filter(
    (leave) => leave.status === "Pending",
  ).length;
  const totalPaidLeaves = Number(leaveData?.paidLeaves) || 0;

  const usedLeaves = Number(leaveData?.usedLeaves) || 0;

  const remainingLeaves = Number(leaveData?.remainingLeaves) || 0;

  const handleLeaveSubmit = async () => {
    if (!selectedEmployees) {
      toast.error("Please select an employee.");
      return;
    }

    const selectedEmp = employees.find(
      (employee) => String(employee.uid) === String(selectedEmployees),
    );

    if (!selectedEmp?.employeeId) {
      toast.error("Employee ID not found.");
      return;
    }

    const addValue = Number(addLeaves);
    const removeValue = Number(removeLeaves);
    const currentPaidLeaves = Number(leaveData?.paidLeaves) || 0;

    // Nothing entered
    if ((!addLeaves || addValue <= 0) && (!removeLeaves || removeValue <= 0)) {
      toast.error("Please enter leaves to add or remove.");
      return;
    }

    // Do not allow both at the same time
    if (addValue > 0 && removeValue > 0) {
      toast.error("Please add or remove leaves separately.");
      return;
    }

    // Remove validation
    if (removeValue > currentPaidLeaves) {
      toast.error("Remove leaves cannot be greater than paid leaves.");
      return;
    }

    try {
      setSubmittingLeaves(true);

      const employeeId = selectedEmp.employeeId;

      // =========================
      // ADD LEAVES
      // =========================
      if (addValue > 0) {
        const addResponse = await axios.post(
          "https://salaryandleaveservice.pandozasolutions.com/admin/addLeaveRecord",
          {
            employeeId: employeeId,
            paidLeaves: addValue,
          },
          {
            withCredentials: true,
          },
        );

        console.log("Add Leave Response:", addResponse.data);
      }

      // =========================
      // REMOVE LEAVES
      // =========================
      if (removeValue > 0) {
        const removeResponse = await axios.put(
          "https://salaryandleaveservice.pandozasolutions.com/admin/removeLeaves",
          {
            employeeId: employeeId,
            paidLeaves: removeValue,
          },
          {
            withCredentials: true,
          },
        );

        console.log("Remove Leave Response:", removeResponse.data);
      }

      // Clear inputs
      setAddLeaves("");
      setRemoveLeaves("");

      // Fetch latest balance
      await getEmployeeLeaveData(employeeId);
    } catch (error) {
      console.error("Leave Update Error:", error);
      console.error("Status:", error?.response?.status);
      console.error("Response:", error?.response?.data);

      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Unable to update leave details.",
      );
    } finally {
      setSubmittingLeaves(false);
    }
  };
  return (
    <>
      <MainPanel
        breadcrumbs={[
          { label: "Dashboard", link: "/dashboard" },
          { label: "Leave Management" },
        ]}
        title={
          String(user?.role || user?.crmRole || "")
            .trim()
            .toUpperCase() === "ADMIN"
            ? "Admin Dashboard"
            : "Admin Dashboard"
        }
      >
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        <div className="view-emp">
          <h1>Manage Leaves</h1>

          <div className="view-emp-bottom">
            {/* EMPLOYEE DROPDOWN */}

            <div className="emp-list">
              <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder={
                  loadingEmployees ? "Loading Employees..." : "Select Employee"
                }
                value={selectedEmployees}
                onChange={handleEmployeeChange}
                disabled={loadingEmployees}
                optionFilterProp="label"
                maxTagCount="responsive"
                style={{ width: "100%" }}
                options={[
                  {
                    label: "Select All",
                    value: "ALL",
                  },
                  ...employees.map((employee) => ({
                    label: `${employee.employeeName} - ${employee.employeeId}`,
                    value: String(employee.uid),
                  })),
                ]}
                onSelect={(value) => {
                  if (value === "ALL") {
                    setSelectedEmployees(
                      employees.map((employee) => String(employee.uid)),
                    );

                    handleEmployeeChange(
                      employees.map((employee) => String(employee.uid)),
                    );
                  }
                }}
              />
            </div>
          </div>
                  {selectedEmployees.length === 1 && (
          <>
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

                  <h3>{totalPaidLeaves}</h3>

                  <p>Leaves available</p>
                </div>
              </div>

              <div className="summary-card used">
                <div className="summary-icon">
                  <CheckCircleOutlined />
                </div>

                <div className="summary-content">
                  <span>Used Leaves</span>

                  <h3>{usedLeaves}</h3>

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

                  <h3>{pendingLeaves}</h3>

                  <p>Requests pending</p>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="leave-action-section">
          <div className="leave-input-group">
            <label>Add Leaves</label>

            <input
              type="number"
              min="0"
              placeholder="Enter leaves to add"
              value={addLeaves}
              onChange={(e) => setAddLeaves(e.target.value)}
            />
          </div>

          <div className="leave-input-group">
            <label>Remove Leaves</label>

            <input
              type="number"
              min="0"
              placeholder="Enter leaves to remove"
              value={removeLeaves}
              onChange={(e) => setRemoveLeaves(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="submit-leave-btn"
            onClick={handleLeaveSubmit}
            disabled={submittingLeaves}
          >
            {submittingLeaves ? "Submitting..." : "Submit"}
          </button>
        </div>
        </div>

      </MainPanel>
    </>
  );
};

export default AddLeave;
