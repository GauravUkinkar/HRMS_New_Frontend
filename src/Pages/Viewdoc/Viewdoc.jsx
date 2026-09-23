import React, { useEffect, useState } from "react";

import "./Viewdoc.scss";

import { GrDocumentPdf } from "react-icons/gr";
import { IoMdDownload } from "react-icons/io";
import { MdOutlinePreview } from "react-icons/md";

import MainPanel from "../../comp/MainPanel/MainPanel";

import axios from "axios";

const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

const Viewdoc = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [documents, setDocuments] = useState({});
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  const [previewFile, setPreviewFile] = useState("");
  const [previewName, setPreviewName] = useState("");

  useEffect(() => {
    getAllEmployee();
  }, []);

  // ============================================
  // GET ALL EMPLOYEES
  // ============================================
  const getAllEmployee = async () => {
    try {
      setLoadingEmployees(true);

      console.log(
        "Employee API URL:",
        `${BASE_URL}Admin/GetAllEmployee`
      );

      const res = await axios.get(
        `${BASE_URL}Admin/GetAllEmployee`,
        {
          withCredentials: true,
        }
      );

      console.log("All Employee API Response:", res.data);

      const employeeData = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      const employeeList = employeeData
        .map((item) => {
          const employee = item?.data || item;

          if (!employee) {
            return null;
          }

          return {
            uid: employee.uid,
            employeeName: employee.employeeName,
            employeeId: employee.employeeId,
          };
        })
        .filter(
          (employee) =>
            employee?.uid &&
            employee?.employeeId
        );

      setEmployees(employeeList);

      console.log("Employee List:", employeeList);
    } catch (error) {
      console.error("Get Employee Error:", error);
      console.error("Status:", error?.response?.status);
      console.error("Response:", error?.response?.data);

      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  // ============================================
  // GET EMPLOYEE DOCUMENTS
  // ============================================
  const getEmployeeDocuments = async (employeeId) => {
    try {
      setLoadingDocuments(true);

      setDocuments({});
      setPreviewFile("");
      setPreviewName("");

      console.log(
        "Getting documents for Employee ID:",
        employeeId
      );

      const res = await axios.get(
        `${BASE_URL}uploadDoc/getDocumentsByEmployeeId/${employeeId}`,
        {
          withCredentials: true,
        }
      );

      console.log(
        "Employee Documents API Response:",
        res.data
      );

      if (
        res.data?.status === "OK" &&
        res.data?.data
      ) {
        setDocuments(res.data.data);

        console.log(
          "Documents:",
          res.data.data
        );
      } else {
        setDocuments({});
      }
    } catch (error) {
      console.error(
        "Get Documents Error:",
        error?.response?.data || error
      );

      setDocuments({});
    } finally {
      setLoadingDocuments(false);
    }
  };

  // ============================================
  // EMPLOYEE CHANGE
  // ============================================
  const handleEmployeeChange = (e) => {
    const uid = e.target.value;

    setSelectedEmployee(uid);

    setDocuments({});
    setPreviewFile("");
    setPreviewName("");

    if (!uid) {
      return;
    }

    const selectedEmp = employees.find(
      (employee) =>
        String(employee.uid) === String(uid)
    );

    console.log(
      "Selected Employee:",
      selectedEmp
    );

    if (selectedEmp?.employeeId) {
      getEmployeeDocuments(
        selectedEmp.employeeId
      );
    }
  };

  // ============================================
  // DOCUMENT LIST
  // ============================================
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

  // ============================================
  // AVAILABLE DOCUMENTS
  // ============================================
  const availableDocuments =
    documentList.filter(
      (document, index, array) => {
        const file = documents?.[document.key];

        if (
          file === null ||
          file === undefined ||
          String(file).trim() === ""
        ) {
          return false;
        }

        return (
          array.findIndex(
            (item) =>
              item.name === document.name
          ) === index
        );
      }
    );

  // ============================================
  // CREATE FILE URL
  // ============================================
  const getFileUrl = (filePath) => {
    if (!filePath) {
      return "";
    }

    const filePathString = String(filePath).trim();

    // Already a complete URL
    if (
      filePathString.startsWith("http://") ||
      filePathString.startsWith("https://")
    ) {
      return filePathString;
    }

    const baseUrl = String(BASE_URL || "").replace(
      /\/+$/,
      ""
    );

    const path = filePathString.replace(
      /^\/+/,
      ""
    );

    return `${baseUrl}/${path}`;
  };

  // ============================================
  // GET ORIGINAL FILE NAME
  // ============================================
  const getOriginalFileName = (
    filePath,
    documentName
  ) => {
    if (!filePath) {
      return `${documentName}.pdf`;
    }

    try {
      const cleanPath = String(filePath)
        .split("?")[0]
        .split("#")[0];

      const fileName = cleanPath
        .split("/")
        .pop();

      if (
        fileName &&
        fileName.includes(".")
      ) {
        return decodeURIComponent(fileName);
      }
    } catch (error) {
      console.error(
        "Filename extraction error:",
        error
      );
    }

    return `${documentName}.pdf`;
  };

  // ============================================
  // PREVIEW
  // ============================================
  const handlePreview = (
    filePath,
    documentName
  ) => {
    const fileUrl = getFileUrl(filePath);

    if (!fileUrl) {
      alert("Document not available");
      return;
    }

    console.log("Preview URL:", fileUrl);

    setPreviewFile(fileUrl);
    setPreviewName(documentName);
  };

  // ============================================
  // DOWNLOAD DOCUMENT
  // ============================================
  const handleDownload = async (
    filePath,
    documentName
  ) => {
    try {
      const fileUrl = getFileUrl(filePath);

      if (!fileUrl) {
        alert("Document not available");
        return;
      }

      console.log(
        "Downloading file:",
        fileUrl
      );

      // Get the original filename
      let fileName = getOriginalFileName(
        filePath,
        documentName
      );

      console.log(
        "Default file name:",
        fileName
      );

      /*
       * Fetch the file as Blob.
       *
       * credentials: "include" sends the
       * logged-in user's cookies if your
       * backend requires authentication.
       */
      const response = await fetch(fileUrl, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(
          `Download failed: ${response.status} ${response.statusText}`
        );
      }

      // ========================================
      // TRY TO GET FILE NAME FROM BACKEND
      // ========================================
      const contentDisposition =
        response.headers.get(
          "content-disposition"
        );

      if (contentDisposition) {
        const fileNameMatch =
          contentDisposition.match(
            /filename\*=UTF-8''([^;]+)|filename="?([^"]+)"?/i
          );

        if (fileNameMatch) {
          fileName = decodeURIComponent(
            fileNameMatch[1] ||
              fileNameMatch[2]
          );
        }
      }

      console.log(
        "Final download filename:",
        fileName
      );

      // ========================================
      // CREATE BLOB
      // ========================================
      const blob = await response.blob();

      if (!blob || blob.size === 0) {
        throw new Error(
          "Downloaded file is empty"
        );
      }

      // ========================================
      // CREATE TEMPORARY DOWNLOAD URL
      // ========================================
      const blobUrl =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = blobUrl;
      link.download = fileName;

      link.style.display = "none";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      // Give browser a little time before
      // releasing the Blob URL
      setTimeout(() => {
        window.URL.revokeObjectURL(
          blobUrl
        );
      }, 1000);

      console.log(
        "Document downloaded successfully:",
        fileName
      );
    } catch (error) {
      console.error(
        "Download Error:",
        error
      );

      /*
       * Fallback:
       * If the backend does not allow Blob
       * download because of CORS, open the
       * file directly.
       */
      try {
        const fileUrl = getFileUrl(filePath);

        if (fileUrl) {
          const link =
            document.createElement("a");

          link.href = fileUrl;
          link.target = "_blank";
          link.rel = "noopener noreferrer";

          document.body.appendChild(link);

          link.click();

          document.body.removeChild(link);

          return;
        }
      } catch (fallbackError) {
        console.error(
          "Fallback download error:",
          fallbackError
        );
      }

      alert(
        "Unable to download document. Please check the document URL or backend access."
      );
    }
  };

  // ============================================
  // CHECK IMAGE
  // ============================================
  const isImageFile = (fileUrl) => {
    return /\.(jpg|jpeg|png|webp|gif|bmp|svg)(\?.*)?$/i.test(
      fileUrl
    );
  };

  // ============================================
  // CHECK PDF
  // ============================================
  const isPdfFile = (fileUrl) => {
    return /\.pdf(\?.*)?$/i.test(
      fileUrl
    );
  };

  // ============================================
  // JSX
  // ============================================
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
        <h1>View Documents</h1>

        <div className="view-doc-bottom">

          {/* EMPLOYEE DROPDOWN */}
          <div className="emp-list">
            <select
              name="employeeName"
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              disabled={loadingEmployees}
            >
              <option value="">
                {loadingEmployees
                  ? "Loading Employees..."
                  : "Select Employee"}
              </option>

              {employees.map(
                (employee) => (
                  <option
                    key={employee.uid}
                    value={employee.uid}
                  >
                    {employee.employeeName} -{" "}
                    {employee.employeeId}
                  </option>
                )
              )}
            </select>
          </div>

          {/* LOADING */}
          {loadingDocuments && (
            <div className="document-loading">
              Loading Documents...
            </div>
          )}

          {/* NO DOCUMENTS */}
          {!loadingDocuments &&
            selectedEmployee &&
            availableDocuments.length ===
              0 && (
              <div className="no-documents">
                No documents uploaded for
                this employee.
              </div>
            )}

          {/* DOCUMENTS */}
          {!loadingDocuments &&
            availableDocuments.length > 0 && (
              <div className="document-preview-wrapper">

                {/* DOCUMENT LIST */}
                <div className="document-list">
                  {availableDocuments.map(
                    (document) => {
                      const filePath =
                        documents[
                          document.key
                        ];

                      return (
                        <div
                          className="document-card"
                          key={document.key}
                        >
                          <GrDocumentPdf className="pdf-icon" />

                          <p>
                            {document.name}
                          </p>

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
                    }
                  )}
                </div>

                {/* PREVIEW SECTION */}
                <div className="preview-section">

                  {previewFile ? (
                    <>
                      <div className="preview-header">
                        <h2>
                          {previewName}
                        </h2>

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

                      <div className="preview-content">

                        {isImageFile(
                          previewFile
                        ) ? (
                          <img
                            src={previewFile}
                            alt={previewName}
                          />
                        ) : isPdfFile(
                            previewFile
                          ) ? (
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
                        Select Preview to view
                        the document
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

export default Viewdoc;