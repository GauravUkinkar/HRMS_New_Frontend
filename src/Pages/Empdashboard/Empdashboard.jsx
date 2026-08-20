import React from "react";
import "./Empdashboard.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";

import { IoDocumentTextSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { FaBirthdayCake } from "react-icons/fa";
import { FaCode } from "react-icons/fa";

import Calender from "../../comp/Calender/Calender";

const Empdashboard = () => {
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
          {/* ================= LEFT SECTION ================= */}
          <div className="left">
            {/* Documents */}
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

            {/* Total Hours */}
            <div className="left2">
              <div className="heading">
                <p>Total Hours Log-In</p>
                <p>45h 00m</p>
              </div>
            </div>

            {/* Notifications */}
            <div className="left3">
              <div className="top">
                <h3>Notification</h3>
                <FaPlus />
              </div>

              <div className="card">
                <div className="heading">Promotion Review</div>
                <p>
                  11 June 2026 Discussed potential promotion in Q1 based on
                  consistent performance and leadership in the recent project.
                </p>
              </div>

              <div className="card">
                <div className="heading">Employee Appreciation</div>
                <p>
                  7 May 2026 Recognized by the team and CEO for outstanding
                  contribution in the client workshop and delivery timeline.
                </p>
              </div>
            </div>
          </div>

          {/* ================= MIDDLE SECTION ================= */}
          <div className="middle">
            <div className="middle1"></div>

            <div className="middle2"></div>

            {/* Team Status */}
            <div className="middle3">
              <h3>Team Status Overview</h3>

              <div className="card-wrapper">
                <div className="card">
                  <div className="title">
                    <FaCode />
                    <h5>Website Team</h5>
                  </div>

                  <div className="des">
                    <p>Total Members: 8</p>
                  </div>

                  <div className="task">
                    <p>New HRMS Development</p>
                  </div>
                </div>

                <div className="card">
                  <div className="title">
                    <FaCode />
                    <h5>Website Team</h5>
                  </div>

                  <div className="des">
                    <p>Total Members: 8</p>
                  </div>

                  <div className="task">
                    <p>New HRMS Development</p>
                  </div>
                </div>

                <div className="card">
                  <div className="title">
                    <FaCode />
                    <h5>Website Team</h5>
                  </div>

                  <div className="des">
                    <p>Total Members: 8</p>
                  </div>

                  <div className="task">
                    <p>New HRMS Development</p>
                  </div>
                </div>

                <div className="card">
                  <div className="title">
                    <FaCode />
                    <h5>Website Team</h5>
                  </div>

                  <div className="des">
                    <p>Total Members: 8</p>
                  </div>

                  <div className="task">
                    <p>New HRMS Development</p>
                  </div>
                </div>

                <div className="card">
                  <div className="title">
                    <FaCode />
                    <h5>Website Team</h5>
                  </div>

                  <div className="des">
                    <p>Total Members: 8</p>
                  </div>

                  <div className="task">
                    <p>New HRMS Development</p>
                  </div>
                </div>

                <div className="card">
                  <div className="title">
                    <FaCode />
                    <h5>Website Team</h5>
                  </div>

                  <div className="des">
                    <p>Total Members: 8</p>
                  </div>

                  <div className="task">
                    <p>New HRMS Development</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SECTION ================= */}
          <div className="right">
            {/* Attendance */}
            <div className="right1">
              <h1 className="heading">Attendance</h1>

              <Calender />

              <div className="bottom">
                <div className="absent">
                  <div className="red"></div>
                  <p>Absent</p>
                </div>

                <div className="today">
                  <div className="blue"></div>
                  <p>Today</p>
                </div>

                <div className="halfday">
                  <div className="grey"></div>
                  <p>Half Day</p>
                </div>
              </div>
            </div>

            {/* Birthdays */}
            <div className="right2">
              <div className="top">
                <h3>Birthdays This Month</h3>
                <FaBirthdayCake />
              </div>

              <div className="card">
                <div className="name">
                  <div className="user-avatar">SS</div>

                  <div className="user-info">
                    <p>Davis Lewis</p>
                    <span>Accountant</span>
                  </div>
                </div>

                <div className="date">
                  <p>01-08-2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainPanel>
    </>
  );
};

export default Empdashboard;