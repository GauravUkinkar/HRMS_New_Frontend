import React from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import "./AdminDash.scss";
import { IoDocumentTextSharp } from "react-icons/io5";
import { CiMenuKebab } from "react-icons/ci";
import Calender from "../../comp/Calender/Calender";

const AdminDash = () => {
  return (
    <>
      <MainPanel
        title="Admin Dashboard"
        breadcrumbs={[
          { label: "Dashboard", link: "/dashboard" },
          { label: "Admin Dashboard" },
        ]}
      >
        <div className="admindash-parent">
          <div className="left">
            <div className="left1">
              <h3>Documents</h3>
              <div className="documents">
                <IoDocumentTextSharp />
                <h4>Aadhar Card</h4>
              </div>
              <div className="documents">
                <IoDocumentTextSharp />
                <h4>Pan Card</h4>
              </div>
              <div className="documents">
                <IoDocumentTextSharp />
                <h4>Degree Certificate</h4>
              </div>
              <button className="btn">View Documents</button>
            </div>
            <div className="left2">
                <div className="heading">
                    <p>Total Hours Log-In</p>
                    <p>45h 00m </p>
                </div>
            </div>
            <div className="left3">
                <div className="top">
                    <h3>Notification</h3>
                    <CiMenuKebab />
                </div>
                <div className="card">
                    <div className="heading">Pramotion Review</div>
                    <p>11 June 2026Discussed potential promotion in Q1based on consistent performance andleadership in the recentproject.</p>
                </div>
                <div className="card">
                      <div className="heading">Employee Appreciation</div>
                    <p>7 May 2026Recognized by the team and CEO foroutstanding contribution in the clientworkshop and delivery timeline.</p>
                </div>
            </div>
          </div>
          <div className="middle">
            <div className="middle1"></div>
            <div className="middle2"></div>
            <div className="middle3"></div>
          </div>
          <div className="right">
            <div className="right1">
               <h1 className="heading">
                Attendence
               </h1>
                <Calender/>
                <div className="bottom">
                    <div className="absent">
                      <div className="red"></div>
                      <p>Absent</p>
                    </div>
                     <div className="today">
                      <div className="blue"></div>
                      <p>Today</p>
                    </div>
                     <div className="halfday">
                      <div className="grey"></div>
                      <p>Half Day</p>
                    </div>
                </div>
            </div>
            <div className="right2">
                <div className="top">

                </div>
            </div>
          </div>
        </div>
      </MainPanel>
    </>
  );
};

export default AdminDash;
