import React, { useContext, useEffect, useState } from "react";
import "./Attendance.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import Table_Comp from "../../comp/table/Table";

import { Dropdown, Modal, DatePicker } from "antd";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { SlCalender } from "react-icons/sl";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;
const BASE_URL2 = import.meta.env.VITE_ATTENDANCE_URL;

const Attendance = () => {
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [previousAttendance, setPreviousAttendance] = useState({
    employeeId: "", date: "", status: ""
  });
  const [previousAttendanceData, setPreviousAttendanceData] = useState([]);
  const [attendanceHistoryLoading, setAttendanceHistoryLoading] = useState(false);

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const [allemployee, setAllEmployee] = useState([]);

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [activePunchIn, setActivePunchIn] = useState(null);
  const [newTime, setNewTime] = useState("");
  const [showPreviousAttendance, setShowPreviousAttendance] = useState(false);
  const [previousStartDate, setPreviousStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [previousEndDate, setPreviousEndDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [previousAttendanceList, setPreviousAttendanceList] = useState([]);
  const [previousAttendanceLoading, setPreviousAttendanceLoading] = useState(false);
  const [showEmployeeAttendance, setShowEmployeeAttendance] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeAttendanceList, setEmployeeAttendanceList] = useState([]);
  const [employeeAttendanceLoading, setEmployeeAttendanceLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
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

  const getAllEmployee = async () => {
    try {
      const res = await axios.get(`${BASE_URL}Admin/GetAllEmployee`,
        {
          withCredentials: true,
        }
      );

      const employees = res.data.map(
        (item, index) => ({
          key: index + 1,

          name:
            item?.data?.employeeName || "",

          empId:
            item?.data?.employeeId || "",

          email:
            item?.data?.email || "",

          status:
            item?.data?.employeeStatus || "",

          designation:
            item?.data?.employeeDesignation ||
            item?.data?.designation ||
            "",

          uid:
            item?.data?.uid || "",
        })
      );

      setAllEmployee(employees);

      console.log(
        "ALL EMPLOYEES:",
        employees
      );
    } catch (error) {
      console.error(
        "Get All Employee Error:",
        error?.response?.data || error
      );
    }
  };
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
        (item) => item.empId === selectedEmployees[0]
      );
      return employee?.name || "Select Employee";
    }

    return `${selectedEmployees.length} Employees Selected`;
  };

  const handleEmployeeCheckboxChange = async (employeeId) => {
    if (!employeeId) {
      return;
    }

    if (employeeId === "ALL") {
      const allIds = allemployee
        .map((item) => item.empId)
        .filter(Boolean);

      const isAllSelected =
        allIds.length > 0 &&
        selectedEmployees.length === allIds.length;

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
        status: item?.status || "Absent"
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

  const getEmployeeMonthlyAttendance = async (
    employeeId,
    month,
    year
  ) => {
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
        }
      );

      const attendanceList = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data?.result)
            ? response.data.result
            : [];

      setEmployeeAttendanceList(attendanceList);
    } catch (error) {
      console.error("Employee Monthly Attendance Error:", error);
      setEmployeeAttendanceList([]);
      toast.error(
        error?.response?.data?.message ||
        "Unable to load employee attendance"
      );
    } finally {
      setEmployeeAttendanceLoading(false);
    }
  };

  const handleCalendar = async (record) => {
    setSelectedEmployee(record);
    setSelectedMonth(dayjs().month() + 1);
    setSelectedYear(dayjs().year());
    setShowEmployeeAttendance(true);

    await getEmployeeMonthlyAttendance(
      record?.employeeId,
      dayjs().month() + 1,
      dayjs().year()
    );
  };

  const handleEmployeeMonthChange = async (e) => {
    const month = Number(e.target.value);
    setSelectedMonth(month);

    await getEmployeeMonthlyAttendance(
      selectedEmployee?.employeeId,
      month,
      selectedYear
    );
  };

  const handleEmployeeYearChange = async (e) => {
    const year = Number(e.target.value);
    setSelectedYear(year);

    await getEmployeeMonthlyAttendance(
      selectedEmployee?.employeeId,
      selectedMonth,
      year
    );
  };

  const closeEmployeeAttendance = () => {
    setShowEmployeeAttendance(false);
    setSelectedEmployee(null);
    setEmployeeAttendanceList([]);
  };
  const closePreviousAttendance = () => {
    setShowPreviousAttendance(false);
    setPreviousAttendanceList([]);
  };

  const getPreviousAttendance = async (
    employeeId
  ) => {
    if (!employeeId) {
      setPreviousAttendanceData([]);
      return;
    }

    try {
      setAttendanceHistoryLoading(true);

      console.log("Selected Employee:", employeeId);
      const today = dayjs();

      const startDate = `${today.year()}-01-01`;

      const endDate = today.format("YYYY-MM-DD");
      console.log("API REQUEST:",
        {
          employeeId,
          startDate,
          endDate,
        }
      );
      const response = await axios.post(
        `${BASE_URL2}api/punch/attendance/${employeeId}`,
        {
          startDate: startDate,
          endDate: endDate,
        },
        {
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

      console.log("PREVIOUS ATTENDANCE RESPONSE:", response?.data);
      let attendanceList = [];

      if (
        Array.isArray(response?.data)
      ) {
        attendanceList = response.data;
      } else if (
        Array.isArray(response?.data?.data)
      ) {
        attendanceList = response.data.data;
      } else if (
        Array.isArray(response?.data?.result)
      ) {
        attendanceList =
          response.data.result;
      } else if (
        Array.isArray(response?.data?.attendance)
      ) {
        attendanceList = response.data.attendance;
      }

      console.log("ATTENDANCE LIST:", attendanceList);

      setPreviousAttendanceData(attendanceList);
      setTimeout(() => {
        setDatePickerOpen(true);
      }, 200);

    } catch (error) {
      console.error(
        "Previous Attendance API Error:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error?.response?.data
      );

      setPreviousAttendanceData([]);

      toast.error(
        error?.response?.data?.message ||
        "Unable to load previous attendance"
      );
    } finally {
      setAttendanceHistoryLoading(
        false
      );
    }
  };
  const getPreviousAttendanceView = async (startDate = previousStartDate, endDate = previousEndDate) => {
    try {
      setPreviousAttendanceLoading(true);

      const response = await axios.get(
        `${BASE_URL2}api/punch/getPreviousAttendence`,
        {
          params: {
            startDate,
            endDate,
          },
        }
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
        error?.response?.data?.message ||
        "Unable to load previous attendance"
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
        if (!record?.punchIn) return "-";
        if (record?.punchInByAdmin) return "Punch In From Admin";
        return dayjs(record.punchIn).format("HH:mm:ss");
      },
    },
    {
      title: "Out Time",
      key: "punchOut",
      align: "center",
      render: (_, record) => {
        if (!record?.punchOut) return "-";
        if (record?.punchOutByAdmin) return "Punch Out From Admin";
        return dayjs(record.punchOut).format("HH:mm:ss");
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
            className={`attendance-status ${normalizedStatus === "HALF_DAY" ? "half-day-status" : ""
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

  const employeeAttendanceColumns = [
    {
      title: "Emp Id",
      dataIndex: "employeeId",
      key: "employeeId",
      align: "center",
      search: true,
      render: (_, record) =>
        record?.employeeId ||
        selectedEmployee?.employeeId ||
        "-",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",
      search: true,
      render: (date) =>
        date
          ? dayjs(date).format("YYYY-MM-DD")
          : "-",
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
      align: "center",
      search: true,
      render: (_, record) =>
        record?.employeeName ||
        selectedEmployee?.employeeName ||
        "-",
    },
    {
      title: "Designation",
      dataIndex: "employeeDesignation",
      key: "employeeDesignation",
      align: "center",
      search: true,
      render: (_, record) =>
        record?.employeeDesignation ||
        selectedEmployee?.employeeDesignation ||
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
          return "Punch In From Admin";
        }

        return dayjs(record.punchIn).format("HH:mm:ss");
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

        return dayjs(record.punchOut).format("HH:mm:ss");
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
              : ""
              }`}
          >
            {status || "-"}
          </span>
        );
      },
    },
  ];

  const getAttendanceStatusByDate = (
    date
  ) => {
    if (!date) {
      return null;
    }

    const selectedDate =
      dayjs(date).format(
        "YYYY-MM-DD"
      );

    const record =
      previousAttendanceData.find(
        (item) => {

          if (!item?.date) {
            return false;
          }

          const apiDate =
            String(
              item.date
            ).split("T")[0];

          return (
            apiDate ===
            selectedDate
          );
        }
      );

    return (
      record?.status
        ?.toString()
        .trim()
        .toUpperCase() ||
      null
    );
  };

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
          }
        );

        if (
          response?.status === 200 &&
          response?.data?.success !== false
        ) {
          toast.success(
            response?.data?.message ||
            "Attendance adjustment completed"
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
            response?.data?.message ||
            "Unable to update attendance"
          );
        }

        return;
      }

      const selectedEmployee = allemployee.find(
        (item) =>
          String(item?.empId || "") === String(employeeId)
      );

      if (!selectedEmployee) {
        toast.error("Selected employee not found");
        return;
      }

      const response = await axios.post(
        `${BASE_URL2}api/punch/adjust/${employeeId}`,
        {
          date,
          attendanceType: status,
          employeeName: selectedEmployee.name || "",
          employeeDesignation: selectedEmployee.designation || "",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response?.status === 200 &&
        response?.data?.success !== false
      ) {
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
          response?.data?.message ||
          "Unable to update previous attendance"
        );
      }
    } catch (error) {
      console.error("Adjust Previous Attendance Error:", error);
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to update previous attendance"
      );
    } finally {
      setAttendanceHistoryLoading(false);
    }
  };

  const markPresent = async (
    employeeId
  ) => {
    try {
      setLoader(true);

      const response =
        await axios.get(
          `${BASE_URL2}api/punch/mark/fd/${employeeId}/true/true`
        );

      if (
        response.status ===
        200
      ) {
        toast.success(
          "Marked Present Successfully"
        );

        await getEmployeeData();
      }
    } catch (error) {
      console.error(
        "Mark Present Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
        "Unable to mark present"
      );
    } finally {
      setLoader(false);
    }
  };

  const markHalfDay = async (
    employeeId
  ) => {
    try {
      setLoader(true);

      const response =
        await axios.get(
          `${BASE_URL2}api/punch/mark/hd/${employeeId}/true/true`
        );

      if (
        response.status ===
        200
      ) {
        toast.success(
          "Marked Half Day Successfully"
        );

        await getEmployeeData();
      }
    } catch (error) {
      console.error(
        "Mark Half Day Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
        "Unable to mark half day"
      );
    } finally {
      setLoader(false);
    }
  };

  const markAbsent = async (
    employeeId
  ) => {
    try {
      setLoader(true);

      const response =
        await axios.get(
          `${BASE_URL2}api/punch/mark/ab/${employeeId}`
        );

      if (
        response.status ===
        200
      ) {
        toast.success(
          "Marked Absent Successfully"
        );

        await getEmployeeData();
      }
    } catch (error) {
      console.error(
        "Mark Absent Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
        "Unable to mark absent"
      );
    } finally {
      setLoader(false);
    }
  };

  const removePunchIn = async (
    employeeId
  ) => {
    try {
      setLoader(true);

      const response =
        await axios.get(
          `${BASE_URL2}api/punch/clear/in/${employeeId}`
        );

      if (
        response.status ===
        200
      ) {
        toast.success(
          "Punch In Removed Successfully"
        );

        setActivePunchIn(null);
        setNewTime("");

        await getEmployeeData();
      }
    } catch (error) {
      console.error(
        "Remove Punch In Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
        "Unable to remove punch in"
      );
    } finally {
      setLoader(false);
    }
  };

  const changePunchInTime = (
    record
  ) => {
    setActivePunchIn(
      record?.employeeId
    );

    if (
      record?.punchIn &&
      record.punchIn !==
      "Punch In From Admin"
    ) {
      setNewTime(
        record.punchIn.slice(
          0,
          5
        )
      );
    } else {
      setNewTime("");
    }
  };

  const updatePunchInTime =
    async (
      employeeId
    ) => {

      if (!newTime) {
        toast.error(
          "Please select punch in time"
        );

        return;
      }

      try {
        setLoader(true);

        const todayDate =
          new Date();

        const [
          hours,
          minutes,
        ] =
          newTime.split(
            ":"
          );

        const fullDate =
          new Date(
            Date.UTC(
              todayDate.getFullYear(),
              todayDate.getMonth(),
              todayDate.getDate(),
              Number(hours),
              Number(minutes),
              0
            )
          );

        const response =
          await axios.post(
            `${BASE_URL2}api/punch/newtime/in/${employeeId}`,
            {
              punchInTime:
                fullDate.toISOString(),
            }
          );

        if (
          response.status ===
          200
        ) {
          toast.success(
            "Punch In Time Updated Successfully"
          );

          setActivePunchIn(null);
          setNewTime("");

          await getEmployeeData();
        }

      } catch (error) {

        console.error(
          "Update Punch In Error:",
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
          "Unable to update punch in time"
        );

      } finally {
        setLoader(false);
      }
    };
  useEffect(() => {
    getEmployeeData();
    getAllEmployee();
  }, []);

  const totalEmployees =
    allemployee.length;

  const presentEmployees =
    data.filter(
      (item) => {

        const status =
          String(
            item?.status ||
            ""
          )
            .trim()
            .toLowerCase()
            .replace(
              /\s+/g,
              ""
            );

        return (
          status ===
          "inoffice" ||
          status ===
          "present"
        );
      }
    ).length;

  const absentEmployees =
    data.filter(
      (item) => {

        const status =
          String(
            item?.status ||
            ""
          )
            .trim()
            .toLowerCase()
            .replace(
              /\s+/g,
              ""
            );

        return (
          status ===
          "absent"
        );
      }
    ).length;

  const columns = [
    {
      title:
        "Employee Id",
      dataIndex:
        "employeeId",
      key:
        "employeeId",
      search: true,
      align: "center",
    },

    {
      title:
        "Employee Name",
      dataIndex:
        "employeeName",
      key:
        "employeeName",
      search: true,
      align: "center",
    },

    {
      title:
        "Designation",
      dataIndex:
        "employeeDesignation",
      key:
        "employeeDesignation",
      search: true,
      align: "center",
    },

    {
      title: "In Time",
      dataIndex:
        "punchIn",
      key:
        "punchIn",
      align: "center",

      render: (
        _,
        record
      ) => {

        if (
          activePunchIn ===
          record?.employeeId
        ) {

          return (
            <div className="change-time-wrapper">

              <input
                type="time"
                value={newTime}
                onChange={(e) =>
                  setNewTime(
                    e.target.value
                  )
                }
                className="time-input"
              />

              <button
                type="button"
                className="save-time-btn"
                onClick={() =>
                  updatePunchInTime(
                    record?.employeeId
                  )
                }
                disabled={
                  loader
                }
              >
                {loader
                  ? "Saving..."
                  : "Save"}
              </button>

            </div>
          );
        }

        return (
          <span>
            {record?.punchIn ||
              "-"}
          </span>
        );
      },
    },

    {
      title: "Out Time",
      dataIndex:
        "punchOut",
      key:
        "punchOut",
      align: "center",

      render: (
        _,
        record
      ) => (
        <span>
          {record?.punchOut ||
            "-"}
        </span>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",

      render: (status) => {
        const displayStatus =
          status === "Absent"
            ? "IN Office"
            : status === "ABSENT"
              ? "Absent"
              : status === "HALF_DAY"
                ? "Half Day"
                : status;

        const statusClass =
          status === "ABSENT"
            ? "absent-status"
            : status === "HALF_DAY"
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
      dataIndex:
        "Action",
      key:
        "Action",
      align: "center",

      render: (
        _,
        record
      ) => {

        const menuItems =
          [];

        if (
          record?.punchIn
        ) {

          menuItems.push({
            key: "1",

            label:
              "Remove Punch In",

            onClick: () =>
              removePunchIn(
                record?.employeeId
              ),
          });

          menuItems.push({
            key: "2",

            label:
              "Change Punch In Time",

            onClick: () =>
              changePunchInTime(
                record
              ),
          });
        }

        menuItems.push({
          key: "3",

          label:
            "Mark Present",

          onClick: () =>
            markPresent(
              record?.employeeId
            ),
        });

        menuItems.push({
          key: "4",

          label:
            "Mark Absent",

          onClick: () =>
            markAbsent(
              record?.employeeId
            ),
        });

        menuItems.push({
          key: "5",

          label:
            "Mark Half Day",

          onClick: () =>
            markHalfDay(
              record?.employeeId
            ),
        });

        return (
          <div className="dropdown_parent">

            <Dropdown
              menu={{
                items:
                  menuItems,
              }}
              trigger={[
                "click",
              ]}
              placement="bottomRight"
            >

              <button
                type="button"
                className="three-dot-btn"
              >
                <HiOutlineDotsHorizontal />
              </button>

            </Dropdown>

            <button
              type="button"
              className="calendar-btn"
              onClick={() =>
                handleCalendar(
                  record
                )
              }
            >
              <SlCalender />
            </button>

          </div>
        );
      },
    },
  ];

  return (
    <MainPanel
      title="Today's Attendance"
      breadcrumbs={[
        {
          label:
            "Dashboard",
          link:
            "/dashboard",
        },

        {
          label:
            "Attendance",
        },
      ]}
    >

      { }

      {!showPreviousAttendance && !showEmployeeAttendance && (
        <div className="top-parent">

          <h1>
            Today's Attendance
          </h1>

          <div className="btn-group">

            { }

            <div className="count">

              Total Employee:

              <span>
                {
                  totalEmployees
                }
              </span>

            </div>

            { }

            <div className="count">

              Present Employee:

              <span>
                {
                  presentEmployees
                }
              </span>

            </div>

            { }

            <div className="count">

              Absent Employee:

              <span>
                {
                  absentEmployees
                }
              </span>

            </div>

            { }

            <button
              type="button"
              className="attendance-link"
              onClick={
                handleAddPreviousAttendance
              }
            >

              <span>
                <FaPlus />
              </span>

              Add Previous Attendance

            </button>

            { }

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
      )}

      {showEmployeeAttendance ? (
        <>
          <div className="previous-view-header">
            <button
              type="button"
              className="previous-view-back"
              onClick={closeEmployeeAttendance}
            >
              ← Back
            </button>

            <div className="previous-view-title">
              <h1 className="empname">Check Employee Attendance -  <span> {selectedEmployee?.employeeName} </span></h1>
            </div>
          </div>

          <div className="employee-month-search">
            <div className="month-field">
              <label>Month</label>
              <select
                value={selectedMonth}
                onChange={handleEmployeeMonthChange}
              >
                {Array.from({ length: 12 }, (_, index) => (
                  <option
                    key={index + 1}
                    value={index + 1}
                  >
                    {dayjs()
                      .month(index)
                      .format("MMMM")}
                  </option>
                ))}
              </select>
            </div>

            <div className="year-field">
              <label>Year</label>
              <input
                type="number"
                value={selectedYear}
                onChange={handleEmployeeYearChange}
              />
            </div>
          </div>

          <Table_Comp
            columns={employeeAttendanceColumns}
            data={employeeAttendanceList.map((item, index) => ({
              ...item,
              employeeId:
                item?.employeeId ||
                selectedEmployee?.employeeId ||
                "",
              employeeName:
                item?.employeeName ||
                selectedEmployee?.employeeName ||
                "",
              employeeDesignation:
                item?.employeeDesignation ||
                selectedEmployee?.employeeDesignation ||
                "",
              key: `${item?.date || index}-${index}`,
            }))}
            loading={employeeAttendanceLoading}
          />
        </>
      ) : showPreviousAttendance ? (
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
      ) : (
        <Table_Comp
          columns={columns}
          data={data}
          loading={loader}
        />
      )}

      { }

      <Modal
        open={
          showAttendanceModal
        }

        onCancel={
          handleCloseAttendanceModal
        }

        footer={null}

        centered

        width={430}

        title="Add Attendance"
      >

        <div className="previous-attendance-form">

          { }

          <div className="form-group">

            <div className="employee-checkbox-dropdown">
              <button
                type="button"
                className="employee-select-button"
                onClick={() =>
                  setEmployeeDropdownOpen((prev) => !prev)
                }
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
                      onChange={() =>
                        handleEmployeeCheckboxChange("ALL")
                      }
                    />
                    <span>All Employee</span>
                  </label>

                  <div className="employee-option-list">
                    {allemployee.map((item) => (
                      <label
                        className="employee-option"
                        key={item.empId}
                      >
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

          { }

          {attendanceHistoryLoading && (
            <div className="attendance-loading">
              Loading previous attendance...
            </div>
          )}

          { }

          <div className="form-group">

            <DatePicker
              className="previous-attendance-datepicker"

              placeholder="dd-mm-yyyy"

              format="DD-MM-YYYY"

              open={
                datePickerOpen
              }

              onOpenChange={(
                open
              ) => {

                setDatePickerOpen(
                  open
                );

              }}

              value={
                previousAttendance.date
                  ? dayjs(
                    previousAttendance.date
                  )
                  : null
              }

              disabled={
                !previousAttendance.employeeId ||
                attendanceHistoryLoading
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

                const selectedDate =
                  date.format("YYYY-MM-DD");

                const existingRecord =
                  previousAttendanceData.find((item) => {
                    if (!item?.date) {
                      return false;
                    }

                    const apiDate =
                      String(item.date).split("T")[0];

                    return apiDate === selectedDate;
                  });

                const existingStatus =
                  existingRecord?.status
                    ? String(existingRecord.status)
                      .trim()
                      .toUpperCase()
                    : "";

                console.log(
                  "Selected Date:",
                  selectedDate
                );

                console.log(
                  "Existing Attendance:",
                  existingRecord
                );

                console.log(
                  "Existing Status:",
                  existingStatus
                );

                setPreviousAttendance((prev) => ({
                  ...prev,
                  date: selectedDate,
                  status: existingStatus,
                }));

                setDatePickerOpen(false);
              }}

              cellRender={(
                current,
                info
              ) => {

                const status =
                  getAttendanceStatusByDate(
                    current
                  );

                return (
                  <div className="attendance-calendar-cell">

                    {info?.originNode}

                    { }

                    {status ===
                      "FULL_DAY" && (
                        <span className="attendance-dot full-day-dot">
                          ●
                        </span>
                      )}

                    { }

                    {status ===
                      "HALF_DAY" && (
                        <span className="attendance-dot half-day-dot">
                          ●
                        </span>
                      )}

                    { }

                    {status ===
                      "ABSENT" && (
                        <span className="attendance-dot absent-day-dot">
                          ●
                        </span>
                      )}

                  </div>
                );
              }}
            />

          </div>

          { }

          <div className="form-group">

            <select
              value={
                previousAttendance.status
              }

              onChange={(
                e
              ) => {

                setPreviousAttendance(
                  (
                    prev
                  ) => ({
                    ...prev,

                    status:
                      e.target.value,
                  })
                );

              }}
            >

              <option value="">
                Select Status
              </option>

              <option value="FULL_DAY">
                FULL_DAY
              </option>

              <option value="HALF_DAY">
                HALF_DAY
              </option>

              <option value="ABSENT">
                ABSENT
              </option>

            </select>

          </div>

          <button
            type="button"
            className="submit-attendance-btn"
            onClick={adjustPreviousAttendance}
            disabled={
              attendanceHistoryLoading
            }
          >
            {attendanceHistoryLoading
              ? "Updating..."
              : "Submit"}
          </button>

        </div>

      </Modal>

    </MainPanel>
  );
};

export default Attendance;