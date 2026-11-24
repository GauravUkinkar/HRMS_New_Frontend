
import React, { useContext, useEffect, useState } from "react";
import "./JoiningLetterManagement.scss";

import MainPanel from "../../comp/MainPanel/MainPanel";
import { UserContext } from "../../../Context";
import { Table, Avatar, Space, Tag } from "antd";

import {
  SearchOutlined,
  EyeOutlined,

  DeleteOutlined,
} from "@ant-design/icons";

import { FaPlus } from "react-icons/fa6";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import { toast } from "react-toastify";

const JoiningLetterManagement = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

  const [offerLetters, setOfferLetters] = useState([]);
  const [loader, setLoader] = useState(false);

  // =====================================================
  // GET ALL OFFER LETTERS
  // =====================================================

  const getAllOfficialLetters = async () => {
    try {
      setLoader(true);

      const response = await axios.get(
        `${BASE_URL}Admin/getAll`,
        {
          withCredentials: true,
        }
      );

      console.log("Offer Letter API Response:", response.data);

      // Extract actual data array from API response
      const apiData = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      // Filter ONLY Offer Letter documents
      const filteredLetters = apiData.filter(
        (item) =>
          String(item?.documentName || "")
            .trim()
            .toLowerCase() === "joining letter"
      );

      // Format API data
      const letters = filteredLetters.map((data, index) => {
        return {
          key: `${data.documentPath || "offer"}-${index}`,

          // Keep actual backend ID
          oid: data.oid ?? data.id ?? null,

          employeeName: data.employeeName || "N/A",

          companyName: data.companyName || "N/A",

          designation: data.designation || "N/A",

          department: data.department || "N/A",

          dateOfjoining: data.dateOfjoining || "N/A",

          issuedDate: data.issuedDate || "N/A",

          salary: data.salary ?? 0,

          gender: data.gender || "N/A",

          employeeType: data.employeeType || "N/A",

          hrManagerName: data.hrManagerName || "N/A",

          documentName: data.documentName || "N/A",

          documentPath: data.documentPath || "",

          email: data.email || "",

          originalData: data,
        };
      });

      console.log("Filtered Offer Letters:", letters);

      setOfferLetters(letters);

    } catch (error) {
      console.error(
        "Get Offer Letters Error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.responseMessage ||
        "Unable to fetch offer letters"
      );

      setOfferLetters([]);
    } finally {
      setLoader(false);
    }
  };

  // =====================================================
  // DELETE OFFER LETTER
  // =====================================================

  const handleDeleteOfferLetter = async (oid) => {
    if (oid === null || oid === undefined) {
      toast.error("Offer Letter ID is missing");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this offer letter?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${BASE_URL}Admin/deleteOfficialLetter/${oid}`,
        {
          withCredentials: true,
        }
      );

      console.log("Delete Offer Letter Response:", response.data);

      toast.success(
        response.data?.responseMessage ||
        "Offer letter deleted successfully"
      );

      getAllOfficialLetters();

    } catch (error) {
      console.error(
        "Delete Offer Letter Error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.responseMessage ||
        error.response?.data?.message ||
        "Failed to delete offer letter"
      );
    }
  };

  // =====================================================
  // GET DATA ON PAGE LOAD
  // =====================================================

  useEffect(() => {
    getAllOfficialLetters();
  }, []);

  // =====================================================
  // TABLE COLUMNS
  // =====================================================

  const columns = [
    // EMPLOYEE NAME
    {
      title: (
        <>
          Employee Name <SearchOutlined />
        </>
      ),

      dataIndex: "employeeName",

      key: "employeeName",

      width: 240,

      fixed: "left",

      render: (_, record) => {
        const name = record.employeeName || "N/A";

        const nameParts = name.trim().split(" ").filter(Boolean);

        let initials = "NA";

        if (nameParts.length === 1) {
          initials = nameParts[0]?.charAt(0) || "N";
        } else if (nameParts.length > 1) {
          initials = `${nameParts[0]?.charAt(0) || ""}${
            nameParts[nameParts.length - 1]?.charAt(0) || ""
          }`;
        }

        return (
          <Space>
            <Avatar className="avatar">
              {initials.toUpperCase()}
            </Avatar>

            <span>{name}</span>
          </Space>
        );
      },
    },

    // COMPANY NAME
    {
      title: (
        <>
          Company Name <SearchOutlined />
        </>
      ),

      dataIndex: "companyName",

      key: "companyName",

      width: 260,
    },

    // DESIGNATION
    {
      title: "Designation",

      dataIndex: "designation",

      key: "designation",

      width: 220,

      render: (designation) => designation || "N/A",
    },

    // DEPARTMENT
    {
      title: "Department",

      dataIndex: "department",

      key: "department",

      width: 180,

      render: (department) => department || "N/A",
    },

    // JOINING DATE
    {
      title: "Joining Date",

      dataIndex: "dateOfjoining",

      key: "dateOfjoining",

      width: 160,

      render: (date) => date || "N/A",
    },

    // OFFER DATE
    {
      title: "Offer Date",

      dataIndex: "issuedDate",

      key: "issuedDate",

      width: 160,

      render: (date) => date || "N/A",
    },

    // DOCUMENT TYPE
    {
      title: "Document Type",

      dataIndex: "documentName",

      key: "documentName",

      width: 160,

      render: (type) => (
        <Tag color="green">{type}</Tag>
      ),
    },

    // EMPLOYEE TYPE
    {
      title: "Employee Type",

      dataIndex: "employeeType",

      key: "employeeType",

      width: 160,

      render: (type) => <Tag>{type || "N/A"}</Tag>,
    },

    // SALARY
    {
      title: "Salary",

      dataIndex: "salary",

      key: "salary",

      width: 150,

      render: (salary) => {
        if (!salary) return "N/A";

        return `₹${Number(salary).toLocaleString("en-IN")}`;
      },
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
            title="View Offer Letter"
            onClick={() => {
              navigate(`/offerLetter/view/${record.oid}`);
            }}
          />
          {/* DELETE */}
          <DeleteOutlined
            className="delete"
            title="Delete Offer Letter"
            onClick={() =>
              handleDeleteOfferLetter(record.oid)
            }
          />

        </Space>
      ),
    },
  ];

  // =====================================================
  // UI
  // =====================================================

  return (
    <MainPanel
          breadcrumbs={[
        { label: "Dashboard", link: "/dashboard" },
        { label: "Joining Letter Management" },
      ]}
      title={
        String(user?.role || user?.crmRole || "")
          .trim()
          .toUpperCase() === "ADMIN"
          ? "Admin Dashboard"
          : " "
      }
    >
      <button
        type="button"
        className="back-btn"
        onClick={() => navigate("/")}
      >
        ← Back
      </button>

      <div className="offerlettermanagement">

        <div className="page-header">

          <h2> Joining Letter Management</h2>

          <div className="btn-group">

            <div className="count">
              Total Joining Letters:{" "}
              <span>{offerLetters.length}</span>
            </div>

            <Link to="/joiningLetter">
              <span>
                <FaPlus />
              </span>{" "}
              Add Joining Letter
            </Link>

          </div>

        </div>

      </div>

      <Table
        loading={loader}
        columns={columns}
        dataSource={offerLetters}
        rowKey="key"
        bordered
        scroll={{
          x: "max-content",
        }}
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],

          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} offer letters`,
        }}
        rowClassName={(_, index) =>
          index % 2 === 0
            ? "table-row-light"
            : "table-row-dark"
        }
      />

    </MainPanel>
  );
};

export default JoiningLetterManagement;
