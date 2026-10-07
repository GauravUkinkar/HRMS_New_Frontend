import React, { useContext, useEffect, useRef, useState } from "react";
import { Table, Avatar, Tag, Space, Input, Button } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../../Context";
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
  const { user } = useContext(UserContext);

  const [allemployee, setAllEmployee] = useState([]);
  const [showEmployeeAttendance, setShowEmployeeAttendance] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeAttendanceList, setEmployeeAttendanceList] = useState([]);
  const [employeeAttendanceLoading, setEmployeeAttendanceLoading] =
    useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  const searchInput = useRef(null);

  const getAllEmployee = async () => {
    try {
      const res = await axios.get(`${BASE_URL}Admin/GetAllEmployee`, {
        withCredentials: true,
      });

      const employees = Array.isArray(res?.data)
        ? res.data
          .map((item, index) => ({
            key: item?.data?.uid || item?.data?.employeeId || index + 1,
            name: item?.data?.employeeName || "",
            empId: item?.data?.employeeId || "",
            department: item?.data?.department || "",
            designation: item?.data?.designation || "",
            email: item?.data?.email || "",
            phone: item?.data?.contactNumber || "",
            dob: item?.data?.dateOfBirth || "",
            address: item?.data?.currentAddress || "",
            status: item?.data?.employeeStatus || "",
            uid: item?.data?.uid || "",
          }))
          .filter((item) => item.empId || item.uid)
        : [];

      setAllEmployee(employees);
    } catch (error) {
      console.error("Get All Employee Error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to load employees"
      );
    }
  };

  const handleDeleteEmployee = async (uid) => {
    if (!uid) {
      toast.error("Employee ID is missing");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}Admin/deleteUserByUserId/${uid}`, {
        withCredentials: true,
      });

      toast.success("Employee deleted successfully");

      await getAllEmployee();
    } catch (error) {
      console.error("Delete Employee Error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to delete employee"
      );
    }
  };

  const getEmployeeMonthlyAttendance = async (
    employeeId,
    month,
    year
  ) => {
    if (!employeeId) {
      setEmployeeAttendanceList([]);
      toast.error("Employee ID is missing");
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
    const currentMonth = dayjs().month() + 1;
    const currentYear = dayjs().year();

    setSelectedEmployee(record);
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
    setEmployeeAttendanceList([]);
    setShowEmployeeAttendance(true);

    await getEmployeeMonthlyAttendance(
      record?.empId,
      currentMonth,
      currentYear
    );
  };

  const handleEmployeeMonthChange = async (e) => {
    const month = Number(e.target.value);

    setSelectedMonth(month);

    await getEmployeeMonthlyAttendance(
      selectedEmployee?.empId,
      month,
      selectedYear
    );
  };

  const handleEmployeeYearChange = async (e) => {
    const year = Number(e.target.value);

    setSelectedYear(year);

    await getEmployeeMonthlyAttendance(
      selectedEmployee?.empId,
      selectedMonth,
      year
    );
  };

  const closeEmployeeAttendance = () => {
    setShowEmployeeAttendance(false);
    setSelectedEmployee(null);
    setEmployeeAttendanceList([]);
    setEmployeeAttendanceLoading(false);
    setSelectedMonth(dayjs().month() + 1);
    setSelectedYear(dayjs().year());
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
          width: 220,
        }}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0] || ""}
          onChange={(event) => {
            setSelectedKeys(
              event.target.value ? [event.target.value] : []
            );
          }}
          onPressEnter={() => {
            confirm();
          }}
          style={{
            marginBottom: 8,
            display: "block",
          }}
          allowClear
        />

        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            size="small"
            onClick={() => confirm()}
          >
            Search
          </Button>

          <Button
            size="small"
            onClick={() => {
              clearFilters?.();
              confirm({
                closeDropdown: true,
              });
            }}
          >
            Reset
          </Button>

          <Button
            type="link"
            size="small"
            onClick={() => close()}
          >
            Close
          </Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),

    onFilter: (value, record) =>
      String(record?.[dataIndex] || "")
        .toLowerCase()
        .includes(String(value || "").toLowerCase()),

    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          searchInput.current?.select();
        }, 100);
      }
    },
  });

  const employeeAttendanceColumns = [
    {
      title: "Emp Id",
      dataIndex: "employeeId",
      key: "employeeId",
      align: "center",

      render: (_, record) =>
        record?.employeeId || selectedEmployee?.empId || "-",
    },

    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",

      render: (date) =>
        date ? dayjs(date).format("YYYY-MM-DD") : "-",
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

        return (
          <span>
            {dayjs(record.punchIn).format("hh:mm:ss A")}

            {record?.punchInByAdmin && (
              <span
                style={{
                  color: "red",
                  marginLeft: "4px",
                }}
              >
                (Admin Punch)
              </span>
            )}
          </span>
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

        return (
          <span>
            {dayjs(record.punchOut).format("hh:mm:ss A")}

            {record?.punchOutByAdmin && (
              <span
                style={{
                  color: "red",
                  marginLeft: "4px",
                }}
              >
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

        let className = "attendance-status";
        let displayStatus = status || "-";

        if (normalizedStatus === "FULL_DAY") {
          className += " full-day-status";
          displayStatus = "FULL_DAY";
        } else if (normalizedStatus === "HALF_DAY") {
          className += " half-day-status";
          displayStatus = "HALF_DAY";
        } else if (normalizedStatus === "ABSENT") {
          className += " absent-status";
          displayStatus = "ABSENT";
        }

        return (
          <span className={className}>
            {displayStatus}
          </span>
        );
      },
    },
  ];

  const columns = [
    {
      title: (
        <>
          Name
        </>
      ),
      dataIndex: "name",
      key: "name",
      width: 220,
      fixed: "left",
      ...getColumnSearchProps("name"),

      render: (_, record) => {
        const name = record?.name || "N/A";

        const nameParts = name.trim().split(/\s+/);

        const initials =
          nameParts.length > 1
            ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]
            }`
            : nameParts[0]?.[0] || "?";

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
          Employee ID
        </>
      ),
      dataIndex: "empId",
      key: "empId",
      width: 150,
      fixed: "left",
      ...getColumnSearchProps("empId"),
    },

    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      width: 180,
      ...getColumnSearchProps("department"),
    },

    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
      width: 220,
      ...getColumnSearchProps("designation"),
    },

    {
      title: (
        <>
          Email 
        </>
      ),
      dataIndex: "email",
      key: "email",
      width: 260,
      ...getColumnSearchProps("email"),
    },

    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 180,
      ...getColumnSearchProps("phone"),
    },

    {
      title: "DOB",
      dataIndex: "dob",
      key: "dob",
      width: 150,
      ...getColumnSearchProps("dob"),

      render: (dob) =>
        dob ? dayjs(dob).format("YYYY-MM-DD") : "-",
    },

    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 250,
      ...getColumnSearchProps("address"),

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
      key: "status",
      width: 120,
      fixed: "right",
      ...getColumnSearchProps("status"),

      render: (status) => (
        <Tag color={status ? "success" : "default"}>
          {status || "N/A"}
        </Tag>
      ),
    },

    {
      title: "Actions",
      key: "actions",
      width: 170,
      fixed: "right",

      render: (_, record) => (
        <Space size="middle">
          <EyeOutlined
            className="view"
            onClick={() =>
              navigate(
                `/EmployeeProfile/${record.empId}`
              )
            }
          />

          <EditOutlined
            className="edit"
            onClick={() =>
              navigate(
                `/editEmployee/${record.empId}`
              )
            }
          />

          <DeleteOutlined
            className="delete"
            onClick={() =>
              handleDeleteEmployee(record.uid)
            }
          />

          <SlCalender
            className="date"
            title="View Attendance"
            onClick={() => handleCalendar(record)}
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getAllEmployee();
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <MainPanel
        breadcrumbs={[
          {
            label: "Dashboard",
            link: "/dashboard",
          },
          {
            label: "Employees List",
          },
        ]}
        title="Admin Dashboard"
      >
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        {showEmployeeAttendance ? (
          <div className="employee-attendance-page">
            <div className="attendance-header">
              <h1 className="empname">
                Check Employee Attendance -{" "}
                <span>
                  {selectedEmployee?.name || ""}
                </span>
              </h1>
            </div>

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
                    {
                      length: 12,
                    },
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

              <button
                type="button"
                className="back-btn"
                onClick={
                  closeEmployeeAttendance
                }
              >
                ← Back
              </button>
            </div>

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

                  key: `${item?.date || index
                    }-${index}`,
                })
              )}
              loading={employeeAttendanceLoading}
              bordered
              scroll={{
                x: "max-content",
              }}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: [
                  "10",
                  "20",
                  "50",
                ],
              }}
            />
          </div>
        ) : (
          <div className="emp-list">
            <div className="employee-list-header">
              <h2>Employees</h2>

              <div className="employee-list-actions">
                <div className="count">
                  Total Number Of Employee:{" "}
                  <span>
                    {allemployee.length}
                  </span>
                </div>

                <div className="add">
                  <Link
                    className="add"
                    to="/addEmployee"
                  >
                    <span>
                      <FaPlus />
                    </span>

                    Add Employee
                  </Link>
                </div>
              </div>
            </div>

            <Table
              columns={columns}
              dataSource={allemployee}
              bordered
              scroll={{
                x: "max-content",
              }}
              pagination={{
                defaultCurrent: 1,
                defaultPageSize: 5,
                showSizeChanger: true,
                pageSizeOptions: [
                  "5",
                  "10",
                  "20",
                  "50",
                ],
                showQuickJumper: true,

                showTotal: (
                  total,
                  range
                ) =>
                  `${range[0]}-${range[1]} of ${total} employees`,
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
    </>
  );
};

export default EmpList;