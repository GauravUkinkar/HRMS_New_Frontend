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
      key: "Employee Id",
      dataIndex: "Employee Id",
      title: "Employee Id",
      search: true,
    },
    {
      key: "Month",
      dataIndex: "Month",
      title: "Month",
    },
    {
      key: "Year",
      dataIndex: "Year",
      title: "Year",
    },
    {
      key: "Gross Salary",
      dataIndex: "Gross Salary",
      title: "Gross Salary",
    },
    {
      key: "Total Working Days",
      dataIndex: "Total Working Days",
      title: "Total Working Days",
    },
    {
      key: "Present Days",
      dataIndex: "Present Days",
      title: "Present Days",
    },
    {
      key: "Absent Days",
      dataIndex: "Absent Days",
      title: "Absent Days",
    },
    {
      key: "Loss of Pay",
      dataIndex: "Loss of Pay",
      title: "Loss of Pay",
    },
    {
      key: "Dearness Allowance",
      dataIndex: "Dearness Allowance",
      title: "Dearness Allowance",
    },
    {
      key: "Employee PF",
      dataIndex: "Employee PF",
      title: "Employee PF",
    },
    {
      key: "Employer PF",
      dataIndex: "Employer PF",
      title: "Employer PF",
    },
    {
      key: "Employee ESIC",
      dataIndex: "Employee ESIC",
      title: "Employee ESIC",
    },
    {
      key: "Advance Salary",
      dataIndex: "Advance Salary",
      title: "Advance Salary",
    },
    {
      key: "Other Deduction",
      dataIndex: "Other Deduction",
      title: "Other Deduction",
    },
    {
      key: "Other Allowance",
      dataIndex: "Other Allowance",
      title: "Other Allowance",
    },
    {
      key: "Professional Tax",
      dataIndex: "Professional Tax",
      title: "Professional Tax",
    },
    {
      key: "Insurance Corporation",
      dataIndex: "Insurance Corporation",
      title: "Insurance Corporation",
    },
    {
      key: "Net Salary",
      dataIndex: "Net Salary",
      title: "Net Salary",
    },

    {
      key: "Action",
      dataIndex: "Action",
      title: "Action",
      fixed: "right",
      render: () => (
        <div>
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
      const res = await axios.get(`${BASE_URL}admin/getAllNewSalaries`, {
        withCredentials: true,
      });
      console.log(res.data, "sdklfjklsdfkldfskljkfdsl");
      setSalaryData(res.data.map(item => item.data));
    } catch (error) {
      console.log(error);
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
