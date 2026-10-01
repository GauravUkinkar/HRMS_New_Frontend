import { useEffect, useState } from "react";
import "./EmpAttendance.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import Table_Comp from "../../comp/table/Table";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate, useSearchParams } from "react-router-dom";

const BASE_URL2 = import.meta.env.VITE_ATTENDANCE_URL;
const BASE_URL_USER = import.meta.env.VITE_USER_BACKEND_URL;

const Attendance = () => {
 const navigate = useNavigate();
const [searchParams] = useSearchParams();

const [attendanceFilter, setAttendanceFilter] = useState(
  searchParams.get("filter") || "all"
);

  const [allEmployees, setAllEmployees] = useState([]);
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  const [showPreviousAttendance] = useState(false);
  const [showEmployeeAttendance] = useState(false);
  const [selectedEmployee] = useState(null);
  const [employeeAttendanceList] = useState([]);
  const [employeeAttendanceLoading] = useState(false);

 

  // ============================================================
  // GET EMPLOYEE ID
  // ============================================================

  const getEmployeeId = (employee) => {
    return String(
      employee?.employeeId ||
        employee?.employeeID ||
        employee?.empId ||
        employee?.empID ||
        employee?.data?.employeeId ||
        employee?.data?.employeeID ||
        employee?.data?.empId ||
        ""
    )
      .trim()
      .toUpperCase();
  };

  // ============================================================
  // GET ALL EMPLOYEES
  // ============================================================

const getAllEmployee = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL_USER}AuthController/GetAllEmployee`,
      {
        withCredentials: true,
      }
    );

    console.log("ALL EMPLOYEE RESPONSE:", response?.data);

    const employees = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.data)
      ? response.data.data
      : [];

    const employeeList = employees
      .map((item) => item?.data || item)
      .filter(Boolean);

    console.log("FINAL EMPLOYEE LIST:", employeeList);
    console.log("EMPLOYEE COUNT:", employeeList.length);

    setAllEmployees(employeeList);

  } catch (error) {
    console.error("GET ALL EMPLOYEE ERROR:", error);
    console.error("ERROR RESPONSE:", error?.response?.data);

    setAllEmployees([]);
  }
};
  // ============================================================
  // GET TODAY ATTENDANCE
  // ============================================================

  const getEmployeeData = async () => {
    try {
      setLoader(true);

      const response = await axios.get(
        `${BASE_URL2}api/punch/details`
      );

      console.log("ATTENDANCE RESPONSE:", response?.data);

const attendanceData = Array.isArray(response?.data)
  ? response.data
  : Array.isArray(response?.data?.data)
  ? response.data.data
  : [];

      console.log("ATTENDANCE DATA:", attendanceData);

      // --------------------------------------------------------
      // Attendance Map
      // --------------------------------------------------------

      const attendanceMap = new Map();

      attendanceData.forEach((item) => {
        const employeeId = getEmployeeId(item);

        if (employeeId) {
          attendanceMap.set(employeeId, item);
        }
      });

      // --------------------------------------------------------
      // Merge Employees + Attendance
      // --------------------------------------------------------

      const tableData = allEmployees.map(
        (employee, index) => {
          const employeeId = getEmployeeId(employee);

          const attendance =
            attendanceMap.get(employeeId);

          let status = "ABSENT";

          if (attendance) {
            const rawStatus = String(
              attendance?.status || ""
            )
              .trim()
              .toUpperCase();

            if (
              attendance?.punchIn ||
              attendance?.punchInByAdmin
            ) {
              status = "IN OFFICE";
            } else if (
              rawStatus === "HALF_DAY"
            ) {
              status = "HALF_DAY";
            } else if (
              rawStatus === "PRESENT" ||
              rawStatus === "FULL_DAY"
            ) {
              status = "PRESENT";
            } else {
              status = "ABSENT";
            }
          }

          return {
            key: employeeId || index,

            employeeId,

            employeeName: String(
              employee?.employeeName ||
                employee?.data?.employeeName ||
                ""
            ).toUpperCase(),

employeeDesignation: String(
  employee?.designation ||
    employee?.employeeDesignation ||
    ""
).toUpperCase(),

            punchIn: attendance?.punchInByAdmin
              ? "Punch In From Admin"
              : attendance?.punchIn
              ? dayjs(
                  attendance.punchIn
                ).format("HH:mm:ss")
              : "",

            punchOut: attendance?.punchOutByAdmin
              ? "Punch Out From Admin"
              : attendance?.punchOut
              ? dayjs(
                  attendance.punchOut
                ).format("HH:mm:ss")
              : "",

            status,
          };
        }
      );

      console.log("FINAL TABLE DATA:", tableData);

      setData(tableData);
    } catch (error) {
      console.error(
        "GET ATTENDANCE ERROR:",
        error
      );

      console.error(
        "ERROR RESPONSE:",
        error?.response?.data
      );

      setData([]);
    } finally {
      setLoader(false);
    }
  };

  // ============================================================
  // LOAD EMPLOYEES
  // ============================================================

useEffect(() => {
  getAllEmployee();
}, []);

useEffect(() => {
  if (allEmployees.length > 0) {
    getEmployeeData();
  }
}, [allEmployees]);

  // ============================================================
  // COUNTS
  // ============================================================

  const totalEmployees = allEmployees.length;

  const presentEmployees = data.filter((item) => {
    const status = String(item?.status || "")
      .trim()
      .toUpperCase();

    return (
      status === "IN OFFICE" ||
      status === "PRESENT" ||
      status === "FULL_DAY"
    );
  }).length;

  const absentEmployees = data.filter((item) => {
    const status = String(item?.status || "")
      .trim()
      .toUpperCase();

    return status === "ABSENT";
  }).length;

  // ============================================================
  // FILTER DATA
  // ============================================================

  const filteredAttendanceData = data.filter(
    (item) => {
      const status = String(item?.status || "")
        .trim()
        .toUpperCase();

      if (attendanceFilter === "present") {
        return (
          status === "IN OFFICE" ||
          status === "PRESENT" ||
          status === "FULL_DAY"
        );
      }

      if (attendanceFilter === "absent") {
        return status === "ABSENT";
      }

      return true;
    }
  );

  // ============================================================
  // TODAY ATTENDANCE COLUMNS
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

      render: (_, record) =>
        record?.punchIn || "-",
    },

    {
      title: "Out Time",
      dataIndex: "punchOut",
      key: "punchOut",
      align: "center",

      render: (_, record) =>
        record?.punchOut || "-",
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

        let displayStatus = "-";

        if (
          normalizedStatus === "IN OFFICE" ||
          normalizedStatus === "PRESENT" ||
          normalizedStatus === "FULL_DAY"
        ) {
          displayStatus = "IN Office";
        } else if (
          normalizedStatus === "HALF_DAY"
        ) {
          displayStatus = "Half Day";
        } else if (
          normalizedStatus === "ABSENT"
        ) {
          displayStatus = "Absent";
        }

        const statusClass =
          normalizedStatus === "ABSENT"
            ? "absent-status"
            : normalizedStatus === "HALF_DAY"
            ? "half-day-status"
            : "";

        return (
          <span
            className={`attendance-status ${statusClass}`}
          >
            {displayStatus}
          </span>
        );
      },
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

        return dayjs(
          record.punchIn
        ).format("HH:mm:ss");
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

        return dayjs(
          record.punchOut
        ).format("HH:mm:ss");
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
                : normalizedStatus ===
                  "ABSENT"
                ? "absent-status"
                : ""
            }`}
          >
            {status || "-"}
          </span>
        );
      },
    },
  ];

  // ============================================================
  // JSX
  // ============================================================

  return (
    <MainPanel
      title="Today's Attendance"
      breadcrumbs={[
        {
          label: "Dashboard",
          link: "/dashboard",
        },
        {
          label: "Attendance",
        },
      ]}
    >
      <button
        type="button"
        className="back-btn"
        onClick={() => navigate("/")}
      >
        ← Back
      </button>

      {!showPreviousAttendance &&
        !showEmployeeAttendance && (
          <div className="top-parent">
            <h1>Today's Attendance</h1>

            <div className="btn-group">
<button
  type="button"
  className={`count ${
    attendanceFilter === "all" ? "active" : ""
  }`}
  onClick={() => setAttendanceFilter("all")}
>
  Total Employee:
  <span>{totalEmployees}</span>
</button>

<button
  type="button"
  className={`count ${
    attendanceFilter === "present" ? "active" : ""
  }`}
  onClick={() => setAttendanceFilter("present")}
>
  Present Employee:
  <span>{presentEmployees}</span>
</button>

<button
  type="button"
  className={`count ${
    attendanceFilter === "absent" ? "active" : ""
  }`}
  onClick={() => setAttendanceFilter("absent")}
>
  Absent Employee:
  <span>{absentEmployees}</span>
</button>


            </div>
          </div>
        )}

      {showEmployeeAttendance ? (
        <Table_Comp
          columns={employeeAttendanceColumns}
          data={employeeAttendanceList.map(
            (item, index) => ({
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

              key: `${
                item?.date || index
              }-${index}`,
            })
          )}
          loading={employeeAttendanceLoading}
        />
      ) : showPreviousAttendance ? (
        <></>
      ) : (
        <Table_Comp
          columns={columns}
          data={filteredAttendanceData}
          loading={loader}
        />
      )}
    </MainPanel>
  );
};

export default Attendance;