import React, { useEffect, useState } from "react";
import "./OfferLetterManagement.scss";

import MainPanel from "../../comp/MainPanel/MainPanel";

import {
  Table,
  Avatar,
  Space,
  Tag,
} from "antd";

import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { FaPlus } from "react-icons/fa6";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

const OfferLetterManagement = () => {
  const navigate = useNavigate();

  const BASE_URL =
    import.meta.env.VITE_USER_BACKEND_URL;

  const [offerLetters, setOfferLetters] =
    useState([]);

  const [loader, setLoader] = useState(false);

  // =====================================================
  // GET ALL OFFER LETTERS
  // =====================================================

  const getAllOfficialLetters = async () => {
    try {
      setLoader(true);

      const response = await axios.get(
        `${BASE_URL}Admin/getAllOfficialLetters`,
        {
          withCredentials: true,
        }
      );

      console.log(
        "Offer Letter API Response:",
        response.data
      );

      const letters = response.data.map(
        (item, index) => {
          const data = item?.data || {};

          return {
            key:
              data.oid ||
              data.id ||
              index + 1,

            oid:
              data.oid ||
              data.id ||
              index + 1,

            employeeName:
              data.employeeName || "N/A",

            companyName:
              data.companyName || "N/A",

            designation:
              data.designation || "N/A",

            department:
              data.department || "N/A",

            dateOfjoining:
              data.dateOfjoining || "N/A",

            issuedDate:
              data.issuedDate || "N/A",

            salary:
              data.salary || 0,

            gender:
              data.gender || "N/A",

            employeeType:
              data.employeeType || "N/A",

            hrManagerName:
              data.hrManagerName || "N/A",

            // Keep complete API object
            originalData: data,
          };
        }
      );

      console.log(
        "Formatted Offer Letters:",
        letters
      );

      setOfferLetters(letters);

    } catch (error) {
      console.log(
        "STATUS:",
        error.response?.status
      );

      console.log(
        "ERROR:",
        error.response?.data || error
      );
    } finally {
      setLoader(false);
    }
  };

  // =====================================================
  // DELETE OFFER LETTER
  // =====================================================

  const handleDeleteOfferLetter = async (oid) => {
    if (!oid) {
      console.error(
        "Offer Letter ID is missing"
      );
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

      console.log(
        "Delete Offer Letter Response:",
        response.data
      );

      alert(
        "Offer letter deleted successfully"
      );

      // Refresh table
      getAllOfficialLetters();

    } catch (error) {
      console.error(
        "Delete Offer Letter Error:",
        error.response?.data || error
      );

      alert(
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
    // ===================================================
    // EMPLOYEE NAME
    // ===================================================

    {
      title: (
        <>
          Employee Name{" "}
          <SearchOutlined />
        </>
      ),

      dataIndex: "employeeName",

      key: "employeeName",

      width: 240,

      fixed: "left",

      render: (_, record) => {
        const name =
          record.employeeName || "N/A";

        const nameParts = name
          .trim()
          .split(" ")
          .filter(Boolean);

        let initials = "NA";

        if (nameParts.length === 1) {
          initials =
            nameParts[0]?.charAt(0) || "N";
        } else if (nameParts.length > 1) {
          initials =
            `${nameParts[0]?.charAt(0) || ""}${nameParts[
              nameParts.length - 1
            ]?.charAt(0) || ""
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
    {
      title: (
        <>
          Company Name{" "}
          <SearchOutlined />
        </>
      ),

      dataIndex: "companyName",

      key: "companyName",

      width: 260,
    },

    // ===================================================
    // DESIGNATION
    // ===================================================

    {
      title: "Designation",

      dataIndex: "designation",

      key: "designation",

      width: 220,

      render: (designation) =>
        designation || "N/A",
    },

    // ===================================================
    // DEPARTMENT
    // ===================================================

    {
      title: "Department",

      dataIndex: "department",

      key: "department",

      width: 180,

      render: (department) =>
        department || "N/A",
    },


    {
      title: "Joining Date",

      dataIndex: "dateOfjoining",

      key: "dateOfjoining",

      width: 160,

      render: (date) => {
        if (!date || date === "N/A") {
          return "N/A";
        }

        return date;
      },
    },
    {
      title: "Offer Date",
      dataIndex: "issuedDate",
      key: "issuedDate",
      width: 160,

      render: (date) => {
        if (!date || date === "N/A") {
          return "N/A";
        }
        return date;
      },
    },
    {
      title: "Employee Type",
      dataIndex: "employeeType",
      key: "employeeType",
      width: 160,
      render: (type) => (
        <Tag>
          {type || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      width: 150,
      render: (salary) => {
        if (!salary) {
          return "N/A";
        }

        return `₹${Number(
          salary
        ).toLocaleString("en-IN")}`;
      },
    },
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
              console.log(
                "Selected Offer Letter:",
                record
              );

              navigate(
                `/offerLetter/view/${record.oid}`
              );
            }}
          />

          {/* EDIT */}

          <EditOutlined
            className="edit"
            title="Edit Offer Letter"
            onClick={() => {
              console.log(
                "Edit Offer Letter:",
                record
              );

              navigate(
                `/offerLetter/edit/${record.oid}`
              );
            }}
          />

          {/* DELETE */}

          <DeleteOutlined
            className="delete"
            title="Delete Offer Letter"
            onClick={() =>
              handleDeleteOfferLetter(
                record.oid
              )
            }
          />

        </Space>
      ),
    },
  ];

  return (
    <MainPanel>

      <div className="offerlettermanagement">
        <div className="page-header">
          <h2>
            Offer Letter Management
          </h2>
        </div>

        <div className="btn-group">
          <div className="count">
            Total Offer Letters:{" "}
            <span>
              {offerLetters.length}
            </span>
          </div>

          <Link to="/offerLetter">
            <span>
              <FaPlus />
            </span>{" "}
            Add Offer Letter
          </Link>


        </div>

      </div>

      <Table
        loading={loader}

        columns={columns}

        dataSource={offerLetters}

        bordered

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

          showTotal: (
            total,
            range
          ) =>
            `${range[0]}-${range[1]} of ${total} offer letters`,
        }}

        rowClassName={(
          _,
          index
        ) =>
          index % 2 === 0
            ? "table-row-light"
            : "table-row-dark"
        }
      />


    </MainPanel>
  );
};

export default OfferLetterManagement;