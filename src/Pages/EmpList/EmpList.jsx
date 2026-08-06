import React, { useEffect, useState } from "react";
import { Table, Avatar, Tag, Button, Space } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { FaPlus } from "react-icons/fa";
import "./EmpList.scss";
import { Link } from "react-router-dom";
import { SlCalender } from "react-icons/sl";
import MainPanel from "../../comp/MainPanel/MainPanel";
import axios from "axios";



const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;


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
      const nameParts = record.name.trim().split(" ");

      const initials =
        nameParts.length > 1
          ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
          : nameParts[0][0];

      return (
        <Space>
          <Avatar className="avatar">
            {initials.toUpperCase()}
          </Avatar>
          {record.name}
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
      {address}
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
  {
    title: "Actions",
    key: "actions",
    width: 140,
    fixed: "right",
    render: () => (
      <Space size="middle">
        <EyeOutlined className="view" />
        <EditOutlined className="edit" />
        <DeleteOutlined className="delete" />
        <SlCalender className="date" />
      </Space>
    ),
  },
];

const EmpList = () => {

  const [allemployee, setAllEmployee] = useState([]);
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
        address: item.data.address,
        status: item.data.employeeStatus,
      }));

      setAllEmployee(employees);

      console.log(employees);
    } catch (error) {
      console.log(error.response?.data || error);
    }
  };

  useEffect(() => {
    getAllEmployee();
  }, []);

  return (
    <MainPanel>
      <div className="emp-list">
        <div className="page-header">
          <h2>Employees</h2>

          <Link to="/addEmployee">
            <span>
              {" "}
              <FaPlus />
            </span>{" "}
            Add Employee
          </Link>
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
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
        />
      </div>
    </MainPanel>
  );
};

export default EmpList;
