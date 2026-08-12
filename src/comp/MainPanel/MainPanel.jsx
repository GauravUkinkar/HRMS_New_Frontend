import { useState } from "react";
import { Link } from "react-router-dom";
import "./MainPanel.scss";
import Sidebar from "../sidebar/Sidebar";
import { BsClockHistory } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa6";

const MainPanel = ({
  children,
  title,
  breadcrumbs = [{ label: "Dashboard" }],
}) => {
  // false = collapsed by default
  const [active, setActive] = useState(false);

  const [showProfile, setShowProfile] = useState(false);
  const [showPunchModal, setShowPunchModal] = useState(false);

  // Close sidebar after clicking any navigation link
  const closeSidebar = () => {
    setActive(false);
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
      <div className={active ? "main_section active" : "main_section"}>

        {/* ================= HEADER ================= */}
        <div className="header">

          <div className="left_section">

            <div className="top_sec">

              {/* Hamburger */}
              <div
                className={active ? "hanburger active" : "hanburger"}
                onClick={() => setActive((prev) => !prev)}
              >
                <span className="hm"></span>
                <span className="hm"></span>
                <span className="hm"></span>
              </div>

              <h2 className="title">{title}</h2>

            </div>

            {/* Breadcrumb */}
            <div className="breadcrumb">

              {breadcrumbs.map((item, index) => (
                <span key={index}>

                  {item.link ? (
                    <Link to={item.link}>{item.label}</Link>
                  ) : (
                    <span>{item.label}</span>
                  )}

                  {index !== breadcrumbs.length - 1 && (
                    <span className="separator"> / </span>
                  )}

                </span>
              ))}

            </div>

          </div>

          {/* ================= RIGHT HEADER ================= */}
          <div className="right-side">

            {/* Time */}
            <div
              className="real-time-clock"
              onClick={() => setShowPunchModal(true)}
            >
              <div className="icon">
                <BsClockHistory />
              </div>

              <div className="right">
                <p>Day Started</p>
                <span>09:15 AM</span>
              </div>
            </div>

            {/* User */}
            <div
              className="user"
              onClick={() => setShowProfile(!showProfile)}
            >

              <div className="user-avatar">
                SS
              </div>

              <div className="user-info">
                <p>Davis Lewis</p>
                <span>Admin</span>
              </div>

              <div className="user-arrow">
                <FaChevronDown />
              </div>

              {showProfile && (
                <div className="profile-menu">

                  <Link to="/profile">
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
        {showPunchModal && (
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
                  <p>Session: Day Started</p>
                  <h3>Punch Details</h3>
                </div>

              </div>

              <div className="modal-body">

                <h4>
                  Punched In at:
                  <span>09:15 AM</span>
                </h4>

                <div className="remaining">
                  Remaining:
                  <h2>8h 15m</h2>
                </div>

                <div className="buttons">

                  <div className="end-btn">
                    End Your Day
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ================= PAGE CONTENT ================= */}
        <div className="botttom_page">
          {children}
        </div>

      </div>

    </div>
  );
};

export default MainPanel;