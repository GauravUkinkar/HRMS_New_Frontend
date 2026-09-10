import React, { useEffect, useState } from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import "./AdminDash.scss";
import { FaQuoteLeft } from "react-icons/fa";
import { FaUsersLine } from "react-icons/fa6";
import { HiUsers } from "react-icons/hi2";
import { FaUsersSlash } from "react-icons/fa6";
import { PiUserSwitchFill } from "react-icons/pi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { LuListChecks } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { Table, Tag } from "antd";
// import { FaQuoteLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { LuBell, LuCheck } from "react-icons/lu";
import { LuCake, LuSend } from "react-icons/lu";
import axios from "axios";
const BASE_URL_USER = import.meta.env.VITE_USER_BACKEND_URL;
const BASE_URL2 = import.meta.env.VITE_ATTENDANCE_URL;
const BASE_URL = import.meta.env.VITE_SALARY_BACKEND_URL;
const BASE_URL3 = import.meta.env.VITE_TEAM_URL;
const AdminDash = () => {
  const quotes = [
    "Great teams build great organizations.",
    "Success is the result of teamwork and dedication.",
    "Coming together is a beginning, staying together is progress, working together is success.",
    "A great employee is not just an asset, but the strength of an organization.",
    "Alone we can do so little; together we can do so much.",
    "The strength of the team is each individual member. The strength of each member is the team.",
    "People are the heart of every successful organization.",
    "Leadership is about making others better as a result of your presence.",
    "Teamwork makes the dream work.",
    "Great things in business are never done by one person. They are done by a team.",
    "A motivated team can achieve extraordinary results.",
    "The best investment an organization can make is in its people.",
    "When people work together, incredible things happen.",
    "Strong teams create strong organizations.",
    "Success grows when people grow together.",
  ];



  // Select a random quote when the dashboard loads
  const [quote] = useState(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  });


  const recentEmployeeColumns = [
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
      width: 110,
    },

    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
      width: 170,

      render: (name) => (
        <span className="employee-name-text">
          {name || "N/A"}
        </span>
      ),
    },

    {
      title: "Punch In Time",
      dataIndex: "punchIn",
      key: "punchIn",
      width: 130,

      render: (time) => time || "--",
    },

    {
      title: "Punch Out Time",
      dataIndex: "punchOut",
      key: "punchOut",
      width: 130,

      render: (time) => time || "--",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,

      render: (status) => {
        const normalizedStatus = String(status || "")
          .trim()
          .toLowerCase()
          .replace(/[-_]/g, " ");

        let color = "default";

        // GREEN
        if (
          normalizedStatus === "in office" ||
          normalizedStatus === "inprogress" ||
          normalizedStatus === "in progress" ||
          normalizedStatus === "present"
        ) {
          color = "success";
        }

        // RED
        else if (
          normalizedStatus === "absent"
        ) {
          color = "error";
        }

        // ORANGE
        else if (
          normalizedStatus === "half day" ||
          normalizedStatus === "halfday"
        ) {
          color = "warning";
        }

        return (
          <Tag color={color}>
            {status || "N/A"}
          </Tag>
        );
      },
    },
  ];

  const birthdayEmployees = [
    {
      id: 1,
      name: "Davis Lewis",
      designation: "Accountant",
      birthday: "01 Sep 2026",
      month: 8,
    },
    {
      id: 2,
      name: "Sneha Patil",
      designation: "HR Executive",
      birthday: "05 Sep 2026",
      month: 8,
    },
    {
      id: 3,
      name: "Rahul Kulkarni",
      designation: "Software Developer",
      birthday: "12 Sep 2026",
      month: 8,
    },
    {
      id: 4,
      name: "Anjali Pawar",
      designation: "Marketing Executive",
      birthday: "18 Sep 2026",
      month: 8,
    },
  ];

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const seconds = currentTime.getSeconds();
  const minutes = currentTime.getMinutes();
  const hours = currentTime.getHours();

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;

  //API INTEGRATION FOR FIRST BOX - TODAY ATTENDANCE DATA TOTALEMP/PRESENT/ABSENT/HALFDAY
  const [today, setToday] = useState({});
  const getTodaydata = async () => {
    try {
      // Get today's date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0];
      const res = await axios.get(
        `${BASE_URL2}api/punch/work-session/summary?date=${currentDate}`
      );

      console.log("TODAY SUMMARY:", res.data);

      setToday(res?.data || {});

    } catch (error) {
      console.log("Today Summary API Error:", error);
    }
  };
  const dashboardCards = [
    {
      id: 1,
      title: "Total Employees",
      value: today?.totalEmployees || 0,
      icon: <FaUsersLine />,
      iconColor: "#2563eb",
      iconBg: "#eff6ff",
    },
    {
      id: 2,
      title: "Punch In Today",
      value: today?.["In-office"] || 0,
      icon: <HiUsers />,
      iconColor: "#16a34a",
      iconBg: "#f0fdf4",
    },
    {
      id: 3,
      title: "Not Punch In Today",
      value: today?.absent || 0,
      icon: <FaUsersSlash />,
      iconColor: "#dc2626",
      iconBg: "#fef2f2",
    },
    {
      id: 4,
      title: "Half Day Exists",
      value: today?.halfday || 0,
      icon: <PiUserSwitchFill />,
      iconColor: "#f59e0b",
      iconBg: "#fffbeb",
    },
  ];


  //API INTEGRATION FOR LEAVES MANAGEMENT 
  const [leave, setLeave] = useState([]);
  const getAllLeaves = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}admin/getAllLeaves`,
        {
          withCredentials: true,
        }
      );

      console.log("GETALLLEAVES", response.data);

      setLeave(response?.data?.data || []);

    } catch (error) {
      console.log("Get All Leaves Error:", error);
      setLeave([]);
    }
  };
  const leaveData = [
    {
      name: "Pending",
      value: leave.filter(
        (item) =>
          item?.approved?.toLowerCase() === "pending"
      ).length,
      color: "#ffc52b",
    },
    {
      name: "Approved",
      value: leave.filter(
        (item) =>
          item?.approved?.toLowerCase() === "approved"
      ).length,
      color: "#42cfa5",
    },
    {
      name: "Rejected",
      value: leave.filter(
        (item) =>
          item?.approved?.toLowerCase() === "rejected"
      ).length,
      color: "#ff424c",
    },
  ];

  //monthwise attendance data present, absent, halfday and total
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    String(currentDate.getMonth() + 1).padStart(2, "0")
  );
  const [selectedYear, setSelectedYear] = useState(
    String(currentDate.getFullYear())
  );
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceLoader, setAttendanceLoader] = useState(false);
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  const years = [];

  for (
    let year = currentDate.getFullYear();
    year >= currentDate.getFullYear() - 5;
    year--
  ) {
    years.push(String(year));
  }



  // api integration with TODAY ATTENDANCE box 
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const getEmployeeData = async () => {
    try {
      setLoader(true);
      const response = await axios.get(`${BASE_URL2}api/punch/details`);

      const tableData = response?.data?.data?.sort(
        (a, b) => new Date(a?.punchIn || 0) - new Date(b?.punchIn || 0)
      ).map((item, index) => ({
        key:
          item?.employeeId ||
          index,
        employeeId:
          item?.employeeId || "",
        employeeName:
          item?.employeeName
            ?.toUpperCase() || "",
        punchIn: item?.punchInByAdmin ? "Punch In From Admin" : item?.punchIn ? item.punchIn
          .split("T")[1]?.replace("Z", "")
          .slice(0, 8) : "",
        punchOut:
          item?.punchOutByAdmin
            ? "Punch Out From Admin"
            : item?.punchOut
              ? item.punchOut
                .split("T")[1]
                ?.replace(
                  "Z",
                  ""
                )
                .slice(
                  0,
                  8
                )
              : "",
        status: item?.status || "In-office"
      })) || [];

      setData(tableData);

      console.log("TODAY ATTENDANCE:", tableData);
    } catch (error) {
      console.error("Attendance API Error:", error);
      toast.error(error?.response?.data?.message || "Unable to load attendance");
      setData([]);
    } finally {
      setLoader(false);
    }
  };
  const getMonthlyAttendance = async (month, year) => {
    try {
      setAttendanceLoader(true);

      // First day of selected month
      const startDate = `${year}-${month}-01`;

      // Last day of selected month
      const lastDay = new Date(
        Number(year),
        Number(month),
        0
      ).getDate();

      const endDate = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;

      console.log("START DATE:", startDate);
      console.log("END DATE:", endDate);

      const response = await axios.get(
        `${BASE_URL2}api/punch/getPreviousAttendence?startDate=${startDate}&endDate=${endDate}`
      );

      console.log("ATTENDANCE API:", response.data);

      const records = response?.data?.data || [];

      // Create every day of selected month
      const days = [];

      for (let day = 1; day <= lastDay; day++) {
        const formattedDay = String(day).padStart(2, "0");

        days.push({
          date: `${day} ${new Date(
            Number(year),
            Number(month) - 1,
            day
          ).toLocaleString("en-US", {
            month: "short",
          })}`,

          fullDate: `${year}-${month}-${formattedDay}`,

          present: 0,
          absent: 0,
          halfDay: 0,
        });
      }

      // Count attendance
      records.forEach((item) => {
        if (!item?.punchIn) return;

        const attendanceDate = item.punchIn.split("T")[0];

        const dayData = days.find(
          (day) => day.fullDate === attendanceDate
        );

        if (!dayData) return;

        const status = String(item?.status || "")
          .trim()
          .toLowerCase()
          .replace(/[-_]/g, " ");

        // If punch-in exists but status is null/empty
        // count it as Present
        if (!item?.status && item?.punchIn) {
          dayData.present += 1;
        }

        // Present
        else if (
          status === "full day" ||
          status === "present" ||
          status === "in office" ||
          status === "in progress"
        ) {
          dayData.present += 1;
        }

        // Absent
        else if (status === "absent") {
          dayData.absent += 1;
        }

        // Half Day
        else if (status === "half day") {
          dayData.halfDay += 1;
        }
      });

      console.log("GRAPH DATA:", days);

      setAttendanceData(days);

    } catch (error) {
      console.log("Attendance API Error:", error);
      setAttendanceData([]);
    } finally {
      setAttendanceLoader(false);
    }
  };




  // API INTEGRATION FOR GET TEAM DATA
  const [team, setTeam] = useState([]);
  const getallteam = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL3}Pandoza_Admin/Admin/Team/getAllTeams`
      );

      console.log("TEAM API RESPONSE:", res.data);

      const teamData = res?.data
        ?.filter((item) => item?.data)
        ?.map((item) => item.data);
      console.log("TEAM DATA:", teamData);
      setTeam(teamData || []);
    } catch (error) {
      console.error("Team API Error:", error);
      setTeam([]);
    }
  };


  //get all NOTIFICATION API INTEGRATION 
  const [notifications, setNotifications] = useState([]);
  const [notificationLoader, setNotificationLoader] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationCountLoader, setNotificationCountLoader] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [showUnread, setShowUnread] = useState(false);

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const displayedNotifications = showUnread
    ? unreadNotifications
    : notifications;

  const stripHtml = (html = "") => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  const getNotificationPreview = (message = "") => {
    const plainText = stripHtml(message).replace(/\s+/g, " ").trim();

    return plainText.length > 80
      ? `${plainText.substring(0, 80)}...`
      : plainText;
  };

  const handleNotificationClick = async (notification) => {
    // Open popup
    setSelectedNotification(notification);
    setShowNotificationModal(true);

    // Mark as read only if unread
    if (!notification?.isRead) {
      await markNotificationAsRead(notification.id);
    }
  };

  const getNotifications = async () => {
    try {
      setNotificationLoader(true);

      const response = await axios.get(
        `${BASE_URL_USER}Notification/AdminNotifications`,
        {
          withCredentials: true,
        }
      );

      console.log("NOTIFICATION API RESPONSE:", response.data);

      setNotifications(response?.data || []);
    } catch (error) {
      console.error("Notification API Error:", error);
      setNotifications([]);
    } finally {
      setNotificationLoader(false);
    }
  };

  const getNotificationCount = async () => {
    try {
      setNotificationCountLoader(true);

      const response = await axios.get(
        `${BASE_URL_USER}Notification/my/count`,
        {
          withCredentials: true,
        }
      );

      console.log("NOTIFICATION COUNT:", response.data);

      setNotificationCount(Number(response?.data) || 0);

    } catch (error) {
      console.error("Notification Count API Error:", error);
      setNotificationCount(0);
    } finally {
      setNotificationCountLoader(false);
    }
  };

  //load unread all notification 

  const getUnreadNotifications = async () => {
    try {
      setNotificationLoader(true);

      const response = await axios.get(
        `${BASE_URL_USER}Notification/my/unread`,
        {
          withCredentials: true,
        }
      );

      console.log("UNREAD NOTIFICATIONS:", response.data);

      setUnreadNotifications(response?.data || []);
      setShowUnread(true);

    } catch (error) {
      console.error("Unread Notification API Error:", error);
      setUnreadNotifications([]);
    } finally {
      setNotificationLoader(false);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.put(
        `${BASE_URL_USER}Notification/${notificationId}/read`,
        {},
        {
          withCredentials: true,
        }
      );

      console.log("Notification marked as read:", notificationId);

      // Remove it from unread list immediately
      setUnreadNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );

      // Decrease unread count
      setNotificationCount((prev) => Math.max(0, prev - 1));

    } catch (error) {
      console.error("Mark Notification Read API Error:", error);
    }
  };

  //Birthday Wish API Integration
  const [birthday, setBirthday] = useState();
  const getMonthBirthday = async () => {
    try {
      const res = await axios.get(`${BASE_URL_USER}AuthController/birthdays?month=jan`,
        {
          withCredentials: true,
        }
      );
      console.log(res.data, "jlkfdskjdfsjkldsfkjlkjlfdsklklfdkjlsd")
      setBirthday(res.data);
    } catch (error) {
      console.log(error);

    }
  }
  useEffect(() => {
    getEmployeeData();
    getAllLeaves();
    getallteam();
    getTodaydata();

    getMonthlyAttendance(
      selectedMonth,
      selectedYear
    );

    getNotifications();
    getNotificationCount();
    getMonthBirthday();
  }, []);


  return (
    <>
      <MainPanel
        title="Admin Dashboard"
        breadcrumbs={[
          { label: "Dashboard", link: "/dashboard" },
          { label: "Admin Dashboard" },
        ]}
      >
        <div className="admindash-parent">
          <div className="left-side">
            {/* Welcome + Quote */}
            <div className="box1">
              <div className="welcome-text">
                <h2>
                  Good Morning, Admin! 👋
                </h2>

                <span>
                  Here's what's happening with your organization today.
                </span>
              </div>

              <div className="quote">
                <div className="quote-icon">
                  <FaQuoteLeft />
                </div>

                <div className="quote-text">
                  <p>{quote}</p>
                </div>
              </div>
            </div>

            {/* card for starting  */}
            <div className="box2">
              {dashboardCards.map((card) => (
                <div className="card" key={card.id}>

                  <div
                    className="card-icon"
                    style={{
                      color: card.iconColor,
                      backgroundColor: card.iconBg,
                    }}
                  >
                    {card.icon}
                  </div>

                  <div className="card-content">
                    <div className="card-title">
                      {card.title}
                    </div>

                    <p>{card.value}</p>
                  </div>

                </div>
              ))}
            </div>

            {/* // Attendance and Leave Management */}
            <div className="box3">


              {/* //montly data show on graph wise count only 31 days in this  */}
              <div className="box3-left">
                <div className="heading">
                  <div className="icon">
                    <LuChartNoAxesCombined />
                    <span>Attendance Overview</span>
                  </div>

                  <div className="attendance-filters">

                    {/* MONTH */}
                    <select
                      className="month-select"
                      value={selectedMonth}
                      onChange={(e) => {
                        const month = e.target.value;

                        setSelectedMonth(month);

                        getMonthlyAttendance(
                          month,
                          selectedYear
                        );
                      }}
                    >
                      {months.map((month) => (
                        <option
                          key={month.value}
                          value={month.value}
                        >
                          {month.label}
                        </option>
                      ))}
                    </select>


                    {/* YEAR */}
                    <select
                      className="month-select"
                      value={selectedYear}
                      onChange={(e) => {
                        const year = e.target.value;

                        setSelectedYear(year);

                        getMonthlyAttendance(
                          selectedMonth,
                          year
                        );
                      }}
                    >
                      {years.map((year) => (
                        <option
                          key={year}
                          value={year}
                        >
                          {year}
                        </option>
                      ))}
                    </select>

                  </div>

                </div>

                <div className="attendance-chart">

                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={attendanceData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: -15,
                        bottom: 5,
                      }}
                      barGap={2}
                    >

                      <CartesianGrid
                        strokeDasharray="0"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="date"
                        tick={{
                          fontSize: 10,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{
                          fontSize: 10,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip />

                      <Bar
                        dataKey="present"
                        fill="#20ad9b"
                        radius={[2, 2, 0, 0]}
                        barSize={8}
                      />

                      <Bar
                        dataKey="absent"
                        fill="#ff3b3bdd"
                        radius={[2, 2, 0, 0]}
                        barSize={8}
                      />

                      <Bar
                        dataKey="halfDay"
                        fill="#ffc62b9c"
                        radius={[2, 2, 0, 0]}
                        barSize={8}
                      />

                    </BarChart>
                  </ResponsiveContainer>

                </div>

                <div className="chart-legend">

                  <div className="legend-item">
                    <span className="dot present"></span>
                    Present
                  </div>

                  <div className="legend-item">
                    <span className="dot absent"></span>
                    Absent
                  </div>

                  <div className="legend-item">
                    <span className="dot half-day"></span>
                    Half Day
                  </div>

                </div>

              </div>

              <div className="box3-right">
                <div className="leave-header">
                  <div className="leave-title">
                    <LuListChecks />
                    <span>Leave Requests</span>
                  </div>


                </div>

                <div className="leave-content">

                  <div className="leave-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={leaveData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={68}
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
                      <strong>
                        {leaveData.reduce((total, item) => total + item.value, 0)}
                      </strong>
                      <span>Total Requests</span>
                    </div>
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
              </div>

            </div>

            <div className="box4">

              {/* Recent Employees */}
              <div className="box4-left">

                <div className="box4-heading">
                  <div className="heading-title">
                    <LuUsers />
                    <span>Today's Attendance</span>
                  </div>

                  <Link to="/attendance" className="view-all">
                    View All →
                  </Link>
                </div>

                <div className="employee-table">
                  <Table
                    columns={recentEmployeeColumns}
                    dataSource={data}
                    loading={loader}
                    rowKey="key"
                    bordered={false}
                    size="small"
                    rowClassName={(_, index) =>
                      index % 2 === 0
                        ? "table-row-light"
                        : "table-row-dark"
                    }
                    pagination={{
                      pageSize: 5,
                      showSizeChanger: false,
                      showQuickJumper: false,
                      position: ["bottomRight"],
                    }}
                  />
                </div>

              </div>


              {/* Team Status */}
              <div className="box4-right">
                <div className="box4-heading">
                  <div className="heading-title">
                    <LuUsers />
                    <span>Team Status</span>
                  </div>
                </div>

                <div className="team-list">
                  {team.map((item, index) => {
                    const teamColors = [
                      "#3182ed",
                      "#e83d9b",
                      "#43c98d",
                      "#8b5cf6",
                      "#f5a623",
                    ];

                    const color = teamColors[index % teamColors.length];

                    return (
                      <div className="team-row" key={item.id}>

                        <div className="team-left">

                          <div
                            className="team-icon"
                            style={{
                              backgroundColor: `${color}20`,
                              color: color,
                            }}
                          >
                            <LuUsers />
                          </div>
                          <div className="heading">

                            {item.name || "N/A"}
                            <span>TL: {item.manegerName}</span>
                          </div>

                        </div>

                        <div className="team-members">
                          {item.memberCount || 0} Members
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          </div>

          <div className="right-side">
            <div className="top-box1">
              <div className="clock">
                {/* Clock Numbers */}
                {Array.from({ length: 12 }, (_, index) => {
                  const number = index + 1;

                  // Convert angle to radians
                  const angle = (number * 30 - 90) * (Math.PI / 180);

                  // Distance from center
                  const radius = 52;

                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  return (
                    <span
                      key={number}
                      className="clock-number"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                      }}
                    >
                      {number}
                    </span>
                  );
                })}

                {/* Hour Hand */}
                <div
                  className="hour-hand"
                  style={{
                    transform: `rotate(${hourAngle}deg)`,
                  }}
                ></div>

                {/* Minute Hand */}
                <div
                  className="minute-hand"
                  style={{
                    transform: `rotate(${minuteAngle}deg)`,
                  }}
                ></div>

                {/* Second Hand */}
                <div
                  className="second-hand"
                  style={{
                    transform: `rotate(${secondAngle}deg)`,
                  }}
                ></div>

                {/* Center */}
                <div className="clock-center"></div>

              </div>

            </div>

            <div className="middle-box2">
              <div className="notification-header">
                <div className="notification-title">

                  <span>Notifications</span>
                </div>

                <div className="notification-count"
                  onClick={() => {
                    getUnreadNotifications();
                    setShowUnread(true);
                  }}
                >
                  <LuBell />

                  <span className="count">
                    {notificationCount}
                  </span>
                </div>


              </div>


              <div className="notification-list">

                {notificationLoader ? (

                  <div className="notification-loading">
                    Loading notifications...
                  </div>

                ) : displayedNotifications.length === 0 ? (

                  <div className="notification-empty">
                    {showUnread
                      ? "No unread notifications"
                      : "No notifications"}
                  </div>

                ) : (

                  displayedNotifications.map((notification) => (

                    <div
                      className={`notification-item ${notification?.isRead ? "read" : "unread"
                        }`}
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                    >

                      {/* Check Icon */}
                      <div className="notification-icon">
                        <LuCheck />
                      </div>

                      {/* Notification Content */}
                      <div className="notification-content">

                        <h4>
                          {notification?.title || "Notification"}
                        </h4>

                        <p>
                          {getNotificationPreview(notification?.message)}
                        </p>

                        <span className="notification-date">
                          {notification?.createdAt
                            ? new Date(
                              notification.createdAt
                            ).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                            : "--"}
                        </span>

                      </div>

                      {/* Show dot only for unread */}
                      {!notification?.isRead && (
                        <span className="notification-dot"></span>
                      )}

                    </div>

                  ))

                )}

              </div>
              {showNotificationModal && selectedNotification && (
                <div
                  className="notification-modal-overlay"
                  onClick={() => setShowNotificationModal(false)}
                >
                  <div
                    className="notification-modal"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="notification-modal-header">
                      <h3>
                        {selectedNotification?.title || "Notification"}
                      </h3>

                      <button
                        type="button"
                        onClick={() => setShowNotificationModal(false)}
                      >
                        ×
                      </button>
                    </div>

                    <div className="notification-modal-body">
                      <p className="notification-modal-date">
                        {selectedNotification?.createdAt
                          ? new Date(
                            selectedNotification.createdAt
                          ).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          : "--"}
                      </p>

                      <div className="notification-full-message">
                        {stripHtml(selectedNotification?.message || "")}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>


            <div className="last-box3">

              {/* Header */}
              <div className="birthday-header">

                <div className="birthday-title">
                  <LuCake />
                  <span>Birthdays This Month</span>
                </div>

              </div>


              {/* Birthday List */}
              <div className="birthday-list">

                {birthdayEmployees.map((employee) => (

                  <div
                    className="birthday-item"
                    key={employee.id}
                  >

                    {/* Employee Avatar */}
                    <div className="birthday-avatar">
                      {employee.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()}
                    </div>


                    {/* Employee Information */}
                    <div className="birthday-info">

                      <h4>
                        {employee.name}
                      </h4>

                      <p>
                        {employee.designation}
                      </p>

                    </div>


                    {/* Birthday Date */}
                    <div className="birthday-date">
                      {employee.birthday}
                    </div>


                    {/* Wish Button */}
                    <button
                      className="wish-button"
                      onClick={() => {
                        console.log(
                          `Wishing ${employee.name} Happy Birthday!`
                        );
                      }}
                    >
                      <LuSend />
                      Wish
                    </button>

                  </div>

                ))}

              </div>

            </div>
          </div>
        </div>
      </MainPanel>
    </>
  );
};

export default AdminDash;