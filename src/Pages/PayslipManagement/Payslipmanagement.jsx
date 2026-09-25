import React, { useEffect, useState, useContext } from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import "./Payslipmanagement.scss";
import { DatePicker, Table } from "antd";
import axios from "axios";
import { UserContext } from "../../../Context";
import { IoEyeOutline } from "react-icons/io5";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";


const Payslipmanagement = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

const employeeId = user?.employeeId;
  const [allemployee, setAllEmployee] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_SALARY_BACKEND_URL;
useEffect(() => {
  if (!employeeId) return;

  const currentDate = new Date();

  const month = currentDate.toLocaleString("en-US", {
    month: "long",
  });

  const year = currentDate.getFullYear().toString();

  getPayslip(month, year);
}, [employeeId]);
const getPayslip = async (month, year) => {
  try {
    if (!employeeId) {
      console.error("Employee ID not found");
      return;
    }

    setLoading(true);

    const response = await axios.get(
      `${BASE_URL}AuthController/getByMonthYearAndEmployeeId`,
      {
        params: {
          month,
          employeeId,
          year,
        },
        withCredentials: true,
      }
    );

    console.log("Payslip API Response:", response.data);

    const salaryData = response?.data?.[0]?.data;

    console.log("Salary Data:", salaryData);

    if (salaryData) {
      setAllEmployee([salaryData]);
    } else {
      setAllEmployee([
        {
          sid: "no-salary",
          employeeId,
          employeeName: user?.employeeName || "-",
          month,
          year,
          noSalaryData: true,
        },
      ]);
    }
  } catch (error) {
    console.error("Payslip API Error:", error);
    setAllEmployee([
          {  sid: "no-salary",
      employeeId,
      employeeName: user?.employeeName || "-",
      month,
      year,
      noSalaryData: true,
          },
    ]);
  } finally {
    setLoading(false);
  }
};


  const formatAmount = (value) => {
    const amount = Number(value || 0);

    return amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const columns = [
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
      fixed: "left",
      render: (text) => <strong>{text || "-"}</strong>,
    },

    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
      fixed: "left",
    },

    {
      title: "Month",
      key: "month",
      render: (_, record) => (
        <span>
          {record.month} {record.year}
        </span>
      ),
    },

    {
      title: "Gross Salary",
      dataIndex: "grossSalary",
      key: "grossSalary",
      render: (value) => `₹ ${formatAmount(value)}`,
    },

    {
      title: "Basic Salary",
      dataIndex: "basicSalary",
      key: "basicSalary",
      render: (value) => `₹ ${formatAmount(value)}`,
    },

    {
      title: "DA",
      dataIndex: "da",
      key: "da",
      render: (value) => `₹ ${formatAmount(value)}`,
    },

    {
      title: "HRA",
      dataIndex: "hra",
      key: "hra",
      render: (value) => `₹ ${formatAmount(value)}`,
    },

    {
      title: "Other Allowance",
      dataIndex: "otherAllowance",
      key: "otherAllowance",
      render: (value) => `₹ ${formatAmount(value)}`,
    },

    {
      title: "Employee PF",
      dataIndex: "employeePf",
      key: "employeePf",
      render: (value) => `₹ ${formatAmount(value)}`,
    },

    {
      title: "Employee ESIC",
      dataIndex: "employeeEsic",
      key: "employeeEsic",
      render: (value) => `₹ ${formatAmount(value)}`,
    },

    {
      title: "Professional Tax",
      dataIndex: "professionalTax",
      key: "professionalTax",
      render: (value) => `₹ ${formatAmount(value)}`,
    },

    {
      title: "Salary Advance",
      dataIndex: "salaryAdvance",
      key: "salaryAdvance",
      render: (value) => `₹ ${formatAmount(value)}`,
    },

    {
      title: "LOP",
      dataIndex: "lop",
      key: "lop",
      render: (value) => `₹ ${formatAmount(value)}`,
    },

    {
      title: "Total Deduction",
      dataIndex: "totalDiduction",
      key: "totalDiduction",
      render: (value, record) => {
        const total =
          Number(record.employeePf || 0) +
          Number(record.employeeEsic || 0) +
          Number(record.professionalTax || 0) +
          Number(record.salaryAdvance || 0) +
          Number(record.lop || 0) +
          Number(record.otherDiduction || 0) +
          Number(record.insuranceCorporation || 0);

        return `₹ ${formatAmount(total)}`;
      },
    },

    {
      title: "Net Salary",
      dataIndex: "netSalary",
      key: "netSalary",
      render: (value) => (
        <strong className="net-salary">₹ {formatAmount(value)}</strong>
      ),
    },

    {
      title: "Present Days",
      dataIndex: "presentDay",
      key: "presentDay",
    },

    {
      title: "Working Days",
      dataIndex: "totalWorkingDay",
      key: "totalWorkingDay",
    },

    {
      title: "Absent Days",
      dataIndex: "absentDays",
      key: "absentDays",
    },

    {
      title: "Pay Date",
      dataIndex: "paydate",
      key: "paydate",
      render: (value, record) => (
        <span>
          {value} {record.month} {record.year}
        </span>
      ),
    },

    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
    },

    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },

    {
      title: "PAN",
      dataIndex: "panNumber",
      key: "panNumber",
    },

    {
      title: "UAN",
      dataIndex: "uanNo",
      key: "uanNo",
    },
{
  title: "Action",
  key: "action",
  fixed: "right",
  width: 80,
  align: "center",
  className: "action-column",
  render: (_, record) => {
    const disabled = record.noSalaryData;

    return (
      <button
        type="button"
        className={`view-btn ${disabled ? "disabled" : ""}`}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            navigate("/Payslip", {
              state:{
                payslip:record,
              },
            });
          }
        }}
      >
        <IoEyeOutline size={20} />
      </button>
    );
  },
},
  ];

  return (
    <MainPanel
      breadcrumbs={[
        { label: "Dashboard", link: "/dashboard" },
        { label: "PayslipManagement" },
      ]}
              title={
          String(user?.role || user?.crmRole || "")
            .trim()
            .toUpperCase() === "EMPLOYEE"
            ? "Employee Dashboard"
            : "Admin Dashboard"
        }
    >
              <Link to="/">
              <button className="btn1"><IoMdArrowBack />Back</button></Link>
      <div className="payslip-list">
        <div className="page-header">
          <h2>Salary Slip</h2>

         

<DatePicker
  picker="month"
  format="MMMM YYYY"
  placeholder="Select Month & Year"
  defaultValue={dayjs()}

  onChange={(date) => {
    if (!date) {
      setAllEmployee([]);
      return;
    }

    const month = date.format("MMMM");
    const year = date.format("YYYY");

    getPayslip(month, year);
  }}
/>
         
        </div>

        <Table
          columns={columns}
          dataSource={allemployee}
          rowKey={(record) => record.sid}
          loading={loading}
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

export default Payslipmanagement;
