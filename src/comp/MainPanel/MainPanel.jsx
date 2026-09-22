import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MainPanel.scss";
import Sidebar from "../sidebar/Sidebar";
import { BsClockHistory } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa6";
import axios from "axios";

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

  const closeSidebar = () => {
    setActive(false);
  };

  const getLoggedInUser = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/AuthController/getUserById`,
        {
          withCredentials: true,
        }
      );

      const user = res?.data?.data;

      if (user) {
        setUserDetails(user);

        if (user?.employeeId) {
          getTodayPunchDetails(user.employeeId);
        }
      }

      console.log("Logged In User:", user);
    } catch (error) {
      console.log(
        "Error fetching logged-in user:",
        error
      );
    }
  };

  useEffect(() => {
  const timer = setInterval(() => {
    setRemainingTime((prev) => {
      let totalSeconds =
        Number(prev.hours || 0) * 3600 +
        Number(prev.minutes || 0) * 60 +
        Number(prev.seconds || 0);

      if (totalSeconds <= 0) {
        clearInterval(timer);

        return {
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      totalSeconds -= 1;

      return {
        hours: Math.floor(totalSeconds / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      };
    });
  }, 1000);

  return () => clearInterval(timer);
}, []);

  const getTodayPunchDetails = async (employeeId) => {
    if (!employeeId) return;

    try {
      const response = await axios.get(
        `${ATTENDANCE_URL}api/punch/employee/${employeeId}`,
        {
          withCredentials: true,
        }
      );

      console.log(
        "TODAY PUNCH DETAILS:",
        response.data
      );

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

      if (employeeData?.punchIn) {
        const punchInDate = new Date(
          employeeData.punchIn
        );

        const isPunchInToday =
          punchInDate.getFullYear() ===
          today.getFullYear() &&
          punchInDate.getMonth() ===
          today.getMonth() &&
          punchInDate.getDate() ===
          today.getDate();

        if (isPunchInToday) {
          setPunchInTime(employeeData.punchIn);
        } else {
          setPunchInTime(null);
        }
      } else {
        setPunchInTime(null);
      }

      if (employeeData?.punchOut) {
        const punchOutDate = new Date(
          employeeData.punchOut
        );

        const isPunchOutToday =
          punchOutDate.getFullYear() ===
          today.getFullYear() &&
          punchOutDate.getMonth() ===
          today.getMonth() &&
          punchOutDate.getDate() ===
          today.getDate();

        if (isPunchOutToday) {
          setPunchOutTime(employeeData.punchOut);
        } else {
          setPunchOutTime(null);
        }
      } else {
        setPunchOutTime(null);
      }

      const hours = Number(
        employeeData?.remainingTime?.hours || 0
      );

      const minutes = Number(
        employeeData?.remainingTime?.minutes || 0
      );

      const seconds = Number(
        employeeData?.remainingTime?.seconds || 0
      );

      setRemainingTime({
        hours,
        minutes,
        seconds,
      });
    } catch (error) {
      console.error(
        "Today Punch Details Error:",
        error
      );

      setPunchInTime(null);
      setPunchOutTime(null);

      setRemainingTime({
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    }
  };

  useEffect(() => {
    getLoggedInUser();
  }, []);

  const userRole = String(
    userDetails?.role ||
    userDetails?.crmRole ||
    ""
  )
    .trim()
    .toUpperCase();

  const isEmployee = userRole === "EMPLOYEE";

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

  const formatRemainingTime = () => {
    const hours = String(
      remainingTime.hours || 0
    ).padStart(2, "0");

    const minutes = String(
      remainingTime.minutes || 0
    ).padStart(2, "0");

    const seconds = String(
      remainingTime.seconds || 0
    ).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  const handlePunchIn = async () => {
    const employeeId =
      userDetails?.employeeId;

    if (!employeeId) {
      alert("Employee ID not found");
      return;
    }

    if (punchingIn) return;

    try {
      setPunchingIn(true);

      const response = await axios.get(
        `${ATTENDANCE_URL}api/punch/IN/${employeeId}/true`,
        {
          withCredentials: true,
        }
      );

      console.log(
        "PUNCH IN RESPONSE:",
        response.data
      );

      if (response.status === 200) {
        await getTodayPunchDetails(
          employeeId
        );
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

      alert(
        error?.response?.data?.message ||
        "Unable to punch in. Please try again."
      );
    } finally {
      setPunchingIn(false);
    }
  };

  const handlePunchOut = async () => {
    const employeeId =
      userDetails?.employeeId;

    if (!employeeId) {
      alert("Employee ID not found");
      return;
    }

    if (punchingOut) return;

    try {
      setPunchingOut(true);

      const response = await axios.get(
        `${ATTENDANCE_URL}api/punch/OUT/${employeeId}/false`,
        {
          withCredentials: true,
        }
      );

      console.log(
        "PUNCH OUT RESPONSE:",
        response.data
      );

      if (response.status === 200) {
        await getTodayPunchDetails(
          employeeId
        );
      }
    } catch (error) {
      console.error(
        "PUNCH OUT ERROR:",
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

      alert(
        error?.response?.data?.message ||
        "Unable to punch out. Please try again."
      );
    } finally {
      setPunchingOut(false);
    }
  };

  const handleEndYourDay = () => {
    if (!punchInTime) {
      return;
    }

    if (punchOutTime) {
      return;
    }

    handlePunchOut();
  };

  return (
    <div
      className="main_panel parent"
      onClick={() => setActive(false)}
    >
      <div
        className={
          active
            ? "sidebar active"
            : "sidebar"
        }
      >
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

      <div
        className={
          active
            ? "main_section active"
            : "main_section"
        }
      >
        <div className="header">
          <div className="left_section">
            <div className="top_sec">
              <div
                className={
                  active
                    ? "hanburger active"
                    : "hanburger"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(
                    (prev) => !prev
                  );
                }}
              >
                <span className="hm"></span>
                <span className="hm"></span>
                <span className="hm"></span>
              </div>

              <h2 className="title">
                {title}
              </h2>
            </div>

            <div className="breadcrumb">
              {breadcrumbs.map(
                (item, index) => (
                  <span key={index}>
                    {item.link ? (
                      <Link
                        to={item.link}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span>
                        {item.label}
                      </span>
                    )}

                    {index !==
                      breadcrumbs.length -
                      1 && (
                        <span className="separator">
                          {" / "}
                        </span>
                      )}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="right-side">
            {isEmployee && (
              <div
                className="real-time-clock"
                onClick={() =>
                  setShowPunchModal(
                    true
                  )
                }
              >
                <div className="icon">
                  <BsClockHistory />
                </div>

                <div className="right">
                  <p>
                    {punchInTime
                      ? "Day Started"
                      : "Not Started"}
                  </p>

                  <span>
                    {formatTime(
                      punchInTime
                    )}
                  </span>
                </div>
              </div>
            )}

            <div
              className="user"
              onClick={(e) => {
                e.stopPropagation();

                setShowProfile(
                  !showProfile
                );
              }}
            >
              <div className="user-avatar">
                {userDetails?.image ? (
                  <img
                    src={userDetails.image}
                    alt={
                      userDetails?.employeeName ||
                      "User"
                    }
                    className="user-profile-image"
                  />
                ) : (
                  (
                    userDetails?.employeeName ||
                    userDetails?.email ||
                    "U"
                  )
                    .split(" ")
                    .map(
                      (word) =>
                        word.charAt(0)
                    )
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                )}
              </div>

              <div className="user-info">
                <p>
                  {userDetails?.employeeName ||
                    userDetails?.email?.split(
                      "@"
                    )[0] ||
                    "User"}
                </p>

                <span>
                  {userDetails?.role ||
                    userDetails?.crmRole ||
                    "Employee"}
                </span>
              </div>

              <div className="user-arrow">
                <FaChevronDown />
              </div>

              {showProfile && (
                <div
                  className="profile-menu"
                  onClick={(e) =>
                    e.stopPropagation()
                  }
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

        {isEmployee &&
          showPunchModal && (
            <div
              className="punch-overlay"
              onClick={() =>
                setShowPunchModal(
                  false
                )
              }
            >
              <div
                className="punch-modal"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >
                <button
                  className="close-btn"
                  onClick={() =>
                    setShowPunchModal(
                      false
                    )
                  }
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

                    <h3>
                      Punch Details
                    </h3>
                  </div>
                </div>

                <div className="modal-body">
                  <h4>
                    Punched In at:

                    <span>
                      {formatTime(
                        punchInTime
                      )}
                    </span>
                  </h4>

                  {punchOutTime && (
                    <h4>
                      Punched Out at:

                      <span>
                        {formatTime(
                          punchOutTime
                        )}
                      </span>
                    </h4>
                  )}

                  {punchInTime &&
                    !punchOutTime && (
                      <div className="remaining">
                        Remaining:

                        <h2>
                          {formatRemainingTime()}
                        </h2>
                      </div>
                    )}

                  <div className="buttons">
                    {!punchInTime && (
                      <button
                        type="button"
                        className="end-btn punch-in-btn"
                        onClick={
                          handlePunchIn
                        }
                        disabled={
                          punchingIn
                        }
                      >
                        {punchingIn
                          ? "Punching In..."
                          : "Punch In"}
                      </button>
                    )}

                    {punchInTime &&
                      !punchOutTime && (
                        <button
                          type="button"
                          className="end-btn"
                          onClick={
                            handleEndYourDay
                          }
                          disabled={
                            punchingOut
                          }
                        >
                          {punchingOut
                            ? "Ending Day..."
                            : "End Your Day"}
                        </button>
                      )}

                    {punchOutTime && (
                      <div className="day-ended">
                        Day Ended at{" "}
                        <strong>
                          {formatTime(
                            punchOutTime
                          )}
                        </strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        <div className="botttom_page">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainPanel;