import { useEffect, useState } from "react";
import "./EmpAttendance.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import Table_Comp from "../../comp/table/Table";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";
const BASE_URL2 = import.meta.env.VITE_ATTENDANCE_URL;

const Attendance = () => {
  const [allemployee] = useState([]);

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showPreviousAttendance] = useState(false);


  const [showEmployeeAttendance] = useState(false);
  const [selectedEmployee] = useState(null);
  const [employeeAttendanceList] = useState([]);
  const [employeeAttendanceLoading] =
    useState(false);


  const getEmployeeData = async () => {
    try {
      setLoader(true);
      const response = await axios.get(`${BASE_URL2}api/punch/details`);

      const tableData =
        response?.data?.data
          ?.sort(
            (a, b) => new Date(a?.punchIn || 0) - new Date(b?.punchIn || 0),
          )
          .map((item, index) => ({
            key: item?.employeeId || index,
            employeeId: item?.employeeId || "",
            employeeName: item?.employeeName?.toUpperCase() || "",
            punchIn: item?.punchInByAdmin
              ? "Punch In From Admin"
              : item?.punchIn
                ? item.punchIn.split("T")[1]?.replace("Z", "").slice(0, 8)
                : "",
            punchOut: item?.punchOutByAdmin
              ? "Punch Out From Admin"
              : item?.punchOut
                ? item.punchOut.split("T")[1]?.replace("Z", "").slice(0, 8)
                : "",
            status: item?.status || "Absent",
          })) || [];

      setData(tableData);

      console.log("TODAY ATTENDANCE:", tableData);
    } catch (error) {
      console.error("Attendance API Error:", error);
      toast.error(
        error?.response?.data?.message || "Unable to load attendance",
      );
      setData([]);
    } finally {
      setLoader(false);
    }
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
            className={`attendance-status ${
              normalizedStatus === "HALF_DAY" ? "half-day-status" : ""
            }`}
          >
            {status || "-"}
          </span>
        );
      },
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
        record?.employeeId || selectedEmployee?.employeeId || "-",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",
      search: true,
      render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
      align: "center",
      search: true,
      render: (_, record) =>
        record?.employeeName || selectedEmployee?.employeeName || "-",
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
            className={`attendance-status ${
              normalizedStatus === "HALF_DAY" ? "half-day-status" : ""
            }`}
          >
            {status || "-"}
          </span>
        );
      },
    },
  ];




  useEffect(() => {
   
    getEmployeeData();
  }, []);

  const totalEmployees = allemployee.length;

  const presentEmployees = data.filter((item) => {
    const status = String(item?.status || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

    return status === "inoffice" || status === "present";
  }).length;

  const absentEmployees = data.filter((item) => {
    const status = String(item?.status || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

    return status === "absent";
  }).length;

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
  ];

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
      {}

      {!showPreviousAttendance && !showEmployeeAttendance && (
        <div className="top-parent">
          <h1>Today's Attendance</h1>

          <div className="btn-group">
            {}

            <div className="count">
              Total Employee:
              <span>{totalEmployees}</span>
            </div>

            {}

            <div className="count">
              Present Employee:
              <span>{presentEmployees}</span>
            </div>

            {}

            <div className="count">
              Absent Employee:
              <span>{absentEmployees}</span>
            </div>
          </div>
        </div>
      )}

      {showEmployeeAttendance ? (
        <>


   

          <Table_Comp
            columns={employeeAttendanceColumns}
            data={employeeAttendanceList.map((item, index) => ({
              ...item,
              employeeId:
                item?.employeeId || selectedEmployee?.employeeId || "",
              employeeName:
                item?.employeeName || selectedEmployee?.employeeName || "",
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
          <Table_Comp
            columns={previousAttendanceColumns}
          />
        </>
      ) : (
        <Table_Comp columns={columns} data={data} loading={loader} />
      )}

      {}
    </MainPanel>
  );
};

export default Attendance;
