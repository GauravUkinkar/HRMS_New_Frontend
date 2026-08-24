import React, { useContext, useEffect, useState } from "react";
import "./Empviewdoc.scss";

import { GrDocumentPdf } from "react-icons/gr";
import { IoMdDownload } from "react-icons/io";
import { MdOutlinePreview } from "react-icons/md";

import MainPanel from "../../comp/MainPanel/MainPanel";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

// Logged-in employee ID
const EMPLOYEE_ID = "PSPL1173";

const Empviewdoc = () => {
  const [documents, setDocuments] = useState({});
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  const [previewFile, setPreviewFile] = useState("");
  const [previewName, setPreviewName] = useState("");

  // =====================================================
  // GET EMPLOYEE DOCUMENTS
  // =====================================================

  const getEmployeeDocuments = async () => {
    try {
      setLoadingDocuments(true);

      setDocuments({});
      setPreviewFile("");
      setPreviewName("");

      console.log("Getting documents for Employee ID:", EMPLOYEE_ID);

      const res = await axios.get(
        `${BASE_URL}uploadDoc/getDocumentsByEmployeeId/${EMPLOYEE_ID}`,
        {
          withCredentials: true,
        },
      );

      console.log("Employee Documents API Response:", res.data);

      if (res.data?.status === "OK" && res.data?.data) {
        setDocuments(res.data.data);

        console.log("Documents:", res.data.data);
      } else {
        setDocuments({});
      }
    } catch (error) {
      console.error("Get Documents Error:", error.response?.data || error);

      setDocuments({});
    } finally {
      setLoadingDocuments(false);
    }
  };

  // =====================================================
  // LOAD DOCUMENTS WHEN PAGE LOADS
  // =====================================================

  useEffect(() => {
    getEmployeeDocuments();
  }, []);

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
  // ONLY SHOW UPLOADED DOCUMENTS
  // =====================================================

  const availableDocuments = documentList.filter((document, index, array) => {
    const file = documents?.[document.key];

    if (file === null || file === undefined || String(file).trim() === "") {
      return false;
    }

    // Remove duplicate document names
    return array.findIndex((item) => item.name === document.name) === index;
  });

  // =====================================================
  // CREATE FILE URL
  // =====================================================

  const getFileUrl = (filePath) => {
    if (!filePath) {
      return "";
    }

    // Already a complete URL
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }

    const baseUrl = BASE_URL.replace(/\/+$/, "");
    const path = String(filePath).replace(/^\/+/, "");

    return `${baseUrl}/${path}`;
  };

  // =====================================================
  // PREVIEW
  // =====================================================

  const handlePreview = (filePath, documentName) => {
    const fileUrl = getFileUrl(filePath);

    if (!fileUrl) {
      alert("Document not available");
      return;
    }

    console.log("Preview URL:", fileUrl);

    setPreviewFile(fileUrl);
    setPreviewName(documentName);
  };

  // =====================================================
  // DOWNLOAD
  // =====================================================

  const handleDownload = async (filePath, documentName) => {
    try {
      const fileUrl = getFileUrl(filePath);

      if (!fileUrl) {
        alert("Document not available");
        return;
      }

      const response = await axios.get(fileUrl, {
        responseType: "blob",
        withCredentials: true,
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = blobUrl;

      // Keep original extension when possible
      const originalPath = String(filePath);

      const extension = originalPath.split(".").pop() || "pdf";

      link.download = `${documentName}.${extension}`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download Error:", error.response?.data || error);

      alert("Unable to download document");
    }
  };

  // =====================================================
  // CHECK IMAGE
  // =====================================================

  const isImageFile = (fileUrl) => {
    return /\.(jpg|jpeg|png|webp|gif|bmp|svg)(\?.*)?$/i.test(fileUrl);
  };

  // =====================================================
  // CHECK PDF
  // =====================================================

  const isPdfFile = (fileUrl) => {
    return /\.pdf(\?.*)?$/i.test(fileUrl);
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <MainPanel
      title="View Uploaded Documents"
      breadcrumbs={[
        {
          label: "Dashboard",
          link: "/dashboard",
        },
        {
          label: "View Documents",
        },
      ]}
    >
      <div className="view-doc">
        {/* ================================
            HEADER
        ================================= */}

        <h1>My Documents</h1>

        <div className="view-doc-bottom">
          {/* ================================
              LOADING
          ================================= */}

          {loadingDocuments && (
            <div className="document-loading">Loading Documents...</div>
          )}

          {/* ================================
              NO DOCUMENTS
          ================================= */}

          {!loadingDocuments && availableDocuments.length === 0 && (
            <div className="no-documents">No documents uploaded.</div>
          )}

          {/* ================================
              DOCUMENTS
          ================================= */}

          {!loadingDocuments && availableDocuments.length > 0 && (
            <div className="document-preview-wrapper">
              {/* =================================
                    DOCUMENT LIST
                ================================= */}

              <div className="document-list">
                {availableDocuments.map((document) => {
                  const filePath = documents[document.key];

                  return (
                    <div className="document-card" key={document.key}>
                      <GrDocumentPdf className="pdf-icon" />

                      <p>{document.name}</p>

                      <div className="btn-parent">
                        {/* PREVIEW */}

                        <button
                          type="button"
                          className="pre"
                          onClick={() => handlePreview(filePath, document.name)}
                        >
                          <MdOutlinePreview />
                          Preview
                        </button>

                        {/* DOWNLOAD */}

                        <button
                          type="button"
                          className="down"
                          onClick={() =>
                            handleDownload(filePath, document.name)
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

              {/* =================================
                    PREVIEW SECTION
                ================================= */}

              <div className="preview-section">
                {previewFile ? (
                  <>
                    {/* PREVIEW HEADER */}

                    <div className="preview-header">
                      <h2>{previewName}</h2>

                      <button
                        type="button"
                        onClick={() => {
                          setPreviewFile("");
                          setPreviewName("");
                        }}
                      >
                        Close
                      </button>
                    </div>

                    {/* PREVIEW CONTENT */}

                    <div className="preview-content">
                      {isImageFile(previewFile) ? (
                        <img src={previewFile} alt={previewName} />
                      ) : isPdfFile(previewFile) ? (
                        <iframe src={previewFile} title={previewName} />
                      ) : (
                        <iframe src={previewFile} title={previewName} />
                      )}
                    </div>
                  </>
                ) : (
                  <div className="preview-empty">
                    <MdOutlinePreview />

                    <p>Select Preview to view the document</p>
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
