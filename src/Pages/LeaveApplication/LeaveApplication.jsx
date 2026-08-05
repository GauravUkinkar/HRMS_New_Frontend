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

            <div className="circle-wrapper">
              <svg width="100" height="100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#d6eaea"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#0f7c7c"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="251"
                  strokeDashoffset={251 - (14 / 20) * 251}
                  style={{
                    transform: "rotate(-90deg)",
                    transformOrigin: "50% 50%",
                  }}
                />
              </svg>

              <div className="text">
                <span>14</span>
                <p>Days</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h4>Used</h4>

            <div className="circle-wrapper">
              <svg width="100" height="100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#d6eaea"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#0f7c7c"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="251"
                  strokeDashoffset={251 - (10 / 20) * 251}
                  style={{
                    transform: "rotate(-90deg)",
                    transformOrigin: "50% 50%",
                  }}
                />
              </svg>

              <div className="text">
                <span>10</span>
                <p>Days</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h4>Remaining</h4>

            <div className="circle-wrapper">
              <svg width="100" height="100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#d6eaea"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#0f7c7c"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="251"
                  strokeDashoffset={251 - (8 / 20) * 251}
                  style={{
                    transform: "rotate(-90deg)",
                    transformOrigin: "50% 50%",
                  }}
                />
              </svg>

              <div className="text">
                <span>4</span>
                <p>Days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="leave-form">
          <div className="form-header">Leave Application</div>

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
