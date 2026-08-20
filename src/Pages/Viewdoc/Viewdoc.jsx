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

  const getAllEmployee = async () => {
    try {
      setLoadingEmployees(true);

      const res = await axios.get(
        `${BASE_URL}Admin/GetAllEmployee`,
        {
          withCredentials: true,
        }
      );

      console.log("All Employee API Response:", res.data);

      const employeeList = res.data
        .map((item) => {
          if (!item?.data) {
            return null;
          }

          return {
            uid: item.data.uid,
            employeeName: item.data.employeeName,
            employeeId: item.data.employeeId,
          };
        })
        .filter(Boolean);

      setEmployees(employeeList);

      console.log("Employee List:", employeeList);
    } catch (error) {
      console.error(
        "Get Employee Error:",
        error.response?.data || error
      );
    } finally {
      setLoadingEmployees(false);
    }
  };

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
        error.response?.data || error
      );

      setDocuments({});
    } finally {
      setLoadingDocuments(false);
    }
  };

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

  const availableDocuments = documentList.filter(
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
          (item) => item.name === document.name
        ) === index
      );
    }
  );

  const getFileUrl = (filePath) => {
    if (!filePath) {
      return "";
    }

    if (
      filePath.startsWith("http://") ||
      filePath.startsWith("https://")
    ) {
      return filePath;
    }

    const baseUrl = BASE_URL.replace(
      /\/+$/,
      ""
    );

    const path = String(filePath).replace(
      /^\/+/,
      ""
    );

    return `${baseUrl}/${path}`;
  };

  const handlePreview = (
    filePath,
    documentName
  ) => {
    const fileUrl = getFileUrl(filePath);

    if (!fileUrl) {
      return;
    }

    console.log(
      "Preview URL:",
      fileUrl
    );

    setPreviewFile(fileUrl);
    setPreviewName(documentName);
  };

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
      type: response.headers["content-type"] || "application/pdf",
    });

    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${documentName}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error(
      "Download Error:",
      error.response?.data || error
    );

    alert("Unable to download document");
  }
};

  const isImageFile = (fileUrl) => {
    return /\.(jpg|jpeg|png|webp|gif|bmp|svg)(\?.*)?$/i.test(
      fileUrl
    );
  };

  const isPdfFile = (fileUrl) => {
    return /\.pdf(\?.*)?$/i.test(
      fileUrl
    );
  };

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

          {loadingDocuments && (
            <div className="document-loading">
              Loading Documents...
            </div>
          )}

          {!loadingDocuments &&
            selectedEmployee &&
            availableDocuments.length ===
              0 && (
              <div className="no-documents">
                No documents uploaded for
                this employee.
              </div>
            )}

          {!loadingDocuments &&
            availableDocuments.length > 0 && (
              <div className="document-preview-wrapper">

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