import React, { useContext, useEffect, useState } from "react";
import "./LeaveApplication.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import axios from "axios";
import { UserContext } from "../../../Context";
import DatePickerModule from "react-multi-date-picker";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { toast } from "react-toastify";

const DatePicker = DatePickerModule?.default || DatePickerModule;

const BASE_URL1 = import.meta.env.VITE_SALARY_BACKEND_URL;

const LeaveApplication = () => {
  const { user } = useContext(UserContext);
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [leaveLoader, setLeaveLoader] = useState(false);

  const [leaveDates, setLeaveDates] = useState([]);
  const [leaveReason, setLeaveReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [legends, setLegends] = useState(false);


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


  useEffect(() => {
    if (user?.employeeId) {
      getAllLeaveRecords();
    }
  }, [user?.employeeId]);


  const totalPaidLeaves = leaveRecords.reduce(
    (total, employee) =>
      total + Number(employee?.paidLeaves || 0),
    0,
  );

  const totalUsedLeaves = leaveRecords.reduce(
    (total, employee) =>
      total + Number(employee?.usedLeaves || 0),
    0,
  );

  const totalRemainingLeaves = leaveRecords.reduce(
    (total, employee) =>
      total + Number(employee?.remainingLeaves || 0),
    0,
  );

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
  const handleDayClick = (clickedDate) => {
    const dateStr = clickedDate.format("YYYY-MM-DD");

    const currentLeaveDates = leaveDates || [];

    const existingIndex = currentLeaveDates.findIndex(
      (item) => item.date === dateStr,
    );
    if (existingIndex === -1) {
      setLeaveDates([
        ...currentLeaveDates,
        {
          date: dateStr,
          isPL: false,
        },
      ]);

      return;
    }

    const existing = currentLeaveDates[existingIndex];
    if (!existing.isPL) {
      const paidLeaveCount = currentLeaveDates.filter(
        (item) => item.isPL === true,
      ).length;

      // Check paid leave limit
      if (paidLeaveCount >= totalRemainingLeaves) {
        toast.error(
          `You have only ${totalRemainingLeaves} paid leave(s) remaining`,
        );

        return;
      }

      const updated = [...currentLeaveDates];

      updated[existingIndex] = {
        ...updated[existingIndex],
        isPL: true,
      };

      setLeaveDates(updated);

      return;
    }
    const updated = currentLeaveDates.filter(
      (item) => item.date !== dateStr,
    );

    setLeaveDates(updated);
  };
  const handleLeaveSubmit = async (e) => {
    e.preventDefault();

    const employeeId = user?.employeeId;

    console.log("USER:", user);
    console.log("EMPLOYEE ID:", employeeId);

    if (!employeeId) {
      toast.error("Employee ID not found");
      return;
    }

    if (!leaveDates.length) {
      toast.error("Please select at least one leave date");
      return;
    }

    if (!leaveReason.trim()) {
      toast.error("Please enter leave reason");
      return;
    }

    const paidLeaveCount = leaveDates.filter(
      (item) => item.isPL === true,
    ).length;

    if (paidLeaveCount > totalRemainingLeaves) {
      toast.error(
        `You can select maximum ${totalRemainingLeaves} paid leave(s)`,
      );

      return;
    }

    try {
      setSubmitting(true);
const formatEntryDate = () => {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")} ${String(
    now.getHours()
  ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
    now.getSeconds()
  ).padStart(2, "0")}`;
};

      const payload = {
        uid: user?.uid,

        leaveReason: leaveReason.trim(),

        totalleaveDays: leaveDates.length,

        employeeId: employeeId,

        employeeName: user?.employeeName || "",

        entryDate: formatEntryDate(),

        leaveDates: leaveDates.map((item) => ({
          date: item.date,
          isPL: item.isPL,
        })),
      };

      console.log("Add Leave Payload:", payload);

      const response = await axios.post(
        `${BASE_URL1}AuthController/addLeave`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials:true,
        },
      );

      console.log("Add Leave Response:", response.data);

      toast.success(
        response?.data?.responseMessage ||
          response?.data?.message ||
          "Leave application submitted successfully",
      );

      // Clear form
      setLeaveDates([]);
      setLeaveReason("");

      // Refresh leave records
      await getAllLeaveRecords();
    } catch (error) {
      console.error("Add Leave API Error:", error);
      console.error(
        "Error Response:",
        error?.response?.data,
      );

      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to submit leave application",
      );
    } finally {
      setSubmitting(false);
    }
  };


  const selectedPaidLeaves = leaveDates.filter(
    (item) => item.isPL === true,
  ).length;



  return (
    <MainPanel>
      <div className="leave-container">


        <div className="heading">
          <h1>Leave Management</h1>
        </div>

        <div className="bottom">


          <div className="leave-content">
            <div className="leave-chart">
              {leaveLoader ? (
                <div className="leave-loading">
                  Loading...
                </div>
              ) : (
                <>
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
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
                          <Cell
                            key={item.name}
                            fill={item.color}
                          />
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

            {/* ======================================
                CHART LEGEND
            ====================================== */}

            <div className="leave-legend">
              {leaveData.map((item) => (
                <div
                  className="legend-row"
                  key={item.name}
                >
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
            <div className="form-header">
              Apply Leave
            </div>

            <form
              className="form-body"
              onSubmit={handleLeaveSubmit}
            >


              <label>Select Leave Days</label>

              <div
                className="calendar-wrapper"
                style={{
                  position: "relative",
                  width: "100%",
                }}
              >
                <DatePicker
                  className="leave-calendar"
                  multiple
                  placeholder="Select Leave Days"
                  value={leaveDates.map(
                    (item) => item.date,
                  )}
                  onOpen={() => setLegends(true)}
                  onClose={() => setLegends(false)}
                  format="YYYY-MM-DD"
                  mapDays={({ date }) => {
                    const dateStr =
                      date.format("YYYY-MM-DD");

                    const matched = leaveDates.find(
                      (item) => item.date === dateStr,
                    );

                    return {
                      onClick: () =>
                        handleDayClick(date),

                      style: matched
                        ? {
                            backgroundColor:
                              matched.isPL
                                ? "#42cfa5"
                                : "#ff424c",
                            color: "white",
                            borderRadius: "50%",
                          }
                        : undefined,
                    };
                  }}
                />

                {legends && (
                  <div className="calendar-legend">
                    <div className="legend-item">
                      <span className="circle paid"></span>
                      Paid Leave
                    </div>

                    <div className="legend-item">
                      <span className="circle unpaid"></span>
                      Unpaid Leave
                    </div>

                    <div className="legend-item">
                      <span className="circle remove"></span>
                      3rd click to remove
                    </div>
                  </div>
                )}
              </div>

              <div className="selected-leave-info">
                <span>
                  Selected Days:{" "}
                  <strong>{leaveDates.length}</strong>
                </span>

                <span>
                  Paid Leaves:{" "}
                  <strong>{selectedPaidLeaves}</strong>
                </span>
              </div>

              {totalRemainingLeaves <= 0 && (
                <div className="no-paid-leave">
                  <span>*</span> Paid leaves are not
                  present
                </div>
              )}

              <label>Enter Leave Reason</label>

              <textarea
                placeholder="Enter Leave Reason"
                value={leaveReason}
                onChange={(e) =>
                  setLeaveReason(e.target.value)
                }
                disabled={submitting}
                maxLength={50}
              />

              <small className="character-count">
                {leaveReason.length}/50
              </small>

         

              <button
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </MainPanel>
  );
};

export default LeaveApplication;