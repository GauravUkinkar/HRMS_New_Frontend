import React, { useEffect, useState } from "react";
import { Table, Avatar, Tag, Space } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { FaPlus } from "react-icons/fa";
import "./EmpList.scss";
import { Link, useNavigate } from "react-router-dom";
import { SlCalender } from "react-icons/sl";
import MainPanel from "../../comp/MainPanel/MainPanel";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

const EmpList = () => {
  const navigate = useNavigate();

  const [allemployee, setAllEmployee] = useState([]);

  // GET ALL EMPLOYEES
  const getAllEmployee = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}Admin/GetAllEmployee`,
        {
          withCredentials: true,
        }
      );

      const employees = res.data.map((item, index) => ({
        key: index + 1,
        name: item.data.employeeName,
        empId: item.data.employeeId,
        department: item.data.department,
        designation: item.data.designation,
        email: item.data.email,
        phone: item.data.contactNumber,
        dob: item.data.dateOfBirth,
        address: item.data.currentAddress,
        status: item.data.employeeStatus,
        uid: item.data.uid,
      }));

      setAllEmployee(employees);

      console.log("Employees:", employees);
    } catch (error) {
      console.log(
        error.response?.data || error
      );
    }
  };


  //delete employee with id 
  const handleDeleteEmployee = async (uid) => {
    if (!uid) {
      console.error("Employee ID is missing");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${BASE_URL}Admin/deleteUserByUserId/${uid}`,
        {
          withCredentials: true,
        }
      );

      console.log("Delete Employee Response:", response.data);

      alert("Employee deleted successfully");

      // Refresh your employee list here
      // getEmployees();

    } catch (error) {
      console.error(
        "Delete Employee Error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete employee"
      );
    }
  };

  useEffect(() => {
    getAllEmployee();
  }, []);

  // ==============================
  // TABLE COLUMNS
  // ==============================
  const columns = [
    {
      title: (
        <>
          Name <SearchOutlined />
        </>
      ),
      dataIndex: "name",
      key: "name",
      width: 220,
      fixed: "left",

      render: (_, record) => {
        const name = record.name || "N/A";

        const nameParts = name.trim().split(" ");

        const initials =
          nameParts.length > 1
            ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]
            }`
            : nameParts[0][0];

        return (
          <Space>
            <Avatar className="avatar">
              {initials.toUpperCase()}
            </Avatar>

            {name}
          </Space>
        );
      },
    },

    {
      title: (
        <>
          Employee ID <SearchOutlined />
        </>
      ),
      dataIndex: "empId",
      key: "empId",
      width: 150,
      fixed: "left",
    },

    {
      title: "Department",
      dataIndex: "department",
      width: 180,
    },

    {
      title: "Designation",
      dataIndex: "designation",
      width: 220,
    },

    {
      title: (
        <>
          Email <SearchOutlined />
        </>
      ),
      dataIndex: "email",
      width: 260,
    },

    {
      title: "Phone",
      dataIndex: "phone",
      width: 180,
    },

    {
      title: "DOB",
      dataIndex: "dob",
      width: 150,
    },

    {
      title: "Address",
      dataIndex: "address",
      width: 250,

      render: (address) => (
        <span
          style={{
            display: "inline-block",
            maxWidth: "20ch",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={address}
        >
          {address || "N/A"}
        </span>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      fixed: "right",

      render: (status) => (
        <Tag color={status ? "success" : "default"}>
          {status || "N/A"}
        </Tag>
      ),
    },
    // ACTIONS
    {
      title: "Actions",
      key: "actions",
      width: 140,
      fixed: "right",

      render: (_, record) => (
        <Space size="middle">

          {/* VIEW */}
          <EyeOutlined
            className="view"
            onClick={() => {
              console.log(
                "Selected Employee ID:",
                record.empId
              );

              navigate(
                `/EmployeeProfile/${record.empId}`
              );
            }}
          />

          {/* EDIT */}
          <EditOutlined
            className="edit"
            onClick={() => {
              navigate(`/editEmployee/${record.empId}`);
            }}
          />

          {/* DELETE */}
          <DeleteOutlined
            className="delete"
            onClick={() => handleDeleteEmployee(record.uid)}
          />

          {/* CALENDAR */}
          <SlCalender
            className="date"
            onClick={() => {
              console.log(
                "Calendar Employee:",
                record.empId
              );
            }}
          />

        </Space>
      ),
    },
  ];
  // JSX
  return (
    <MainPanel>
      <div className="emp-list">

        <div className="page-header">
          <h2>Employees</h2>

          <div className="btn-group">
            <div className="count">
              Total Number Of Employee: <span>{allemployee.length}</span>
            </div>
            <Link to="/addEmployee">
              <span>
                <FaPlus />
              </span>{" "}
              Add Employee
            </Link>
          </div>


        </div>

        <Table
          columns={columns}
          dataSource={allemployee}
          bordered
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
          }}
          rowClassName={(_, index) =>
            index % 2 === 0
              ? "table-row-light"
              : "table-row-dark"
          }
        />

      </div>
    </MainPanel>
  );
};

export default EmpList;