import React, { useEffect, useState } from "react";
import "./Attendance.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import Table_Comp from "../../comp/table/Table";
import { useNavigate } from "react-router-dom";
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
  const [attendanceFilter, setAttendanceFilter] = useState("present");
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

  const [selectedYear, setSelectedYear] = useState(dayjs().year());

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

      const attendanceMap = new Map(
        rawData.map((item) => [
          String(item?.employeeId || "").trim(),
          item,
        ])
      );

      const tableData = employees.map((employee, index) => {
        const employeeId = String(employee?.empId || "").trim();
        const item = attendanceMap.get(employeeId);

        const punchIn = item?.punchIn
          ? formatTime12Hour(item.punchIn)
          : "";

        const punchOut = item?.punchOut
          ? formatTime12Hour(item.punchOut)
          : "";

        let status = String(item?.status || "")
          .trim()
          .toUpperCase();

        if (punchIn) {
          status = "IN Office";
        } else if (status === "HALF_DAY") {
          status = "HALF_DAY";
        } else if (status === "FULL_DAY" || status === "PRESENT") {
          status = "PRESENT";
        } else {
          status = "ABSENT";
        }

        return {
          key: employeeId || index,
          employeeId: employeeId,
          employeeName:
            item?.employeeName?.toUpperCase() ||
            employee?.name?.toUpperCase() ||
            "",
          employeeDesignation:
            item?.employeeDesignation ||
            item?.designation ||
            employee?.designation ||
            "",
          punchIn: item?.punchInByAdmin
            ? "Punch In From Admin"
            : punchIn,
          punchOut: item?.punchOutByAdmin
            ? "Punch Out From Admin"
            : punchOut,
          status,
          punchInByAdmin: item?.punchInByAdmin || false,
          punchOutByAdmin: item?.punchOutByAdmin || false,
        };
      });

      setData(tableData);
    } catch (error) {
      console.error("Attendance API Error:", error);

      toast.error(
        error?.response?.data?.message || "Unable to load attendance"
      );

      setData([]);
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
      selectedYear,
    );
  };

  const handleEmployeeYearChange = async (e) => {
    const year = Number(e.target.value);

    if (!year || year < 2000 || year > 2100) {
      return;
    }

    setSelectedYear(year);

    await getEmployeeMonthlyAttendance(
      selectedEmployee?.employeeId,
      selectedMonth,
      year,
    );
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
      key: "punchIn",
      align: "center",

      render: (_, record) => {
        if (!record?.punchIn) {
          return "-";
        }

        if (record?.punchInByAdmin) {
          return "Punch In From Admin";
        }

        return formatTime12Hour(record.punchIn);
      },
    },

    {
      title: "Out Time",
      key: "punchOut",
      align: "center",

      render: (_, record) => {
        if (!record?.punchOut) {
          return "-";
        }

        if (record?.punchOutByAdmin) {
          return "Punch Out From Admin";
        }

        return formatTime12Hour(record.punchOut);
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

        return (
          <span
            className={`attendance-status ${normalizedStatus === "HALF_DAY"
              ? "half-day-status"
              : normalizedStatus === "ABSENT"
                ? "absent-status"
                : ""
              }`}
          >
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
      key: "punchOut",
      align: "center",

      render: (_, record) => {
        if (!record?.punchOut) {
          return "-";
        }

        if (record?.punchOutByAdmin) {
          return <span className="admin-punch-text">Punch Out From Admin</span>;
        }

        return formatTime12Hour(record.punchOut);
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

        let displayStatus = status || "-";
        let statusClass = "full-day-status";

        if (normalizedStatus === "FULL_DAY") {
          displayStatus = "FULL_DAY";
          statusClass = "full-day-status";
        } else if (normalizedStatus === "PRESENT") {
          displayStatus = "FULL_DAY";
          statusClass = "full-day-status";
        } else if (normalizedStatus === "HALF_DAY") {
          displayStatus = "HALF_DAY";
          statusClass = "half-day-status";
        } else if (normalizedStatus === "ABSENT") {
          displayStatus = "ABSENT";
          statusClass = "absent-status";
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
        const employees = allemployee
          .filter((item) => selectedEmployees.includes(item?.empId))
          .map((item) => ({
            employeeId: item?.empId || "",
            attendanceType: status,
            employeeName: item?.name || "",
            employeeDesignation: item?.designation || "",
          }))
          .filter((item) => item.employeeId);

        if (!employees.length) {
          toast.error("No employees selected");
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
          toast.success(
            response?.data?.message || "Attendance adjustment completed",
          );

          await getEmployeeData();

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

  // ============================================================
  // MARK PRESENT
  // ============================================================

  const markPresent = async (employeeId) => {
    try {
      setLoader(true);

      const response = await axios.get(
        `${BASE_URL2}api/punch/mark/fd/${employeeId}/true/true`,
      );

      if (response.status === 200) {
        toast.success("Marked Present Successfully");

        await getEmployeeData();
      }
    } catch (error) {
      console.error("Mark Present Error:", error);

      toast.error(error?.response?.data?.message || "Unable to mark present");
    } finally {
      setLoader(false);
    }
  };

  // ============================================================
  // MARK HALF DAY
  // ============================================================

  const markHalfDay = async (employeeId) => {
    try {
      setLoader(true);

      const response = await axios.get(
        `${BASE_URL2}api/punch/mark/hd/${employeeId}/true/true`,
      );

      if (response.status === 200) {
        toast.success("Marked Half Day Successfully");

        await getEmployeeData();
      }
    } catch (error) {
      console.error("Mark Half Day Error:", error);

      toast.error(error?.response?.data?.message || "Unable to mark half day");
    } finally {
      setLoader(false);
    }
  };

  // ============================================================
  // MARK ABSENT
  // ============================================================

  const markAbsent = async (employeeId) => {
    try {
      setLoader(true);

      const response = await axios.get(
        `${BASE_URL2}api/punch/mark/ab/${employeeId}`,
      );

      if (response.status === 200) {
        toast.success("Marked Absent Successfully");

        await getEmployeeData();
      }
    } catch (error) {
      console.error("Mark Absent Error:", error);

      toast.error(error?.response?.data?.message || "Unable to mark absent");
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
        `${BASE_URL2}api/punch/clear/out/${employeeId}`
      );

      if (response.status === 200) {
        toast.success("Punch Out Removed Successfully");

        await getEmployeeData();
      }
    } catch (error) {
      console.error("Remove Punch Out Error:", error);

      toast.error(
        error?.response?.data?.message || "Unable to remove punch out"
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

  const updatePunchInTime = async (employeeId) => {
    if (!newTime) {
      toast.error("Please select punch in time");

      return;
    }

    try {
      setLoader(true);

      const todayDate = new Date();

      const [hours, minutes] = newTime.split(":");

      const fullDate = new Date(
        Date.UTC(
          todayDate.getFullYear(),
          todayDate.getMonth(),
          todayDate.getDate(),
          Number(hours),
          Number(minutes),
          0,
        ),
      );

      const response = await axios.post(
        `${BASE_URL2}api/punch/newtime/in/${employeeId}`,
        {
          punchInTime: fullDate.toISOString(),
        },
      );

      if (response.status === 200) {
        toast.success("Punch In Time Updated Successfully");

        setActivePunchIn(null);
        setNewTime("");

        await getEmployeeData();
      }
    } catch (error) {
      console.error("Update Punch In Error:", error);

      toast.error(
        error?.response?.data?.message || "Unable to update punch in time",
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
    const hasPunchIn =
      Boolean(item?.punchIn) &&
      item?.punchIn !== "Punch In From Admin";

    if (attendanceFilter === "present") {
      return hasPunchIn || item?.punchIn === "Punch In From Admin";
    }

    if (attendanceFilter === "absent") {
      return !hasPunchIn;
    }

    return true;
  });

  // ============================================================
  // COUNTS
  // ============================================================

  const totalEmployees = allemployee.length;

  const presentEmployees = data.filter((item) => {
    const status = String(item?.status || "")
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, "");

    const hasPunchIn =
      Boolean(item?.punchIn) && item?.punchIn !== "Punch In From Admin";

    return (
      hasPunchIn ||
      status === "inoffice" ||
      status === "present" ||
      status === "fullday"
    );
  }).length;

  const absentEmployees = data.filter((item) => {
    const status = String(item?.status || "")
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, "");

    const hasPunchIn = Boolean(item?.punchIn);

    return !hasPunchIn && status === "absent";
  }).length;

  // ============================================================
  // TODAY TABLE
  // ============================================================

  const columns = [
    {
      title: "Employee Id",
      dataIndex: "employeeId",
      key: "employeeId",
      search: true,
      align: "center",
    },

    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
      search: true,
      align: "center",
    },

    {
      title: "Designation",
      dataIndex: "employeeDesignation",
      key: "employeeDesignation",
      search: true,
      align: "center",
    },

    {
      title: "In Time",
      dataIndex: "punchIn",
      key: "punchIn",
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
                onClick={() => updatePunchInTime(record?.employeeId)}
                disabled={loader}
              >
                {loader ? "Saving..." : "Save"}
              </button>
            </div>
          );
        }

        return <span>{record?.punchIn || "-"}</span>;
      },
    },

    {
      title: "Out Time",
      dataIndex: "punchOut",
      key: "punchOut",
      align: "center",

      render: (_, record) => <span>{record?.punchOut || "-"}</span>,
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

        let displayStatus = status || "-";

        if (
          normalizedStatus === "IN OFFICE" ||
          normalizedStatus === "PRESENT" ||
          normalizedStatus === "FULL_DAY"
        ) {
          displayStatus = "IN Office";
        }

        if (normalizedStatus === "HALF_DAY") {
          displayStatus = "Half Day";
        }

        if (normalizedStatus === "ABSENT") {
          displayStatus = "Absent";
        }

        const statusClass =
          normalizedStatus === "ABSENT"
            ? "absent-status"
            : normalizedStatus === "HALF_DAY"
              ? "half-day-status"
              : "";

        return (
          <span className={`attendance-status ${statusClass}`}>
            {displayStatus}
          </span>
        );
      },
    },

    {
      title: "Action",
      key: "Action",
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
        }

        if (record?.punchOut) {
          menuItems.push({
            key: "6",
            label: "Remove Punch Out",
            onClick: () => removePunchOut(record?.employeeId),
          });
        }

        menuItems.push({
          key: "3",
          label: "Mark Present",
          onClick: () => markPresent(record?.employeeId),
        });

        menuItems.push({
          key: "4",
          label: "Mark Absent",
          onClick: () => markAbsent(record?.employeeId),
        });

        menuItems.push({
          key: "5",
          label: "Mark Half Day",
          onClick: () => markHalfDay(record?.employeeId),
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
      title="Employee Attendance"
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
              className="previous-view-back"
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

            <div className="previous-view-header">
              <button
                type="button"
                className="previous-view-back"
                onClick={() => navigate("/")}
              >
                ← Back
              </button>

              <div className="previous-view-title">
                <h1>Today's Attendance</h1>
              </div>

            </div>

            <div className="btn-group">
              <button
                type="button"
                className={`count ${attendanceFilter === "all" ? "active" : ""}`}
                onClick={() => setAttendanceFilter("all")}
              >
                Total Employee:
                <span>{totalEmployees}</span>
              </button>

              <button
                type="button"
                className={`count ${attendanceFilter === "present" ? "active" : ""}`}
                onClick={() => setAttendanceFilter("present")}
              >
                Present Employee:
                <span>{presentEmployees}</span>
              </button>

              <button
                type="button"
                className={`count ${attendanceFilter === "absent" ? "active" : ""}`}
                onClick={() => setAttendanceFilter("absent")}
              >
                Absent Employee:
                <span>{absentEmployees}</span>
              </button>

              <button
                type="button"
                className="attendance-link"
                onClick={handleAddPreviousAttendance}
              >
                <span>
                  <FaPlus />
                </span>
                Add Previous Attendance
              </button>

              <button
                type="button"
                className="attendance-link"
                onClick={handleViewPreviousAttendance}
              >
                <span>
                  <FaPlus />
                </span>
                View Previous Attendance
              </button>
            </div>
          </div>

          <Table_Comp
            columns={columns}
            data={filteredAttendanceData}
            loading={loader}
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
