import React, { useEffect, useState } from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import "./Empdashboard.scss";
import { useNavigate } from "react-router-dom";
import { IoDocumentTextSharp } from "react-icons/io5";
import { FaBirthdayCake } from "react-icons/fa";
import { FaCode } from "react-icons/fa";
import { FaEllipsisV } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import Calender from "../../comp/Calender/Calender";

// =====================================================
// DUMMY ATTENDANCE DATA
// Later this data will come from your API
// =====================================================

const attendanceData = {
  thisWeek: [
    { day: "M", hours: 8 },
    { day: "T", hours: 7 },
    { day: "W", hours: 7 },
    { day: "T", hours: 9 },
    { day: "F", hours: 7 },
    { day: "S", hours: 8 },
    { day: "S", hours: 0 },
  ],

  lastWeek: [
    { day: "M", hours: 9 },
    { day: "T", hours: 8 },
    { day: "W", hours: 9 },
    { day: "T", hours: 6 },
    { day: "F", hours: 9 },
    { day: "S", hours: 7 },
    { day: "S", hours: 0 },
  ],

  thisMonth: [
    { day: "M", hours: 8.2 },
    { day: "T", hours: 7.8 },
    { day: "W", hours: 8.5 },
    { day: "T", hours: 8.1 },
    { day: "F", hours: 7.6 },
    { day: "S", hours: 6.5 },
    { day: "S", hours: 2.0 },
  ],
};

const EmployeeDash = () => {
  const navigate = useNavigate();

  const [leaveSummary, setLeaveSummary] = useState({
    totalLeaves: 0,
    takenLeaves: 0,
    remainingLeaves: 0,
  });

  const [leaveLoading, setLeaveLoading] = useState(true);
  const getLeaveSummary = async () => {
    try {
      setLeaveLoading(true);

      const response = await fetch(
        "YOUR_API_URL/api/EmployeeLeaveSummary?employeeId=123",
      );

      if (!response.ok) {
        throw new Error("Failed to fetch leave summary");
      }

      const result = await response.json();

      setLeaveSummary(result.data);
    } catch (error) {
      console.error("Leave summary error:", error);
    } finally {
      setLeaveLoading(false);
    }
  };

  useEffect(() => {
    getLeaveSummary();
  }, []);

  // =====================================================
  // HOURS LOGGED STATE
  // =====================================================

  const [selectedPeriod, setSelectedPeriod] = useState("thisWeek");

  // =====================================================
  // GET CURRENT ATTENDANCE DATA
  // =====================================================

  const currentAttendance = attendanceData[selectedPeriod];

  // =====================================================
  // CALCULATE TOTAL HOURS
  // =====================================================

  const totalHours = currentAttendance.reduce(
    (total, item) => total + item.hours,
    0,
  );

  // =====================================================
  // FORMAT TOTAL HOURS
  // =====================================================

  const totalHoursText = `${totalHours}h 00m`;

  return (
    <>
      <MainPanel
        title="Employee Dashboard"
        breadcrumbs={[
          { label: "Dashboard", link: "/dashboard" },
          { label: "Employee Dashboard" },
        ]}
      >
        <div className="empdash-parent">
          {/* =================================
              LEFT SECTION
          ================================= */}

          <div className="left">
            {/* DOCUMENTS */}

            <div className="left1">
              <h3>Documents</h3>

              <div className="documents">
                <IoDocumentTextSharp />
                <h4>Aadhar Card</h4>
              </div>

              <div className="documents">
                <IoDocumentTextSharp />
                <h4>Pan Card</h4>
              </div>

              <div className="documents">
                <IoDocumentTextSharp />
                <h4>Degree Certificate</h4>
              </div>

              <button className="btn" onClick={() => navigate("/Viewdoc")}>
                View Documents
              </button>
            </div>

            {/* =================================
                HOURS LOGGED
            ================================= */}

            <div className="left2">
              {/* HOURS HEADER */}

              <div className="top">
                <div>
                  <h3>Hours Logged</h3>

                  <h2>{totalHoursText}</h2>
                </div>

                {/* PERIOD DROPDOWN */}

                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="thisWeek">This Week</option>

                  <option value="lastWeek">Last Week</option>

                  <option value="thisMonth">This Month</option>
                </select>
              </div>

              {/* =================================
                  DYNAMIC HOURS CHART
              ================================= */}

              <div
                className={`hours-chart ${
                  selectedPeriod === "thisMonth" ? "month-chart" : ""
                }`}
              >
                {currentAttendance.map((item, index) => {
                  /*
                    Daily target = 9 hours

                    9h = 100%
                    8h = 88.8%
                    7h = 77.7%
                    6h = 66.6%
                    etc.
                  */

                  const barHeight = Math.min((item.hours / 9) * 100, 100);

                  /*
                    Check whether employee completed
                    the required 9 hours.
                  */

                  const completed = item.hours >= 9;

                  /*
                    Check whether employee was absent.
                  */

                  const absent = item.hours === 0;

                  return (
                    <div className="chart-column" key={index}>
                      {/* HOURS LABEL */}

                      <span>{String(item.hours).padStart(2, "0")}h</span>

                      {/* BAR */}

                      <div className="bar-container">
                        <div
                          className={`bar ${
                            absent
                              ? "absent"
                              : completed
                                ? "completed"
                                : "incomplete"
                          }`}
                          style={{
                            height: `${barHeight}%`,
                          }}
                        />
                      </div>

                      {/* DAY */}

                      <p>{item.day}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* INTERNAL NOTES */}

            <div className="left3">
              <div className="top">
                <h3>Notification</h3>
              </div>
              <div className="card">
                <div className="heading">Pramotion Review</div>
                <p>
                  11 June 2026Discussed potential promotion in Q1based on
                  consistent performance andleadership in the recentproject.
                </p>
              </div>
              <div className="card">
                <div className="heading">Employee Appreciation</div>
                <p>
                  7 May 2026Recognized by the team and CEO foroutstanding
                  contribution in the clientworkshop and delivery timeline.
                </p>
              </div>
            </div>
          </div>

          {/* =================================
              MIDDLE SECTION
          ================================= */}

          <div className="middle">
            {/* LEAVE SUMMARY */}

            <div className="middle1">
              {/* ALL LEAVES */}
              <div className="leave-card">
                <h4>All Leaves</h4>

                <div className="circle all-leaves">
                  <div>
                    <strong>
                      {leaveLoading ? "..." : leaveSummary.totalLeaves}
                    </strong>

                    <span>Days</span>
                  </div>
                </div>
              </div>

              {/* TAKEN LEAVES */}
              <div className="leave-card">
                <h4>Taken Leaves</h4>

                <div
                  className="circle taken-leaves"
                  style={{
                    "--progress":
                      leaveSummary.totalLeaves > 0
                        ? `${
                            (leaveSummary.takenLeaves /
                              leaveSummary.totalLeaves) *
                            360
                          }deg`
                        : "0deg",
                  }}
                >
                  <div>
                    <strong>
                      {leaveLoading ? "..." : leaveSummary.takenLeaves}
                    </strong>

                    <span>Days</span>
                  </div>
                </div>
              </div>

              {/* REMAINING LEAVES */}
              <div className="leave-card">
                <h4>Remaining Leaves</h4>

                <div
                  className="circle remaining-leaves"
                  style={{
                    "--progress":
                      leaveSummary.totalLeaves > 0
                        ? `${
                            (leaveSummary.remainingLeaves /
                              leaveSummary.totalLeaves) *
                            360
                          }deg`
                        : "0deg",
                  }}
                >
                  <div>
                    <strong>
                      {leaveLoading ? "..." : leaveSummary.remainingLeaves}
                    </strong>

                    <span>Days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PERFORMANCE OVERVIEW */}

            <div className="middle2">
              <div className="performance-top">
                <div>
                  <h3>Performance Overview</h3>

                  <div className="performance-score">
                    <h2>86.75%</h2>

                    <span>↑ 5.4%</span>
                  </div>
                </div>

                <div className="performance-right">
                  <p>vs last month</p>

                  <div>
                    <span>This Cycle</span>

                    <strong>86.75%</strong>
                  </div>
                </div>

                <MdArrowForward />
              </div>

              <div className="performance-chart">
                <div className="chart-labels">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>

                <div className="chart-area">
                  <div className="chart-line">
                    <svg viewBox="0 0 700 220" preserveAspectRatio="none">
                      <path
                        d="M0 80
                        C45 75, 55 72, 95 68
                        C135 62, 150 45, 195 50
                        C235 55, 250 48, 290 65
                        C330 82, 350 95, 395 105
                        C430 113, 455 105, 490 98
                        C530 90, 555 95, 590 82
                        C625 68, 650 60, 700 58"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />

                      <path
                        d="M0 80
                        C45 75, 55 72, 95 68
                        C135 62, 150 45, 195 50
                        C235 55, 250 48, 290 65
                        C330 82, 350 95, 395 105
                        C430 113, 455 105, 490 98
                        C530 90, 555 95, 590 82
                        C625 68, 650 60, 700 58
                        L700 220
                        L0 220 Z"
                        fill="currentColor"
                        opacity="0.12"
                      />
                    </svg>
                  </div>

                  <div className="months">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Dec</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RECENT CRM ENTRIES */}

            <div className="middle3">
              <div className="top">
                <h3>Recent CRM Entries</h3>

                <a href="#view-all">View all</a>
              </div>

              <div className="crm-card">
                <div className="crm-icon">
                  <FaCode />
                </div>

                <div className="crm-content">
                  <h4>E-commerce Website Redesign</h4>

                  <p>
                    <strong>Role:</strong> Frontend Developer
                  </p>

                  <p>Redesigning product listing and filters component.</p>

                  <p>API integration in progress.</p>
                </div>

                <div className="status progress">In Progress</div>
              </div>

              <div className="crm-card">
                <div className="crm-icon bug">
                  <FaCode />
                </div>

                <div className="crm-content">
                  <h4>Bug Fix Sprint - Payment Module</h4>

                  <p>
                    <strong>Role:</strong> Full Stack Developer
                  </p>

                  <p>Investigating issue with payment gateway timeout.</p>

                  <p>Fix and testing in progress.</p>
                </div>

                <div className="status paused">Paused</div>
              </div>
            </div>
          </div>

          {/* =================================
              RIGHT SECTION
          ================================= */}

          <div className="right">
            {/* ATTENDANCE */}

            <div className="right1">
              <Calender />
            </div>

            {/* BIRTHDAYS */}

            <div className="right2">
              <div className="top">
                <h3>Birthdays This Month</h3>

                <FaBirthdayCake />
              </div>

              <div className="card">
                <div className="name">
                  <div className="user-avatar">AM</div>

                  <div className="user-info">
                    <p>Ava Martinez</p>

                    <span>Product Designer</span>
                  </div>
                </div>

                <div className="date">
                  <FaBirthdayCake />

                  <p>June 5</p>
                </div>
              </div>

              <button className="birthday-btn">View Birthdays</button>
            </div>

            {/* INTERNAL NOTES */}
            <div className="right3">
              <div className="top">
                <h3>Internal Notes</h3>

                <FaEllipsisV />
              </div>

              <div className="card">
                <div className="heading">Promotion Review</div>

                <p>11 November 2024</p>

                <p>
                  Discussed potential promotion in Q1 based on consistent
                  performance and leadership in the recent project.
                </p>
              </div>

              <div className="card">
                <div className="heading">Employee Appreciation</div>

                <p>7 October 2024</p>

                <p>
                  Recognized by the team and CEO for outstanding contribution in
                  the client workshop and delivery timeline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </MainPanel>
    </>
  );
};

export default EmployeeDash;
