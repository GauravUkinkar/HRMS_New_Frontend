import React, { useEffect, useRef, useState, useContext } from "react";
import "./ViewApprovals.scss";

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
import { IoMdArrowBack } from "react-icons/io";


const ViewApproval = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [data, setData] = useState([]);
  const [edit, setEdit] = useState(null);
  const [values, setValues] = useState({});
  const [loader, setLoader] = useState(false);
  const [isPdf, setIsPdf] = useState(false);

  const pdfRef = useRef();

  const token = localStorage.getItem("token");

  const BASE_URL = import.meta.env.VITE_APPROVAL_BACKEND_URL;

  // =====================================================
  // GET APPROVAL DATA
  // =====================================================

  const getApprovalData = async () => {
    try {
      setLoader(true);

      let response;

      if (user?.role === "ADMIN") {
        response = await axios.get(`${BASE_URL}Admin/GetAllApproval`, {
          withCredentials: true,
        });
      } else {
        response = await axios.get(
          `${BASE_URL}employee/GetApprovalByForUseruid?uid=${user?.uid}`,
          {
            withCredentials: true,
          },
        );
      }

      console.log("Approval API Response:", response.data);

      const approvalData = response.data?.data || [];

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

      const response = await axios.post(
        `${BASE_URL}Admin/ChangeStatusForMam?aId=${id}&status=${value}`,
        {},
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        toast.success("Mam status updated successfully");

        setEdit(null);
        getApprovalData();
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to update Mam status",
      );
    }
  };

  // =====================================================
  // CHANGE FINANCE STATUS
  // =====================================================

  const changeFinanceStatus = async (e, id) => {
    try {
      const value = e.target.value;

      if (!value) return;

      const response = await axios.post(
        `${BASE_URL}Admin/ChangeStatusForFinance?aId=${id}&status=${value}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        toast.success("Finance status updated successfully");

        setEdit(null);
        getApprovalData();
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to update Finance status",
      );
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

      setValues(response.data?.data || {});

      if (response.status === 200) {
        setIsPdf(true);

        setTimeout(() => {
          handleDownloadPDF();
        }, 500);
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

  if (!input) return;

  try {
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: input.scrollWidth,
      windowHeight: input.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 10;

    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    const imageRatio = canvas.width / canvas.height;

    let imageWidth = availableWidth;
    let imageHeight = imageWidth / imageRatio;

    // If content is taller than one A4 page
    if (imageHeight > availableHeight) {
      imageHeight = availableHeight;
      imageWidth = imageHeight * imageRatio;
    }

    const x = (pageWidth - imageWidth) / 2;
    const y = margin;

    pdf.addImage(
      imgData,
      "JPEG",
      x,
      y,
      imageWidth,
      imageHeight,
      undefined,
      "FAST"
    );

    pdf.save(
      `Approval_Letter_${values?.name || "Employee"}.pdf`
    );

    toast.success("Approval letter downloaded");
  } catch (error) {
    console.log("PDF Download Error:", error);
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

    if (!confirmDelete) return;

    try {
      // Add your delete API here when available.

      console.log("Delete Approval ID:", id);

      toast.info("Delete API is not connected yet");
    } catch (error) {
      console.log(error);

      toast.error("Failed to delete approval");
    }
  };

  // =====================================================
  // GET DATA ON PAGE LOAD
  // =====================================================

  useEffect(() => {
    if (user) {
      getApprovalData();
    }
  }, [user]);

  // =====================================================
  // TABLE COLUMNS
  // =====================================================

  const columns = [
    {
      title: "Id",
      dataIndex: "index",
      key: "index",
      width: 80,
      fixed: "left",
    },

    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 150,
    },

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

    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      width: 250,

      render: (subject) => subject || "N/A",
    },

    {
      title: "Start Date",
      dataIndex: "StartDate",
      key: "StartDate",
      width: 150,

      render: (date) => date || "N/A",
    },

    {
      title: "End Date",
      dataIndex: "EndDate",
      key: "EndDate",
      width: 150,

      render: (date) => date || "N/A",
    },

    {
      title: "Recurring",
      dataIndex: "Recurring",
      key: "Recurring",
      width: 150,

      render: (value) => <Tag>{value || "No Recurring"}</Tag>,
    },

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

{
  title: "Actions",
  key: "actions",
  width: 160,
  fixed: "right",

  render: (_, record) => (
    <Space size="middle">

      {/* ADMIN EDIT - STATUS */}
      {user?.role === "ADMIN" && (
        <MdEdit
          className="edit"
          title="Edit Approval Status"
          onClick={() => setEdit(record.id)}
        />
      )}

      {/* EMPLOYEE EDIT - COMPLETE APPROVAL LETTER */}
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

  return (
    <MainPanel
      breadcrumbs={[
        { label: "Dashboard", link: "/dashboard" },
        { label: "Approval Letters" },
      ]}
      title={
        String(user?.role || user?.crmRole || "")
          .trim()
          .toUpperCase() === "EMPLOYEE"
          ? "Employee Dashboard"
          : "Approval Letters"
      }
    >
          <button
            type="button"
            className="back-btn"
            onClick={() =>
              navigate("/")
            }
          >
            ← Back
          </button>
      
        <div className="page-header">
          <h2>Approval Letters</h2>
          <Link to="/approvalLetter">
            <button className="btn">Add Letter</button>
          </Link>
        </div>
      
      <div className="parent">
        <div className="card" style={{ padding: "20px" }}>
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

        {/* PDF CONTENT */}

        {isPdf && (
          <div className="right-letter" ref={pdfRef}>
            <div className="date">{values?.date}</div>

            <p className="main-info">
              To, <br />
              Prajakta Marwaha <br />
              Director <br />
              Pandoza Solutions Pvt Ltd <br />
              2014 - 2016, 10 Biz Park, Viman Nagar, <br />
              Pune, Maharashtra 411014
            </p>

            <p className="subject">Subject: {values?.subject}</p>

            <div
              className="sic-editor-data"
              dangerouslySetInnerHTML={{
                __html: values?.content || "",
              }}
            />

            <div className="user">
              Your Sincerely <span>{values?.name}</span>
            </div>

            <div className="bottomsection">
              <div className="approvar">
                To Be Approved By <span>Prajakta Marwaha</span>
              </div>

              <div className="finance">
                To Be Approved By <span>Finance Department</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainPanel>
  );
};

export default ViewApproval;
