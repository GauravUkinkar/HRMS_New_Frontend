
import React, { useEffect, useState } from "react";
import { Table, Avatar, Tag, Space } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { FaPlus } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import "./EmpList.scss";
import { Link, useNavigate } from "react-router-dom";
import MainPanel from "../../comp/MainPanel/MainPanel";
import axios from "axios";
import dayjs from "dayjs";

const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;
const BASE_URL2 = import.meta.env.VITE_ATTENDANCE_URL;

const EmpList = () => {
  const navigate = useNavigate();

  const [allemployee, setAllEmployee] = useState([]);

  // ==============================
  // EMPLOYEE ATTENDANCE STATES
  // ==============================
  const [showEmployeeAttendance, setShowEmployeeAttendance] =
    useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [employeeAttendanceList, setEmployeeAttendanceList] = useState([]);

  const [employeeAttendanceLoading, setEmployeeAttendanceLoading] =
    useState(false);

  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);

  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  // ==============================
  // GET ALL EMPLOYEES
  // ==============================
  const getAllEmployee = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}Admin/GetAllEmployee`,
        {
          withCredentials: true,
        }
      );

      const employees = res.data.map((item, index) => ({
        key: index + 1,
        name: item.data.employeeName,
        empId: item.data.employeeId,
        department: item.data.department,
        designation: item.data.designation,
        email: item.data.email,
        phone: item.data.contactNumber,
        dob: item.data.dateOfBirth,
        address: item.data.currentAddress,
        status: item.data.employeeStatus,
        uid: item.data.uid,
      }));

      setAllEmployee(employees);

      console.log("Employees:", employees);
    } catch (error) {
      console.log(
        error.response?.data || error
      );
    }
  };

  // ==============================
  // DELETE EMPLOYEE
  // ==============================
  const handleDeleteEmployee = async (uid) => {
    if (!uid) {
      console.error("Employee ID is missing");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${BASE_URL}Admin/deleteUserByUserId/${uid}`,
        {
          withCredentials: true,
        }
      );

      console.log(
        "Delete Employee Response:",
        response.data
      );

      alert("Employee deleted successfully");

      // Refresh employee list
      getAllEmployee();

    } catch (error) {
      console.error(
        "Delete Employee Error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete employee"
      );
    }
  };

  // ==============================
  // GET MONTHLY ATTENDANCE
  // ==============================
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

      console.log(
        "Employee Monthly Attendance:",
        attendanceList
      );

      setEmployeeAttendanceList(attendanceList);

    } catch (error) {
      console.error(
        "Employee Monthly Attendance Error:",
        error
      );

      setEmployeeAttendanceList([]);

      alert(
        error?.response?.data?.message ||
        "Unable to load employee attendance"
      );
    } finally {
      setEmployeeAttendanceLoading(false);
    }
  };

  // ==============================
  // CALENDAR CLICK
  // ==============================
  const handleCalendar = async (record) => {
    console.log(
      "Calendar Employee:",
      record
    );

    setSelectedEmployee(record);

    const currentMonth = dayjs().month() + 1;
    const currentYear = dayjs().year();

    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);

    // Open employee attendance page
    setShowEmployeeAttendance(true);

    // Load current month attendance
    await getEmployeeMonthlyAttendance(
      record?.empId,
      currentMonth,
      currentYear
    );
  };

  // ==============================
  // MONTH CHANGE
  // ==============================
  const handleEmployeeMonthChange = async (e) => {
    const month = Number(e.target.value);

    setSelectedMonth(month);

    await getEmployeeMonthlyAttendance(
      selectedEmployee?.empId,
      month,
      selectedYear
    );
  };

  // ==============================
  // YEAR CHANGE
  // ==============================
  const handleEmployeeYearChange = async (e) => {
    const year = Number(e.target.value);

    setSelectedYear(year);

    await getEmployeeMonthlyAttendance(
      selectedEmployee?.empId,
      selectedMonth,
      year
    );
  };

  // ==============================
  // CLOSE EMPLOYEE ATTENDANCE
  // ==============================
  const closeEmployeeAttendance = () => {
    setShowEmployeeAttendance(false);
    setSelectedEmployee(null);
    setEmployeeAttendanceList([]);
  };

  // ==============================
  // EMPLOYEE ATTENDANCE COLUMNS
  // ==============================
  const employeeAttendanceColumns = [
    {
      title: "Emp Id",
      dataIndex: "employeeId",
      key: "employeeId",
      align: "center",
      render: (_, record) =>
        record?.employeeId ||
        selectedEmployee?.empId ||
        "-",
    },

    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",
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
      render: (_, record) =>
        record?.employeeName ||
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
          return "Punch In From Admin";
        }

        return dayjs(record.punchIn).format(
          "HH:mm:ss"
        );
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

        return dayjs(record.punchOut).format(
          "HH:mm:ss"
        );
      },
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",

      render: (status) => {
        const normalizedStatus = String(
          status || ""
        )
          .trim()
          .toUpperCase();

        return (
          <span
            className={`attendance-status ${
              normalizedStatus === "HALF_DAY"
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

  // ==============================
  // EMPLOYEE LIST TABLE COLUMNS
  // ==============================
  const columns = [
    {
      title: (
        <>
          Name <SearchOutlined />
        </>
      ),
      dataIndex: "name",
      key: "name",
      width: 220,
      fixed: "left",

      render: (_, record) => {
        const name = record.name || "N/A";

        const nameParts = name
          .trim()
          .split(" ");

        const initials =
          nameParts.length > 1
            ? `${nameParts[0][0]}${
                nameParts[nameParts.length - 1][0]
              }`
            : nameParts[0][0];

        return (
          <Space>
            <Avatar className="avatar">
              {initials.toUpperCase()}
            </Avatar>

            {name}
          </Space>
        );
      },
    },

    {
      title: (
        <>
          Employee ID <SearchOutlined />
        </>
      ),
      dataIndex: "empId",
      key: "empId",
      width: 150,
      fixed: "left",
    },

    {
      title: "Department",
      dataIndex: "department",
      width: 180,
    },

    {
      title: "Designation",
      dataIndex: "designation",
      width: 220,
    },

    {
      title: (
        <>
          Email <SearchOutlined />
        </>
      ),
      dataIndex: "email",
      width: 260,
    },

    {
      title: "Phone",
      dataIndex: "phone",
      width: 180,
    },

    {
      title: "DOB",
      dataIndex: "dob",
      width: 150,
    },

    {
      title: "Address",
      dataIndex: "address",
      width: 250,

      render: (address) => (
        <span
          style={{
            display: "inline-block",
            maxWidth: "20ch",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={address}
        >
          {address || "N/A"}
        </span>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      fixed: "right",

      render: (status) => (
        <Tag color={status ? "success" : "default"}>
          {status || "N/A"}
        </Tag>
      ),
    },

    // ==============================
    // ACTIONS
    // ==============================
    {
      title: "Actions",
      key: "actions",
      width: 170,
      fixed: "right",

      render: (_, record) => (
        <Space size="middle">

          {/* VIEW */}
          <EyeOutlined
            className="view"
            onClick={() => {
              console.log(
                "Selected Employee ID:",
                record.empId
              );

              navigate(
                `/EmployeeProfile/${record.empId}`
              );
            }}
          />

          {/* EDIT */}
          <EditOutlined
            className="edit"
            onClick={() => {
              navigate(
                `/editEmployee/${record.empId}`
              );
            }}
          />

          {/* DELETE */}
          <DeleteOutlined
            className="delete"
            onClick={() =>
              handleDeleteEmployee(record.uid)
            }
          />

          {/* CALENDAR */}
          <SlCalender
            className="date"
            title="View Attendance"
            onClick={() =>
              handleCalendar(record)
            }
          />

        </Space>
      ),
    },
  ];

  // ==============================
  // USE EFFECT
  // ==============================
  useEffect(() => {
    getAllEmployee();
  }, []);

  // ==============================
  // JSX
  // ==============================
  return (
    <MainPanel
      title={
        showEmployeeAttendance
          ? "Employee Attendance"
          : "Employee List"
      }
      breadcrumbs={[
        {
          label: "Dashboard",
          link: "/dashboard",
        },
        {
          label: showEmployeeAttendance
            ? "Employee Attendance"
            : "Employee List",
        },
      ]}
    >

      {/* ==========================================
          EMPLOYEE ATTENDANCE PAGE
      ========================================== */}
      {showEmployeeAttendance ? (
        <div className="employee-attendance-page">

          {/* HEADER */}
          <div className="previous-view-header">

            <button
              type="button"
              className="previous-view-back"
              onClick={closeEmployeeAttendance}
            >
              ← Back
            </button>

            <div className="previous-view-title">
              <h1 className="empname">
                Check Employee Attendance -{" "}
                <span>
                  {selectedEmployee?.name}
                </span>
              </h1>
            </div>

          </div>

          {/* MONTH + YEAR */}
          <div className="employee-month-search">

            <div className="month-field">
              <label>Month</label>

              <select
                value={selectedMonth}
                onChange={
                  handleEmployeeMonthChange
                }
              >
                {Array.from(
                  { length: 12 },
                  (_, index) => (
                    <option
                      key={index + 1}
                      value={index + 1}
                    >
                      {dayjs()
                        .month(index)
                        .format("MMMM")}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="year-field">
              <label>Year</label>

              <input
                type="number"
                value={selectedYear}
                onChange={
                  handleEmployeeYearChange
                }
              />
            </div>

          </div>

      

          {/* ATTENDANCE TABLE */}
          <Table
            columns={employeeAttendanceColumns}
            dataSource={employeeAttendanceList.map(
              (item, index) => ({
                ...item,

                employeeId:
                  item?.employeeId ||
                  selectedEmployee?.empId ||
                  "",

                employeeName:
                  item?.employeeName ||
                  selectedEmployee?.name ||
                  "",

                employeeDesignation:
                  item?.employeeDesignation ||
                  selectedEmployee?.designation ||
                  "",

                key: `${
                  item?.date || index
                }-${index}`,
              })
            )}
            loading={employeeAttendanceLoading}
            bordered
            scroll={{ x: "max-content" }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
            }}
          />

        </div>
      ) : (

        /* ==========================================
           NORMAL EMPLOYEE LIST PAGE
        ========================================== */
        <div className="emp-list">

          <div className="page-header">

            <h2>Employees</h2>

            <div className="btn-group">

              <div className="count">
                Total Number Of Employee:{" "}
                <span>
                  {allemployee.length}
                </span>
              </div>

              <Link to="/addEmployee">
                <span>
                  <FaPlus />
                </span>{" "}
                Add Employee
              </Link>

            </div>

          </div>

          <Table
            columns={columns}
            dataSource={allemployee}
            bordered
            scroll={{ x: "max-content" }}
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
            }}
            rowClassName={(_, index) =>
              index % 2 === 0
                ? "table-row-light"
                : "table-row-dark"
            }
          />

        </div>
      )}

    </MainPanel>
  );
};

export default EmpList;

