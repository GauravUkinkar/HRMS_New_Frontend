import React, { useContext, useEffect, useState } from "react";
import "./Empviewdoc.scss";

import { UserContext } from "../../../Context";
import { GrDocumentPdf } from "react-icons/gr";
import { IoMdDownload } from "react-icons/io";
import { MdOutlinePreview } from "react-icons/md";
import MainPanel from "../../comp/MainPanel/MainPanel";

import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

const Empviewdoc = () => {
  const { user } = useContext(UserContext);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [documents, setDocuments] = useState({});
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  const [previewFile, setPreviewFile] = useState("");
  const [previewName, setPreviewName] = useState("");

  // =====================================================
  // GET EMPLOYEE ID
  // =====================================================

  // Admin:
  // /Empviewdoc?employeeId=PSPL1173
  //
  // Employee:
  // uses logged-in user's employeeId

  const selectedEmployeeId = searchParams.get("employeeId");

  const employeeId = selectedEmployeeId || user?.employeeId;

  // =====================================================
  // LOG USER + EMPLOYEE ID
  // =====================================================

  useEffect(() => {
    console.log("Logged-in User:", user);
    console.log("Selected Employee ID:", selectedEmployeeId);
    console.log("Final Employee ID:", employeeId);
  }, [user, selectedEmployeeId, employeeId]);

  // =====================================================
  // DOCUMENT LIST
  // =====================================================

  const documentList = [
    {
      key: "adharCard",
      name: "Aadhar Card",
    },
    {
      key: "aadharCard",
      name: "Aadhar Card",
    },
    {
      key: "panCard",
      name: "Pan Card",
    },
    {
      key: "tenthCertificate",
      name: "10th Certificate",
    },
    {
      key: "twelfthCertificate",
      name: "12th Certificate",
    },
    {
      key: "degreeCertificate",
      name: "Degree Certificate",
    },
    {
      key: "diplomaCertificate",
      name: "Diploma Certificate",
    },
    {
      key: "latestEducationCertificateOrDegree",
      name: "Latest Education Certificate",
    },
    {
      key: "relievingLetter",
      name: "Relieving Letter",
    },
    {
      key: "experianceLetter",
      name: "Experience Letter",
    },
    {
      key: "experienceLetter",
      name: "Experience Letter",
    },
    {
      key: "bankStatement",
      name: "Bank Statement",
    },
    {
      key: "salarySlip1",
      name: "Salary Slip 1",
    },
    {
      key: "salarySlip2",
      name: "Salary Slip 2",
    },
    {
      key: "salarySlip3",
      name: "Salary Slip 3",
    },
  ];

  // =====================================================
  // GET EMPLOYEE DOCUMENTS
  // =====================================================

  const getEmployeeDocuments = async () => {
    if (!employeeId) {
      console.log("Employee ID not available");

      setDocuments({});
      setPreviewFile("");
      setPreviewName("");

      return;
    }

    try {
      setLoadingDocuments(true);

      setDocuments({});
      setPreviewFile("");
      setPreviewName("");

      const url = `${BASE_URL}uploadDoc/getDocumentsByEmployeeId/${employeeId}`;

      console.log("====================================");
      console.log("Getting Employee Documents");
      console.log("Employee ID:", employeeId);
      console.log("Documents API URL:", url);
      console.log("====================================");

      const res = await axios.get(url, {
        withCredentials: true,
      });

      console.log("Employee Documents API Response:", res.data);

      if (res.data?.status === "OK" && res.data?.data) {
        setDocuments(res.data.data);

        console.log("Documents:", res.data.data);
      } else {
        setDocuments({});

        console.log("No documents found");
      }
    } catch (error) {
      console.error(
        "Get Documents Error:",
        error?.response?.status,
        error?.response?.data || error
      );

      setDocuments({});

      if (error?.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
      } else if (error?.response?.status === 403) {
        toast.error("You don't have permission to view these documents.");
      } else if (error?.response?.status === 404) {
        toast.error("Documents not found.");
      } else {
        toast.error("Unable to load employee documents.");
      }
    } finally {
      setLoadingDocuments(false);
    }
  };

  // =====================================================
  // LOAD DOCUMENTS
  // =====================================================

  useEffect(() => {
    if (employeeId) {
      getEmployeeDocuments();
    }
  }, [employeeId]);

  // =====================================================
  // ONLY SHOW AVAILABLE DOCUMENTS
  // =====================================================

  const availableDocuments = documentList.filter(
    (document, index, array) => {
      const file = documents?.[document.key];

      // Don't show empty documents
      if (
        file === null ||
        file === undefined ||
        String(file).trim() === ""
      ) {
        return false;
      }

      // Remove duplicate document names
      return (
        array.findIndex(
          (item) => item.name === document.name
        ) === index
      );
    }
  );

  // =====================================================
  // CREATE FILE URL
  // =====================================================

  const getFileUrl = (filePath) => {
    if (!filePath) {
      return "";
    }

    const filePathString = String(filePath).trim();

    // Already complete URL
    if (
      filePathString.startsWith("http://") ||
      filePathString.startsWith("https://")
    ) {
      return filePathString;
    }

    const baseUrl = String(BASE_URL || "").replace(/\/+$/, "");

    const path = filePathString.replace(/^\/+/, "");

    return `${baseUrl}/${path}`;
  };

  // =====================================================
  // PREVIEW DOCUMENT
  // =====================================================

  const handlePreview = (filePath, documentName) => {
    const fileUrl = getFileUrl(filePath);

    if (!fileUrl) {
      toast.error("Document not available.");
      return;
    }

    console.log("Preview Document:", documentName);
    console.log("Preview URL:", fileUrl);

    setPreviewFile(fileUrl);
    setPreviewName(documentName);
  };

  // =====================================================
  // DOWNLOAD DOCUMENT
  // =====================================================

  const handleDownload = async (filePath, documentName) => {
    try {
      if (!employeeId) {
        toast.error("Employee ID not available.");
        return;
      }

      if (!filePath) {
        toast.error("Document not available.");
        return;
      }

      const filePathString = String(filePath);

      // Get filename from URL/path
      const fileName = filePathString
        .split("/")
        .pop()
        .split("\\")
        .pop();

      if (!fileName || !fileName.includes(".")) {
        toast.error("Invalid document file.");
        return;
      }

      const downloadUrl = `${BASE_URL}uploadDoc/download/${employeeId}/${encodeURIComponent(
        fileName
      )}`;

      console.log("Download URL:", downloadUrl);

      const response = await axios.get(downloadUrl, {
        responseType: "blob",
        withCredentials: true,
      });

      const blob = new Blob([response.data], {
        type:
          response.headers["content-type"] ||
          "application/octet-stream",
      });

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = fileName;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);

      toast.success(`${documentName} downloaded successfully.`);
    } catch (error) {
      console.error(
        "Download Error:",
        error?.response?.data || error
      );

      if (error?.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
      } else if (error?.response?.status === 403) {
        toast.error(
          "You don't have permission to download this document."
        );
      } else if (error?.response?.status === 404) {
        toast.error("Document file not found.");
      } else {
        toast.error("Unable to download document.");
      }
    }
  };

  // =====================================================
  // CHECK IMAGE
  // =====================================================

  const isImageFile = (fileUrl) => {
    return /\.(jpg|jpeg|png|webp|gif|bmp|svg)(\?.*)?$/i.test(
      fileUrl
    );
  };

  // =====================================================
  // CHECK PDF
  // =====================================================

  const isPdfFile = (fileUrl) => {
    return /\.pdf(\?.*)?$/i.test(fileUrl);
  };

  // =====================================================
  // CLOSE PREVIEW
  // =====================================================

  const closePreview = () => {
    setPreviewFile("");
    setPreviewName("");
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <MainPanel
      title={
        String(user?.role || user?.crmRole || "")
          .trim()
          .toUpperCase() === "EMPLOYEE"
          ? "Employee Dashboard"
          : "Admin Dashboard"
      }
      breadcrumbs={[
        {
          label: "Dashboard",
          link: "/",
        },
        {
          label: "View Documents",
        },
      ]}
    >
      {/* BACK BUTTON */}

      <button
        type="button"
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="view-doc">
        {/* HEADER */}

        <h1>
          {selectedEmployeeId
            ? "Employee Documents"
            : "My Documents"}
        </h1>

        {/* EMPLOYEE ID */}

        {employeeId && (
          <div className="document-employee-id">
            Employee ID: <strong>{employeeId}</strong>
          </div>
        )}

        <div className="view-doc-bottom">
          {/* LOADING */}

          {loadingDocuments && (
            <div className="document-loading">
              Loading Documents...
            </div>
          )}

          {/* NO EMPLOYEE ID */}

          {!loadingDocuments && !employeeId && (
            <div className="no-documents">
              Employee ID not available.
            </div>
          )}

          {/* NO DOCUMENTS */}

          {!loadingDocuments &&
            employeeId &&
            availableDocuments.length === 0 && (
              <div className="no-documents">
                No documents uploaded.
              </div>
            )}

          {/* DOCUMENTS */}

          {!loadingDocuments &&
            employeeId &&
            availableDocuments.length > 0 && (
              <div className="document-preview-wrapper">
                {/* DOCUMENT LIST */}

                <div className="document-list">
                  {availableDocuments.map((document) => {
                    const filePath =
                      documents?.[document.key];

                    return (
                      <div
                        className="document-card"
                        key={document.key}
                      >
                        <GrDocumentPdf className="pdf-icon" />

                        <p>{document.name}</p>

                        <div className="btn-parent">
                          {/* PREVIEW */}

                          <button
                            type="button"
                            className="pre"
                            onClick={() =>
                              handlePreview(
                                filePath,
                                document.name
                              )
                            }
                          >
                            <MdOutlinePreview />
                            Preview
                          </button>

                          {/* DOWNLOAD */}

                          <button
                            type="button"
                            className="down"
                            onClick={() =>
                              handleDownload(
                                filePath,
                                document.name
                              )
                            }
                          >
                            <IoMdDownload />
                            Download
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* PREVIEW SECTION */}

                <div className="preview-section">
                  {previewFile ? (
                    <>
                      {/* PREVIEW HEADER */}

                      <div className="preview-header">
                        <h2>{previewName}</h2>

                        <button
                          type="button"
                          onClick={closePreview}
                        >
                          Close
                        </button>
                      </div>

                      {/* PREVIEW CONTENT */}

                      <div className="preview-content">
                        {isImageFile(previewFile) ? (
                          <img
                            src={previewFile}
                            alt={previewName}
                          />
                        ) : isPdfFile(previewFile) ? (
                          <iframe
                            src={previewFile}
                            title={previewName}
                          />
                        ) : (
                          <iframe
                            src={previewFile}
                            title={previewName}
                          />
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="preview-empty">
                      <MdOutlinePreview />

                      <p>
                        Select Preview to view the document
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </MainPanel>
  );
};

export default Empviewdoc;