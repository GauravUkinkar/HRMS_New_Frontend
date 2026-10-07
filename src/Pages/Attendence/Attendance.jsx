import React, { useEffect, useState } from "react";
import "./Attendance.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import Table_Comp from "../../comp/table/Table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Dropdown, Modal, DatePicker, Table } from "antd";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { SlCalender } from "react-icons/sl";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;
const BASE_URL2 = import.meta.env.VITE_ATTENDANCE_URL;

const Attendance = () => {
  const navigate = useNavigate();
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  const [previousAttendance, setPreviousAttendance] = useState({
    employeeId: "",
    date: "",
    status: "",
  });
  const [searchParams] = useSearchParams();

  const attendanceFilter = searchParams.get("filter") || "all";
  const [previousAttendanceData, setPreviousAttendanceData] = useState([]);

  const [attendanceHistoryLoading, setAttendanceHistoryLoading] =
    useState(false);

  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);

  const [allemployee, setAllEmployee] = useState([]);

  // ============================================================
  // TODAY ATTENDANCE
  // ============================================================

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  const [activePunchIn, setActivePunchIn] = useState(null);
  const [newTime, setNewTime] = useState("");

  // ============================================================
  // PREVIOUS ATTENDANCE VIEW
  // ============================================================

  const [showPreviousAttendance, setShowPreviousAttendance] = useState(false);

  const [previousStartDate, setPreviousStartDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );

  const [previousEndDate, setPreviousEndDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );

  const [previousAttendanceList, setPreviousAttendanceList] = useState([]);

  const [previousAttendanceLoading, setPreviousAttendanceLoading] =
    useState(false);

  // ============================================================
  // EMPLOYEE MONTHLY ATTENDANCE
  // ============================================================

  const [showEmployeeAttendance, setShowEmployeeAttendance] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [employeeAttendanceList, setEmployeeAttendanceList] = useState([]);

  const [employeeAttendanceLoading, setEmployeeAttendanceLoading] =
    useState(false);

  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);

  const [selectedYear, setSelectedYear] = useState(String(dayjs().year()));

  // ============================================================
  // ADD PREVIOUS ATTENDANCE
  // ============================================================

  const handleAddPreviousAttendance = () => {
    setPreviousAttendance({
      employeeId: "",
      date: "",
      status: "",
    });

    setSelectedEmployees([]);
    setEmployeeDropdownOpen(false);
    setPreviousAttendanceData([]);
    setDatePickerOpen(false);

    setShowAttendanceModal(true);
  };

  const handleCloseAttendanceModal = () => {
    setShowAttendanceModal(false);
    setDatePickerOpen(false);
    setEmployeeDropdownOpen(false);
    setSelectedEmployees([]);

    setPreviousAttendance({
      employeeId: "",
      date: "",
      status: "",
    });

    setPreviousAttendanceData([]);
  };
  const formatTime12Hour = (dateTime) => {
    if (!dateTime) return "";

    const value = String(dateTime);

    if (!value.includes("T")) {
      return value;
    }

    const timePart = value.split("T")[1]?.split(".")[0]?.replace("Z", "");

    if (!timePart) return "";

    const [hours, minutes, seconds = "00"] = timePart.split(":");

    let hour = Number(hours);

    if (isNaN(hour) || !minutes) return "";

    const period = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12;

    return `${String(hour).padStart(2, "0")}:${minutes}:${seconds} ${period}`;
  };

  // ============================================================
  // GET ALL EMPLOYEES
  // ============================================================

  const getAllEmployee = async () => {
    try {
      const res = await axios.get(`${BASE_URL}Admin/GetAllEmployee`, {
        withCredentials: true,
      });

      const employees = (res?.data || []).map((item, index) => ({
        key: index + 1,
        name: item?.data?.employeeName || "",
        empId: item?.data?.employeeId || "",
        email: item?.data?.email || "",
        status: item?.data?.employeeStatus || "",
        designation:
          item?.data?.employeeDesignation || item?.data?.designation || "",
        uid: item?.data?.uid || "",
      }));

      setAllEmployee(employees);

      return employees;
    } catch (error) {
      console.error("Get All Employee Error:", error?.response?.data || error);
      return [];
    }
  };

  // ============================================================
  // EMPLOYEE DROPDOWN TEXT
  // ============================================================

  const getSelectedEmployeeText = () => {
    if (!selectedEmployees.length) {
      return "Select Employee";
    }

    if (
      allemployee.length > 0 &&
      selectedEmployees.length === allemployee.length
    ) {
      return "All Employee";
    }

    if (selectedEmployees.length === 1) {
      const employee = allemployee.find(
        (item) => item.empId === selectedEmployees[0],
      );

      return employee?.name || "Select Employee";
    }

    return `${selectedEmployees.length} Employees Selected`;
  };

  // ============================================================
  // EMPLOYEE CHECKBOX
  // ============================================================

  const handleEmployeeCheckboxChange = async (employeeId) => {
    if (!employeeId) {
      return;
    }

    // SELECT ALL
    if (employeeId === "ALL") {
      const allIds = allemployee.map((item) => item.empId).filter(Boolean);

      const isAllSelected =
        allIds.length > 0 && selectedEmployees.length === allIds.length;

      if (isAllSelected) {
        setSelectedEmployees([]);

        setPreviousAttendance({
          employeeId: "",
          date: "",
          status: "",
        });

        setPreviousAttendanceData([]);
        setDatePickerOpen(false);

        return;
      }

      setSelectedEmployees(allIds);

      setPreviousAttendance({
        employeeId: "ALL",
        date: "",
        status: "",
      });

      setPreviousAttendanceData([]);
      setDatePickerOpen(false);
      setEmployeeDropdownOpen(false);

      return;
    }

    // INDIVIDUAL EMPLOYEE
    const nextSelected = selectedEmployees.includes(employeeId)
      ? selectedEmployees.filter((id) => id !== employeeId)
      : [...selectedEmployees, employeeId];

    setSelectedEmployees(nextSelected);
    setDatePickerOpen(false);

    if (nextSelected.length === 0) {
      setPreviousAttendance({
        employeeId: "",
        date: "",
        status: "",
      });

      setPreviousAttendanceData([]);

      return;
    }

    if (nextSelected.length === 1) {
      const singleEmployeeId = nextSelected[0];

      setPreviousAttendance({
        employeeId: singleEmployeeId,
        date: "",
        status: "",
      });

      setPreviousAttendanceData([]);

      await getPreviousAttendance(singleEmployeeId);

      return;
    }

    setPreviousAttendance({
      employeeId: "MULTIPLE",
      date: "",
      status: "",
    });

    setPreviousAttendanceData([]);
  };

  // ============================================================
  // GET TODAY ATTENDANCE
  // ============================================================

  const getEmployeeData = async (employeeList = allemployee) => {
    try {
      setLoader(true);

      const response = await axios.get(`${BASE_URL2}api/punch/details`);

      const rawData = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

      const employees = employeeList || [];

      const attendanceMap = new Map();

      rawData.forEach((item) => {
        const employeeId = String(item?.employeeId || "").trim();

        if (employeeId) {
          attendanceMap.set(employeeId, item);
        }
      });

      const tableData = employees
        .map((employee, index) => {
          const employeeId = String(employee?.empId || "").trim();
          const item = attendanceMap.get(employeeId);

          if (!item) {
            return {
              key: employeeId || index,
              employeeId,
              employeeName: employee?.name?.toUpperCase() || "",
              employeeDesignation: employee?.designation || "",
              punchIn: "",
              punchOut: "",
              status: "ABSENT",
              hasPunchIn: false,
              punchInByAdmin: false,
              punchOutByAdmin: false,
            };
          }

          const punchInByAdmin = Boolean(item?.punchInByAdmin);
          const punchOutByAdmin = Boolean(item?.punchOutByAdmin);

          const punchIn = item?.punchIn
            ? formatTime12Hour(item.punchIn)
            : "";

          const punchOut = item?.punchOut
            ? formatTime12Hour(item.punchOut)
            : "";

          const apiStatus = String(item?.status || "")
            .trim()
            .toUpperCase();

          let status = "ABSENT";

          if (apiStatus === "FULL_DAY") {
            status = "FULL_DAY";
          } else if (apiStatus === "HALF_DAY") {
            status = "HALF_DAY";
          } else if (apiStatus === "ABSENT") {
            status = "ABSENT";
          } else if (punchIn) {
            status = "IN Office";
          }

          return {
            key: employeeId || index,
            employeeId,
            employeeName:
              item?.employeeName?.toUpperCase() ||
              employee?.name?.toUpperCase() ||
              "",
            employeeDesignation:
              item?.employeeDesignation ||
              item?.designation ||
              employee?.designation ||
              "",
            punchIn,
            punchOut,
            status,
            hasPunchIn: Boolean(item?.punchIn),
            punchInByAdmin,
            punchOutByAdmin,
          };
        })
        .sort((a, b) => {
          if (!a.punchIn && !b.punchIn) return 0;
          if (!a.punchIn) return 1;
          if (!b.punchIn) return -1;

          return a.punchIn.localeCompare(b.punchIn);
        });

      setData(tableData);

      return rawData;
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

      return [];
    } finally {
      setLoader(false);
    }
  };

  // ============================================================
  // EMPLOYEE MONTHLY ATTENDANCE
  // ============================================================

  const getEmployeeMonthlyAttendance = async (employeeId, month, year) => {
    if (!employeeId) {
      setEmployeeAttendanceList([]);
      return;
    }

    try {
      setEmployeeAttendanceLoading(true);

      const response = await axios.post(
        `${BASE_URL2}api/punch/attendance/${employeeId}`,
        {
          year: Number(year),
          month: String(month),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const attendanceList = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data?.result)
            ? response.data.result
            : Array.isArray(response?.data?.attendance)
              ? response.data.attendance
              : [];

      setEmployeeAttendanceList(attendanceList);
    } catch (error) {
      console.error("Employee Monthly Attendance Error:", error);

      setEmployeeAttendanceList([]);

      toast.error(
        error?.response?.data?.message || "Unable to load employee attendance",
      );
    } finally {
      setEmployeeAttendanceLoading(false);
    }
  };

  // ============================================================
  // EMPLOYEE CALENDAR
  // ============================================================

  const handleCalendar = async (record) => {
    setSelectedEmployee(record);

    const currentMonth = dayjs().month() + 1;
    const currentYear = dayjs().year();

    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);

    setShowPreviousAttendance(false);
    setShowEmployeeAttendance(true);

    await getEmployeeMonthlyAttendance(
      record?.employeeId,
      currentMonth,
      currentYear,
    );
  };

  const handleEmployeeMonthChange = async (e) => {
    const month = Number(e.target.value);

    setSelectedMonth(month);

    await getEmployeeMonthlyAttendance(
      selectedEmployee?.employeeId,
      month,
      Number(selectedYear),
    );
  };

  const handleEmployeeYearChange = async (e) => {
    const value = e.target.value;

    if (value.length > 4) {
      return;
    }

    setSelectedYear(value);

    if (value.length === 4) {
      const year = Number(value);

      if (year < 2000 || year > 2100) {
        return;
      }

      await getEmployeeMonthlyAttendance(
        selectedEmployee?.employeeId,
        selectedMonth,
        year,
      );
    }
  };

  const closeEmployeeAttendance = () => {
    setShowEmployeeAttendance(false);
    setSelectedEmployee(null);
    setEmployeeAttendanceList([]);
  };

  // ============================================================
  // PREVIOUS ATTENDANCE
  // ============================================================

  const closePreviousAttendance = () => {
    setShowPreviousAttendance(false);
    setPreviousAttendanceList([]);
  };

  const getPreviousAttendance = async (employeeId) => {
    if (!employeeId) {
      setPreviousAttendanceData([]);
      return;
    }

    try {
      setAttendanceHistoryLoading(true);

      const today = dayjs();

      const startDate = `${today.year()}-01-01`;
      const endDate = today.format("YYYY-MM-DD");

      const response = await axios.post(
        `${BASE_URL2}api/punch/attendance/${employeeId}`,
        {
          startDate,
          endDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      let attendanceList = [];

      if (Array.isArray(response?.data)) {
        attendanceList = response.data;
      } else if (Array.isArray(response?.data?.data)) {
        attendanceList = response.data.data;
      } else if (Array.isArray(response?.data?.result)) {
        attendanceList = response.data.result;
      } else if (Array.isArray(response?.data?.attendance)) {
        attendanceList = response.data.attendance;
      }

      setPreviousAttendanceData(attendanceList);

      setTimeout(() => {
        setDatePickerOpen(true);
      }, 200);
    } catch (error) {
      console.error("Previous Attendance API Error:", error);

      setPreviousAttendanceData([]);

      toast.error(
        error?.response?.data?.message || "Unable to load previous attendance",
      );
    } finally {
      setAttendanceHistoryLoading(false);
    }
  };

  // ============================================================
  // VIEW PREVIOUS ATTENDANCE
  // ============================================================

  const getPreviousAttendanceView = async (
    startDate = previousStartDate,
    endDate = previousEndDate,
  ) => {
    try {
      setPreviousAttendanceLoading(true);

      const response = await axios.get(
        `${BASE_URL2}api/punch/getPreviousAttendence`,
        {
          params: {
            startDate,
            endDate,
          },
        },
      );

      const attendanceList = Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response?.data)
          ? response.data
          : [];

      setPreviousAttendanceList(attendanceList);
    } catch (error) {
      console.error("Previous Attendance View Error:", error);

      setPreviousAttendanceList([]);

      toast.error(
        error?.response?.data?.message || "Unable to load previous attendance",
      );
    } finally {
      setPreviousAttendanceLoading(false);
    }
  };

  const handleViewPreviousAttendance = async () => {
    setShowEmployeeAttendance(false);
    setSelectedEmployee(null);
    setEmployeeAttendanceList([]);

    setShowPreviousAttendance(true);

    await getPreviousAttendanceView(previousStartDate, previousEndDate);
  };

  const handlePreviousAttendanceSearch = async () => {
    if (!previousStartDate || !previousEndDate) {
      toast.error("Please select start date and end date");
      return;
    }

    if (dayjs(previousStartDate).isAfter(dayjs(previousEndDate))) {
      toast.error("Start date cannot be greater than end date");
      return;
    }

    await getPreviousAttendanceView(previousStartDate, previousEndDate);
  };

  // ============================================================
  // PREVIOUS ATTENDANCE COLUMNS
  // ============================================================
const previousAttendanceColumns = [
  {
    title: "Emp Id",
    dataIndex: "employeeId",
    key: "employeeId",
    align: "center",
  },

  {
    title: "Employee Name",
    dataIndex: "employeeName",
    key: "employeeName",
    align: "center",
  },

  {
    title: "Designation",
    dataIndex: "employeeDesignation",
    key: "employeeDesignation",
    align: "center",
  },

  {
    title: "In Time",
    dataIndex: "punchIn",
    key: "punchIn",
    width: 180,
    align: "center",

    render: (time, record) => {
      if (!time) {
        return "-";
      }

      return (
        <span>
          {formatTime12Hour(time)}

          {record?.punchInByAdmin && (
            <span className="admin-punch-label">
              {" "}
              (Admin Punch)
            </span>
          )}
        </span>
      );
    },
  },

  {
    title: "Out Time",
    dataIndex: "punchOut",
    key: "punchOut",
    width: 180,
    align: "center",

    render: (time, record) => {
      if (!time) {
        return "-";
      }

      return (
        <span>
          {formatTime12Hour(time)}

          {record?.punchOutByAdmin && (
            <span className="admin-punch-label">
              {" "}
              (Admin Punch)
            </span>
          )}
        </span>
      );
    },
  },

  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    align: "center",

    render: (status) => {
      const normalizedStatus = String(status || "")
        .trim()
        .toUpperCase();

      if (
        normalizedStatus === "FULL_DAY" ||
        normalizedStatus === "PRESENT"
      ) {
        return (
          <span className="attendance-status full-day-status">
            Full Day
          </span>
        );
      }

      if (normalizedStatus === "HALF_DAY") {
        return (
          <span className="attendance-status half-day-status">
            Half Day
          </span>
        );
      }

      if (normalizedStatus === "ABSENT") {
        return (
          <span className="attendance-status absent-status">
            Absent
          </span>
        );
      }

      return (
        <span className="attendance-status">
          {status || "-"}
        </span>
      );
    },
  },

  {
    title: "Action",
    key: "action",
    align: "center",

    render: (_, record) => (
      <button
        type="button"
        className="calendar-btn"
        onClick={() => handleCalendar(record)}
      >
        <SlCalender />
      </button>
    ),
  },
];

  // ============================================================
  // MONTHLY ATTENDANCE COLUMNS
  // ============================================================

  const employeeAttendanceColumns = [
    {
      title: "Emp Id",
      dataIndex: "employeeId",
      key: "employeeId",
      align: "center",

      render: (_, record) =>
        record?.employeeId ||
        selectedEmployee?.employeeId ||
        selectedEmployee?.empId ||
        "-",
    },

    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",

      render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "-"),
    },

    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
      align: "center",

      render: (_, record) =>
        record?.employeeName ||
        selectedEmployee?.employeeName ||
        selectedEmployee?.name ||
        "-",
    },

    {
      title: "Designation",
      dataIndex: "employeeDesignation",
      key: "employeeDesignation",
      align: "center",

      render: (_, record) =>
        record?.employeeDesignation ||
        selectedEmployee?.employeeDesignation ||
        selectedEmployee?.designation ||
        "-",
    },

    {
      title: "In Time",
      key: "punchIn",
      align: "center",

      render: (_, record) => {
        if (!record?.punchIn) {
          return "-";
        }

        if (record?.punchInByAdmin) {
          return <span className="admin-punch-text">Punch In From Admin</span>;
        }

        return formatTime12Hour(record.punchIn);
      },
    },

    {
      title: "Out Time",
      dataIndex: "punchOut",
      key: "punchOut",
      width: 200,
      align: "center",

      render: (_, record) => {
        if (!record?.punchOut) {
          return "-";
        }

        return (
          <span>
            {record.punchOut}

            {record?.punchOutByAdmin && (
              <span className="admin-punch-label">
                {" "}
                (Admin Punch)
              </span>
            )}
          </span>
        );
      },
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",

      render: (status) => {
        const normalizedStatus = String(status || "")
          .trim()
          .toUpperCase();

        let displayStatus = "-";
        let statusClass = "";

        if (
          normalizedStatus === "FULL_DAY" ||
          normalizedStatus === "PRESENT"
        ) {
          displayStatus = "Full Day";
          statusClass = "full-day-status";
        } else if (normalizedStatus === "HALF_DAY") {
          displayStatus = "Half Day";
          statusClass = "half-day-status";
        } else if (normalizedStatus === "ABSENT") {
          displayStatus = "Absent";
          statusClass = "absent-status";
        } else if (normalizedStatus === "IN OFFICE") {
          displayStatus = "IN Office";
          statusClass = "in-office-status";
        }

        return (
          <span className={`monthly-status ${statusClass}`}>
            {displayStatus}
          </span>
        );
      },
    },
  ];

  // ============================================================
  // GET STATUS FOR DATE PICKER
  // ============================================================

  const getAttendanceStatusByDate = (date) => {
    if (!date) {
      return null;
    }

    const selectedDate = dayjs(date).format("YYYY-MM-DD");

    const record = previousAttendanceData.find((item) => {
      if (!item?.date) {
        return false;
      }

      const apiDate = String(item.date).split("T")[0];

      return apiDate === selectedDate;
    });

    return record?.status?.toString().trim().toUpperCase() || null;
  };

  const getAttendanceForSelectedDate = async (date) => {
    if (!date) {
      return [];
    }

    try {
      const response = await axios.get(
        `${BASE_URL2}api/punch/getPreviousAttendence`,
        {
          params: {
            startDate: date,
            endDate: date,
          },
        },
      );

      if (Array.isArray(response?.data?.data)) {
        return response.data.data;
      }

      if (Array.isArray(response?.data)) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error("Selected Date Attendance Error:", error);
      return [];
    }
  };
  // ============================================================
  // ADJUST PREVIOUS ATTENDANCE
  // ============================================================

  const adjustPreviousAttendance = async () => {
    const { employeeId, date, status } = previousAttendance;

    if (!selectedEmployees.length) {
      toast.error("Please select employee");
      return;
    }

    if (!date) {
      toast.error("Please select date");
      return;
    }

    if (!status) {
      toast.error("Please select status");
      return;
    }

    try {
      setAttendanceHistoryLoading(true);

      const isBulk =
        selectedEmployees.length > 1 ||
        employeeId === "ALL" ||
        employeeId === "MULTIPLE";

      if (isBulk) {
        let eligibleEmployees = [];

        if (employeeId === "ALL") {
          const attendanceForDate = await getAttendanceForSelectedDate(date);

          const eligibleEmployeeIds = new Set(
            attendanceForDate
              .filter((item) => {
                const attendanceStatus = String(item?.status || "")
                  .trim()
                  .toUpperCase();

                return attendanceStatus !== "ABSENT";
              })
              .map((item) => String(item?.employeeId || "").trim())
              .filter(Boolean),
          );

          eligibleEmployees = allemployee.filter((item) =>
            eligibleEmployeeIds.has(String(item?.empId || "").trim()),
          );
        } else {
          eligibleEmployees = allemployee.filter((item) =>
            selectedEmployees.includes(item?.empId),
          );
        }

        const employees = eligibleEmployees
          .map((item) => ({
            employeeId: item?.empId || "",
            attendanceType: status,
            employeeName: item?.name || "",
            employeeDesignation: item?.designation || "",
          }))
          .filter((item) => item.employeeId);

        if (!employees.length) {
          toast.error("No eligible employees found for selected date");
          return;
        }

        const response = await axios.post(
          `${BASE_URL2}api/punch/bulkAdjustment`,
          {
            date,
            employee: employees,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (response?.status === 200 && response?.data?.success !== false) {
          toast.success("Previous Attendance Updated Successfully");

          const employeesList = await getAllEmployee();
          await getEmployeeData(employeesList);

          setPreviousAttendance({
            employeeId: "",
            date: "",
            status: "",
          });

          setSelectedEmployees([]);
          setPreviousAttendanceData([]);
          setEmployeeDropdownOpen(false);
          setDatePickerOpen(false);
          setShowAttendanceModal(false);
        } else {
          throw new Error(
            response?.data?.message || "Unable to update attendance",
          );
        }

        return;
      }

      const selectedEmployeeData = allemployee.find(
        (item) => String(item?.empId || "") === String(employeeId),
      );

      if (!selectedEmployeeData) {
        toast.error("Selected employee not found");
        return;
      }

      const response = await axios.post(
        `${BASE_URL2}api/punch/adjust/${employeeId}`,
        {
          date,
          attendanceType: status,
          employeeName: selectedEmployeeData.name || "",
          employeeDesignation: selectedEmployeeData.designation || "",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response?.status === 200 && response?.data?.success !== false) {
        toast.success("Previous Attendance Updated Successfully");

        await getEmployeeData();
        await getPreviousAttendance(employeeId);

        setPreviousAttendance({
          employeeId: "",
          date: "",
          status: "",
        });

        setSelectedEmployees([]);
        setPreviousAttendanceData([]);
        setEmployeeDropdownOpen(false);
        setDatePickerOpen(false);
        setShowAttendanceModal(false);
      } else {
        throw new Error(
          response?.data?.message || "Unable to update previous attendance",
        );
      }
    } catch (error) {
      console.error("Adjust Previous Attendance Error:", error);

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to update previous attendance",
      );
    } finally {
      setAttendanceHistoryLoading(false);
    }
  };

  const markPresent = async (record) => {
    try {
      setLoader(true);

      const today = dayjs().format("YYYY-MM-DD");

      if (!record?.employeeId) {
        toast.error("Employee ID not found");
        return;
      }

      const response = await axios.post(
        `${BASE_URL2}api/punch/adjust/${record.employeeId}`,
        {
          date: today,
          attendanceType: "FULL_DAY",
          employeeName: record?.employeeName || "",
          employeeDesignation: record?.employeeDesignation || "",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setData((prev) =>
          prev.map((item) =>
            item.employeeId === record.employeeId
              ? {
                ...item,
                status: "FULL_DAY",
              }
              : item
          )
        );

        toast.success("Marked Full Day Successfully");
      }
    } catch (error) {
      console.error("Mark Present Error:", error);

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to mark full day"
      );
    } finally {
      setLoader(false);
    }
  };

  const markHalfDay = async (record) => {
    try {
      setLoader(true);

      const today = dayjs().format("YYYY-MM-DD");

      if (!record?.employeeId) {
        toast.error("Employee ID not found");
        return;
      }

      const response = await axios.post(
        `${BASE_URL2}api/punch/adjust/${record.employeeId}`,
        {
          date: today,
          attendanceType: "HALF_DAY",
          employeeName: record?.employeeName || "",
          employeeDesignation: record?.employeeDesignation || "",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setData((prev) =>
          prev.map((item) =>
            item.employeeId === record.employeeId
              ? {
                ...item,
                status: "HALF_DAY",
              }
              : item
          )
        );

        toast.success("Marked Half Day Successfully");
      }
    } catch (error) {
      console.error("Mark Half Day Error:", error);

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to mark half day"
      );
    } finally {
      setLoader(false);
    }
  };



  // ============================================================
  // REMOVE PUNCH IN
  // ============================================================

  const removePunchIn = async (employeeId) => {
    try {
      setLoader(true);

      const response = await axios.get(
        `${BASE_URL2}api/punch/clear/in/${employeeId}`,
      );

      if (response.status === 200) {
        toast.success("Punch In Removed Successfully");

        setActivePunchIn(null);
        setNewTime("");

        await getEmployeeData();
      }
    } catch (error) {
      console.error("Remove Punch In Error:", error);

      toast.error(
        error?.response?.data?.message || "Unable to remove punch in",
      );
    } finally {
      setLoader(false);
    }
  };

  const removePunchOut = async (employeeId) => {
    try {
      setLoader(true);

      const response = await axios.get(
        `${BASE_URL2}api/punch/clear/out/${employeeId}`,
      );

      if (response.status === 200) {
        toast.success("Punch Out Removed Successfully");

        await getEmployeeData();
      }
    } catch (error) {
      console.error("Remove Punch Out Error:", error);

      toast.error(
        error?.response?.data?.message || "Unable to remove punch out",
      );
    } finally {
      setLoader(false);
    }
  };

  // ============================================================
  // CHANGE PUNCH IN TIME
  // ============================================================

  const changePunchInTime = (record) => {
    setActivePunchIn(record?.employeeId);

    if (record?.punchIn && record.punchIn !== "Punch In From Admin") {
      setNewTime(record.punchIn.slice(0, 5));
    } else {
      setNewTime("");
    }
  };

  // ============================================================
  // UPDATE PUNCH IN TIME
  // ============================================================

  const updatePunchInTime = async (
    employeeId,
    employeeName,
    employeeDesignation,
    currentPunchIn
  ) => {
    if (!newTime) {
      toast.error("Please select punch in time");
      return;
    }

    if (!employeeId) {
      toast.error("Employee ID is missing");
      return;
    }

    try {
      setLoader(true);

      const hasExistingPunchIn =
        Boolean(currentPunchIn) &&
        currentPunchIn !== "Punch In From Admin";

      const hasAdminPunchIn =
        currentPunchIn === "Punch In From Admin";

      if (!hasExistingPunchIn && !hasAdminPunchIn) {
        const punchInResponse = await axios.post(
          `${BASE_URL2}api/punch/in/${employeeId}/true`,
          {
            employeeName,
            employeeDesignation,
          }
        );

        if (
          punchInResponse?.status !== 200 &&
          punchInResponse?.status !== 201
        ) {
          throw new Error(
            punchInResponse?.data?.message ||
            "Unable to create punch in"
          );
        }
      }

      const todayDate = new Date();
      const [hours, minutes] = newTime.split(":");

      const fullDate = new Date(
        Date.UTC(
          todayDate.getFullYear(),
          todayDate.getMonth(),
          todayDate.getDate(),
          Number(hours),
          Number(minutes),
          0
        )
      );

      const timeResponse = await axios.post(
        `${BASE_URL2}api/punch/newtime/in/${employeeId}`,
        {
          punchInTime: fullDate.toISOString(),
        }
      );

      if (
        timeResponse?.status !== 200 &&
        timeResponse?.status !== 201
      ) {
        throw new Error(
          timeResponse?.data?.message ||
          "Unable to update punch in time"
        );
      }

      toast.success("Punch In Time Updated Successfully");

      setActivePunchIn(null);
      setNewTime("");

      const employees = await getAllEmployee();
      await getEmployeeData(employees);
    } catch (error) {
      console.error(
        "Update Punch In Error:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to update punch in time"
      );
    } finally {
      setLoader(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    const loadData = async () => {
      const employees = await getAllEmployee();
      await getEmployeeData(employees);
    };

    loadData();
  }, []);
  const filteredAttendanceData = data.filter((item) => {
    if (attendanceFilter === "present") {
      return item?.status === "IN Office" || item?.status === "HALF_DAY";
    }

    if (attendanceFilter === "absent") {
      return item?.status === "ABSENT";
    }

    return true;
  });

  const totalEmployees = allemployee.length;

  const presentEmployees = data.filter(
    (item) => Boolean(item?.punchIn) || Boolean(item?.punchInByAdmin),
  ).length;

  const absentEmployees = Math.max(totalEmployees - presentEmployees, 0);

  const handleAttendanceFilter = (filter) => {
    navigate(`/attendance?filter=${filter}`);
  };

  // ============================================================
  // TODAY TABLE
  // ============================================================

  const columns = [
    {
      title: "Employee Id",
      dataIndex: "employeeId",
      key: "employeeId",
      width: 150,
      align: "center",
    },

    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
      width: 220,
      align: "center",
    },

    {
      title: "Designation",
      dataIndex: "employeeDesignation",
      key: "employeeDesignation",
      width: 220,
      align: "center",
    },

    {
      title: "In Time",
      dataIndex: "punchIn",
      key: "punchIn",
      width: 200,
      align: "center",

      render: (_, record) => {
        if (activePunchIn === record?.employeeId) {
          return (
            <div className="change-time-wrapper">
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="time-input"
              />

              <button
                type="button"
                className="save-time-btn"
                onClick={() =>
                  updatePunchInTime(
                    record?.employeeId,
                    record?.employeeName,
                    record?.employeeDesignation,
                    record?.punchIn
                  )
                }
                disabled={loader}
              >
                {loader ? "Saving..." : "Save"}
              </button>
            </div>
          );
        }

        return (
          <span>
            {record?.punchIn || "-"}
            {record?.punchInByAdmin && (
              <span className="admin-punch-label"> (Admin Punch)</span>
            )}
          </span>
        );
      },
    },

    {
      title: "Out Time",
      dataIndex: "punchOut",
      key: "punchOut",
      width: 200,
      align: "center",

      render: (_, record) => <span>{record?.punchOut || "-"}</span>,
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      align: "center",

      render: (status) => {
        const normalizedStatus = String(status || "")
          .trim()
          .toUpperCase();

        if (normalizedStatus === "HALF_DAY") {
          return (
            <span className="attendance-status half-day-status">
              Half Day
            </span>
          );
        }

        if (
          normalizedStatus === "FULL_DAY" ||
          normalizedStatus === "PRESENT"
        ) {
          return (
            <span className="attendance-status full-day-status">
              Full Day
            </span>
          );
        }

        if (normalizedStatus === "ABSENT") {
          return (
            <span className="attendance-status absent-status">
              Absent
            </span>
          );
        }

        return (
          <span className="attendance-status">
            IN Office
          </span>
        );
      },
    },

    {
      title: "Action",
      key: "Action",
      width: 180,
      fixed: "right",
      align: "center",

      render: (_, record) => {
        const menuItems = [];

        if (record?.punchIn) {
          menuItems.push({
            key: "1",
            label: "Remove Punch In",
            onClick: () => removePunchIn(record?.employeeId),
          });

          menuItems.push({
            key: "2",
            label: "Change Punch In Time",
            onClick: () => changePunchInTime(record),
          });
        } else {
          menuItems.push({
            key: "1",
            label: "Punch In",
            onClick: () => changePunchInTime(record),
          });
        }

        if (record?.punchOut) {
          menuItems.push({
            key: "3",
            label: "Remove Punch Out",
            onClick: () => removePunchOut(record?.employeeId),
          });
        }

        menuItems.push({
          key: "4",
          label: "Mark Full Day",
          onClick: () => markPresent(record),
        });

        menuItems.push({
          key: "5",
          label: "Mark Half Day",
          onClick: () => markHalfDay(record),
        });

        return (
          <div className="dropdown_parent">
            <Dropdown
              menu={{
                items: menuItems,
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <button type="button" className="three-dot-btn">
                <HiOutlineDotsHorizontal />
              </button>
            </Dropdown>

            <button
              type="button"
              className="calendar-btn"
              onClick={() => handleCalendar(record)}
            >
              <SlCalender />
            </button>
          </div>
        );
      },
    },
  ];

  // ============================================================
  // JSX
  // ============================================================

  return (
    <MainPanel
      title="Admin Dashboard"
      breadcrumbs={[
        {
          label: "Dashboard",
          link: "/dashboard",
        },
        {
          label: "Employee Attendance",
        },
      ]}
    >
      {/* =====================================================
          PREVIOUS ATTENDANCE PAGE
      ===================================================== */}

      {showPreviousAttendance ? (
        <>
          <div className="previous-view-header">
            <button
              type="button"
              className="back-btn"
              onClick={closePreviousAttendance}
            >
              ← Back
            </button>

            <div className="previous-view-title">
              <h1>Check Date Range wise Attendance</h1>
            </div>
          </div>

          <div className="previous-attendance-search">
            <div className="date-range-wrapper">
              <DatePicker
                value={previousStartDate ? dayjs(previousStartDate) : null}
                format="YYYY-MM-DD"
                onChange={(date) => {
                  setPreviousStartDate(date ? date.format("YYYY-MM-DD") : "");
                }}
              />

              <span className="date-arrow">→</span>

              <DatePicker
                value={previousEndDate ? dayjs(previousEndDate) : null}
                format="YYYY-MM-DD"
                onChange={(date) => {
                  setPreviousEndDate(date ? date.format("YYYY-MM-DD") : "");
                }}
              />
            </div>

            <button
              type="button"
              className="search-attendance-btn"
              onClick={handlePreviousAttendanceSearch}
              disabled={previousAttendanceLoading}
            >
              {previousAttendanceLoading ? "Searching..." : "Search Attendance"}
            </button>
          </div>

          <Table_Comp
            columns={previousAttendanceColumns}
            data={previousAttendanceList.map((item, index) => ({
              ...item,
              key: item?.employeeId ? `${item.employeeId}-${index}` : index,
            }))}
            loading={previousAttendanceLoading}
          />
        </>
      ) : showEmployeeAttendance ? (
        // =====================================================
        // EMPLOYEE MONTHLY ATTENDANCE
        // =====================================================
        <div className="employee-attendance-page">
          {/* ================= HEADER ================= */}
          <div className="employee-attendance-header">
            <button
              type="button"
              className="employee-attendance-back"
              onClick={closeEmployeeAttendance}
            >
              ← Back
            </button>

            <h1>
              Check Employee Attendance
              <span>
                {" "}
                -{" "}
                {selectedEmployee?.employeeName || selectedEmployee?.name || ""}
              </span>
            </h1>
          </div>

          {/* ================= MONTH / YEAR FILTER ================= */}
          <div className="attendance-filter">
            <div className="attendance-filter-field">
              <label htmlFor="attendance-month">Month</label>

              <select
                id="attendance-month"
                value={selectedMonth}
                onChange={handleEmployeeMonthChange}
              >
                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {dayjs().month(index).format("MMMM")}
                  </option>
                ))}
              </select>
            </div>

            <div className="attendance-filter-field">
              <label htmlFor="attendance-year">Year</label>

              <input
                id="attendance-year"
                type="number"
                min="2000"
                max="2100"
                value={selectedYear}
                onChange={handleEmployeeYearChange}
              />
            </div>
          </div>

          {/* ================= MONTHLY ATTENDANCE TABLE ================= */}
          <div className="monthly-attendance-table-wrapper">
            <Table
              className="monthly-attendance-table"
              columns={employeeAttendanceColumns}
              dataSource={employeeAttendanceList.map((item, index) => ({
                ...item,

                employeeId:
                  item?.employeeId ||
                  selectedEmployee?.employeeId ||
                  selectedEmployee?.empId ||
                  "",

                employeeName:
                  item?.employeeName ||
                  selectedEmployee?.employeeName ||
                  selectedEmployee?.name ||
                  "",

                employeeDesignation:
                  item?.employeeDesignation ||
                  selectedEmployee?.employeeDesignation ||
                  selectedEmployee?.designation ||
                  "",

                key: `${item?.date || "attendance"}-${index}`,
              }))}
              loading={employeeAttendanceLoading}
              bordered={false}
              pagination={false}
              scroll={{ x: 1100 }}
            />
          </div>
        </div>
      ) : (
        // =====================================================
        // TODAY ATTENDANCE
        // =====================================================
        <>
          <div className="top-parent">
            <button
              type="button"
              className="back-btn"
              onClick={() => navigate("/")}
            >
              ← Back
            </button>
            <div className="previous-view-header">
              <div className="previous-view-title">
                <h1>Today's Attendance</h1>
              </div>
            </div>
            <div className="btn-group">
              <button
                type="button"
                className={`count ${attendanceFilter === "all" ? "active" : ""
                  }`}
                onClick={() => handleAttendanceFilter("all")}
              >
                Total Employee:
                <span>{totalEmployees}</span>
              </button>

              <button
                type="button"
                className={`count ${attendanceFilter === "present" ? "active" : ""
                  }`}
                onClick={() => handleAttendanceFilter("present")}
              >
                Present Employee:
                <span>{presentEmployees}</span>
              </button>

              <button
                type="button"
                className={`count ${attendanceFilter === "absent" ? "active" : ""
                  }`}
                onClick={() => handleAttendanceFilter("absent")}
              >
                Absent Employee:
                <span>{absentEmployees}</span>
              </button>

              {/* KEEP THESE TWO BUTTONS AS THEY ARE */}
              <button
                type="button"
                className="count"
                onClick={handleAddPreviousAttendance}
              >
                Add Previous Attendance
                <SlCalender />
              </button>

              <button
                type="button"
                className="count"
                onClick={handleViewPreviousAttendance}
              >
                View Previous Attendance
                <SlCalender />
              </button>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={filteredAttendanceData}
            loading={loader}
            bordered
            scroll={{ x: "max-content" }}
            pagination={{
              pageSize: 10,
            }}
            rowClassName={(_, index) =>
              index % 2 === 0 ? "table-row-light" : "table-row-dark"
            }
          />
        </>
      )}

      <Modal
        open={showAttendanceModal}
        onCancel={handleCloseAttendanceModal}
        footer={null}
        centered
        width={430}
        title="Add Attendance"
      >
        <div className="previous-attendance-form">
          {/* EMPLOYEE */}

          <div className="form-group">
            <div className="employee-checkbox-dropdown">
              <button
                type="button"
                className="employee-select-button"
                onClick={() => setEmployeeDropdownOpen((prev) => !prev)}
              >
                <span>{getSelectedEmployeeText()}</span>

                <span className="employee-select-arrow">⌄</span>
              </button>

              {employeeDropdownOpen && (
                <div className="employee-dropdown-menu">
                  <label className="employee-option all-employee-option">
                    <input
                      type="checkbox"
                      checked={
                        allemployee.length > 0 &&
                        selectedEmployees.length === allemployee.length
                      }
                      ref={(input) => {
                        if (input) {
                          input.indeterminate =
                            selectedEmployees.length > 0 &&
                            selectedEmployees.length < allemployee.length;
                        }
                      }}
                      onChange={() => handleEmployeeCheckboxChange("ALL")}
                    />

                    <span>All Employee</span>
                  </label>

                  <div className="employee-option-list">
                    {allemployee.map((item) => (
                      <label className="employee-option" key={item.empId}>
                        <span className="employee-option-left">
                          <input
                            type="checkbox"
                            checked={selectedEmployees.includes(item.empId)}
                            onChange={() =>
                              handleEmployeeCheckboxChange(item.empId)
                            }
                          />

                          <span className="employee-option-name">
                            {item.name}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* LOADING */}

          {attendanceHistoryLoading && (
            <div className="attendance-loading">
              Loading previous attendance...
            </div>
          )}

          {/* DATE */}

          <div className="form-group">
            <DatePicker
              className="previous-attendance-datepicker"
              placeholder="dd-mm-yyyy"
              format="DD-MM-YYYY"
              open={datePickerOpen}
              onOpenChange={(open) => {
                setDatePickerOpen(open);
              }}
              value={
                previousAttendance.date ? dayjs(previousAttendance.date) : null
              }
              disabled={
                !previousAttendance.employeeId || attendanceHistoryLoading
              }
              onChange={(date) => {
                if (!date) {
                  setPreviousAttendance((prev) => ({
                    ...prev,
                    date: "",
                    status: "",
                  }));

                  setDatePickerOpen(false);

                  return;
                }

                const selectedDate = date.format("YYYY-MM-DD");

                const existingRecord = previousAttendanceData.find((item) => {
                  if (!item?.date) {
                    return false;
                  }

                  const apiDate = String(item.date).split("T")[0];

                  return apiDate === selectedDate;
                });

                const existingStatus = existingRecord?.status
                  ? String(existingRecord.status).trim().toUpperCase()
                  : "";

                setPreviousAttendance((prev) => ({
                  ...prev,
                  date: selectedDate,
                  status: existingStatus,
                }));

                setDatePickerOpen(false);
              }}
              cellRender={(current, info) => {
                const status = getAttendanceStatusByDate(current);

                return (
                  <div className="attendance-calendar-cell">
                    {info?.originNode}

                    {status === "FULL_DAY" && (
                      <span className="attendance-dot full-day-dot">●</span>
                    )}

                    {status === "HALF_DAY" && (
                      <span className="attendance-dot half-day-dot">●</span>
                    )}

                    {status === "ABSENT" && (
                      <span className="attendance-dot absent-day-dot">●</span>
                    )}
                  </div>
                );
              }}
            />
          </div>

          {/* STATUS */}

          <div className="form-group">
            <select
              value={previousAttendance.status}
              onChange={(e) => {
                setPreviousAttendance((prev) => ({
                  ...prev,
                  status: e.target.value,
                }));
              }}
            >
              <option value="">Select Status</option>

              <option value="FULL_DAY">FULL_DAY</option>

              <option value="HALF_DAY">HALF_DAY</option>

              <option value="ABSENT">ABSENT</option>
            </select>
          </div>

          {/* SUBMIT */}

          <button
            type="button"
            className="submit-attendance-btn"
            onClick={adjustPreviousAttendance}
            disabled={attendanceHistoryLoading}
          >
            {attendanceHistoryLoading ? "Updating..." : "Submit"}
          </button>
        </div>
      </Modal>
    </MainPanel>
  );
};

export default Attendance;
