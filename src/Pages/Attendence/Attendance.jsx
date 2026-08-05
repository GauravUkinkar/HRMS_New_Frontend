import React, { useState } from "react";
import "./Attendance.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import Table_Comp from "../../comp/table/Table";
import { SlCalender } from "react-icons/sl";

const today = new Date().toLocaleDateString("en-GB");

const Attendance = () => {
  const [data, setData] = useState([
    {
      key: 1,
      employeeName: "Rahul Sharma",
      "Employee Id": "EMP001",
      Department: "IT",
      Email: "rahul.sharma@example.com",
      "Mark Attendance": "Present",
    },
    {
      key: 2,
      employeeName: "Priya Verma",
      "Employee Id": "EMP002",
      Department: "HR",
      Email: "priya.verma@example.com",
      "Mark Attendance": "Absent",
    },
    {
      key: 3,
      employeeName: "Amit Kumar",
      "Employee Id": "EMP003",
      Department: "Finance",
      Email: "amit.kumar@example.com",
      "Mark Attendance": "Present",
    },
  ]);

  const [loader, setLoader] = useState(false);

  const deleteEmployee = (record) => {
    setData((prev) => prev.filter((item) => item.key !== record.key));
  };

  const columns = [
    {
      key: "employeeName",
      dataIndex: "employeeName",
      title: "Employee Name",
      search: true,
      align: "center",
    },
    {
      key: "Employee Id",
      dataIndex: "Employee Id",
      title: "Employee Id",
      search: true,
      align: "center",

    },
    {
      key: "Department",
      dataIndex: "Department",
      title: "Department",
      align: "center",

    },
    {
      key: "Email",
      dataIndex: "Email",
      title: "Email",
      align: "center",

    },
    {
      key: "Mark Attendance",
      dataIndex: "attendance",
      title: "Mark Attendance",
      align: "center",

      render: (_, record) => (
        <div className="attendance-btns">
          <button className="full-day">Full Day</button>
          <button className="half-day">Half Day</button>
          <button className="absent">Absent</button>
        </div>
      ),
    },
    {
      key: "Action",
      dataIndex: "Action",
      title: "Action",
      align: "center",

      render: (_, record) => (
        <div className="action-btns">
          <span onClick={() => deleteEmployee(record)}>
            <RiDeleteBin6Line />
          </span>
          <span>
            <CiEdit />
          </span>
        </div>
      ),
    },
  ];

  return (
    <MainPanel title="Admin Dashboard">
      <div className="top-parent">
        <h1>Attendance</h1>

        <div className="buttons">
          <button className="btn">
            <SlCalender />
            <span>{today}</span>
          </button>

          <button className="btn">Mark Attendance</button>
        </div>
      </div>

      <Table_Comp columns={columns} data={data} />
    </MainPanel>
  );
};

export default Attendance;
