import React from "react";
import "./LeaveApplication.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";

const LeaveApplication = () => {
  return (
    <MainPanel>
      <div className="leave-container">
        <div className="leave-summary">
          <div className="card">
            <h4>All Leaves</h4>
            <div className="circle">
              <span>14</span>
              <p>Days</p> 
            </div>
          </div>

          <div className="card">
            <h4>Used</h4>
            <div className="circle">
              <span>10</span>
              <p>Days</p>
            </div>
          </div>

          <div className="card">
            <h4>Remaining</h4>
            <div className="circle">
              <span>8</span>
              <p>Days</p>
            </div>
          </div>
        </div>

   
        <div className="leave-form">
          <div className="form-header">Leave Application
            
          </div>

          <div className="form-body">
            <label>Select Leave Days</label>
            <input type="text" placeholder="Select Leave Days" />

            <label>Enter leave Reason</label>
            <textarea placeholder="Enter leave Reason"></textarea>

            <button>Submit</button>
          </div>
        </div>
      </div>
    </MainPanel>
  );
};

export default LeaveApplication;
