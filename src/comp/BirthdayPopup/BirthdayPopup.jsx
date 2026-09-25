import React from "react";
import "./BirthdayPopup.scss";

const BirthdayPopup = ({
  open,
  notification,
  employee,
  onClose,
}) => {
  if (!open || !notification) {
    return null;
  }

  const employeeName = employee?.employeeName || "Employee";

  const employeeImage =
    employee?.employeeImage ||
    employee?.profileImage ||
    employee?.image ||
    "";

  const getInitials = (name) => {
    return String(name)
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const stripHtml = (html = "") => {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    return temp.textContent || temp.innerText || "";
  };

  return (
    <div className="birthday-popup-overlay">
      <div className="birthday-popup-card">
        <button
          type="button"
          className="birthday-popup-close"
          onClick={onClose}
        >
          ×
        </button>

        <div className="birthday-company">
          <div className="birthday-company-logo">
            P
          </div>

          <div>
            <h3>Pandoza Solutions</h3>
            <span>Private Limited</span>
          </div>
        </div>

        <div className="birthday-decoration-top">
          🎉 🎈 🎂 🎈 🎉
        </div>

        <h1>Happy Birthday! 🎂</h1>

        <div className="birthday-employee-image">
          {employeeImage ? (
            <img
              src={employeeImage}
              alt={employeeName}
            />
          ) : (
            <span>{getInitials(employeeName)}</span>
          )}
        </div>

        <h2>{employeeName}</h2>

        <div className="birthday-message">
          {stripHtml(notification?.message || "")}
        </div>

        <div className="birthday-decoration-bottom">
          🎁 🎂 🎉 🎈 🎁
        </div>

        <button
          type="button"
          className="birthday-thank-button"
          onClick={onClose}
        >
          Thank You ❤️
        </button>
      </div>
    </div>
  );
};

export default BirthdayPopup;