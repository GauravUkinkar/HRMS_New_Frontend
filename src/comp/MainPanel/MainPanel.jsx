import { useState } from "react";
import { Link } from "react-router-dom";
import "./MainPanel.scss";
import Sidebar from "../sidebar/Sidebar";
import { BsClockHistory } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa6";
const MainPanel = ({
  children,
  title ,
  breadcrumbs = [{ label: "Dashboard" }],
}) => {
  const [active, setActive] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPunchModal, setShowPunchModal] = useState(false);
  return (
    <div className="main_panel parent">
      {/* Sidebar */}
      <div className={active ? "sidebar active" : "sidebar"}>
        <Sidebar active={active} />
      </div>


      
      {/* Main Section */}
      <div className={active ? "main_section active" : "main_section"}>
        {/* Header */}
        <div className="header">

          <div class="left_section">
           <div class="top_sec">
               <div
            className="hanburger"
            onClick={() => setActive(!active)}
          >
            <span className="hm" ></span>
            <span className="hm" ></span>
            <span className="hm" ></span>
          </div>
             <h2 className="title">{title}</h2>
           </div>

              {/* Page ttitle & Breadcrumb */}

           

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
          {/* Hamburger */}
       
          {/* header data start hare  */}
     
           

            <div className="right-side">
              {/* Time */}
              <div className="real-time-clock" onClick={() => setShowPunchModal(true)}>
                <div className="icon"><BsClockHistory /></div>

                <div className="right">
                  <p>Day Started</p>
                  <span>09:15 AM</span>
                </div>
              </div>

              {/* User */}
              <div className="user"
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
                    <Link to="/profile">Profile</Link>
                    <Link to="/settings">Settings</Link>
                  </div>
                )}
              </div>
            </div>

        



        </div>


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
                  Punched In at: <span>09:15 AM</span>
                </h4>

                <div className="remaining">
                  Remaining:
                  <h2>8h 15m</h2>
                </div>

                <div className="buttons">
                  {/* <button className="break-btn">
                    Take a Break
                  </button> */}

                  <div className="end-btn">
                   
                    End Your Day
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* Page Content */}
        <div className="botttom_page">{children}</div>
      </div>
    </div>
  );
};

export default MainPanel;

