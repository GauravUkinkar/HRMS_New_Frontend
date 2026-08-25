import React, { useContext, useEffect, useState } from "react";
import "./Attendance.scss";

import MainPanel from "../../comp/MainPanel/MainPanel";
import Table_Comp from "../../comp/table/Table";

import { Dropdown } from "antd";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { SlCalender } from "react-icons/sl";
import { FaPlus } from "react-icons/fa6";

import axios from "axios";
import { toast } from "react-toastify";

import { UserContext } from "../../../Context";
import { Link } from "react-router-dom";

const BASE_URL2 = import.meta.env.VITE_ATTENDANCE_URL;

const Attendance = () => {
  const { user, employee } = useContext(UserContext);

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  /* =========================================================
     PUNCH IN EDIT
  ========================================================= */

  const [activePunchIn, setActivePunchIn] = useState(null);
  const [newTime, setNewTime] = useState("");

  const today = new Date().toLocaleDateString("en-GB");

  /* =========================================================
     GET ATTENDANCE DATA
  ========================================================= */

  const getEmployeeData = async () => {
    try {
      setLoader(true);

      const response = await axios.get(
        `${BASE_URL2}api/punch/details`
      );

      const tableData =
        response?.data?.data
          ?.sort(
            (a, b) =>
              new Date(a.punchIn || 0) -
              new Date(b.punchIn || 0)
          )
          .map((item, index) => ({
            key: item?.employeeId || index,

            employeeId: item?.employeeId || "",

            employeeName:
              item?.employeeName?.toUpperCase() || "",

            employeeDesignation:
              item?.employeeDesignation || "",

            punchIn: item?.punchInByAdmin
              ? "Punch In From Admin"
              : item?.punchIn
              ? item.punchIn
                  .split("T")[1]
                  ?.replace("Z", "")
                  .slice(0, 8)
              : "",

            punchOut: item?.punchOutByAdmin
              ? "Punch Out From Admin"
              : item?.punchOut
              ? item.punchOut
                  .split("T")[1]
                  ?.replace("Z", "")
                  .slice(0, 8)
              : "",

            status: item?.status || "Absent",
          })) || [];

      setData(tableData);
    } catch (error) {
      console.error("Attendance API Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to load attendance"
      );

      setData([]);
    } finally {
      setLoader(false);
    }
  };

  /* =========================================================
     MARK PRESENT
  ========================================================= */

  const markPresent = async (employeeId) => {
    try {
      setLoader(true);

      const response = await axios.get(
        `${BASE_URL2}api/punch/mark/fd/${employeeId}/true/true`
      );

      if (response.status === 200) {
        toast.success("Marked Present Successfully");

        await getEmployeeData();
      }
    } catch (error) {
      console.error("Mark Present Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to mark present"
      );
    } finally {
      setLoader(false);
    }
  };

  /* =========================================================
     MARK HALF DAY
  ========================================================= */

  const markHalfDay = async (employeeId) => {
    try {
      setLoader(true);

      const response = await axios.get(
        `${BASE_URL2}api/punch/mark/hd/${employeeId}/true/true`
      );

      if (response.status === 200) {
        toast.success("Marked Half Day Successfully");

        await getEmployeeData();
      }
    } catch (error) {
      console.error("Mark Half Day Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to mark half day"
      );
    } finally {
      setLoader(false);
    }
  };

  /* =========================================================
     MARK ABSENT
  ========================================================= */

  const markAbsent = async (employeeId) => {
    try {
      setLoader(true);

      const response = await axios.get(
        `${BASE_URL2}api/punch/mark/ab/${employeeId}`
      );

      if (response.status === 200) {
        toast.success("Marked Absent Successfully");

        await getEmployeeData();
      }
    } catch (error) {
      console.error("Mark Absent Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to mark absent"
      );
    } finally {
      setLoader(false);
    }
  };

  /* =========================================================
     REMOVE PUNCH IN
  ========================================================= */

  const removePunchIn = async (employeeId) => {
    try {
      setLoader(true);

      const response = await axios.get(
        `${BASE_URL2}api/punch/clear/in/${employeeId}`
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
        error?.response?.data?.message ||
          "Unable to remove punch in"
      );
    } finally {
      setLoader(false);
    }
  };

  /* =========================================================
     CHANGE PUNCH IN TIME
  ========================================================= */

  const changePunchInTime = (record) => {
    setActivePunchIn(record?.employeeId);

    if (
      record?.punchIn &&
      record.punchIn !== "Punch In From Admin"
    ) {
      setNewTime(record.punchIn.slice(0, 5));
    } else {
      setNewTime("");
    }
  };

  /* =========================================================
     UPDATE PUNCH IN TIME
  ========================================================= */

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
          0
        )
      );

      const response = await axios.post(
        `${BASE_URL2}api/punch/newtime/in/${employeeId}`,
        {
          punchInTime: fullDate.toISOString(),
        }
      );

      if (response.status === 200) {
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
        error?.response?.data?.message ||
          "Unable to update punch in time"
      );
    } finally {
      setLoader(false);
    }
  };

  /* =========================================================
     CALENDAR
  ========================================================= */

  const handleCalendar = (record) => {
    console.log(
      "Calendar Employee:",
      record?.employeeId
    );
  };

  /* =========================================================
     INITIAL API CALL
  ========================================================= */

  useEffect(() => {
    getEmployeeData();
  }, []);

  /* =========================================================
     DYNAMIC COUNTS
  ========================================================= */

  const totalEmployees = data.length;

  const presentEmployees = data.filter((item) => {
    const status = String(
      item?.status || ""
    ).toLowerCase();

    return (
      status === "present" ||
      status === "in office" ||
      status === "inoffice"
    );
  }).length;

  const absentEmployees = data.filter((item) => {
    const status = String(
      item?.status || ""
    ).toLowerCase();

    return status === "absent";
  }).length;

  /* =========================================================
     TABLE COLUMNS
  ========================================================= */

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

    /* =====================================================
       IN TIME
    ===================================================== */

    {
      title: "In Time",
      dataIndex: "punchIn",
      key: "punchIn",
      align: "center",

      render: (_, record) => {
        if (
          activePunchIn === record?.employeeId
        ) {
          return (
            <div className="change-time-wrapper">

              <input
                type="time"
                value={newTime}
                onChange={(e) =>
                  setNewTime(e.target.value)
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
          </span>
        );
      },
    },

    /* =====================================================
       OUT TIME
       READ ONLY
    ===================================================== */

    {
      title: "Out Time",
      dataIndex: "punchOut",
      key: "punchOut",
      align: "center",

      render: (_, record) => (
        <span>
          {record?.punchOut || "-"}
        </span>
      ),
    },

    /* =====================================================
       STATUS
    ===================================================== */

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",

      render: (status) => {
        const displayStatus =
          String(status || "").toLowerCase() ===
          "absent"
            ? "IN Office"
            : status || "IN Office";

        return (
          <span className="attendance-status">
            {displayStatus}
          </span>
        );
      },
    },

    /* =====================================================
       ACTION
    ===================================================== */

    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      align: "center",

      render: (_, record) => {
        const menuItems = [];

        /* -----------------------------------------------
           REMOVE PUNCH IN
        ------------------------------------------------ */

        if (record?.punchIn) {
          menuItems.push({
            key: "1",
            label: "Remove Punch In",

            onClick: () =>
              removePunchIn(
                record?.employeeId
              ),
          });

          /* -----------------------------------------------
             CHANGE PUNCH IN TIME
          ------------------------------------------------ */

          menuItems.push({
            key: "2",
            label: "Change Punch In Time",

            onClick: () =>
              changePunchInTime(record),
          });
        }

        /* -----------------------------------------------
           MARK PRESENT
        ------------------------------------------------ */

        menuItems.push({
          key: "3",
          label: "Mark Present",

          onClick: () =>
            markPresent(
              record?.employeeId
            ),
        });

        /* -----------------------------------------------
           MARK ABSENT
        ------------------------------------------------ */

        menuItems.push({
          key: "4",
          label: "Mark Absent",

          onClick: () =>
            markAbsent(
              record?.employeeId
            ),
        });

        /* -----------------------------------------------
           MARK HALF DAY
        ------------------------------------------------ */

        menuItems.push({
          key: "5",
          label: "Mark Half Day",

          onClick: () =>
            markHalfDay(
              record?.employeeId
            ),
        });

        return (
          <div className="dropdown_parent">

            {/* THREE DOT */}

            <Dropdown
              menu={{
                items: menuItems,
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <button
                type="button"
                className="three-dot-btn"
              >
                <HiOutlineDotsHorizontal />
              </button>
            </Dropdown>

            {/* CALENDAR */}

            <button
              type="button"
              className="calendar-btn"
              onClick={() =>
                handleCalendar(record)
              }
            >
              <SlCalender />
            </button>

          </div>
        );
      },
    },
  ];

  /* =========================================================
     RETURN
  ========================================================= */

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

      <div className="top-parent">

        <h1>Today's Attendance</h1>

        <div className="btn-group">

          {/* TOTAL EMPLOYEE */}

          <div className="count">
            Total Employee:
            <span>
              {totalEmployees}
            </span>
          </div>

          {/* PRESENT EMPLOYEE */}

          <div className="count">
            Present Employee:
            <span>
              {presentEmployees}
            </span>
          </div>

          {/* ABSENT EMPLOYEE */}

          <div className="count">
            Absent Employee:
            <span>
              {absentEmployees}
            </span>
          </div>

          {/* ADD PREVIOUS ATTENDANCE */}

          <Link
            to="/"
            className="attendance-link"
          >
            <span>
              <FaPlus />
            </span>

            Add Previous Attendance
          </Link>

          {/* VIEW PREVIOUS ATTENDANCE */}

          <Link
            to="/"
            className="attendance-link"
          >
            <span>
              <FaPlus />
            </span>

            View Previous Attendance
          </Link>

        </div>

      </div>

      <Table_Comp
        columns={columns}
        data={data}
        loading={loader}
      />

    </MainPanel>
  );
};

export default Attendance;