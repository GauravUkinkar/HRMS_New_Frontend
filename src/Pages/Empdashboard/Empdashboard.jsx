import React from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import "./Empdashboard.scss";

import { IoDocumentTextSharp } from "react-icons/io5";
import { FaBirthdayCake } from "react-icons/fa";
import { FaCode } from "react-icons/fa";
import { FaEllipsisV } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";

import Calender from "../../comp/Calender/Calender";

const EmployeeDash = () => {
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

              <button className="btn">View Documents</button>
            </div>

            {/* HOURS LOGGED */}
            <div className="left2">
              <div className="top">
                <div>
                  <h3>Hours Logged</h3>
                  <h2>45h 00m</h2>
                </div>

                <select>
                  <option>This Week</option>
                  <option>Last Week</option>
                  <option>This Month</option>
                </select>
              </div>

              <div className="hours-chart">
                <div className="chart-column">
                  <span>08h</span>
                  <div className="bar" style={{ height: "75%" }}></div>
                  <p>M</p>
                </div>

                <div className="chart-column">
                  <span>07h</span>
                  <div className="bar" style={{ height: "65%" }}></div>
                  <p>T</p>
                </div>

                <div className="chart-column">
                  <span>07h</span>
                  <div className="bar" style={{ height: "62%" }}></div>
                  <p>W</p>
                </div>

                <div className="chart-column">
                  <span>09h</span>
                  <div className="bar" style={{ height: "88%" }}></div>
                  <p>T</p>
                </div>

                <div className="chart-column">
                  <span>07h</span>
                  <div className="bar" style={{ height: "68%" }}></div>
                  <p>F</p>
                </div>

                <div className="chart-column">
                  <span>08h</span>
                  <div className="bar" style={{ height: "78%" }}></div>
                  <p>S</p>
                </div>

                <div className="chart-column">
                  <span>00h</span>
                  <div className="bar absent" style={{ height: "15%" }}></div>
                  <p>S</p>
                </div>
              </div>
            </div>

            {/* INTERNAL NOTES */}
            <div className="left3">
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

          {/* =================================
              MIDDLE SECTION
          ================================= */}
          <div className="middle">
            {/* LEAVE SUMMARY */}
            <div className="middle1">
              <div className="leave-card">
                <h4>All Leaves</h4>

                <div className="circle">
                  <div>
                    <strong>14</strong>
                    <span>Days</span>
                  </div>
                </div>
              </div>

              <div className="leave-card">
                <h4>Annual Leaves</h4>

                <div className="circle">
                  <div>
                    <strong>10</strong>
                    <span>Days</span>
                  </div>
                </div>
              </div>

              <div className="leave-card">
                <h4>Casual Leaves</h4>

                <div className="circle">
                  <div>
                    <strong>8</strong>
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
          </div>
        </div>
      </MainPanel>
    </>
  );
};

export default EmployeeDash;
