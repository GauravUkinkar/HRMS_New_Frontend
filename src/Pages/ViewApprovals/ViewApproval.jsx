import React, { useEffect, useRef, useState, useContext } from "react";

import "./ViewApprovals.scss";
import { FaPlus } from "react-icons/fa";
import MainPanel from "../../comp/MainPanel/MainPanel";

import { Table, Space, Tag, Avatar } from "antd";

import { MdEdit, MdDelete } from "react-icons/md";

import { FaDownload } from "react-icons/fa";

import axios from "axios";

import { UserContext } from "../../../Context";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { toast } from "react-toastify";

import SelectInput from "../../comp/selectInput/SelectInput";

import { MenuItem } from "@mui/material";

import { Link, useNavigate } from "react-router-dom";

const ViewApproval = () => {
  const navigate = useNavigate();
  const [statusLoader, setStatusLoader] = useState(false);
  const { user } = useContext(UserContext);

  // =====================================================
  // STATES
  // =====================================================

  const [data, setData] = useState([]);

  const [edit, setEdit] = useState(null);

  const [values, setValues] = useState({});

  const [loader, setLoader] = useState(false);

  const [isPdf, setIsPdf] = useState(false);

  // =====================================================
  // PDF REF
  // =====================================================

  const pdfRef = useRef(null);

  // =====================================================
  // TOKEN
  // =====================================================

  const token = localStorage.getItem("token");

  // =====================================================
  // BASE URL
  // =====================================================

  const BASE_URL = import.meta.env.VITE_APPROVAL_BACKEND_URL;

  // =====================================================
  // DATE FORMATTER
  // =====================================================

  const formatApprovalDate = (dateValue) => {
    if (!dateValue) return "";

    // Handle values such as:
    // 2026-09-30
    // 2026-09-30T00:00:00
    // 2026-09-30T00:00:00.000Z

    const dateOnly = String(dateValue).split("T")[0];

    const parts = dateOnly.split("-");

    if (parts.length !== 3) {
      return dateValue;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    if (!year || !month || !day) {
      return dateValue;
    }

    // Important:
    // Do NOT use new Date("2026-09-30")
    // directly because timezone conversion
    // can sometimes change the displayed date.

    const date = new Date(year, month - 1, day);

    if (isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // =====================================================
  // GET APPROVAL DATA
  // =====================================================

  const getApprovalData = async () => {
    if (!user?.uid) {
      return;
    }

    try {
      setLoader(true);

      let response;

      // ================================================
      // ADMIN
      // ================================================

      if (user?.role === "ADMIN") {
        response = await axios.get(`${BASE_URL}Admin/GetAllApproval`, {
          withCredentials: true,
        });
      }

      // ================================================
      // EMPLOYEE
      // ================================================
      else {
        response = await axios.get(
          `${BASE_URL}employee/GetApprovalByForUseruid?uid=${user.uid}`,
          {
            withCredentials: true,
          },
        );
      }

      console.log("Approval API Response:", response.data);

      const approvalData = response?.data?.data || [];

      // ================================================
      // FORMAT DATA
      // ================================================

      const formattedData = [...approvalData].reverse().map((item, index) => ({
        id: item.aid,

        index: index + 1,

        key: item.aid,

        date: item.date,

        name: item.name,

        subject: item.subject,

        content: item.content,

        StartDate: item.startDate,

        EndDate: item.endDate,

        Recurring: item.recuring,

        price: item.price,

        approvebByMam: item.approvebByMam,

        approvedByFinance: item.approvedByFinance,

        status: item.overAllStatus,
      }));

      setData(formattedData);
    } catch (error) {
      console.log("Get Approval Error:", error.response?.data || error);

      toast.error(
        error.response?.data?.message || "Failed to get approval data",
      );
    } finally {
      setLoader(false);
    }
  };

  // =====================================================
  // CHANGE MAM STATUS
  // =====================================================

  const changemamStatus = async (e, id) => {
    try {
      const value = e.target.value;

      if (!value) return;

      setStatusLoader(true);

      const response = await axios.post(
        `${BASE_URL}Admin/ChangeStatusForMam?aId=${id}&status=${value}`,
        {},
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        setEdit(null);

        await getApprovalData();

        toast.success("Mam status updated successfully");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to update Mam status",
      );
    } finally {
      setStatusLoader(false);
    }
  };

  // =====================================================
  // CHANGE FINANCE STATUS
  // =====================================================

  const changeFinanceStatus = async (e, id) => {
    try {
      const value = e.target.value;

      if (!value) return;

      setStatusLoader(true);

      const response = await axios.post(
        `${BASE_URL}Admin/ChangeStatusForFinance?aId=${id}&status=${value}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        setEdit(null);

        await getApprovalData();

        toast.success("Finance status updated successfully");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to update Finance status",
      );
    } finally {
      setStatusLoader(false);
    }
  };

  // =====================================================
  // CHANGE OVERALL STATUS
  // =====================================================

  const changeoverStatus = async (e, id) => {
    try {
      const value = e.target.value;

      if (!value) return;

      const response = await axios.post(
        `${BASE_URL}Admin/FinalStatus?aId=${id}&status=${value}`,
        {},
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        toast.success("Approval status updated successfully");

        setEdit(null);

        getApprovalData();
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to update approval status",
      );
    }
  };

  // =====================================================
  // GET APPROVAL BY ID
  // =====================================================

  const getApprovalDataById = async (id) => {
    try {
      const response = await axios.get(
        `${BASE_URL}authController/GetApproval?aId=${id}`,
        {
          withCredentials: true,
        },
      );

      console.log("Approval By ID:", response.data);

      setValues(response?.data?.data || {});

      if (response.status === 200) {
        setIsPdf(true);

        // Give React time to render
        // the A4 PDF element.
        setTimeout(() => {
          handleDownloadPDF();
        }, 800);
      }
    } catch (error) {
      console.log("Get Approval By ID Error:", error.response?.data || error);

      toast.error("Failed to generate approval letter");
    }
  };

  // =====================================================
  // DOWNLOAD PDF
  // =====================================================

  const handleDownloadPDF = async () => {
    const input = pdfRef.current;

    if (!input) {
      toast.error("PDF content not ready");
      return;
    }

    try {
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });

      const canvas = await html2canvas(input, {
        scale: 2,

        useCORS: true,

        allowTaint: true,

        backgroundColor: "#ffffff",

        logging: false,

        width: 794,

        height: 1123,

        windowWidth: 794,

        windowHeight: 1123,
      });

      const imgData = canvas.toDataURL("image/jpeg", 1);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();

      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(
        imgData,
        "JPEG",
        0,
        0,
        pageWidth,
        pageHeight,
        undefined,
        "FAST",
      );

      pdf.save(`Approval_Letter_${values?.name || "Employee"}.pdf`);

      toast.success("Approval letter downloaded");
    } catch (error) {
      console.error("PDF Download Error:", error);

      toast.error("Failed to download approval letter");
    } finally {
      setIsPdf(false);
    }
  };

  // =====================================================
  // DELETE APPROVAL
  // =====================================================

  const handleDelete = async (id) => {
    if (!id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this approval?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await axios.delete(
        `${BASE_URL}Admin/DeleteApproval?aId=${id}`,
        {
          withCredentials: true,
        },
      );

      if (response.status === 200 || response.status === 204) {
        toast.success("Approval deleted successfully");

        setData((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.log("Delete Approval Error:", error.response?.data || error);

      toast.error(error.response?.data?.message || "Failed to delete approval");
    }
  };

  // =====================================================
  // GET DATA WHEN USER IS READY
  // =====================================================

  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    getApprovalData();
  }, [user?.uid, user?.role]);

  // =====================================================
  // TABLE COLUMNS
  // =====================================================

  const columns = [
    // ================================================
    // ID
    // ================================================

    {
      title: "Id",

      dataIndex: "index",

      key: "index",

      width: 80,

      fixed: "left",
    },

    // ================================================
    // DATE
    // ================================================

    {
      title: "Date",

      dataIndex: "date",

      key: "date",

      width: 150,

      render: (date) => formatApprovalDate(date),
    },

    // ================================================
    // EMPLOYEE NAME
    // ================================================

    {
      title: "Employee Name",

      dataIndex: "name",

      key: "name",

      width: 220,

      fixed: "left",

      render: (name) => {
        const employeeName = name || "N/A";

        const nameParts = employeeName.trim().split(" ").filter(Boolean);

        let initials = "NA";

        if (nameParts.length === 1) {
          initials = nameParts[0]?.charAt(0) || "N";
        } else {
          initials = `${nameParts[0]?.charAt(0) || ""}${
            nameParts[nameParts.length - 1]?.charAt(0) || ""
          }`;
        }

        return (
          <Space>
            <Avatar className="avatar">{initials.toUpperCase()}</Avatar>

            <span>{employeeName}</span>
          </Space>
        );
      },
    },

    // ================================================
    // SUBJECT
    // ================================================

    {
      title: "Subject",

      dataIndex: "subject",

      key: "subject",

      width: 250,

      render: (subject) => subject || "N/A",
    },

    // ================================================
    // START DATE
    // ================================================

    {
      title: "Start Date",

      dataIndex: "StartDate",

      key: "StartDate",

      width: 150,

      render: (date) => (date ? formatApprovalDate(date) : "N/A"),
    },

    // ================================================
    // END DATE
    // ================================================

    {
      title: "End Date",

      dataIndex: "EndDate",

      key: "EndDate",

      width: 150,

      render: (date) => (date ? formatApprovalDate(date) : "N/A"),
    },

    // ================================================
    // RECURRING
    // ================================================

    {
      title: "Recurring",

      dataIndex: "Recurring",

      key: "Recurring",

      width: 150,

      render: (value) => <Tag>{value || "No Recurring"}</Tag>,
    },

    // ================================================
    // PRICE
    // ================================================

    {
      title: "Price",

      dataIndex: "price",

      key: "price",

      width: 150,

      render: (price) => {
        if (price === null || price === undefined || price === "") {
          return "N/A";
        }

        return `₹${Number(price).toLocaleString("en-IN")}`;
      },
    },

    // ================================================
    // APPROVED BY MAM
    // ================================================

    {
      title: "Approved By Mam",

      dataIndex: "approvebByMam",

      key: "approvebByMam",

      width: 190,

      render: (text, record) => (
        <>
          {user?.role === "ADMIN" && edit === record.id ? (
            <SelectInput
              label="Select Option"
              value={record.approvebByMam || ""}
              onChange={(e) => changemamStatus(e, record.id)}
              disabled={statusLoader}
            >
              <MenuItem value="Approved">Approved</MenuItem>

              <MenuItem value="Rejected">Rejected</MenuItem>
            </SelectInput>
          ) : (
            <Tag
              color={
                record.approvebByMam === "Approved"
                  ? "green"
                  : record.approvebByMam === "Rejected"
                    ? "red"
                    : "gold"
              }
            >
              {record.approvebByMam || "Pending"}
            </Tag>
          )}
        </>
      ),
    },

    // ================================================
    // APPROVED BY FINANCE
    // ================================================

    {
      title: "Approved By Finance",

      dataIndex: "approvedByFinance",

      key: "approvedByFinance",

      width: 200,

      render: (text, record) => (
        <>
          {user?.role === "ADMIN" && edit === record.id ? (
            <SelectInput
              label="Select Option"
              value={record.approvedByFinance || ""}
              onChange={(e) => changeFinanceStatus(e, record.id)}
              disabled={statusLoader}
            >
              <MenuItem value="Approved">Approved</MenuItem>

              <MenuItem value="Rejected">Rejected</MenuItem>
            </SelectInput>
          ) : (
            <Tag
              color={
                record.approvedByFinance === "Approved"
                  ? "green"
                  : record.approvedByFinance === "Rejected"
                    ? "red"
                    : "gold"
              }
            >
              {record.approvedByFinance || "Pending"}
            </Tag>
          )}
        </>
      ),
    },

    // ================================================
    // OVERALL STATUS
    // ================================================

    {
      title: "Status",

      dataIndex: "status",

      key: "status",

      width: 160,

      render: (text, record) => (
        <>
          {user?.role === "ADMIN" && edit === record.id ? (
            <SelectInput
              label="Select Option"
              value={record.status || ""}
              onChange={(e) => changeoverStatus(e, record.id)}
            >
              <MenuItem value="Approved">Approved</MenuItem>

              <MenuItem value="Rejected">Rejected</MenuItem>
            </SelectInput>
          ) : (
            <Tag
              color={
                record.status === "Approved"
                  ? "green"
                  : record.status === "Rejected"
                    ? "red"
                    : "gold"
              }
            >
              {record.status || "Pending"}
            </Tag>
          )}
        </>
      ),
    },

    // ================================================
    // ACTIONS
    // ================================================

    {
      title: "Actions",

      key: "actions",

      width: 160,

      fixed: "right",

      render: (_, record) => (
        <Space size="middle">
          {/* ADMIN STATUS EDIT */}

          {user?.role === "ADMIN" && (
            <MdEdit
              className="edit"
              title="Edit Approval Status"
              onClick={() => setEdit(record.id)}
            />
          )}

          {/* EMPLOYEE COMPLETE EDIT */}

          {user?.role === "EMPLOYEE" && (
            <MdEdit
              className="edit"
              title="Edit Approval Letter"
              onClick={() => navigate(`/editApproval/${record.id}`)}
            />
          )}

          {/* ADMIN DELETE */}

          {user?.role === "ADMIN" && (
            <MdDelete
              className="delete"
              title="Delete Approval"
              onClick={() => handleDelete(record.id)}
            />
          )}

          {/* DOWNLOAD */}

          <FaDownload
            className="download"
            title="Download Approval"
            onClick={() => getApprovalDataById(record.id)}
          />
        </Space>
      ),
    },
  ];

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <MainPanel
      breadcrumbs={[
        {
          label: "Dashboard",
          link: "/dashboard",
        },

        {
          label: "Approval Letters",
        },
      ]}
      title={
        String(user?.role || user?.crmRole || "")
          .trim()
          .toUpperCase() === "ADMIN"
          ? "Admin Dashboard"
          : "Approval Letters"
      }
    >
      {/* ============================================== */}
      {/* BACK */}
      {/* ============================================== */}

      <button type="button" className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      {/* ============================================== */}
      {/* PAGE HEADER */}
      {/* ============================================== */}

      <div className="page-header">
        <h2>Approval Letters</h2>

        {String(user?.role || user?.crmRole || "")
          .trim()
          .toUpperCase() === "EMPLOYEE" && (
          <Link to="/approvalLetter">
            <button className="apply">Add Letter<FaPlus /></button>
          </Link>
        )}
      </div>

      {/* ============================================== */}
      {/* TABLE */}
      {/* ============================================== */}

      <div className="parent">
        <div
          className="card"
          style={{
            padding: "20px",
          }}
        >
          <Table
            loading={loader}
            columns={columns}
            dataSource={data}
            bordered
            scroll={{
              x: "max-content",
            }}
            pagination={{
              pageSize: 10,

              showSizeChanger: true,

              pageSizeOptions: ["10", "20", "50", "100"],

              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} approvals`,
            }}
            rowClassName={(_, index) =>
              index % 2 === 0 ? "table-row-light" : "table-row-dark"
            }
          />
        </div>

        {/* ============================================ */}
        {/* PDF A4 CONTENT */}
        {/* ============================================ */}

        {isPdf && (
          <div className="pdf-render-wrapper">
            <div className="right-letter pdf-letter" ref={pdfRef}>
              {/* ====================================== */}
              {/* DATE */}
              {/* ====================================== */}

              <div className="date">{formatApprovalDate(values?.date)}</div>

              {/* ====================================== */}
              {/* RECEIVER */}
              {/* ====================================== */}

              <div className="main-info">
                To,
                <br />
                Prajakta Marwaha
                <br />
                Director
                <br />
                Pandoza Solutions Pvt Ltd
                <br />
                2014 - 2016, 10 Biz Park, Viman Nagar,
                <br />
                Pune, Maharashtra 411014
              </div>

              {/* ====================================== */}
              {/* SUBJECT */}
              {/* ====================================== */}

              <div className="subject">Subject: {values?.subject}</div>

              {/* ====================================== */}
              {/* CONTENT */}
              {/* ====================================== */}

              <div
                className="sic-editor-data"
                dangerouslySetInnerHTML={{
                  __html: values?.content || "",
                }}
              />

              {/* ====================================== */}
              {/* BOTTOM */}
              {/* ====================================== */}

              <div className="letter-bottom">
                {/* ==================================== */}
                {/* SIGNATURE */}
                {/* ==================================== */}

                <div className="user">
                  <div>Your Sincerely</div>

                  <span>{values?.name}</span>
                </div>

                {/* ==================================== */}
                {/* APPROVAL ROW */}
                {/* ==================================== */}

                <div className="bottomsection">
                  <div className="approvar">
                    <div>To Be Approved By</div>

                    <span>Prajakta Marwaha</span>
                  </div>

                  <div className="finance">
                    <div>To Be Approved By</div>

                    <span>Finance Department</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainPanel>
  );
};

export default ViewApproval;
