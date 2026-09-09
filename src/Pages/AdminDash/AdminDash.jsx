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
const BASE_URL2 = import.meta.env.VITE_ATTENDANCE_URL;
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

  const attendanceData = [
    {
      date: "1 Sep",
      present: 215,
      absent: 18,
      halfDay: 22,
    },
    {
      date: "2 Sep",
      present: 210,
      absent: 16,
      halfDay: 18,
    },
    {
      date: "3 Sep",
      present: 212,
      absent: 14,
      halfDay: 20,
    },
    {
      date: "4 Sep",
      present: 200,
      absent: 25,
      halfDay: 30,
    },
    {
      date: "5 Sep",
      present: 185,
      absent: 17,
      halfDay: 15,
    },
    {
      date: "6 Sep",
      present: 140,
      absent: 18,
      halfDay: 16,
    },
    {
      date: "7 Sep",
      present: 155,
      absent: 17,
      halfDay: 18,
    },
    {
      date: "8 Sep",
      present: 165,
      absent: 15,
      halfDay: 17,
    },
    {
      date: "9 Sep",
      present: 172,
      absent: 13,
      halfDay: 15,
    },
    {
      date: "10 Sep",
      present: 180,
      absent: 12,
      halfDay: 14,
    },
    {
      date: "11 Sep",
      present: 190,
      absent: 10,
      halfDay: 12,
    },
    {
      date: "12 Sep",
      present: 182,
      absent: 14,
      halfDay: 16,
    },
    {
      date: "13 Sep",
      present: 145,
      absent: 20,
      halfDay: 18,
    },
    {
      date: "14 Sep",
      present: 158,
      absent: 17,
      halfDay: 19,
    },
    {
      date: "15 Sep",
      present: 175,
      absent: 15,
      halfDay: 14,
    },
    {
      date: "16 Sep",
      present: 188,
      absent: 11,
      halfDay: 13,
    },
    {
      date: "17 Sep",
      present: 195,
      absent: 9,
      halfDay: 11,
    },
    {
      date: "18 Sep",
      present: 202,
      absent: 12,
      halfDay: 10,
    },
    {
      date: "19 Sep",
      present: 180,
      absent: 16,
      halfDay: 15,
    },
    {
      date: "20 Sep",
      present: 142,
      absent: 21,
      halfDay: 17,
    },
    {
      date: "21 Sep",
      present: 160,
      absent: 18,
      halfDay: 16,
    },
    {
      date: "22 Sep",
      present: 178,
      absent: 14,
      halfDay: 13,
    },
    {
      date: "23 Sep",
      present: 185,
      absent: 12,
      halfDay: 15,
    },
    {
      date: "24 Sep",
      present: 198,
      absent: 10,
      halfDay: 12,
    },
    {
      date: "25 Sep",
      present: 205,
      absent: 8,
      halfDay: 10,
    },
    {
      date: "26 Sep",
      present: 180,
      absent: 15,
      halfDay: 14,
    },
    {
      date: "27 Sep",
      present: 148,
      absent: 19,
      halfDay: 18,
    },
    {
      date: "28 Sep",
      present: 165,
      absent: 16,
      halfDay: 15,
    },
    {
      date: "29 Sep",
      present: 190,
      absent: 11,
      halfDay: 12,
    },
    {
      date: "30 Sep",
      present: 200,
      absent: 9,
      halfDay: 11,
    },
    {
      date: "31 Sep",
      present: 195,
      absent: 10,
      halfDay: 13,
    },
  ];

  const leaveData = [
    {
      name: "Pending",
      value: 12,
      color: "#ffc52b",
    },
    {
      name: "Approved",
      value: 24,
      color: "#42cfa5",
    },
    {
      name: "Rejected",
      value: 3,
      color: "#ff424c",
    },
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
  const notifications = [
    {
      id: 1,
      title: "Promotion Review",
      description:
        "Discussed potential promotion based on consistent performance and leadership in the recent project.",
      date: "11 June 2026",
    },
    {
      id: 2,
      title: "Employee Appreciation",
      description:
        "Recognized by the team and CEO for outstanding contribution in the client workshop and delivery timeline.",
      date: "7 May 2026",
    },
    {
      id: 3,
      title: "Leave Request",
      description:
        "A new leave request has been submitted and is waiting for your approval.",
      date: "5 May 2026",
    },
    {
      id: 4,
      title: "New Employee",
      description:
        "A new employee has been added to the Development department.",
      date: "2 May 2026",
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
    title: "Present Today",
    value: today?.["In-office"] || 0,
    icon: <HiUsers />,
    iconColor: "#16a34a",
    iconBg: "#f0fdf4",
  },
  {
    id: 3,
    title: "Absent Today",
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
  useEffect(() => {
    getEmployeeData();
    getallteam();
    getTodaydata();
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

              <div className="box3-left">
                <div className="heading">
                  <div className="icon">
                    <LuChartNoAxesCombined />
                    <span>Attendance Overview</span>
                  </div>

                  <select className="month-select">
                    <option value="2026-09">
                      September 2026
                    </option>

                    <option value="2026-08">
                      August 2026
                    </option>

                    <option value="2026-07">
                      July 2026
                    </option>
                  </select>

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

                  <select className="month-select">
                    <option>September 2026</option>
                    <option>August 2026</option>
                    <option>July 2026</option>
                  </select>
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
                  <LuBell />
                  <span>Notifications</span>
                </div>

                <span className="notification-count">
                  {notifications.length}
                </span>

              </div>


              <div className="notification-list">

                {notifications.map((notification) => (

                  <div
                    className="notification-item"
                    key={notification.id}
                  >

                    {/* Check Icon */}
                    <div className="notification-icon">
                      <LuCheck />
                    </div>


                    {/* Content */}
                    <div className="notification-content">

                      <h4>
                        {notification.title}
                      </h4>

                      <p>
                        {notification.description}
                      </p>

                      <span className="notification-date">
                        {notification.date}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

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