import React, { useEffect, useState } from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import "./AdminDash.scss";

import { FaQuoteLeft } from "react-icons/fa";
import { FaUsersLine, FaUsersSlash } from "react-icons/fa6";
import { HiUsers } from "react-icons/hi2";
import { PiUserSwitchFill } from "react-icons/pi";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { LuChartNoAxesCombined } from "react-icons/lu";
import { LuListChecks } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { LuBell } from "react-icons/lu";
import { LuCheck } from "react-icons/lu";
import { LuCake } from "react-icons/lu";
import { LuSend } from "react-icons/lu";

import { Table, Tag } from "antd";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL_USER = import.meta.env.VITE_USER_BACKEND_URL;
const BASE_URL2 = import.meta.env.VITE_ATTENDANCE_URL;
const BASE_URL = import.meta.env.VITE_SALARY_BACKEND_URL;
const BASE_URL3 = import.meta.env.VITE_TEAM_URL;

const AdminDash = () => {
  const navigate = useNavigate();

  // =========================================================
  // QUOTES
  // =========================================================

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

  const [quote] = useState(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  });

  // =========================================================
  // CLOCK
  // =========================================================

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

  const getGreeting = () => {
    const hour = currentTime.getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";

    return "Good Night";
  };

  // =========================================================
  // COMMON HELPERS
  // =========================================================

  const normalizeStatus = (status) => {
    return String(status || "")
      .trim()
      .toLowerCase()
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ");
  };

  const getEmployeeKey = (employee) => {
    return String(
      employee?.employeeId ??
      employee?.employeeID ??
      employee?.empId ??
      employee?.id ??
      employee?.uid ??
      "",
    ).trim();
  };


  const formatTime12Hour = (dateTime) => {
    if (!dateTime) return "";

    const value = String(dateTime);

    if (!value.includes("T")) {
      const [hours, minutes, seconds = "00"] = value.split(":");

      let hour = Number(hours);

      if (isNaN(hour) || !minutes) return value;

      const period = hour >= 12 ? "PM" : "AM";

      hour = hour % 12 || 12;

      return `${String(hour).padStart(2, "0")}:${minutes}:${seconds} ${period}`;
    }

    const timePart = value
      .split("T")[1]
      ?.split(".")[0]
      ?.replace("Z", "");

    if (!timePart) return "";

    const [hours, minutes, seconds = "00"] = timePart.split(":");

    let hour = Number(hours);

    if (isNaN(hour) || !minutes) return "";

    const period = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12;

    return `${String(hour).padStart(2, "0")}:${minutes}:${seconds} ${period}`;
  };

  // =========================================================
  // EMPLOYEE DATA
  // =========================================================

  const [allEmployees, setAllEmployees] = useState([]);
  const [employeeLoader, setEmployeeLoader] = useState(false);

  const getAllEmployees = async () => {
    try {
      const response = await axios.get(`${BASE_URL_USER}Admin/GetAllEmployee`, {
        withCredentials: true,
      });

      console.log("ALL EMPLOYEES API:", response.data);

      let employees = [];

      if (Array.isArray(response?.data)) {
        employees = response.data;
      } else if (Array.isArray(response?.data?.data)) {
        employees = response.data.data;
      } else if (Array.isArray(response?.data?.employees)) {
        employees = response.data.employees;
      }

      employees = employees.filter(Boolean);

      console.log("TOTAL ALL EMPLOYEES:", employees.length);

      setAllEmployees(employees);

      return employees;
    } catch (error) {
      console.error("Get All Employees Error:", error?.response?.data || error);

      setAllEmployees([]);

      return [];
    }
  };

  // =========================================================
  // TODAY ATTENDANCE
  // =========================================================

  const [today, setToday] = useState({});
  const [todayAttendanceRecords, setTodayAttendanceRecords] = useState([]);

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  const getTodaydata = async () => {
    try {
      const currentDate = new Date().toISOString().split("T")[0];

      const res = await axios.get(
        `${BASE_URL2}api/punch/work-session/summary?date=${currentDate}`,
      );

      console.log("TODAY SUMMARY:", res.data);

      setToday(res?.data || {});

      return res?.data || {};
    } catch (error) {
      console.log("Today Summary API Error:", error?.response?.data || error);

      setToday({});

      return {};
    }
  };

  const getEmployeeData = async () => {
    try {
      setLoader(true);

      const response = await axios.get(`${BASE_URL2}api/punch/details`);

      console.log("TODAY ATTENDANCE API:", response.data);

      const records = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

      setTodayAttendanceRecords(records);

      const tableData = records.map((item, index) => {
        const punchInByAdmin = Boolean(item?.punchInByAdmin);
        const punchOutByAdmin = Boolean(item?.punchOutByAdmin);

        const punchInTime = item?.punchIn
          ? formatTime12Hour(item.punchIn)
          : "";

        const punchOutTime = item?.punchOut
          ? formatTime12Hour(item.punchOut)
          : "";

        const apiStatus = String(item?.status || "")
          .trim()
          .toUpperCase();

        let status = "ABSENT";

        if (apiStatus === "FULL_DAY" || apiStatus === "PRESENT") {
          status = "FULL_DAY";
        } else if (apiStatus === "HALF_DAY") {
          status = "HALF_DAY";
        } else if (apiStatus === "ABSENT") {
          status = "ABSENT";
        } else if (item?.punchIn) {
          status = "IN Office";
        }

        return {
          key: item?.employeeId || index,
          employeeId: item?.employeeId || "",
          employeeName: item?.employeeName?.toUpperCase() || "",
          employeeDesignation: item?.employeeDesignation || "",

          punchIn: punchInTime,
          punchOut: punchOutTime,

          status,

          hasPunchIn:
            Boolean(item?.punchIn) || Boolean(item?.punchInByAdmin),

          punchInByAdmin,

          punchOutByAdmin,

          rawPunchIn: item?.punchIn || "",
        };
      });
      tableData.sort((a, b) => {
        if (!a.rawPunchIn && !b.rawPunchIn) {
          return 0;
        }

        if (!a.rawPunchIn) {
          return 1;
        }

        if (!b.rawPunchIn) {
          return -1;
        }

        return (
          new Date(a.rawPunchIn).getTime() -
          new Date(b.rawPunchIn).getTime()
        );
      });

      setData(tableData);

      console.log("SORTED TODAY ATTENDANCE:", tableData);

      return records;
    } catch (error) {
      console.error(
        "Attendance API Error:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
        "Unable to load attendance"
      );

      setData([]);
      setTodayAttendanceRecords([]);

      return [];
    } finally {
      setLoader(false);
    }
  };

  // =========================================================
  // DASHBOARD CARDS
  // =========================================================

  const totalEmployees = allEmployees.length;

  const presentEmployees = todayAttendanceRecords.filter(
    (item) => Boolean(item?.punchIn) || Boolean(item?.punchInByAdmin),
  ).length;

  const absentEmployees = Math.max(totalEmployees - presentEmployees, 0);

  const dashboardCards = [
    {
      id: 1,
      title: "Total Employees",
      value: totalEmployees,
      icon: <FaUsersLine />,
      iconColor: "#2563eb",
      iconBg: "#eff6ff",
    },
    {
      id: 2,
      title: "Punch In Today",
      value: presentEmployees,
      icon: <HiUsers />,
      iconColor: "#16a34a",
      iconBg: "#f0fdf4",
    },
    {
      id: 3,
      title: "Not Punch In Today",
      value: absentEmployees,
      icon: <FaUsersSlash />,
      iconColor: "#dc2626",
      iconBg: "#fef2f2",
    },
    {
      id: 4,
      title: "Half Day Exists",
      // value: halfDayEmployees,
      icon: <PiUserSwitchFill />,
      iconColor: "#f59e0b",
      iconBg: "#fffbeb",
    },
  ];

  // =========================================================
  // TABLE COLUMNS
  // =========================================================

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
        <span className="employee-name-text">{name || "N/A"}</span>
      ),
    },

    {
      title: "Punch In Time",
      dataIndex: "punchIn",
      key: "punchIn",
      width: 130,

      render: (_, record) => (
        <span>
          {record?.punchIn || "--"}

          {record?.punchInByAdmin && (
            <span className="admin-punch-label">
              {" "}
              (Admin Punch)
            </span>
          )}
        </span>
      ),
    },

    {
      title: "Punch Out Time",
      dataIndex: "punchOut",
      key: "punchOut",
      width: 130,

      render: (_, record) => (
        <span>
          {record?.punchOut || "--"}

          {record?.punchOutByAdmin && (
            <span className="admin-punch-label">
              {" "}
              (Admin)
            </span>
          )}
        </span>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,

      render: (status) => {
        const normalizedStatus = String(status || "")
          .trim()
          .toUpperCase();

        if (normalizedStatus === "FULL_DAY") {
          return (
            <span className="dashboard-status full-day-status">
              Full Day
            </span>
          );
        }

        if (normalizedStatus === "HALF_DAY") {
          return (
            <span className="dashboard-status half-day-status">
              Half Day
            </span>
          );
        }

        if (normalizedStatus === "ABSENT") {
          return (
            <span className="dashboard-status absent-status">
              Absent
            </span>
          );
        }

        if (normalizedStatus === "IN OFFICE") {
          return (
            <span className="dashboard-status in-office-status">
              IN Office
            </span>
          );
        }

        return (
          <span className="dashboard-status in-office-status">
            {status || "--"}
          </span>
        );
      },
    },
  ];

  // =========================================================
  // LEAVE MANAGEMENT
  // =========================================================

  const [leave, setLeave] = useState([]);

  const getAllLeaves = async () => {
    try {
      const response = await axios.get(`${BASE_URL}admin/getAllLeaves`, {
        withCredentials: true,
      });

      console.log("GET ALL LEAVES:", response.data);

      const leaveData = Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response?.data)
          ? response.data
          : [];

      setLeave(leaveData);
    } catch (error) {
      console.log("Get All Leaves Error:", error?.response?.data || error);

      setLeave([]);
    }
  };

  const leaveData = [
    {
      name: "Pending",
      value: leave.filter(
        (item) => normalizeStatus(item?.approved) === "pending",
      ).length,
      color: "#ffc52b",
    },

    {
      name: "Approved",
      value: leave.filter(
        (item) => normalizeStatus(item?.approved) === "approved",
      ).length,
      color: "#42cfa5",
    },

    {
      name: "Rejected",
      value: leave.filter(
        (item) => normalizeStatus(item?.approved) === "rejected",
      ).length,
      color: "#ff424c",
    },
  ];

  // =========================================================
  // MONTHLY ATTENDANCE
  // =========================================================

  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    String(currentDate.getMonth() + 1).padStart(2, "0"),
  );

  const [selectedYear, setSelectedYear] = useState(
    String(currentDate.getFullYear()),
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

  const getMonthlyAttendance = async (month, year) => {
    try {
      setAttendanceLoader(true);

      const startDate = `${year}-${month}-01`;

      const lastDay = new Date(Number(year), Number(month), 0).getDate();

      const endDate = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;

      console.log("MONTHLY START DATE:", startDate);

      console.log("MONTHLY END DATE:", endDate);

      const response = await axios.get(
        `${BASE_URL2}api/punch/getPreviousAttendence?startDate=${startDate}&endDate=${endDate}`,
      );

      console.log("MONTHLY ATTENDANCE API:", response.data);

      const records = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

      const days = [];

      for (let day = 1; day <= lastDay; day++) {
        const formattedDay = String(day).padStart(2, "0");

        days.push({
          date: `${day} ${new Date(
            Number(year),
            Number(month) - 1,
            day,
          ).toLocaleString("en-US", {
            month: "short",
          })}`,

          fullDate: `${year}-${month}-${formattedDay}`,

          present: 0,
          absent: 0,
          halfDay: 0,
        });
      }

      records.forEach((item) => {
        if (!item?.punchIn) {
          return;
        }

        const attendanceDate = item.punchIn.split("T")[0];

        const dayData = days.find((day) => day.fullDate === attendanceDate);

        if (!dayData) {
          return;
        }

        const status = normalizeStatus(item?.status);

        if (
          !item?.status ||
          status === "full day" ||
          status === "present" ||
          status === "in office" ||
          status === "in progress" ||
          status === "inprogress"
        ) {
          dayData.present += 1;
        } else if (status === "absent") {
          dayData.absent += 1;
        } else if (status === "half day" || status === "halfday") {
          dayData.halfDay += 1;
        }
      });

      console.log("MONTH GRAPH DATA:", days);

      setAttendanceData(days);
    } catch (error) {
      console.log(
        "Monthly Attendance API Error:",
        error?.response?.data || error,
      );

      setAttendanceData([]);
    } finally {
      setAttendanceLoader(false);
    }
  };

  useEffect(() => {
    getMonthlyAttendance(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  // =========================================================
  // TEAM
  // =========================================================

  const [team, setTeam] = useState([]);

  const getallteam = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL3}Pandoza_Admin/Admin/Team/getAllTeams`,
      );

      console.log("TEAM API RESPONSE:", res.data);

      const teamData = Array.isArray(res?.data)
        ? res.data.filter((item) => item?.data).map((item) => item.data)
        : Array.isArray(res?.data?.data)
          ? res.data.data
          : [];

      console.log("NORMALIZED TEAM DATA:", teamData);

      setTeam(teamData);
    } catch (error) {
      console.error("Team API Error:", error?.response?.data || error);

      setTeam([]);
    }
  };

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  const [notifications, setNotifications] = useState([]);

  const [notificationLoader, setNotificationLoader] = useState(false);

  const [notificationCount, setNotificationCount] = useState(0);

  const [unreadNotifications, setUnreadNotifications] = useState([]);

  const [showUnread, setShowUnread] = useState(false);

  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const [selectedNotification, setSelectedNotification] = useState(null);

  const displayedNotifications = showUnread
    ? unreadNotifications
    : [...notifications].sort((a, b) => {
      if (a?.isRead === b?.isRead) {
        return 0;
      }

      return a?.isRead ? 1 : -1;
    });

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

  const getNotifications = async () => {
    try {
      setNotificationLoader(true);

      const response = await axios.get(
        `${BASE_URL_USER}Notification/getMyNotifications`,
        {
          withCredentials: true,
        },
      );

      console.log("NOTIFICATION API RESPONSE:", response.data);

      const notificationData = Array.isArray(response.data)
        ? response.data.map((item) => item?.data).filter(Boolean)
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

      console.log("NORMALIZED NOTIFICATIONS:", notificationData);

      setNotifications(notificationData);
    } catch (error) {
      console.error("Notification API Error:", error?.response?.data || error);

      setNotifications([]);
    } finally {
      setNotificationLoader(false);
    }
  };

  const getNotificationCount = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL_USER}Notification/my/UnreadCount`,
        {
          withCredentials: true,
        },
      );

      console.log("NOTIFICATION COUNT:", response.data);

      setNotificationCount(Number(response?.data) || 0);
    } catch (error) {
      console.error(
        "Notification Count API Error:",
        error?.response?.data || error,
      );

      setNotificationCount(0);
    }
  };

  const getUnreadNotifications = async () => {
    try {
      setNotificationLoader(true);

      const response = await axios.get(
        `${BASE_URL_USER}Notification/my/UnreadNotifications`,
        {
          withCredentials: true,
        },
      );

      console.log("UNREAD NOTIFICATION API RESPONSE:", response.data);

      const unreadData = Array.isArray(response.data)
        ? response.data.map((item) => item?.data).filter(Boolean)
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

      console.log("NORMALIZED UNREAD NOTIFICATIONS:", unreadData);

      setUnreadNotifications(unreadData);

      setShowUnread(true);
    } catch (error) {
      console.error(
        "Unread Notification API Error:",
        error?.response?.data || error,
      );

      setUnreadNotifications([]);
    } finally {
      setNotificationLoader(false);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.put(
        `${BASE_URL_USER}Notification/${notificationId}/markAsRead`,
        {},
        {
          withCredentials: true,
        },
      );

      console.log("Notification marked as read:", notificationId);

      // Update normal list immediately
      setNotifications((prev) =>
        prev.map((notification) =>
          notification?.id === notificationId
            ? {
              ...notification,
              isRead: true,
            }
            : notification,
        ),
      );

      // Remove from unread list
      setUnreadNotifications((prev) =>
        prev.filter((notification) => notification?.id !== notificationId),
      );

      // Update unread count
      setNotificationCount((prev) => Math.max(0, Number(prev) - 1));

      return true;
    } catch (error) {
      console.error(
        "Mark Notification Read API Error:",
        error?.response?.data || error,
      );

      return false;
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification) {
      return;
    }

    setSelectedNotification(notification);

    setShowNotificationModal(true);

    if (!notification?.isRead) {
      await markNotificationAsRead(notification.id);
    }
  };

  const handleNotificationDetails = (notification) => {
    if (!notification) {
      return;
    }

    const type = String(notification?.type || "")
      .trim()
      .toLowerCase();

    setShowNotificationModal(false);

    switch (type) {
      case "birthday":
        navigate("/birthday");
        break;

      case "leave":
      case "leave_request":
      case "leaverequest":
        navigate("/LeaveManagement");
        break;

      case "attendance":
        navigate("/attendance");
        break;

      case "document":
      case "document-upload":
      case "document_upload":
        navigate("/Viewdoc");
        break;

      case "salary":
        navigate("/SalaryManagement");
        break;

      case "task":
        navigate("/TaskManagement");
        break;

      default:
        break;
    }
  };

  // =========================================================
  // BIRTHDAY
  // =========================================================

  const [birthday, setBirthday] = useState([]);

  const [birthdayLoader, setBirthdayLoader] = useState(false);

  const [wishingEmployeeId, setWishingEmployeeId] = useState(null);

  const [wishedEmployees, setWishedEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem("birthdayWishedEmployees");

      const parsed = saved ? JSON.parse(saved) : [];

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Birthday localStorage error:", error);

      return [];
    }
  });

  const isBirthdayToday = (birthdayDate) => {
    if (!birthdayDate) {
      return false;
    }

    const today = new Date();

    let birthday;

    birthday = new Date(birthdayDate);

    if (isNaN(birthday.getTime())) {
      return false;
    }

    return (
      birthday.getDate() === today.getDate() &&
      birthday.getMonth() === today.getMonth()
    );
  };

  const getMonthBirthday = async () => {
    try {
      setBirthdayLoader(true);

      const currentMonth = new Date()
        .toLocaleString("en-US", {
          month: "short",
        })
        .toLowerCase();

      const res = await axios.get(
        `${BASE_URL_USER}AuthController/birthdays?month=${currentMonth}`,
        {
          withCredentials: true,
        },
      );

      console.log("MONTH BIRTHDAY API:", res.data);

      const birthdayData = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
          ? res.data
          : [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filteredBirthdayData = birthdayData.filter((employee) => {
        if (!employee?.date) return false;

        const birthdayDate = new Date(employee.date);
        birthdayDate.setHours(0, 0, 0, 0);

        return birthdayDate >= today;
      });

      setBirthday(filteredBirthdayData);
    } catch (error) {
      console.error("Birthday API Error:", error?.response?.data || error);

      setBirthday([]);
    } finally {
      setBirthdayLoader(false);
    }
  };

  const handleBirthdayWish = async (employee) => {
    console.log("WISH BUTTON CLICKED");

    console.log("EMPLOYEE:", employee);

    try {
      const recipientUid = employee?.uid;

      console.log("RECIPIENT UID:", recipientUid);

      if (!recipientUid) {
        toast.error("Recipient UID not found");

        return;
      }

      if (wishedEmployees.includes(recipientUid)) {
        toast.info("Birthday wish already sent");

        return;
      }

      setWishingEmployeeId(recipientUid);

      const companyName =
        employee?.companyName ||
        employee?.company ||
        "Pandoza Solutions Pvt.Ltd.";

      const payload = {
        recipientUids: [recipientUid],

        title: "Happy Birthday! 🎂",

        message: `Wishing ${employee?.employeeName || "you"
          } a very Happy Birthday! 🎉 From ${companyName}.`,

        type: "birthday",

        referenceId: recipientUid,
      };

      console.log("BIRTHDAY NOTIFICATION PAYLOAD:", payload);

      await axios.post(`${BASE_URL_USER}Notification/Admin/create`, payload, {
        withCredentials: true,
      });

      setWishedEmployees((prev) => {
        const updated = prev.includes(recipientUid)
          ? prev
          : [...prev, recipientUid];

        try {
          localStorage.setItem(
            "birthdayWishedEmployees",
            JSON.stringify(updated),
          );
        } catch (error) {
          console.error("Unable to save birthday wish:", error);
        }

        return updated;
      });

      toast.success(
        `Birthday wish sent to ${employee?.employeeName || "employee"}! 🎉`,
      );
    } catch (error) {
      console.error(
        "BIRTHDAY NOTIFICATION ERROR:",
        error?.response?.data || error,
      );

      toast.error(
        error?.response?.data?.message ||
        error?.response?.data?.responseMessage ||
        "Unable to send birthday wish",
      );
    } finally {
      setWishingEmployeeId(null);
    }
  };

  // =========================================================
  // INITIAL DASHBOARD LOAD
  // =========================================================

  useEffect(() => {
    const loadDashboard = async () => {
      await getAllEmployees();

      await Promise.all([
        getEmployeeData(),
        getAllLeaves(),
        getallteam(),
        getTodaydata(),
        getNotifications(),
        getNotificationCount(),
        getMonthBirthday(),
      ]);
    };

    loadDashboard();
  }, []);

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <>
      <MainPanel
        title="Admin Dashboard"
        breadcrumbs={[
          {
            label: "Dashboard",
            link: "/dashboard",
          },
          {
            label: "Admin Dashboard",
          },
        ]}
      >
        <div className="admindash-parent">
          <div className="left-side">
            {/* =================================================
                WELCOME
            ================================================= */}

            <div className="box1">
              <div className="welcome-text">
                <h2>{getGreeting()}, Admin! 👋</h2>

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

            {/* =================================================
                DASHBOARD CARDS
            ================================================= */}

            <div className="box2">
              {dashboardCards.map((card) => (
                <div
                  className="card"
                  key={card.id}
                  onClick={() => {
                    if (card.id === 1) {
                      navigate("/attendance?filter=all");
                    } else if (card.id === 2) {
                      navigate("/attendance?filter=present");
                    } else if (card.id === 3) {
                      navigate("/attendance?filter=absent");
                    } else if (card.id === 4) {
                      navigate("/attendance?filter=halfday");
                    }
                  }}
                >
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
                    <div className="card-title">{card.title}</div>

                    <p>{card.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* =================================================
                ATTENDANCE + LEAVE
            ================================================= */}

            <div className="box3">
              {/* MONTHLY ATTENDANCE */}

              <div className="box3-left">
                <div className="heading">
                  <div className="icon">
                    <LuChartNoAxesCombined />

                    <span>Attendance Overview</span>
                  </div>

                  <div className="attendance-filters">
                    <select
                      className="month-select"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>

                    <select
                      className="month-select"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
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
                      <CartesianGrid strokeDasharray="0" vertical={false} />

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

              {/* LEAVE REQUESTS */}

              <div className="box3-right">
                <div className="leave-header">
                  <div className="leave-title">
                    <LuListChecks />

                    <span>Leave Requests</span>
                  </div>

                  <Link to="/LeaveManagement" className="view-all">
                    View All →
                  </Link>
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
                            <Cell key={item.name} fill={item.color} />
                          ))}
                        </Pie>

                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="chart-center">
                      <strong>
                        {leaveData.reduce(
                          (total, item) => total + item.value,
                          0,
                        )}
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

            {/* =================================================
                TODAY ATTENDANCE + TEAM
            ================================================= */}

            <div className="box4">
              {/* TODAY ATTENDANCE */}

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
                    scroll={{
                      x: "max-content",
                    }}
                    rowClassName={(_, index) =>
                      index % 2 === 0 ? "table-row-light" : "table-row-dark"
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

              {/* TEAM STATUS */}

              <div className="box4-right">
                <div className="box4-heading">
                  <div className="heading-title">
                    <LuUsers />

                    <span>Team Status</span>
                  </div>
                </div>

                <div className="team-list">
                  {team.length === 0 ? (
                    <div className="team-empty">No teams found</div>
                  ) : (
                    team.map((item, index) => {
                      const teamColors = [
                        "#3182ed",
                        "#e83d9b",
                        "#43c98d",
                        "#8b5cf6",
                        "#f5a623",
                      ];

                      const color = teamColors[index % teamColors.length];

                      return (
                        <div className="team-row" key={item?.id || index}>
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
                              {item?.name || "N/A"}

                              <span>
                                TL:{" "}
                                {item?.manegerName ||
                                  item?.managerName ||
                                  "N/A"}
                              </span>
                            </div>
                          </div>

                          <div className="team-members">
                            {item?.memberCount || 0} Members
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="right-side">
            {/* CLOCK */}

            <div className="top-box1">
              <div className="clock">
                {Array.from(
                  {
                    length: 12,
                  },
                  (_, index) => {
                    const number = index + 1;

                    const angle = (number * 30 - 90) * (Math.PI / 180);

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
                  },
                )}

                <div
                  className="hour-hand"
                  style={{
                    transform: `rotate(${hourAngle}deg)`,
                  }}
                ></div>

                <div
                  className="minute-hand"
                  style={{
                    transform: `rotate(${minuteAngle}deg)`,
                  }}
                ></div>

                <div
                  className="second-hand"
                  style={{
                    transform: `rotate(${secondAngle}deg)`,
                  }}
                ></div>

                <div className="clock-center"></div>
              </div>
            </div>

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <div className="middle-box2">
              <div className="notification-header">
                <div
                  className="notification-title"
                  onClick={() => {
                    setShowUnread(false);

                    getNotifications();
                  }}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <span>Notifications</span>
                </div>

                <div
                  className="notification-count"
                  onClick={() => {
                    getUnreadNotifications();
                  }}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <LuBell />

                  <span className="count">{notificationCount}</span>
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
                      key={notification?.id}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="notification-icon">
                        <LuCheck />
                      </div>

                      <div className="notification-content">
                        <h4>{notification?.title || "Notification"}</h4>

                        <p>{getNotificationPreview(notification?.message)}</p>

                        <span className="notification-date">
                          {notification?.createdAt
                            ? new Date(notification.createdAt).toLocaleString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                            : "--"}
                        </span>
                      </div>

                      {!notification?.isRead && (
                        <span className="notification-dot"></span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* NOTIFICATION MODAL */}

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
                      <div>
                        <h3>{selectedNotification?.title || "Notification"}</h3>

                        <span className="notification-modal-type">
                          {selectedNotification?.type || "Notification"}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="notification-modal-close"
                        onClick={() => setShowNotificationModal(false)}
                      >
                        ×
                      </button>
                    </div>

                    <div className="notification-modal-body">
                      <p className="notification-modal-date">
                        {selectedNotification?.createdAt
                          ? new Date(
                            selectedNotification.createdAt,
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

                      <div className="notification-modal-actions">
                        <button
                          type="button"
                          className="notification-modal-cancel"
                          onClick={() => setShowNotificationModal(false)}
                        >
                          Close
                        </button>

                        {String(selectedNotification?.type || "")
                          .trim()
                          .toLowerCase() !== "birthday" && (
                            <button
                              type="button"
                              className="notification-modal-details"
                              onClick={() =>
                                handleNotificationDetails(selectedNotification)
                              }
                            >
                              View Details
                              <span>→</span>
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* =================================================
                BIRTHDAYS
            ================================================= */}

            <div className="last-box3">
              <div className="birthday-header">
                <div className="birthday-title">
                  <LuCake />

                  <span>Birthdays This Month</span>
                </div>
              </div>

              <div className="birthday-list">
                {birthdayLoader ? (
                  <div className="birthday-loading">Loading birthdays...</div>
                ) : birthday.length === 0 ? (
                  <div className="birthday-empty">No birthdays this month</div>
                ) : (
                  birthday.map((employee, index) => {
                    const birthdayToday = isBirthdayToday(employee?.date);

                    const employeeId = employee?.uid;

                    return (
                      <div
                        className={`birthday-item ${birthdayToday ? "birthday-today" : ""
                          }`}
                        key={employeeId || index}
                      >
                        <div className="birthday-avatar">
                          {(employee?.employeeName || "N/A")
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .toUpperCase()}
                        </div>

                        <div className="birthday-info">
                          <h4>{employee?.employeeName || "N/A"}</h4>

                          {birthdayToday && (
                            <span className="birthday-today-text">
                              🎂 Birthday Today!
                            </span>
                          )}
                        </div>

                        <div className="birthday-date">
                          {employee?.date
                            ? new Date(employee.date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                              },
                            )
                            : "--"}
                        </div>

                        {birthdayToday && (
                          <button
                            type="button"
                            className={`wish-button ${wishedEmployees.includes(employeeId)
                              ? "wish-sent"
                              : ""
                              }`}
                            disabled={
                              wishingEmployeeId === employeeId ||
                              wishedEmployees.includes(employeeId)
                            }
                            onClick={() => handleBirthdayWish(employee)}
                          >
                            <LuSend />

                            {wishingEmployeeId === employeeId
                              ? "Sending..."
                              : wishedEmployees.includes(employeeId)
                                ? "Wished ✓"
                                : "Wish"}
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </MainPanel>
    </>
  );
};

export default AdminDash;
