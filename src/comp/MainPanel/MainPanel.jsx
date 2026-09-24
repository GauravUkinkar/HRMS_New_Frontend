
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MainPanel.scss";
import Sidebar from "../sidebar/Sidebar";
import { BsClockHistory } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;
const ATTENDANCE_URL = import.meta.env.VITE_ATTENDANCE_URL;

const MainPanel = ({
  children,
  title,
  breadcrumbs = [{ label: "Dashboard" }],
}) => {
  const [active, setActive] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPunchModal, setShowPunchModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);

  const [remainingTime, setRemainingTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [punchingIn, setPunchingIn] = useState(false);
  const [punchingOut, setPunchingOut] = useState(false);

  // Make sure the base URL always has /
  const attendanceBaseUrl = ATTENDANCE_URL?.endsWith("/")
    ? ATTENDANCE_URL
    : `${ATTENDANCE_URL}/`;

  const closeSidebar = () => {
    setActive(false);
  };

  // =========================
  // GET TODAY PUNCH DETAILS
  // =========================
  const getTodayPunchDetails = async (employeeId) => {
    if (!employeeId) return;

    try {
      const url = `${attendanceBaseUrl}api/punch/employee/${employeeId}`;

      console.log("TODAY PUNCH DETAILS URL:", url);

      const response = await axios.get(url, {
        withCredentials: true,
      });

      console.log("TODAY PUNCH DETAILS RESPONSE:", response.data);

      const employeeData = response?.data?.data;

      if (!employeeData) {
        setPunchInTime(null);
        setPunchOutTime(null);

        setRemainingTime({
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      const today = new Date();

      // -------------------------
      // PUNCH IN
      // -------------------------
      if (employeeData?.punchIn) {
        const punchInDate = new Date(employeeData.punchIn);

        const isPunchInToday =
          punchInDate.getFullYear() === today.getFullYear() &&
          punchInDate.getMonth() === today.getMonth() &&
          punchInDate.getDate() === today.getDate();

        if (isPunchInToday) {
          setPunchInTime(employeeData.punchIn);
        } else {
          setPunchInTime(null);
        }
      } else {
        setPunchInTime(null);
      }

      // -------------------------
      // PUNCH OUT
      // -------------------------
      if (employeeData?.punchOut) {
        const punchOutDate = new Date(employeeData.punchOut);

        const isPunchOutToday =
          punchOutDate.getFullYear() === today.getFullYear() &&
          punchOutDate.getMonth() === today.getMonth() &&
          punchOutDate.getDate() === today.getDate();

        if (isPunchOutToday) {
          setPunchOutTime(employeeData.punchOut);
        } else {
          setPunchOutTime(null);
        }
      } else {
        setPunchOutTime(null);
      }

      // -------------------------
      // REMAINING TIME
      // -------------------------
      const hours = Number(employeeData?.remainingTime?.hours || 0);
      const minutes = Number(employeeData?.remainingTime?.minutes || 0);
      const seconds = Number(employeeData?.remainingTime?.seconds || 0);

      setRemainingTime({
        hours,
        minutes,
        seconds,
      });
    } catch (error) {
      console.error("Today Punch Details Error:", error);
      console.error("STATUS:", error?.response?.status);
      console.error("RESPONSE:", error?.response?.data);

      setPunchInTime(null);
      setPunchOutTime(null);

      setRemainingTime({
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    }
  };

  // =========================
  // PUNCH IN
  // =========================
const handlePunchIn = async () => {
  const employeeId = userDetails?.employeeId;

  if (!employeeId) {
    toast.error("Employee Id not found");
    return;
  }

  if (punchingIn) return;

  // Check possible designation field names
  const employeeDesignation =
    userDetails?.employeeDesignation ||
    userDetails?.designation ||
    userDetails?.employeeDesignationName ||
    userDetails?.jobTitle ||
    "";

  if (!employeeDesignation.trim()) {
    console.error(
      "Employee designation is missing from userDetails:",
      userDetails
    );

    toast.error("Employee designation not found");
    return;
  }

  const punchInUrl = `${attendanceBaseUrl}api/punch/in/${employeeId}/false`;

  const payload = {
    employeeName:
      userDetails?.employeeName || "",

    employeeDesignation:
      employeeDesignation,
  };

  console.log("ATTENDANCE_URL:", ATTENDANCE_URL);
  console.log("EMPLOYEE ID:", employeeId);
  console.log("EMPLOYEE NAME:", userDetails?.employeeName);
  console.log(
    "EMPLOYEE DESIGNATION:",
    employeeDesignation
  );
  console.log("FINAL URL:", punchInUrl);
  console.log("PUNCH IN PAYLOAD:", payload);

  try {
    setPunchingIn(true);

    const response = await axios.post(
      punchInUrl,
      payload,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "PUNCH IN RESPONSE:",
      response.data
    );

    console.log(
      "PUNCH IN STATUS:",
      response.status
    );

    if (response.status === 200) {
      toast.success(
        response?.data?.message ||
          "Start Your Day successful!",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );

      await getTodayPunchDetails(employeeId);
    }
  } catch (error) {
    console.error(
      "PUNCH IN ERROR:",
      error
    );

    console.error(
      "STATUS:",
      error?.response?.status
    );

    console.error(
      "RESPONSE:",
      error?.response?.data
    );

    console.error(
      "REQUEST URL:",
      error?.config?.url
    );

    toast.error(
      error?.response?.data?.message ||
        "Unable to start your day. Please try again.",
      {
        position: "top-right",
        autoClose: 3000,
      }
    );
  } finally {
    setPunchingIn(false);
  }
};

  // =========================
  // PUNCH OUT
  // =========================
  const handlePunchOut = async () => {
    const employeeId = userDetails?.employeeId;

    if (!employeeId) {
      toast.error("Employee Id not found");
      return;
    }

    if (punchingOut) return;

    try {
      setPunchingOut(true);

      const url = `${attendanceBaseUrl}api/punch/OUT/${employeeId}/false`;

      console.log("PUNCH OUT URL:", url);
      console.log("EMPLOYEE ID:", employeeId);

      // IMPORTANT:
      // Punch Out API is GET
      const response = await axios.get(url, {
        withCredentials: true,
      });

      console.log("PUNCH OUT RESPONSE:", response.data);

      if (response.status === 200) {
        toast.success(
          response?.data?.message || "Day ended successfully!",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );

        // Refresh today's punch information
        await getTodayPunchDetails(employeeId);
      }
    } catch (error) {
      console.error("PUNCH OUT ERROR:", error);
      console.error("STATUS:", error?.response?.status);
      console.error("RESPONSE:", error?.response?.data);

      toast.error(
        error?.response?.data?.message ||
          "Unable to end your day. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setPunchingOut(false);
    }
  };

  // =========================
  // GET LOGGED-IN USER
  // =========================
  const getLoggedInUser = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/AuthController/getUserById`,
        {
          withCredentials: true,
        }
      );

      const user = response?.data?.data;

      console.log("Logged In User:", user);

      if (user) {
        setUserDetails(user);

        if (user?.employeeId) {
          await getTodayPunchDetails(user.employeeId);
        }
      }
    } catch (error) {
      console.error("Error fetching logged-in user:", error);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    getLoggedInUser();
  }, []);

  // =========================
  // REMAINING TIME TIMER
  // =========================
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        const totalSeconds =
          Number(prev.hours || 0) * 3600 +
          Number(prev.minutes || 0) * 60 +
          Number(prev.seconds || 0);

        if (totalSeconds <= 0) {
          return {
            hours: 0,
            minutes: 0,
            seconds: 0,
          };
        }

        const newTotalSeconds = totalSeconds - 1;

        return {
          hours: Math.floor(newTotalSeconds / 3600),
          minutes: Math.floor((newTotalSeconds % 3600) / 60),
          seconds: newTotalSeconds % 60,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // =========================
  // END YOUR DAY
  // =========================
  const handleEndYourDay = () => {
    if (!punchInTime) {
      return;
    }

    if (punchOutTime) {
      return;
    }

    handlePunchOut();
  };

  // =========================
  // USER ROLE
  // =========================
 const userRole = String(
  userDetails?.role || userDetails?.crmRole || ""
)
  .trim()
  .toUpperCase();

const isEmployee = userRole === "EMPLOYEE";
const isAdmin = userRole === "ADMIN";

  // =========================
  // FORMAT PUNCH TIME
  // =========================
  const formatTime = (dateTime) => {
    if (!dateTime) {
      return "--:--";
    }

    const date = new Date(dateTime);

    if (isNaN(date.getTime())) {
      return "--:--";
    }

    return date.toLocaleTimeString("en-IN", {
      timeZone: "UTC",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // =========================
  // FORMAT REMAINING TIME
  // =========================
  const formatRemainingTime = () => {
    const hours = String(remainingTime.hours || 0).padStart(2, "0");
    const minutes = String(remainingTime.minutes || 0).padStart(2, "0");
    const seconds = String(remainingTime.seconds || 0).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div
      className="main_panel parent"
      onClick={() => setActive(false)}
    >
      {/* ================= SIDEBAR ================= */}
      <div className={active ? "sidebar active" : "sidebar"}>
        <Sidebar
          active={active}
          setActive={setActive}
          closeSidebar={closeSidebar}
        />
      </div>

      {active && (
        <div
          className="sidebar_overlay"
          onClick={() => setActive(false)}
        />
      )}

      {/* ================= MAIN SECTION ================= */}
      <div
        className={
          active ? "main_section active" : "main_section"
        }
      >
        {/* ================= HEADER ================= */}
        <div className="header">
          <div className="left_section">
            <div className="top_sec">
              <div
                className={
                  active ? "hanburger active" : "hanburger"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((prev) => !prev);
                }}
              >
                <span className="hm"></span>
                <span className="hm"></span>
                <span className="hm"></span>
              </div>

              <h2 className="title">{title}</h2>
            </div>

            <div className="breadcrumb">
              {breadcrumbs.map((item, index) => (
                <span key={index}>
                  {item.link ? (
                    <Link to={item.link}>{item.label}</Link>
                  ) : (
                    <span>{item.label}</span>
                  )}

                  {index !== breadcrumbs.length - 1 && (
                    <span className="separator">{" / "}</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* ================= RIGHT HEADER ================= */}
          <div className="right-side">
            {/* ================= EMPLOYEE CLOCK ================= */}
            {isEmployee && (
              <div
                className={`real-time-clock ${
                  punchInTime
                    ? "day-started"
                    : "day-not-started"
                }`}
                onClick={() => {
                  if (!punchInTime && !punchingIn) {
                    handlePunchIn();
                  } else if (punchInTime) {
                    setShowPunchModal(true);
                  }
                }}
              >
                <div className="icon">
                  <BsClockHistory />
                </div>

                <div className="right">
                  {punchInTime ? (
                    <>
                      <p>Day Started</p>
                      <span>{formatTime(punchInTime)}</span>
                    </>
                  ) : (
                    <p>
                      {punchingIn
                        ? "Starting Your Day..."
                        : "Start Your Day"}
                    </p>
                  )}
                </div>
              </div>
            )}
{/* ================= USER ================= */}
<div
  className={`user ${isAdmin ? "admin-user" : ""}`}
  onClick={(e) => {
    e.stopPropagation();

    // Admin should not open profile/settings dropdown
    if (isAdmin) {
      setShowProfile(false);
      return;
    }

    setShowProfile(!showProfile);
  }}
>
  <div className="user-avatar">
    {userDetails?.image ? (
      <img
        src={userDetails.image}
        alt={userDetails?.employeeName || "User"}
        className="user-profile-image"
      />
    ) : (
      (
        userDetails?.employeeName ||
        userDetails?.email ||
        "U"
      )
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase()
    )}
  </div>

  <div className="user-info">
    <p>
      {userDetails?.employeeName ||
        userDetails?.email?.split("@")[0] ||
        "User"}
    </p>

    <span>
      {userDetails?.role ||
        userDetails?.crmRole ||
        "Employee"}
    </span>
  </div>

  {/* Hide dropdown arrow for Admin */}
  {!isAdmin && (
    <div className="user-arrow">
      <FaChevronDown />
    </div>
  )}

  {/* Profile + Settings only for non-admin users */}
  {!isAdmin && showProfile && (
    <div
      className="profile-menu"
      onClick={(e) => e.stopPropagation()}
    >
      <Link to={`/profile/${userDetails?.employeeId}`}>
        Profile
      </Link>

      <Link to="/settings">
        Settings
      </Link>
    </div>
  )}
</div>
          
          </div>
        </div>

        {/* ================= PUNCH MODAL ================= */}
        {isEmployee && showPunchModal && (
          <div
            className="punch-overlay"
            onClick={() => setShowPunchModal(false)}
          >
            <div
              className="punch-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-btn"
                onClick={() => setShowPunchModal(false)}
              >
                ✕
              </button>

              <div className="modal-header">
                <BsClockHistory />

                <div>
                  <p>
                    Session:{" "}
                    {punchInTime
                      ? "Day Started"
                      : "Not Started"}
                  </p>

                  <h3>Punch Details</h3>
                </div>
              </div>

              <div className="modal-body">
                <h4>
                  Punched In at:
                  <span>{formatTime(punchInTime)}</span>
                </h4>

                {punchOutTime && (
                  <h4>
                    Punched Out at:
                    <span>{formatTime(punchOutTime)}</span>
                  </h4>
                )}

                {punchInTime && !punchOutTime && (
                  <div className="remaining">
                    Remaining:
                    <h2>{formatRemainingTime()}</h2>
                  </div>
                )}

                <div className="buttons">
                  {/* PUNCH IN */}
                  {!punchInTime && (
                    <button
                      type="button"
                      className="end-btn punch-in-btn"
                      onClick={handlePunchIn}
                      disabled={punchingIn}
                    >
                      {punchingIn
                        ? "Punching In..."
                        : "Punch In"}
                    </button>
                  )}

                  {/* END DAY */}
                  {punchInTime && !punchOutTime && (
                    <button
                      type="button"
                      className="end-btn"
                      onClick={handleEndYourDay}
                      disabled={punchingOut}
                    >
                      {punchingOut
                        ? "Ending Day..."
                        : "End Your Day"}
                    </button>
                  )}

                  {/* DAY ENDED */}
                  {punchOutTime && (
                    <div className="day-ended">
                      Day Ended at{" "}
                      <strong>
                        {formatTime(punchOutTime)}
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PAGE CONTENT ================= */}
        <div className="botttom_page">{children}</div>
      </div>
    </div>
  );
};

export default MainPanel;

