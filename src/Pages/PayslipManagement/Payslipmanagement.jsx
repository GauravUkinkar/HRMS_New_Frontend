import React, { useEffect, useState } from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import "./Payslipmanagement.scss";
import { DatePicker, Table, Tag } from "antd";
import axios from "axios";

const Payslipmanagement = () => {
  const [allemployee, setAllEmployee] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const [employeeId, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const getAllEmployees = async () =>{
      try{
        const response = await axios.get(
          `${import.meta.env.VITE_USER_BACKEND_URL}Admin/GetAllEmployee`,
          {
            withCredentials:true,
          }
        );

        console.log("Employee API:", response.data);

        setEmployees(response?.data?.data || []);
      } catch (error) {
        console.error("Employee API Error:", error);
      }
    };
    getAllEmployees();

  }, []);


  const BASE_URL = import.meta.env.VITE_SALARY_BACKEND_URL;

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
  ];

  // Uncomment and modify when you have the API endpoint
  /*
  useEffect(() => {
    const getAllPayslips = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${BASE_URL}admin/getAllNewSalaries`,
          {
            withCredentials: true,
          }
        );

        setAllEmployee(response.data || []);
      } catch (error) {
        console.error("Payslip API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllPayslips();
  }, []);
  */

  return (
    <MainPanel
      breadcrumbs={[
        { label: "Dashboard", link: "/dashboard" },
        { label: "PayslipManagement" },
      ]}
    >
      <div className="payslip-list">
        <div className="page-header">
          <h2>Salary Slip</h2>

         

<DatePicker
  picker="month"
  format="MMMM YYYY"
  placeholder="Select Month & Year"

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
