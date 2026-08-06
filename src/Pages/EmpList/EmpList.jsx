import React from "react";
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

const dataSource = [
  {
    key: 1,
    name: "John Smith",
    empId: "#FG2354",
    department: "Development",
    designation: "Frontend Developer",
    phone: "+91 9876543210",
    dob: "15 Mar 1990",
    address: "123, ABC Street, Mumbai",
    email: "john.smith@example.com",
    location: "Mumbai",
    joining: "12 Jan 2023",
    salary: "$4500",
    status: "Active",
  },
  {
    key: 2,
    name: "Sarah Johnson",
    empId: "#FG2355",
    department: "Human Resources",
    designation: "HR Manager",
    phone: "+91 9123456780",
    dob: "22 Jul 1985",
    address: "456, XYZ Avenue, Delhi",
    email: "sarah@example.com",
    location: "Delhi",
    joining: "20 Feb 2022",
    salary: "$5200",
    status: "Active",
  },
  {
    key: 3,
    name: "Michael Brown",
    empId: "#FG2356",
    department: "Finance",
    designation: "Accountant",
    phone: "+91 9988776655",
    dob: "05 Nov 1988",
    address: "789, PQR Lane, Pune",
    email: "michael@example.com",
    location: "Pune",
    joining: "10 Mar 2021",
    salary: "$4000",
    status: "Active",
  },
  {
    key: 4,
    name: "Emily Davis",
    empId: "#FG2357",
    department: "Marketing",
    designation: "Marketing Lead",
    phone: "+91 9000011111",
    dob: "30 Jan 1992",
    address: "321, LMN Road, Bangalore",
    email: "emily@example.com",
    location: "Bangalore",
    joining: "15 Jun 2022",
    salary: "$4800",
    status: "Active",
  },
  {
    key: 5,
    name: "David Wilson",
    empId: "#FG2358",
    department: "Sales",
    designation: "Sales Executive",
    phone: "+91 9555566666",
    dob: "18 Sep 1987",
    address: "654, STU Street, Hyderabad",
    email: "david@example.com",
    location: "Hyderabad",
    joining: "05 Sep 2023",
    salary: "$3800",
    status: "Active",
  },
];

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
    render: (_, record) => (
      <Space>
        <Avatar className="avatar">
          {record.name
            .split(" ")
            .map((x) => x[0])
            .join("")}
        </Avatar>
        {record.name}
      </Space>
    ),
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
    width: 150,
  },

  {
    title: "Status",
    dataIndex: "status",
    width: 120,
    fixed: "right",
    render: (status) => <Tag color="success">{status}</Tag>,
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
          dataSource={dataSource}
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
