import React, { useEffect, useState } from "react";
import "./SalaryManagement.scss";

import MainPanel from "../../comp/MainPanel/MainPanel";

import { Table, Avatar, Space } from "antd";

import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { FaPlus } from "react-icons/fa6";

import axios from "axios";

const SalaryManagement = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [loader, setLoader] = useState(false);

  const BASE_URL = import.meta.env.VITE_SALARY_BACKEND_URL;

  // ==========================================
  // GET ALL SALARIES
  // ==========================================

  const getSalary = async () => {
    try {
      setLoader(true);

      const res = await axios.get(
        `${BASE_URL}admin/getAllNewSalaries`,
        {
          withCredentials: true,
        }
      );

      console.log("Salary API Response:", res.data);

      const salaryRecords = res.data
        .map((item, index) => {
          if (!item?.data) return null;

          return {
            key: item.data.sid || index + 1,

            employeeName: item.data.employeeName || "N/A",
            employeeId: item.data.employeeId || "N/A",

            month: item.data.month || "N/A",
            year: item.data.year || "N/A",

            grossSalary: item.data.grossSalary ?? 0,

            totalWorkingDays:
              item.data.totalWorkingDays ?? 0,

            presentDay:
              item.data.presentDay ?? 0,

            absentDays:
              item.data.absentDays ?? 0,

            lop:
              item.data.lop ?? 0,

            da:
              item.data.da ?? 0,

            employeePf:
              item.data.employeePf ?? 0,

            employerPf:
              item.data.employerPf ?? 0,

            employeeEsic:
              item.data.employeeEsic ?? 0,

            salaryAdvance:
              item.data.salaryAdvance ?? 0,

            otherDeduction:
              item.data.otherDeduction ?? 0,

            otherAllowance:
              item.data.otherAllowance ?? 0,

            professionalTax:
              item.data.professionalTax ?? 0,

            insuranceCorporation:
              item.data.insuranceCorporation ?? 0,

            netSalary:
              item.data.netSalary ?? 0,
          };
        })
        .filter(Boolean);

      console.log("Formatted Salary Data:", salaryRecords);

      setSalaryData(salaryRecords);

    } catch (error) {
      console.log(
        "STATUS:",
        error.response?.status
      );

      console.log(
        "ERROR:",
        error.response?.data
      );

    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getSalary();
  }, []);

  // ==========================================
  // TABLE COLUMNS
  // ==========================================

  const columns = [
    {
      title: (
        <>
          Employee Name <SearchOutlined />
        </>
      ),
      dataIndex: "employeeName",
      key: "employeeName",
      width: 220,
      fixed: "left",

      render: (name) => {
        const employeeName = name || "N/A";

        const nameParts = employeeName
          .trim()
          .split(" ");

        const initials =
          nameParts.length > 1
            ? `${nameParts[0][0]}${
                nameParts[nameParts.length - 1][0]
              }`
            : nameParts[0]?.[0] || "?";

        return (
          <Space>
            <Avatar className="avatar">
              {initials.toUpperCase()}
            </Avatar>

            <span>{employeeName}</span>
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
      dataIndex: "employeeId",
      key: "employeeId",
      width: 160,
    },

    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      width: 130,
    },

    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      width: 100,
    },

    {
      title: "Gross Salary",
      dataIndex: "grossSalary",
      key: "grossSalary",
      width: 150,

      render: (value) =>
        `₹ ${Number(value).toLocaleString("en-IN")}`,
    },

    {
      title: "Total Working Days",
      dataIndex: "totalWorkingDays",
      key: "totalWorkingDays",
      width: 180,
    },

    {
      title: "Present Days",
      dataIndex: "presentDay",
      key: "presentDay",
      width: 150,
    },

    {
      title: "Absent Days",
      dataIndex: "absentDays",
      key: "absentDays",
      width: 150,
    },

    {
      title: "Loss of Pay",
      dataIndex: "lop",
      key: "lop",
      width: 140,

      render: (value) =>
        `₹ ${Number(value).toLocaleString("en-IN")}`,
    },

    {
      title: "Dearness Allowance",
      dataIndex: "da",
      key: "da",
      width: 180,

      render: (value) =>
        `₹ ${Number(value).toLocaleString("en-IN")}`,
    },

    {
      title: "Employee PF",
      dataIndex: "employeePf",
      key: "employeePf",
      width: 150,

      render: (value) =>
        `₹ ${Number(value).toLocaleString("en-IN")}`,
    },

    {
      title: "Employer PF",
      dataIndex: "employerPf",
      key: "employerPf",
      width: 150,

      render: (value) =>
        `₹ ${Number(value).toLocaleString("en-IN")}`,
    },

    {
      title: "Employee ESIC",
      dataIndex: "employeeEsic",
      key: "employeeEsic",
      width: 160,

      render: (value) =>
        `₹ ${Number(value).toLocaleString("en-IN")}`,
    },

    {
      title: "Advance Salary",
      dataIndex: "salaryAdvance",
      key: "salaryAdvance",
      width: 170,

      render: (value) =>
        `₹ ${Number(value).toLocaleString("en-IN")}`,
    },

    {
      title: "Other Deduction",
      dataIndex: "otherDeduction",
      key: "otherDeduction",
      width: 170,

      render: (value) =>
        `₹ ${Number(value).toLocaleString("en-IN")}`,
    },

    {
      title: "Other Allowance",
      dataIndex: "otherAllowance",
      key: "otherAllowance",
      width: 170,

      render: (value) =>
        `₹ ${Number(value).toLocaleString("en-IN")}`,
    },

    {
      title: "Professional Tax",
      dataIndex: "professionalTax",
      key: "professionalTax",
      width: 170,

      render: (value) =>
        `₹ ${Number(value).toLocaleString("en-IN")}`,
    },

    {
      title: "Insurance Corporation",
      dataIndex: "insuranceCorporation",
      key: "insuranceCorporation",
      width: 200,

      render: (value) =>
        `₹ ${Number(value).toLocaleString("en-IN")}`,
    },

    {
      title: "Net Salary",
      dataIndex: "netSalary",
      key: "netSalary",
      width: 150,

      render: (value) => (
        <strong>
          ₹ {Number(value).toLocaleString("en-IN")}
        </strong>
      ),
    },

    // ==========================================
    // ACTIONS
    // ==========================================

    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right",

      render: (_, record) => (
        <Space size="middle">

          <EditOutlined
            className="edit"
            onClick={() => {
              console.log(
                "Edit Salary:",
                record
              );
            }}
          />

          <DeleteOutlined
            className="delete"
            onClick={() => {
              console.log(
                "Delete Salary:",
                record
              );
            }}
          />

        </Space>
      ),
    },
  ];

  // ==========================================
  // JSX
  // ==========================================

  return (
    <MainPanel>

      <div className="salary-management">

        {/* HEADER */}

        <div className="page-header">

          <h2>Salary Management</h2>

          <button className="add-salary-btn">
            <FaPlus />
            Add Salary
          </button>

        </div>

        {/* TABLE */}

        <Table
          columns={columns}
          dataSource={salaryData}
          bordered
          loading={loader}
          scroll={{ x: "max-content" }}

          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: [
              "5",
              "10",
              "20",
              "50",
            ],
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

export default SalaryManagement;