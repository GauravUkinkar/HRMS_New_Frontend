import React, { useContext, useEffect, useState } from "react";
import "./LeaveApplication.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import axios from "axios";
import { UserContext } from "../../../Context";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { toast } from "react-toastify";

const BASE_URL1 = import.meta.env.VITE_SALARY_BACKEND_URL;

const LeaveApplication = () => {
  // GET USER FROM CONTEXT
  const { user } = useContext(UserContext);

  // STATES
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [leaveLoader, setLeaveLoader] = useState(false);

  // GET LEAVE RECORD
  const getAllLeaveRecords = async () => {
    try {
      setLeaveLoader(true);

      const employeeId = user?.employeeId;

      if (!employeeId) {
        console.error("Employee ID not found from user data");
        setLeaveRecords([]);
        return;
      }

      console.log("Leave Employee ID:", employeeId);

      const response = await axios.get(
        `${BASE_URL1}employee/getLeaveRecordbyEmployeeId`,
        {
          params: {
            employeeId: employeeId,
          },
          withCredentials: true,
        },
      );

      console.log("Leave API Response:", response.data);

      const record = response?.data?.data;

      if (record) {
        setLeaveRecords([record]);
      } else {
        setLeaveRecords([]);
      }
    } catch (error) {
      console.error("Leave API Error:", error);
      setLeaveRecords([]);
    } finally {
      setLeaveLoader(false);
    }
  };

  // CALL API WHEN EMPLOYEE ID IS AVAILABLE
  useEffect(() => {
    if (user?.employeeId) {
      getAllLeaveRecords();
    }
  }, [user?.employeeId]);

  // CALCULATE LEAVES
  const totalPaidLeaves = leaveRecords.reduce(
    (total, employee) => total + Number(employee?.paidLeaves || 0),
    0,
  );

  const totalUsedLeaves = leaveRecords.reduce(
    (total, employee) => total + Number(employee?.usedLeaves || 0),
    0,
  );

  const totalRemainingLeaves = leaveRecords.reduce(
    (total, employee) => total + Number(employee?.remainingLeaves || 0),
    0,
  );

  // CHART DATA
  const leaveData = [
    {
      name: "Remaining",
      value: totalRemainingLeaves,
      color: "#ffc52b",
    },
    {
      name: "Paid Leaves",
      value: totalPaidLeaves,
      color: "#42cfa5",
    },
    {
      name: "Leaves Taken",
      value: totalUsedLeaves,
      color: "#ff424c",
    },
  ];

  const[leaveDays, setLeaveDays] = useState("");
  const[leaveReason, setLeaveReason] = useState("");
  const[submitting, setSubmitting] = useState(false);

const handleLeaveSubmit = async (e) => {
  e.preventDefault();

  const employeeId = user?.employeeId;

  console.log("USER:", user);
  console.log("EMPLOYEE ID:", employeeId);

  if (!employeeId) {
    toast.error("Employee ID not found");
    return;
  }

  if (!leaveDays || Number(leaveDays) <= 0) {
    toast.error("Please enter leave days");
    return;
  }

  if (!leaveReason.trim()) {
    toast.error("Please enter leave reason");
    return;
  }

  try {
    setSubmitting(true);

    const payload = {
      uid: 0,
      leaveReason: leaveReason.trim(),
      totalleaveDays: Number(leaveDays),
      employeeId: employeeId,
      employeeName: user?.employeeName || "",
      entryDate: new Date().toISOString(),
      leaveDates: [],
    };

    console.log("Add Leave Payload:", payload);

    const response = await axios.post(
      `${BASE_URL1}AuthController/addLeave`,
      payload,
        {
    headers: {
      "Content-Type": "application/json",
    },
  }

    );

    console.log("Add Leave Response:", response.data);

    toast.success(
      response?.data?.responseMessage ||
        response?.data?.message ||
        "Leave application submitted successfully"
    );

    setLeaveDays("");
    setLeaveReason("");

    await getAllLeaveRecords();
  } catch (error) {
    console.error("Add Leave API Error:", error);
    console.error("Error Response:", error?.response?.data);

    toast.error(
      error?.response?.data?.responseMessage ||
        error?.response?.data?.message ||
        "Failed to submit leave application"
    );
  } finally {
    setSubmitting(false);
  }
};

  return (
    <MainPanel>
      <div className="leave-container">
        <div className="heading">
          <h1>Leave application</h1>
        </div>
        <div className="bottom">
          <div className="leave-content">
            <div className="leave-chart">
              {leaveLoader ? (
                <div className="leave-loading">Loading...</div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leaveData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={100}
                        startAngle={90}
                        endAngle={-270}
                      >
                        {leaveData.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="chart-center">
                    <strong>{totalPaidLeaves}</strong>
                    <span>Total Leaves</span>
                  </div>
                </>
              )}
            </div>

            <div className="leave-legend">
              {leaveData.map((item) => (
                <div className="legend-row" key={item.name}>
                  <div className="legend-left">
                    <span
                      className="legend-dot"
                      style={{
                        backgroundColor: item.color,
                      }}
                    ></span>

                    <span>{item.name}</span>
                  </div>

                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="leave-form">
            <div className="form-header">Leave Application</div>

<form className="form-body" onSubmit={handleLeaveSubmit}>
  <label>Enter Leave Days</label>

  <input
    type="number"
    min="1"
    placeholder="Enter Leave Days"
    value={leaveDays}
    onChange={(e) => setLeaveDays(e.target.value)}
    disabled={submitting}
  />

  {totalRemainingLeaves > 0 ? (
    <>
      <label>Enter Paid Leaves</label>

      <input
        type="number"
        min="1"
        max={totalRemainingLeaves}
        placeholder="Enter Paid Leaves"
        disabled={submitting}
      />
    </>
  ) : (
    <div className="no-paid-leave">
      <span>*</span> Paid leaves are not present
    </div>
  )}

  <label>Enter Leave Reason</label>

  <textarea
    placeholder="Enter Leave Reason"
    value={leaveReason}
    onChange={(e) => setLeaveReason(e.target.value)}
    disabled={submitting}
  />

  <button type="submit" disabled={submitting}>
    {submitting ? "Submitting..." : "Submit"}
  </button>
</form>
          </div>
        </div>
      </div>
    </MainPanel>
  );
};

export default LeaveApplication;
