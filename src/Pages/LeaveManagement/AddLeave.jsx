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
const BASE_URL_LEAVE = import.meta.env.VITE_LEAVE_BACKEND_URL;

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

  // GET ALL EMPLOYEES
  const getAllEmployee = async () => {
    try {
      setLoadingEmployees(true);

      const res = await axios.get(`${BASE_URL}Admin/GetAllEmployee`, {
        withCredentials: true,
      });

      const employeeData = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      const employeeList = employeeData
        .map((item) => {
          const employee = item?.data || item;

          if (!employee) return null;

          return {
            uid: employee.uid,
            employeeName: employee.employeeName,
            employeeId: employee.employeeId,
          };
        })
        .filter(
          (employee) =>
            employee?.uid !== undefined &&
            employee?.uid !== null &&
            employee?.employeeId
        );

      setEmployees(employeeList);
    } catch (error) {
      console.error("Get Employee Error:", error);
      console.error("Response:", error?.response?.data);

      setEmployees([]);
      toast.error("Unable to load employees.");
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    getAllEmployee();
  }, []);

  // GET LEAVE DATA FOR ONE EMPLOYEE
  const getEmployeeLeaveData = async (employeeId) => {
    try {
      const res = await axios.get(
        "https://salaryandleaveservice.pandozasolutions.com/admin/getLeaveRecordbyEmployeeId",
        {
          params: { employeeId },
          withCredentials: true,
        }
      );

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

  // HANDLE EMPLOYEE SELECTION
  const handleEmployeeChange = async (values) => {
    const normalizedValues = (values || [])
      .filter((value) => value !== "ALL")
      .map(String);

    setSelectedEmployees(normalizedValues);

    if (!normalizedValues.length) {
      setLeaveData(null);
      setLeaveSummary([]);
      return;
    }

    const selectedEmployeesData = employees.filter((employee) =>
      normalizedValues.includes(String(employee.uid))
    );

    if (selectedEmployeesData.length === 1) {
      const employeeId = selectedEmployeesData[0]?.employeeId;

      if (employeeId) {
        await getEmployeeLeaveData(employeeId);
      }

      return;
    }

    try {
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
              }
            );

            if (res?.data?.status === "OK") {
              return res.data.data;
            }

            return null;
          } catch (error) {
            console.error(
              `Leave API Error for ${employee.employeeId}:`,
              error
            );
            return null;
          }
        })
      );

      const validLeaveData = leaveResponses.filter(Boolean);

      const combinedLeaveData = {
        paidLeaves: validLeaveData.reduce(
          (total, item) => total + (Number(item.paidLeaves) || 0),
          0
        ),
        usedLeaves: validLeaveData.reduce(
          (total, item) => total + (Number(item.usedLeaves) || 0),
          0
        ),
        remainingLeaves: validLeaveData.reduce(
          (total, item) => total + (Number(item.remainingLeaves) || 0),
          0
        ),
      };

      setLeaveData(combinedLeaveData);
    } catch (error) {
      console.error("Multiple Employee Leave Error:", error);
      setLeaveData(null);
      toast.error("Unable to load leave details.");
    }
  };

  // LEAVE STATUS
  const getLeaveStatus = (leave) => {
    if (typeof leave.approved === "string") {
      const value = leave.approved.trim().toLowerCase();

      if (value === "approved") return "Approved";
      if (value === "rejected") return "Rejected";

      return "Pending";
    }

    if (leave.approved === true || leave.approved === 1) {
      return "Approved";
    }

    if (leave.rejected === true || leave.rejected === 1) {
      return "Rejected";
    }

    const status = String(
      leave.status || leave.leaveStatus || ""
    )
      .trim()
      .toLowerCase();

    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";

    return "Pending";
  };

  const leaveHistory = leaveSummary.map((leave, index) => ({
    id: leave.lid || leave.leaveId || index + 1,
    from: leave.leaveDates?.length
      ? leave.leaveDates[0]?.date || "-"
      : "-",
    to: leave.leaveDates?.length
      ? leave.leaveDates[leave.leaveDates.length - 1]?.date || "-"
      : "-",
    days: leave.totalleaveDays || 0,
    reason: leave.leaveReason || "N/A",
    status: getLeaveStatus(leave),
  }));

  const pendingLeaves = leaveHistory.filter(
    (leave) => leave.status === "Pending"
  ).length;

  const totalPaidLeaves = Number(leaveData?.paidLeaves) || 0;
  const usedLeaves = Number(leaveData?.usedLeaves) || 0;
  const remainingLeaves = Number(leaveData?.remainingLeaves) || 0;

  // ADD OR REMOVE LEAVES
  const handleLeaveSubmit = async () => {
    if (!selectedEmployees.length) {
      toast.error("Please select at least one employee.");
      return;
    }

    const selectedEmps = employees.filter((employee) =>
      selectedEmployees.includes(String(employee.uid))
    );

    if (!selectedEmps.length) {
      toast.error("No valid employees selected.");
      return;
    }

    const addValue = Number(addLeaves);
    const removeValue = Number(removeLeaves);

    if (
      (addLeaves !== "" &&
        (!Number.isFinite(addValue) || addValue < 0)) ||
      (removeLeaves !== "" &&
        (!Number.isFinite(removeValue) || removeValue < 0))
    ) {
      toast.error("Leave values must be valid non-negative numbers.");
      return;
    }

    if (
      (!addLeaves || addValue <= 0) &&
      (!removeLeaves || removeValue <= 0)
    ) {
      toast.error("Please enter leaves to add or remove.");
      return;
    }

    if (addValue > 0 && removeValue > 0) {
      toast.error("Please add or remove leaves separately.");
      return;
    }

    try {
      setSubmittingLeaves(true);

      // ADD LEAVES
      if (addValue > 0) {
        const payload = selectedEmps.map((employee) => ({
          employeeId: employee.employeeId,
          paidLeaves: addValue,
        }));

        const response = await axios.post(
          `${BASE_URL_LEAVE}admin/addLeaveRecord`,
          payload,
          {
            withCredentials: true,
          }
        );

        console.log("Add Leaves Response:", response.data);
      }

// REMOVE LEAVES
// REMOVE LEAVES
if (removeValue > 0) {
  for (const employee of selectedEmps) {
    const payload = [
      {
        employeeId: employee.employeeId,
        paidLeaves: removeValue,
      },
    ];

    try {
      const response = await axios.post(
        `${BASE_URL_LEAVE}admin/removeLeavesByEmployeeId`,
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Remove Leaves Response:", response.data);
    } catch (error) {
      console.error("Remove Leaves Status:", error.response?.status);
      console.error("Remove Leaves Response:", error.response?.data);
      throw error;
    }
  }
}

      setAddLeaves("");
      setRemoveLeaves("");

      toast.success("Leave details updated successfully.");

      // REFRESH SELECTED EMPLOYEE LEAVE DATA
      await handleEmployeeChange(selectedEmployees);
    } catch (error) {
      console.error("Leave Update Error:", error);
      console.error("Status:", error?.response?.status);
      console.error("Response:", error?.response?.data);

      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Unable to update leave details."
      );
    } finally {
      setSubmittingLeaves(false);
    }
  };

  return (
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
          <div className="emp-list">
            <Select
              mode="multiple"
              allowClear
              showSearch
              placeholder={
                loadingEmployees
                  ? "Loading Employees..."
                  : "Select Employee"
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
                  const allEmployeeUids = employees.map((employee) =>
                    String(employee.uid)
                  );

                  handleEmployeeChange(allEmployeeUids);
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
  );
};

export default AddLeave;