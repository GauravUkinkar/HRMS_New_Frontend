import React from "react";
import "./SalaryManagement.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import { FaPlus } from "react-icons/fa6";
import Table_Comp from "../../comp/table/Table";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useEffect, useState } from "react";
import axios from "axios";

const SalaryManagement = () => {
  const [salarydata, setSalaryData] = useState([]);
  const [loader, setLoader] = useState(false);


  const BASE_URL = import.meta.env.VITE_SALARY_BACKEND_URL;


  const columns = [
    {
      key: "employeeName",
      dataIndex: "employeeName",
      title: "Employee Name",
      search: true,
      fixed: "left",
    },

    {
      key: "employeeId",
      dataIndex: "employeeId",
      title: "Employee Id",
      search: true,
    },

    {
      key: "month",
      dataIndex: "month",
      title: "Month",
    },

    {
      key: "year",
      dataIndex: "year",
      title: "Year",
    },

    {
      key: "grossSalary",
      dataIndex: "grossSalary",
      title: "Gross Salary",
    },

    {
      key: "totalWorkingDays",
      dataIndex: "totalWorkingDays",
      title: "Total Working Days",
    },

    {
      key: "presentDay",
      dataIndex: "presentDay",
      title: "Present Days",
    },

    {
      key: "absentDays",
      dataIndex: "absentDays",
      title: "Absent Days",
    },

    {
      key: "lop",
      dataIndex: "lop",
      title: "Loss of Pay",
    },

    {
      key: "da",
      dataIndex: "da",
      title: "Dearness Allowance",
    },

    {
      key: "employeePf",
      dataIndex: "employeePf",
      title: "Employee PF",
    },

    {
      key: "employerPf",
      dataIndex: "employerPf",
      title: "Employer PF",
    },

    {
      key: "employeeEsic",
      dataIndex: "employeeEsic",
      title: "Employee ESIC",
    },

    {
      key: "salaryAdvance",
      dataIndex: "salaryAdvance",
      title: "Advance Salary",
    },

    {
      key: "otherDeduction",
      dataIndex: "otherDeduction",
      title: "Other Deduction",
    },

    {
      key: "otherAllowance",
      dataIndex: "otherAllowance",
      title: "Other Allowance",
    },

    {
      key: "professionalTax",
      dataIndex: "professionalTax",
      title: "Professional Tax",
    },

    {
      key: "insuranceCorporation",
      dataIndex: "insuranceCorporation",
      title: "Insurance Corporation",
    },

    {
      key: "netSalary",
      dataIndex: "netSalary",
      title: "Net Salary",
    },

    {
      key: "action",
      dataIndex: "action",
      title: "Action",
      fixed: "right",

      render: (_, record) => (
        <div className="table-actions">
          <span>
            <RiDeleteBin6Line />
          </span>

          <span>
            <CiEdit />
          </span>
        </div>
      ),
    },
  ];
  const getSalary = async () => {
    try {
      setLoader(true);
      const res = await axios.get(
        `${BASE_URL}admin/getAllNewSalaries`,
        {
          withCredentials: true,
        }
      );

      console.log(res.data, "lkdfjkldfjskjdfs");

      const salaryRecords = res.data
        .map((item) => item.data)
        .filter(Boolean);
      console.log("Table Data:", salaryRecords)
      setSalaryData(salaryRecords);
    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("ERROR:", error.response?.data);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    getSalary();
  }, []);
  return (
    <>
      <MainPanel>
        <div className="salarymanagement-parent">
          <h1>Salary Management</h1>
          <button className="btn">
            <FaPlus />
            Add Salary
          </button>
        </div>
        <Table_Comp columns={columns} data={salarydata} xscroll={3000} />
      </MainPanel>
    </>
  );
};

export default SalaryManagement;
