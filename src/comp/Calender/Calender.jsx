import React from "react";
import "./Calender.scss";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";

const Calender = ({ attendanceData = [] }) => {
  const getAttendanceStatus = (date) => {
    const dateString = dayjs(date).format("YYYY-MM-DD");

    const attendance = attendanceData.find(
      (item) => item?.date === dateString
    );

    if (!attendance) return "";

    return String(attendance.status || "")
      .trim()
      .toUpperCase()
      .replace(/[-\s]/g, "_");
  };

  const CustomDay = (props) => {
    const { day, outsideCurrentMonth, ...other } = props;

    const dateString = dayjs(day).format("YYYY-MM-DD");
    const todayString = dayjs().format("YYYY-MM-DD");

    const status = getAttendanceStatus(day);
    const isToday = dateString === todayString;

    let className = "custom-calendar-day";

    // Attendance color
    if (status === "FULL_DAY") {
      className += " attendance-present";
    } else if (status === "HALF_DAY") {
      className += " attendance-half-day";
    } else if (status === "ABSENT") {
      className += " attendance-absent";
    }

    // Today's date
    if (isToday) {
      className += " today-date";
    }

    if (outsideCurrentMonth) {
      className += " outside-month";
    }

    return (
      <button
        type="button"
        {...other}
        className={className}
      >
        {dayjs(day).date()}
      </button>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        slots={{
          day: CustomDay,
        }}
      />
    </LocalizationProvider>
  );
};

export default Calender;