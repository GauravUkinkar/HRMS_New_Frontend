import React, { useEffect, useState } from "react";
import "./SalaryManagement.scss";

import MainPanel from "../../comp/MainPanel/MainPanel";

import { Avatar, Space, Table } from "antd";

import { FaEye } from "react-icons/fa";

import {
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { FaPlus } from "react-icons/fa6";

import axios from "axios";
import SelectInput from "../../comp/selectInput/SelectInput";
import { MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SalaryManagement = () => {
   const navigate = useNavigate();
  const [salaryData, setSalaryData] = useState([]);
  const [loader, setLoader] = useState(false);

  // ==========================================
  // FILTER STATES
  // ==========================================

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const BASE_URL = import.meta.env.VITE_SALARY_BACKEND_URL;

  // ==========================================
  // MONTHS
  // ==========================================

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // ==========================================
  // YEARS
  // ==========================================

  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: 10 },
    (_, index) => currentYear - index
  );


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

            totalWorkingDay:
              item.data.totalWorkingDay ?? 0,

            presentDay:
              item.data.presentDay ?? 0,

            absentDays:
              item.data.absentDays ?? 0,

            lop: item.data.lop ?? 0,

            da: item.data.da ?? 0,

            employeePf:
              item.data.employeePf ?? 0,

            employerPf:
              item.data.employerPf ?? 0,

            employeeEsic:
              item.data.employeeEsic ?? 0,

            salaryAdvance:
              item.data.salaryAdvance ?? 0,

            otherDiduction:
              item.data.otherDiduction ?? 0,

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

      console.log(
        "Formatted Salary Data:",
        salaryRecords
      );

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
  const deleteSalary = async (record) => {
    try{
      console.log("Deleting Salary:", record);

      const response = await axios.delete(
        `${BASE_URL}admin/deleteNewSalary`,
        {
          params: {
            sId:record.key,
          },
          withCredentials:true,
        }
      );
      console.log("Deleye Salary Response:",response.data);

      toast.success(
        response.data?.responseMessage ||
        "Salary Deleted Successfully!"
      );
      getSalary();
    } catch(err){
      console.error("DELETE SALARY ERROR:",err);
      console.error("Status:",err.response?.status);
      console.error("Response:",err.response?.data);

      toast.error(
        err.response?.data?.responseMessage||
        "Unable to delete salary"

      );
    }
  };


  useEffect(() => {
    getSalary();
  }, []);



  const filteredSalaryData = salaryData.filter(
    (salary) => {
      const monthMatch =
        !selectedMonth ||
        String(salary.month)
          .trim()
          .toLowerCase() ===
          selectedMonth
            .trim()
            .toLowerCase();

      const yearMatch =
        !selectedYear ||
        String(salary.year).trim() ===
          String(selectedYear).trim();

      return monthMatch && yearMatch;
    }
  );



  const clearFilters = () => {
    setSelectedMonth("");
    setSelectedYear("");
  };



  const columns = [
    {
      title: "Employee Name",
      search: true,
      dataIndex: "employeeName",
      key: "employeeName",
      width: 220,
      fixed: "left",

      render: (name) => {
        const employeeName = name || "N/A";

        const nameParts =
          employeeName.trim().split(" ");

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
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
      width: 160,
      search: true,
    },

    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      width: 130,
      search: true,
    },

    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      width: 100,
      search: true,
    },

    {
      title: "Gross Salary",
      dataIndex: "grossSalary",
      key: "grossSalary",
      width: 150,

      render: (value) =>
        `₹ ${Number(value).toLocaleString(
          "en-IN"
        )}`,
    },

    {
      title: "Total Working Days",
      dataIndex: "totalWorkingDay",
      key: "totalWorkingDay",
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
        `₹ ${Number(value).toLocaleString(
          "en-IN"
        )}`,
    },

    {
      title: "Dearness Allowance",
      dataIndex: "da",
      key: "da",
      width: 180,

      render: (value) =>
        `₹ ${Number(value).toLocaleString(
          "en-IN"
        )}`,
    },

    {
      title: "Employee PF",
      dataIndex: "employeePf",
      key: "employeePf",
      width: 150,

      render: (value) =>
        `₹ ${Number(value).toLocaleString(
          "en-IN"
        )}`,
    },

    {
      title: "Employer PF",
      dataIndex: "employerPf",
      key: "employerPf",
      width: 150,

      render: (value) =>
        `₹ ${Number(value).toLocaleString(
          "en-IN"
        )}`,
    },

    {
      title: "Employee ESIC",
      dataIndex: "employeeEsic",
      key: "employeeEsic",
      width: 160,

      render: (value) =>
        `₹ ${Number(value).toLocaleString(
          "en-IN"
        )}`,
    },

    {
      title: "Advance Salary",
      dataIndex: "salaryAdvance",
      key: "salaryAdvance",
      width: 170,

      render: (value) =>
        `₹ ${Number(value).toLocaleString(
          "en-IN"
        )}`,
    },

    {
      title: "Other Deduction",
      dataIndex: "otherDiduction",
      key: "otherDiduction",
      width: 170,

      render: (value) =>
        `₹ ${Number(value).toLocaleString(
          "en-IN"
        )}`,
    },

    {
      title: "Other Allowance",
      dataIndex: "otherAllowance",
      key: "otherAllowance",
      width: 170,

      render: (value) =>
        `₹ ${Number(value).toLocaleString(
          "en-IN"
        )}`,
    },

    {
      title: "Professional Tax",
      dataIndex: "professionalTax",
      key: "professionalTax",
      width: 170,

      render: (value) =>
        `₹ ${Number(value).toLocaleString(
          "en-IN"
        )}`,
    },

    {
      title: "Insurance Corporation",
      dataIndex: "insuranceCorporation",
      key: "insuranceCorporation",
      width: 200,

      render: (value) =>
        `₹ ${Number(value).toLocaleString(
          "en-IN"
        )}`,
    },

    {
      title: "Net Salary",
      dataIndex: "netSalary",
      key: "netSalary",
      width: 150,

      render: (value) => (
        <strong>
          ₹{" "}
          {Number(value).toLocaleString(
            "en-IN"
          )}
        </strong>
      ),
    },



    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right",

      render: (_, record) => (
        <Space size="middle">
                 <FaEye
            className="viewsalary"
            onClick={() => {
              console.log(
                "View Salary:",
                record
              );
            }}
          />
          <EditOutlined
            className="edit"
            onClick={() => {
                console.log("FULL RECORD:", record);
              navigate(`/editSalary/${record.key}`);
              console.log(
                "Edit Salary:",
                record
              );
            }}
          />

          <DeleteOutlined
            className="delete"
            onClick={() => {
              deleteSalary(record)
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



  return (
    <MainPanel>
      <div className="salary-management">



        <div className="page-header">

          <h2>Salary Management</h2>

          <div className="rightside">

            {/* MONTH */}

            <SelectInput
              label="Month"
              name="month"
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(
                  e.target.value
                )
              }
            >
              {months.map((month) => (
                <MenuItem
                  key={month}
                  value={month}
                >
                  {month}
                </MenuItem>
              ))}
            </SelectInput>

     

            <SelectInput
              label="Year"
              name="year"
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(
                  e.target.value
                )
              }
            >
              {years.map((year) => (
                <MenuItem
                  key={year}
                  value={year}
                >
                  {year}
                </MenuItem>
              ))}
            </SelectInput>

     

            {(selectedMonth ||
              selectedYear) && (
              <button
                type="button"
                className="clear-filter-btn"
                onClick={clearFilters}
              >
                Clear
              </button>
            )}

      

            <button
              type="button"
              className="add-salary-btn"
              onClick={() => navigate("/addSalary")}
        
              
            >
              <FaPlus />
              Add Salary
            </button>

          </div>
        </div>



        <Table
          columns={columns}
          dataSource={filteredSalaryData}
          bordered
          loading={loader}
          scroll={{
            x: "max-content",
          }}
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