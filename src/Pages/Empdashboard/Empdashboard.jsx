import { useContext, useEffect, useState } from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import "./Empdashboard.scss";
import { useNavigate } from "react-router-dom";
import { IoDocumentTextSharp } from "react-icons/io5";
import { FaBirthdayCake } from "react-icons/fa";
import { FaCode } from "react-icons/fa";
import { FaEllipsisV } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";
import Calender from "../../comp/Calender/Calender";
import { UserContext } from "../../../Context";
import axios from "axios";

const salaryApi = axios.create({
  baseURL: "https://salaryservicetest.pandozasolutions.com",
});

const EmployeeDash = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDucumentsLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;
  const ATTENDANCE_BASE_URL = "https://192.168.1.212:6006/api";

  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(true);

  const [selectedPeriod, setSelectedPeriod] = useState("thisWeek");
  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(true);
  const [birthdays, setBirthdays] = useState([]);
const [birthdayLoading, setBirthdayLoading] = useState(true);

  useEffect(() => {
    const getDocuments = async () => {
      try {
        setDucumentsLoading(true);

        const employeeId = user?.employeeId;

        if (!employeeId) {
          console.error("Employee ID not found");
          setDocuments([]);
          return;
        }

        console.log("Documents Employee ID:", employeeId);

        const response = await axios.get(
          `${BASE_URL}uploadDoc/getDocumentsByEmployeeId/${employeeId}`,
          {
            withCredentials: true,
          },
        );

        console.log("Documents API Response:", response.data);

        const data = response?.data?.data || {};

        const allowedDocuments = [
          "adharCard",
          "panCard",
          "experianceLetter",
          "certificate",
          "salarySlip1",
          "salarySlip2",
          "salarySlip3",
          "bankStatement",
          "relievingLetter",
          "tenthCertificate",
          "twelfthCertificate",
          "degreeCertificate",
          "latestEducationCertificateOrDegree",
          "diplomaCertificate",
        ];

        const documentList = allowedDocuments
          .filter((key) => data[key])
          .map((key) => ({
            documentName: key,
            fileUrl: data[key],
          }));

        setDocuments(documentList);

        console.log("Document List:", documentList);
      } catch (error) {
        console.error("Documents API Error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          url: error.config?.url,
        });

        setDocuments([]);
      } finally {
        setDucumentsLoading(false);
      }
    };

    if (user) {
      getDocuments();
    }
  }, [user, BASE_URL]);

  useEffect(() => {
    const getAttendance = async () => {
      try {
        setAttendanceLoading(true);

        const employeeId =
          user?.employeeId || user?.employeeID || user?.empId || user?.id;

        if (!employeeId) {
          console.error("Employee ID not found");
          setAttendanceData([]);
          return;
        }

        console.log("Attendance Employee ID:", employeeId);

        const response = await axios.post(
          `${ATTENDANCE_BASE_URL}/punch/attendance/${employeeId}`,
          {},
          {
            withCredentials: true,
          },
        );

        console.log("Attendance API Response:", response.data);

        const data = response?.data?.data || [];

        setAttendanceData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(
          "Attendance API Error:",
          error.response?.status,
          error.response?.data || error.message,
        );

        setAttendanceData([]);
      } finally {
        setAttendanceLoading(false);
      }
    };

    if (user) {
      getAttendance();
    }
  }, [user]);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        setNotificationLoading(true);

        const response = await axios.get(`${BASE_URL}Notification/my`, {
          withCredentials: true,
        });

        console.log("Notification API Response:", response.data);

        const data = response?.data || [];

        setNotifications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Notification API Error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          url: error.config?.url,
        });

        setNotifications([]);
      } finally {
        setNotificationLoading(false);
      }
    };
    if (user) {
      getNotifications();
    }
  }, [user, BASE_URL]);

  useEffect(() => {
    const getBirthdays = async () => {
    try {
      setBirthdayLoading(true);

      const today = new Date();

      const date = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const response = await axios.get(
        `${BASE_URL}AuthController/birthdays`,
        {
          params: {
            date : date,
          },
          withCredentials: true,
        }
      );
      console.log("Birthday API Response:", response.data);

      const data = response?.data?.data || response?.data || [];

      setBirthdays(Array.isArray(data) ? data: []);
    } catch (error) {
      console.error("Birthday API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
      });
      setBirthdays([]);
    } finally {
      setBirthdayLoading(false);
    }
  };
  if (user) {
    getBirthdays();
  }
  },[user, BASE_URL]);

  const getWeekRange = (weekType) => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const day = today.getDay();

    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    if (weekType === "lastWeek") {
      monday.setDate(monday.getDate() - 7);
    }

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
      monday,
      sunday,
    };
  };

  const getWeekDays = (weekType) => {
    const { monday } = getWeekRange(weekType);

    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);

      days.push(date);
    }

    return days;
  };

  const weekDays = getWeekDays(selectedPeriod);

  const currentAttendance = weekDays.map((day) => {
    const dateString = day.toISOString().split("T")[0];

    const attendance = attendanceData.find((item) => {
      return item.date?.split("T")[0] === dateString;
    });

    return {
      date: dateString,
      workedMinutes: attendance ? Number(attendance.workedMinutes) || 0 : 0,
    };
  });

  const totalMinutes = currentAttendance.reduce(
    (total, item) => total + Number(item.workedMinutes || 0),
    0,
  );

  const totalHours = Math.floor(totalMinutes / 60);

  const remainingMinutes = totalMinutes % 60;

  const totalHoursText = `${totalHours}h ${String(remainingMinutes).padStart(
    2,
    "0",
  )}m`;

  const [leaveSummary, setLeaveSummary] = useState({
    employeeId: "",
    paidLeaves: 0,
    usedLeaves: 0,
    remainingLeaves: 0,
    employeeName: "",
  });

  const [leaveLoading, setLeaveLoading] = useState(true);
  const getLeaveSummary = async () => {
    try {
      setLeaveLoading(true);

      const employeeId =
        user?.employeeId || user?.employeeID || user?.empId || user?.id;

      if (!employeeId) {
        console.error("Employee ID not found");
        return;
      }

      console.log("Logged-in Employee ID:", employeeId);

      const response = await salaryApi.get(
        `/employee/getLeaveRecordbyEmployeeId`,
        {
          params: {
            employeeId: employeeId,
          },

          withCredentials: true,
        },
      );

      console.log("Leave API Response:", response.data);

      const data = response?.data?.data;

      if (data) {
        setLeaveSummary({
          employeeId: data.employeeId || employeeId,
          paidLeaves: Number(data.paidLeaves) || 0,
          usedLeaves: Number(data.usedLeaves) || 0,
          remainingLeaves: Number(data.remainingLeaves) || 0,
          employeeName: data.employeeName || "",
        });
      }
    } catch (error) {
      console.error(
        "Leave summary error:",
        error.response?.status,
        error.response?.data || error.message,
      );
    } finally {
      setLeaveLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      getLeaveSummary();
    }
  }, [user]);

  const takenLeaveProgress =
    leaveSummary.paidLeaves > 0
      ? (leaveSummary.usedLeaves / leaveSummary.paidLeaves) * 360
      : 0;

  const remainingLeaveProgress =
    leaveSummary.paidLeaves > 0
      ? (leaveSummary.remainingLeaves / leaveSummary.paidLeaves) * 360
      : 0;

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
          <div className="left">
            <div className="left1">
              <h3>List of Documents</h3>

              {documentsLoading ? (
                <p>Loading documents...</p>
              ) : documents.length > 0 ? (
                documents.slice(0, 3).map((document, index) => (
                  <div className="documents" key={index}>
                    <IoDocumentTextSharp className="document-icon" />

                    <h4>
                      {document.documentName
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </h4>
                  </div>
                ))
              ) : (
                <p>No documents found</p>
              )}

              <button className="btn" onClick={() => navigate("/Empviewdoc")}>
                View Documents
              </button>
            </div>
            <div className="left2">
              <div className="top">
                <div>
                  <h3>Hours Logged</h3>

                  <h2>{attendanceLoading ? "Loading..." : totalHoursText}</h2>
                </div>

                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="thisWeek">This Week</option>

                  <option value="lastWeek">Last Week</option>
                </select>
              </div>

              <div className="hours-chart">
                {attendanceLoading ? (
                  <p>Loading attendance...</p>
                ) : (
                  currentAttendance.map((item) => {
                    const workedMinutes = Number(item.workedMinutes) || 0;

                    const hours = Math.floor(workedMinutes / 60);

                    const minutes = workedMinutes % 60;

                    const barHeight = Math.min(
                      (workedMinutes / 540) * 100,
                      100,
                    );

                    const completed = workedMinutes >= 540;

                    const absent = workedMinutes === 0;

                    const date = new Date(`${item.date}T00:00:00`);

                    return (
                      <div className="chart-column" key={item.date}>
                        <span>
                          {hours}h {String(minutes).padStart(2, "0")}m
                        </span>

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

                        <p>
                          {date.toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <div className="left3">
              <div className="top">
                <h3>Notification</h3>
              </div>

              {notificationLoading ? (
                <p>Loading notifications...</p>
              ) : notifications.length > 0 ? (
                notifications.slice(0, 2).map((notification) => (
                  <div className="card" key={notification.id}>
                    <div className="heading">{notification.title}</div>

                    <p>{notification.message}</p>
                  </div>
                ))
              ) : (
                <p>No notifications found</p>
              )}
            </div>
          </div>
          <div className="middle">
            <div className="middle1">
              <div className="leave-card">
                <h4>All Leaves</h4>
                <div className="circle all-leaves">
                  <div>
                    <strong>
                      {leaveLoading ? "..." : leaveSummary.paidLeaves}
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
                    "--progress": `${takenLeaveProgress}deg`,
                  }}
                >
                  <div>
                    <strong>
                      {leaveLoading ? "..." : leaveSummary.usedLeaves}
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
                    "--progress": `${remainingLeaveProgress}deg`,
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
                        d="
                          M0 80
                          C45 75, 55 72, 95 68
                          C135 62, 150 45, 195 50
                          C235 55, 250 48, 290 65
                          C330 82, 350 95, 395 105
                          C430 113, 455 105, 490 98
                          C530 90, 555 95, 590 82
                          C625 68, 650 60, 700 58
                        "
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />

                      <path
                        d="
                          M0 80
                          C45 75, 55 72, 95 68
                          C135 62, 150 45, 195 50
                          C235 55, 250 48, 290 65
                          C330 82, 350 95, 395 105
                          C430 113, 455 105, 490 98
                          C530 90, 555 95, 590 82
                          C625 68, 650 60, 700 58
                          L700 220
                          L0 220 Z
                        "
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

            {/* =================================
                RECENT CRM ENTRIES
            ================================= */}

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

  {birthdayLoading ? (
    <p>Loading birthdays...</p>
  ) : birthdays.length > 0 ? (
    birthdays.slice(0, 3).map((birthday, index) => {
      const employeeName =
        birthday.employeeName ||
        birthday.name ||
        birthday.fullName ||
        "Employee";

      const designation =
        birthday.designation ||
        birthday.jobTitle ||
        "Employee";

      const birthdayDate =
        birthday.dateOfBirth ||
        birthday.birthDate ||
        birthday.dob;

      const initials = employeeName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

      return (
        <div className="card" key={birthday.id || index}>
          <div className="name">
            <div className="user-avatar">
              {initials}
            </div>

            <div className="user-info">
              <p>{employeeName}</p>

              <span>{designation}</span>
            </div>
          </div>

          <div className="date">
            <FaBirthdayCake />

            <p>
              {birthdayDate
                ? new Date(birthdayDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "Birthday"}
            </p>
          </div>
        </div>
      );
    })
  ) : (
    <p>No birthdays this month</p>
  )}

  <button className="birthday-btn">
    View Birthdays
  </button>
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
