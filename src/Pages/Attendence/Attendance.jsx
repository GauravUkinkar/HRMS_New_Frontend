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
// import { UserContext } from "../../../Context";
import { Link } from "react-router-dom";
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
  const [allemployee, setAllEmployee] = useState([]);

  // const { user, employee } =
  //   useContext(UserContext);

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [activePunchIn, setActivePunchIn] = useState(null);
  const [newTime, setNewTime] = useState("");

  // Button code for add previous attendance modal
  const handleAddPreviousAttendance = () => {
    setPreviousAttendance({
      employeeId: "",
      date: "",
      status: "",
    });

    setPreviousAttendanceData([]);
    setDatePickerOpen(false);
    setShowAttendanceModal(true);
  };

  const handleCloseAttendanceModal = () => {
    setShowAttendanceModal(false);
    setDatePickerOpen(false);
    setPreviousAttendance({
      employeeId: "",
      date: "",
      status: "",
    });
    setPreviousAttendanceData([]);
  };

  const getAllEmployee = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}Admin/GetAllEmployee`,
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

  // Todays Attendance API Call
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

  // GET PREVIOUS ATTENDANCE

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

      const startDate =`${today.year()}-01-01`;

      const endDate = today.format("YYYY-MM-DD");
      console.log("API REQUEST:",
        {
          employeeId,
          startDate,
          endDate,
        }
      );

      // API CALL
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

      console.log(
        "PREVIOUS ATTENDANCE RESPONSE:",
        response?.data
      );

      // -------------------------------------------------------
      // GET ARRAY FROM RESPONSE
      // -------------------------------------------------------

      let attendanceList = [];

      if (
        Array.isArray(
          response?.data
        )
      ) {
        attendanceList =
          response.data;
      } else if (
        Array.isArray(
          response?.data?.data
        )
      ) {
        attendanceList =
          response.data.data;
      } else if (
        Array.isArray(
          response?.data?.result
        )
      ) {
        attendanceList =
          response.data.result;
      } else if (
        Array.isArray(
          response?.data?.attendance
        )
      ) {
        attendanceList =
          response.data.attendance;
      }

      console.log(
        "ATTENDANCE LIST:",
        attendanceList
      );

      setPreviousAttendanceData(
        attendanceList
      );

      // -------------------------------------------------------
      // OPEN DATE PICKER AFTER API RESPONSE
      // -------------------------------------------------------

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

  // =========================================================
  // GET STATUS FOR DATE
  // =========================================================

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

  // =========================================================
  // ADJUST / UPDATE PREVIOUS ATTENDANCE
  // =========================================================

  const adjustPreviousAttendance = async () => {
    const { employeeId, date, status } =
      previousAttendance;

    if (!employeeId) {
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

      const selectedEmployee = allemployee.find(
        (item) =>
          String(item?.empId || "") ===
          String(employeeId)
      );

      if (!selectedEmployee) {
        toast.error("Selected employee not found");
        return;
      }

      const payload = {
        date,
        attendanceType: status,
        employeeName: selectedEmployee.name || "",
        employeeDesignation:
          selectedEmployee.designation || "",
      };

      console.log(
        "ADJUST ATTENDANCE URL:",
        `${BASE_URL2}api/punch/adjust/${employeeId}`
      );

      console.log(
        "ADJUST ATTENDANCE PAYLOAD:",
        payload
      );

      const response = await axios.post(
        `${BASE_URL2}api/punch/adjust/${employeeId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "ADJUST ATTENDANCE RESPONSE:",
        response?.data
      );

      if (
        response?.status === 200 &&
        response?.data?.success !== false
      ) {
        toast.success(
          "Previous Attendance Updated Successfully"
        );

        await getEmployeeData();

        await getPreviousAttendance(employeeId);

        setPreviousAttendance({
          employeeId: "",
          date: "",
          status: "",
        });

        setDatePickerOpen(false);
        setShowAttendanceModal(false);
      } else {
        throw new Error(
          response?.data?.message ||
          "Unable to update previous attendance"
        );
      }
    } catch (error) {
      console.error(
        "Adjust Previous Attendance Error:",
        error
      );

      console.error(
        "Adjust API Response:",
        error?.response?.data
      );

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to update previous attendance"
      );
    } finally {
      setAttendanceHistoryLoading(false);
    }
  };

  // =========================================================
  // MARK PRESENT
  // =========================================================

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

  // =========================================================
  // MARK HALF DAY
  // =========================================================

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

  // =========================================================
  // MARK ABSENT
  // =========================================================

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

  // =========================================================
  // REMOVE PUNCH IN
  // =========================================================

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

  // =========================================================
  // CHANGE PUNCH IN TIME
  // =========================================================

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

  // =========================================================
  // UPDATE PUNCH IN TIME
  // =========================================================

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

  // =========================================================
  // CALENDAR BUTTON
  // =========================================================

  const handleCalendar = (
    record
  ) => {
    console.log(
      "Calendar Employee:",
      record?.employeeId
    );
  };

  // =========================================================
  // INITIAL API CALL
  // =========================================================

  useEffect(() => {
    getEmployeeData();
    getAllEmployee();
  }, []);

  // =========================================================
  // COUNTS
  // =========================================================

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

  // =========================================================
  // TABLE COLUMNS
  // =========================================================

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

    // =======================================================
    // IN TIME
    // =======================================================

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

    // =======================================================
    // OUT TIME
    // =======================================================

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

    // =======================================================
    // STATUS
    // EXISTING TABLE STATUS KEPT
    // =======================================================

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",

      render: (status) => {
        const normalizedStatus = String(status || "")
          .trim()
          .toUpperCase();

        const displayStatus =
          normalizedStatus === "ABSENT"
            ? "IN Office"
            : status || "IN Office";

        return (
          <span
            className={`attendance-status ${normalizedStatus === "HALF_DAY"
              ? "half-day-status"
              : ""
              }`}
          >
            {displayStatus}
          </span>
        );
      },
    },

    // =======================================================
    // ACTION
    // =======================================================

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

  // =========================================================
  // RETURN
  // =========================================================

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

      {/* =====================================================
          TOP SECTION
      ===================================================== */}

      <div className="top-parent">

        <h1>
          Today's Attendance
        </h1>

        <div className="btn-group">

          {/* TOTAL */}

          <div className="count">

            Total Employee:

            <span>
              {
                totalEmployees
              }
            </span>

          </div>

          {/* PRESENT */}

          <div className="count">

            Present Employee:

            <span>
              {
                presentEmployees
              }
            </span>

          </div>

          {/* ABSENT */}

          <div className="count">

            Absent Employee:

            <span>
              {
                absentEmployees
              }
            </span>

          </div>

          {/* ADD PREVIOUS */}

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

          {/* VIEW PREVIOUS */}

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

      {/* =====================================================
          TABLE
      ===================================================== */}

      <Table_Comp
        columns={columns}
        data={data}
        loading={loader}
      />

      {/* =====================================================
          ADD PREVIOUS ATTENDANCE MODAL
      ===================================================== */}

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

          {/* =================================================
              EMPLOYEE
          ================================================= */}

          <div className="form-group">

            <select
              value={
                previousAttendance.employeeId
              }

              onChange={async (
                e
              ) => {

                const employeeId =
                  e.target.value;

                setPreviousAttendance({
                  employeeId:
                    employeeId,

                  date: "",

                  status: "",
                });

                setPreviousAttendanceData(
                  []
                );

                setDatePickerOpen(
                  false
                );

                if (
                  employeeId
                ) {

                  await getPreviousAttendance(
                    employeeId
                  );

                }

              }}
            >

              <option value="">
                Select Employee
              </option>

              {allemployee.map(
                (
                  item
                ) => (

                  <option
                    key={
                      item.empId
                    }

                    value={
                      item.empId
                    }
                  >
                    {item.name}
                  </option>

                )
              )}

            </select>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {attendanceHistoryLoading && (
            <div className="attendance-loading">
              Loading previous attendance...
            </div>
          )}

          {/* =================================================
              DATE
          ================================================= */}

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

                    {/* FULL DAY */}

                    {status ===
                      "FULL_DAY" && (
                        <span className="attendance-dot full-day-dot">
                          ●
                        </span>
                      )}

                    {/* HALF DAY */}

                    {status ===
                      "HALF_DAY" && (
                        <span className="attendance-dot half-day-dot">
                          ●
                        </span>
                      )}

                    {/* ABSENT */}

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

          {/* =================================================
              STATUS
          ================================================= */}

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