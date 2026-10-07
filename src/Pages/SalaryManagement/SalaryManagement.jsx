import React, { useContext, useEffect, useState } from "react";
import "./SalaryManagement.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import { Avatar, Space, Table, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FaEye } from "react-icons/fa";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import SelectInput from "../../comp/selectInput/SelectInput";
import { MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../../../Context";

const SalaryManagement = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [salaryData, setSalaryData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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

  const years = Array.from({ length: 10 }, (_, index) => currentYear - index);

  // ==========================================
  // GET SALARY
  // ==========================================

  const getSalary = async () => {
    try {
      setLoader(true);

      const res = await axios.get(`${BASE_URL}admin/getAllNewSalaries`, {
        withCredentials: true,
      });

      console.log("Salary API Response:", res.data);

      const salaryRecords = res.data
        .map((item, index) => {
          if (!item?.data) return null;

          /*
           * IMPORTANT:
           * Keep ALL fields returned by the API.
           *
           * Earlier we were manually selecting only some
           * fields, so companyName, basicSalary, HRA,
           * bank details, PAN, UAN etc. were getting lost.
           */

          return {
            ...item.data,

            key: item.data.sid || index + 1,

            // Employee information
            employeeName: item.data.employeeName || "N/A",

            employeeId: item.data.employeeId || "N/A",

            // Company
            companyName:
              item.data.companyName ||
              item.data.company ||
              item.data.company_name ||
              "",

            // Salary period
            month: item.data.month || "N/A",

            year: item.data.year || "N/A",

            // Earnings
            grossSalary: item.data.grossSalary ?? 0,

            basicSalary: item.data.basicSalary ?? 0,

            da: item.data.da ?? 0,

            hra: item.data.hra ?? 0,

            otherAllowance: item.data.otherAllowance ?? 0,

            // Attendance
            totalWorkingDay: item.data.totalWorkingDay ?? 0,

            presentDay: item.data.presentDay ?? 0,

            absentDays: item.data.absentDays ?? 0,

            lop: item.data.lop ?? 0,

            // Deductions
            employeePf: item.data.employeePf ?? 0,

            employerPf: item.data.employerPf ?? 0,

            employeeEsic: item.data.employeeEsic ?? 0,

            salaryAdvance: item.data.salaryAdvance ?? 0,

            otherDiduction: item.data.otherDiduction ?? 0,

            professionalTax: item.data.professionalTax ?? 0,

            insuranceCorporation: item.data.insuranceCorporation ?? 0,

            // Net salary
            netSalary: item.data.netSalary ?? 0,

            // Employee personal/payment information
            paydate: item.data.paydate ?? item.data.payDate ?? "",

            bankName: item.data.bankName ?? "",

            accountNumber: item.data.accountNumber ?? item.data.accountNo ?? "",

            panNumber: item.data.panNumber ?? item.data.panNo ?? "",

            uanNo: item.data.uanNo ?? item.data.uanNumber ?? "",
          };
        })
        .filter(Boolean);

      console.log("Formatted Salary Data:", salaryRecords);

      setSalaryData(salaryRecords);
    } catch (error) {
      console.log("STATUS:", error.response?.status);

      console.log("ERROR:", error.response?.data);

      toast.error(
        error.response?.data?.responseMessage || "Unable to fetch salary data",
      );
    } finally {
      setLoader(false);
    }
  };

  // ==========================================
  // VIEW PAYSLIP
  // ==========================================

  // ==========================================
  // VIEW PAYSLIP
  // ==========================================

  const handleViewPayslip = async (record) => {
    try {
      setLoader(true);

      console.log("SELECTED SALARY RECORD:", record);

      const employeeId = record?.employeeId;
      const year = record?.year;
      const selectedMonth = record?.month;

      if (!employeeId || !year) {
        toast.error("Employee ID or Year is missing");
        return;
      }

      // =========================================================
      // GET COMPLETE PAYSLIP DATA FROM API
      // =========================================================

      const response = await axios.get(
        `${BASE_URL}admin/getByYearAndEmployeeId`,
        {
          params: {
            year: year,
            employeeId: employeeId,
          },
          withCredentials: true,
        },
      );

      console.log("RAW PAYSLIP API RESPONSE:", response.data);

      // =========================================================
      // SUPPORT BOTH POSSIBLE API RESPONSE FORMATS
      //
      // Format 1:
      // [
      //   {
      //     status: "OK",
      //     data: { ... }
      //   }
      // ]
      //
      // Format 2:
      // {
      //   status: "OK",
      //   data: { ... }
      // }
      // =========================================================

      const salaryList = Array.isArray(response.data)
        ? response.data
        : response.data?.data
          ? [response.data]
          : [];

      if (salaryList.length === 0) {
        toast.error("Payslip data not found");
        return;
      }

      // =========================================================
      // FIND THE EXACT EMPLOYEE + YEAR + MONTH RECORD
      // =========================================================

      const matchingSalary =
        salaryList.find((item) => {
          const data = item?.data;

          return (
            String(data?.employeeId || "").trim() ===
            String(employeeId).trim() &&
            String(data?.year || "").trim() === String(year).trim() &&
            String(data?.month || "")
              .trim()
              .toLowerCase() ===
            String(selectedMonth || "")
              .trim()
              .toLowerCase()
          );
        }) ||
        salaryList.find((item) => {
          const data = item?.data;

          return (
            String(data?.employeeId || "").trim() === String(employeeId).trim()
          );
        }) ||
        salaryList[0];

      const apiPayslip = matchingSalary?.data;

      if (!apiPayslip) {
        toast.error("Payslip data not found");
        return;
      }

      // =========================================================
      // IMPORTANT:
      // Do NOT allow empty values from one object to overwrite
      // valid values from the other object.
      // =========================================================

      const firstNonEmpty = (...values) => {
        return values.find(
          (value) =>
            value !== undefined &&
            value !== null &&
            String(value).trim() !== "",
        );
      };

      const payslipData = {
        // Keep every field returned by the API
        ...record,
        ...apiPayslip,

        // Employee
        employeeName: firstNonEmpty(
          apiPayslip.employeeName,
          record.employeeName,
          "",
        ),

        employeeId: firstNonEmpty(
          apiPayslip.employeeId,
          record.employeeId,
          employeeId,
        ),

        // Salary period
        month: firstNonEmpty(apiPayslip.month, record.month, selectedMonth, ""),

        year: firstNonEmpty(apiPayslip.year, record.year, year, ""),

        // Company
        // Your API response currently returns companyName: null,
        // so use the salary record if available and finally the
        // actual company configured in this payslip module.
        companyName: firstNonEmpty(
          apiPayslip.companyName,
          apiPayslip.company,
          apiPayslip.company_name,
          record.companyName,
          record.company,
          record.company_name,
          "Pandoza Solutions Pvt Ltd",
        ),

        // Payment / employee details
        paydate: firstNonEmpty(
          apiPayslip.paydate,
          apiPayslip.payDate,
          record.paydate,
          record.payDate,
          "",
        ),

        bankName: firstNonEmpty(apiPayslip.bankName, record.bankName, ""),

        accountNumber: firstNonEmpty(
          apiPayslip.accountNumber,
          apiPayslip.accountNo,
          record.accountNumber,
          record.accountNo,
          "",
        ),

        // THIS FIXES YOUR PAN NUMBER ISSUE
        panNumber: firstNonEmpty(
          apiPayslip.panNumber,
          apiPayslip.panNo,
          apiPayslip.pan,
          record.panNumber,
          record.panNo,
          record.pan,
          "",
        ),

        uanNo: firstNonEmpty(
          apiPayslip.uanNo,
          apiPayslip.uanNumber,
          record.uanNo,
          record.uanNumber,
          "",
        ),

        // Attendance
        totalWorkingDay: firstNonEmpty(
          apiPayslip.totalWorkingDay,
          record.totalWorkingDay,
          0,
        ),

        presentDay: firstNonEmpty(apiPayslip.presentDay, record.presentDay, 0),

        absentDays: firstNonEmpty(apiPayslip.absentDays, record.absentDays, 0),

        lop: firstNonEmpty(apiPayslip.lop, record.lop, 0),

        // Earnings
        grossSalary: firstNonEmpty(
          apiPayslip.grossSalary,
          record.grossSalary,
          0,
        ),

        basicSalary: firstNonEmpty(
          apiPayslip.basicSalary,
          record.basicSalary,
          0,
        ),

        da: firstNonEmpty(apiPayslip.da, record.da, 0),

        hra: firstNonEmpty(apiPayslip.hra, record.hra, 0),

        otherAllowance: firstNonEmpty(
          apiPayslip.otherAllowance,
          record.otherAllowance,
          0,
        ),

        // Deductions
        professionalTax: firstNonEmpty(
          apiPayslip.professionalTax,
          record.professionalTax,
          0,
        ),

        employeePf: firstNonEmpty(apiPayslip.employeePf, record.employeePf, 0),

        employerPf: firstNonEmpty(apiPayslip.employerPf, record.employerPf, 0),

        employeeEsic: firstNonEmpty(
          apiPayslip.employeeEsic,
          record.employeeEsic,
          0,
        ),

        salaryAdvance: firstNonEmpty(
          apiPayslip.salaryAdvance,
          record.salaryAdvance,
          0,
        ),

        otherDiduction: firstNonEmpty(
          apiPayslip.otherDiduction,
          record.otherDiduction,
          0,
        ),

        insuranceCorporation: firstNonEmpty(
          apiPayslip.insuranceCorporation,
          record.insuranceCorporation,
          0,
        ),

        netSalary: firstNonEmpty(apiPayslip.netSalary, record.netSalary, 0),
      };

      // =========================================================
      // DEBUG - CHECK EXACT DATA BEFORE OPENING PAYSLIP
      // =========================================================

      console.log("FINAL PAYSLIP DATA SENT TO PAYSLIP PAGE:", payslipData);
      console.log("FINAL COMPANY:", payslipData.companyName);
      console.log("FINAL PAN:", payslipData.panNumber);
      console.log("FINAL ACCOUNT:", payslipData.accountNumber);
      console.log("FINAL PAY DATE:", payslipData.paydate);

      // =========================================================
      // OPEN PAYSLIP
      // =========================================================

      navigate("/Payslip", {
        state: {
          payslip: payslipData,
        },
      });
    } catch (error) {
      console.error("VIEW PAYSLIP ERROR:", error);

      console.error("STATUS:", error.response?.status);

      console.error("API ERROR:", error.response?.data);

      toast.error(
        error.response?.data?.responseMessage || "Unable to fetch payslip",
      );
    } finally {
      setLoader(false);
    }
  };

  // ==========================================
  // DELETE SALARY
  // ==========================================

  const deleteSalary = async (record) => {
    try {
      console.log("Deleting Salary:", record);

      const response = await axios.delete(`${BASE_URL}admin/deleteNewSalary`, {
        params: {
          sId: record.key,
        },
        withCredentials: true,
      });

      console.log("Delete Salary Response:", response.data);

      toast.success(
        response.data?.responseMessage || "Salary Deleted Successfully!",
      );

      getSalary();
    } catch (err) {
      console.error("DELETE SALARY ERROR:", err);

      console.error("Status:", err.response?.status);

      console.error("Response:", err.response?.data);

      toast.error(
        err.response?.data?.responseMessage || "Unable to delete salary",
      );
    }
  };

  // ==========================================
  // USE EFFECT
  // ==========================================

  useEffect(() => {
    getSalary();
  }, []);

  // ==========================================
  // FILTER SALARY DATA
  // ==========================================
  const filteredSalaryData = salaryData.filter((salary) => {
    const monthMatch =
      !selectedMonth ||
      String(salary.month || "").trim().toLowerCase() ===
      selectedMonth.trim().toLowerCase();

    const yearMatch =
      !selectedYear ||
      String(salary.year || "").trim() === String(selectedYear).trim();

    return monthMatch && yearMatch;
  });

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

 const clearFilters = () => {
  setSelectedMonth("");
  setSelectedYear("");
  setCurrentPage(1);
};

  // ==========================================
  // TABLE COLUMNS
  // ==========================================
 const getColumnSearchProps = (dataIndex) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div
      style={{
        padding: 8,
      }}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <Input
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0] || ""}
        onChange={(e) => {
          setSelectedKeys(e.target.value ? [e.target.value] : []);
        }}
        onPressEnter={() => {
          confirm();
        }}
        style={{
          width: 200,
          marginBottom: 8,
          display: "block",
        }}
      />

      <Space>
        <Button
          type="primary"
          onClick={() => confirm()}
          icon={<SearchOutlined />}
          size="small"
          style={{
            width: 90,
          }}
        >
          Search
        </Button>

        <Button
          onClick={() => {
            clearFilters?.();
            confirm();
          }}
          size="small"
          style={{
            width: 90,
          }}
        >
          Reset
        </Button>
      </Space>
    </div>
  ),

  filterIcon: (filtered) => (
    <SearchOutlined
      style={{
        color: filtered ? "#1677ff" : undefined,
      }}
    />
  ),

  onFilter: (value, record) =>
    String(record?.[dataIndex] ?? "")
      .toLowerCase()
      .includes(String(value).toLowerCase()),
});
  const columns = [
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
      ...getColumnSearchProps("employeeName"),
      render: (text, record) => (
        <div className="employee-name">
          <Avatar>
            {record?.employeeName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <span>{text}</span>
        </div>
      ),
    },

    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
      width: 160,
      ...getColumnSearchProps("employeeId"),
    },

    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      width: 130,
      ...getColumnSearchProps("month"),
    },

    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      width: 100,
      ...getColumnSearchProps("year"),
    },

    {
  title: "Gross Salary",
  dataIndex: "grossSalary",
  key: "grossSalary",
  width: 150,
  ...getColumnSearchProps("grossSalary"),
  render: (value) =>
    `₹ ${Number(value || 0).toLocaleString("en-IN")}`,
},

    {
      title: "Total Working Days",
      dataIndex: "totalWorkingDay",
      key: "totalWorkingDay",
      width: 180,
      ...getColumnSearchProps("totalWorkingDay"),
    },

    {
      title: "Present Days",
      dataIndex: "presentDay",
      key: "presentDay",
      width: 150,
      ...getColumnSearchProps("presentDay"),
    },

    {
      title: "Absent Days",
      dataIndex: "absentDays",
      key: "absentDays",
      width: 150,
      ...getColumnSearchProps("absentDays"),
    },

    {
      title: "Loss of Pay",
      dataIndex: "lop",
      key: "lop",
      width: 140,
      ...getColumnSearchProps("lop"),
      render: (value) => `₹ ${Number(value).toLocaleString("en-IN")}`,
    },

    {
      title: "Dearness Allowance",
      dataIndex: "da",
      key: "da",
      width: 180,
      ...getColumnSearchProps("da"),
      render: (value) => `₹ ${Number(value).toLocaleString("en-IN")}`,
    },

    {
      title: "Employee PF",
      dataIndex: "employeePf",
      key: "employeePf",
      width: 150,
      ...getColumnSearchProps("employeePf"),

      render: (value) => `₹ ${Number(value).toLocaleString("en-IN")}`,
    },

    {
      title: "Employer PF",
      dataIndex: "employerPf",
      key: "employerPf",
      width: 150,
      ...getColumnSearchProps("employerPf"),

      render: (value) => `₹ ${Number(value).toLocaleString("en-IN")}`,
    },

   {
  title: "Employee ESIC",
  dataIndex: "employeeEsic",
  key: "employeeEsic",
  width: 160,
  ...getColumnSearchProps("employeeEsic"),
  render: (value) =>
    `₹ ${Number(value || 0).toLocaleString("en-IN")}`,
},

    {
      title: "Advance Salary",
      dataIndex: "salaryAdvance",
      key: "salaryAdvance",
      width: 170,
      ...getColumnSearchProps("salaryAdvance"),
      render: (value) => `₹ ${Number(value).toLocaleString("en-IN")}`,
    },

    {
      title: "Other Deduction",
      dataIndex: "otherDiduction",
      key: "otherDiduction",
      width: 170,
      ...getColumnSearchProps("otherDiduction"),

      render: (value) => `₹ ${Number(value).toLocaleString("en-IN")}`,
    },

    {
      title: "Other Allowance",
      dataIndex: "otherAllowance",
      key: "otherAllowance",
      width: 170,
      ...getColumnSearchProps("otherAllowance"),

      render: (value) => `₹ ${Number(value).toLocaleString("en-IN")}`,
    },

    {
      title: "Professional Tax",
      dataIndex: "professionalTax",
      key: "professionalTax",
      width: 170,
      ...getColumnSearchProps("professionalTax"),

      render: (value) => `₹ ${Number(value).toLocaleString("en-IN")}`,
    },

    {
      title: "Insurance Corporation",
      dataIndex: "insuranceCorporation",
      key: "insuranceCorporation",
      width: 200,
      ...getColumnSearchProps("insuranceCorporation"),

      render: (value) => `₹ ${Number(value).toLocaleString("en-IN")}`,
    },

   {
  title: "Net Salary",
  dataIndex: "netSalary",
  key: "netSalary",
  width: 150,
  ...getColumnSearchProps("netSalary"),
  render: (value) => (
    <strong>
      ₹ {Number(value || 0).toLocaleString("en-IN")}
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
          {/* VIEW PAYSLIP */}

          <button
            type="button"
            className="view-salary-link"
            onClick={() => handleViewPayslip(record)}
            title="View Payslip"
          >
            <FaEye className="viewsalary" />
          </button>

          {/* EDIT SALARY */}

          <EditOutlined
            className="edit"
            title="Edit Salary"
            onClick={() => {
              console.log("FULL RECORD:", record);

              navigate(`/editSalary/${record.key}`);
            }}
          />

          {/* DELETE SALARY */}

          <DeleteOutlined
            className="delete"
            title="Delete Salary"
            onClick={() => {
              deleteSalary(record);

              console.log("Delete Salary:", record);
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
    <MainPanel
      breadcrumbs={[
        { label: "Dashboard", link: "/dashboard" },
        { label: "Salary Management" },
      ]}
      title={
        String(user?.role || user?.crmRole || "")
          .trim()
          .toUpperCase() === "ADMIN"
          ? "Admin Dashboard"
          : " "
      }
    >
      <button type="button" className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>
      <div className="salary-management">
        <div className="page-header">
          <h2>Salary Management</h2>

          {/* FILTERS + ADD SALARY */}

          <div className="rightside">
            {/* MONTH */}

            <SelectInput
              label="Month"
              name="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </SelectInput>

            {/* YEAR */}

            <SelectInput
              label="Year"
              name="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </SelectInput>

            {/* CLEAR */}

            {(selectedMonth || selectedYear) && (
              <button
                type="button"
                className="clear-filter-btn"
                onClick={clearFilters}
              >
                Clear
              </button>
            )}

            {/* ADD SALARY */}

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

        {/* SALARY TABLE */}

        <Table
          columns={columns}
          dataSource={filteredSalaryData}
          bordered
          loading={loader}
          scroll={{
            x: "max-content",
          }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredSalaryData.length,
            showSizeChanger: true,
            pageSizeOptions: [ "10", "20", "50"],
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} records`,
          }}
          rowClassName={(_, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
        />
      </div>
    </MainPanel>
  );
};

export default SalaryManagement;
