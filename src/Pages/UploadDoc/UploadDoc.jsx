import React, { useContext, useEffect, useState } from "react";
import "./UploadDoc.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import FileUpload from "../../comp/FileUpload/FileUpload";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../../../Context";
import { Link } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

const initialDocuments = {
  adharCard: null,
  panCard: null,
  experianceLetter: null,
  salarySlip1: null,
  salarySlip2: null,
  salarySlip3: null,
  bankStatement: null,
  relevingLetter: null,
  tenthCertificate: null,
  twelfthCertificate: null,
  degreeCertificate: null,
  latestEducationCertificateOrDegree: null,
  employeeImage: null,
  diplomaCertificate: null,
};

const documentKeys = [
  "adharCard",
  "panCard",
  "experianceLetter",
  "salarySlip1",
  "salarySlip2",
  "salarySlip3",
  "bankStatement",
  "relevingLetter",
  "tenthCertificate",
  "twelfthCertificate",
  "degreeCertificate",
  "latestEducationCertificateOrDegree",
  "employeeImage",
  "diplomaCertificate",
];

const UploadDoc = () => {
  const { user } = useContext(UserContext);

  const [documents, setDocuments] = useState(initialDocuments);
  const [availableDocuments, setAvailableDocuments] = useState({});
  const [errors, setErrors] = useState({});
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [updating, setUpdating] = useState(false);

  const employeeId = user?.employeeId;

  const hasExistingDocuments = documentKeys.some((key) => {
    const value = availableDocuments?.[key];

    return (
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ""
    );
  });

  const getEmployeeDocuments = async () => {
    if (!employeeId) {
      setLoadingDocuments(false);
      return;
    }

    try {
      setLoadingDocuments(true);

      const response = await axios.get(
        `${BASE_URL}uploadDoc/getDocumentsByEmployeeId/${employeeId}`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.status === "OK" && response?.data?.data) {
        setAvailableDocuments(response.data.data);
      } else {
        setAvailableDocuments({});
      }
    } catch (error) {
      console.error(
        "Get Documents Error:",
        error?.response?.data || error
      );

      setAvailableDocuments({});
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    getEmployeeDocuments();
  }, [employeeId]);

  const handleFileChange = (name, event) => {
    const file = event.target.files?.[0];

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (!file) return;

    const maxFileSize = 2 * 1024 * 1024;

    if (file.size > maxFileSize) {
      setErrors((prev) => ({
        ...prev,
        [name]:
          "File size exceeded. Maximum allowed file size is 2 MB.",
      }));

      setDocuments((prev) => ({
        ...prev,
        [name]: null,
      }));

      event.target.value = "";
      return;
    }

    setDocuments((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uid = user?.uid;

    if (!uid) {
      toast.error("User ID not found");
      return;
    }

    const selectedDocuments = Object.entries(documents).filter(
      ([, file]) => file instanceof File
    );

    if (selectedDocuments.length === 0) {
      toast.error("Please select at least one document");
      return;
    }

    if (!hasExistingDocuments) {
      const requiredDocuments = [
        "adharCard",
        "panCard",
      ];

      const missingDocuments = requiredDocuments.filter(
        (documentName) => !documents[documentName]
      );

      if (missingDocuments.length > 0) {
        toast.error(
          "Please upload Aadhar Card and PAN Card"
        );
        return;
      }
    }

    try {
      setUpdating(true);

      const formData = new FormData();

      selectedDocuments.forEach(([name, file]) => {
        formData.append(name, file);
      });

      const apiUrl = hasExistingDocuments
        ? `${BASE_URL}uploadDoc/update`
        : `${BASE_URL}uploadDoc/upload`;

      const method = hasExistingDocuments ? "put" : "post";

      const response = await axios[method](
        apiUrl,
        formData,
        {
          params: {
            uId: uid,
          },
          withCredentials: true,
        }
      );

      if (
        response?.status === 200 ||
        response?.status === 201
      ) {
        toast.success(
          hasExistingDocuments
            ? "Documents updated successfully"
            : "Documents uploaded successfully"
        );

        setDocuments(initialDocuments);
        setErrors({});

        await getEmployeeDocuments();
      }
    } catch (error) {
      console.error(
        "Documents Error:",
        error?.response?.data || error
      );

      const backendMessage =
        error?.response?.data?.responseMessage ||
        error?.response?.data?.message;

      toast.error(
        backendMessage ||
          (hasExistingDocuments
            ? "Failed to update documents"
            : "Failed to upload documents")
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    
    <MainPanel
                  breadcrumbs={[
          { label: "Dashboard", link: "/dashboard" },
          { label: "Upload Documents" },
        ]}
      title={
        String(user?.role || user?.crmRole || "")
          .trim()
          .toUpperCase() === "EMPLOYEE"
          ? "Employee Dashboard"
          : "Upload Documents"
      }
    >
              <Link to="/">
        <button className="btn1"><IoMdArrowBack />Back</button></Link>
      <div className="upload-parent">
        <h1>
          {hasExistingDocuments
            ? "Update Documents"
            : "Upload Documents"}
        </h1>

        {loadingDocuments ? (
          <div className="document-loading">
            Loading Documents...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="inputs">
              <div className="form-row">
                <FileUpload
                  label="Aadhar Card"
                  required={!hasExistingDocuments}
                  file={
                    documents.adharCard ||
                    availableDocuments?.adharCard
                  }
                  error={errors.adharCard}
                  onChange={(e) =>
                    handleFileChange("adharCard", e)
                  }
                />

                <FileUpload
                  label="PAN Card"
                  required={!hasExistingDocuments}
                  file={
                    documents.panCard ||
                    availableDocuments?.panCard
                  }
                  error={errors.panCard}
                  onChange={(e) =>
                    handleFileChange("panCard", e)
                  }
                />
              </div>

              <div className="form-row">
                <FileUpload
                  label="10th Certificate"
                  file={
                    documents.tenthCertificate ||
                    availableDocuments?.tenthCertificate
                  }
                  error={errors.tenthCertificate}
                  onChange={(e) =>
                    handleFileChange("tenthCertificate", e)
                  }
                />

                <FileUpload
                  label="12th Certificate"
                  file={
                    documents.twelfthCertificate ||
                    availableDocuments?.twelfthCertificate
                  }
                  error={errors.twelfthCertificate}
                  onChange={(e) =>
                    handleFileChange("twelfthCertificate", e)
                  }
                />
              </div>

              <div className="form-row">
                <FileUpload
                  label="Degree Certificate"
                  file={
                    documents.degreeCertificate ||
                    availableDocuments?.degreeCertificate
                  }
                  error={errors.degreeCertificate}
                  onChange={(e) =>
                    handleFileChange("degreeCertificate", e)
                  }
                />

                <FileUpload
                  label="Diploma Certificate"
                  file={
                    documents.diplomaCertificate ||
                    availableDocuments?.diplomaCertificate
                  }
                  error={errors.diplomaCertificate}
                  onChange={(e) =>
                    handleFileChange("diplomaCertificate", e)
                  }
                />
              </div>

              <div className="form-row">
                <FileUpload
                  label="Experience Letter"
                  file={
                    documents.experianceLetter ||
                    availableDocuments?.experianceLetter
                  }
                  error={errors.experianceLetter}
                  onChange={(e) =>
                    handleFileChange("experianceLetter", e)
                  }
                />

                <FileUpload
                  label="Relieving Letter"
                  file={
                    documents.relevingLetter ||
                    availableDocuments?.relevingLetter
                  }
                  error={errors.relevingLetter}
                  onChange={(e) =>
                    handleFileChange("relevingLetter", e)
                  }
                />
              </div>

              <div className="form-row">
                <FileUpload
                  label="Salary Slip 1"
                  file={
                    documents.salarySlip1 ||
                    availableDocuments?.salarySlip1
                  }
                  error={errors.salarySlip1}
                  onChange={(e) =>
                    handleFileChange("salarySlip1", e)
                  }
                />

                <FileUpload
                  label="Salary Slip 2"
                  file={
                    documents.salarySlip2 ||
                    availableDocuments?.salarySlip2
                  }
                  error={errors.salarySlip2}
                  onChange={(e) =>
                    handleFileChange("salarySlip2", e)
                  }
                />
              </div>

              <div className="form-row">
                <FileUpload
                  label="Salary Slip 3"
                  file={
                    documents.salarySlip3 ||
                    availableDocuments?.salarySlip3
                  }
                  error={errors.salarySlip3}
                  onChange={(e) =>
                    handleFileChange("salarySlip3", e)
                  }
                />

                <FileUpload
                  label="Bank Statement"
                  file={
                    documents.bankStatement ||
                    availableDocuments?.bankStatement
                  }
                  error={errors.bankStatement}
                  onChange={(e) =>
                    handleFileChange("bankStatement", e)
                  }
                />
              </div>

              <div className="form-row">
                <FileUpload
                  label="Latest Education Certificate/Degree"
                  file={
                    documents.latestEducationCertificateOrDegree ||
                    availableDocuments?.latestEducationCertificateOrDegree
                  }
                  error={
                    errors.latestEducationCertificateOrDegree
                  }
                  onChange={(e) =>
                    handleFileChange(
                      "latestEducationCertificateOrDegree",
                      e
                    )
                  }
                />

                <FileUpload
                  label="Employee Image"
                  file={
                    documents.employeeImage ||
                    availableDocuments?.employeeImage
                  }
                  error={errors.employeeImage}
                  onChange={(e) =>
                    handleFileChange("employeeImage", e)
                  }
                />
              </div>

              <button
                type="submit"
                className="btn"
                disabled={updating}
              >
                {updating
                  ? hasExistingDocuments
                    ? "Updating..."
                    : "Uploading..."
                  : hasExistingDocuments
                  ? "Update Documents"
                  : "Upload Documents"}
              </button>
            </div>
          </form>
        )}
      </div>
    </MainPanel>
  );
};

export default UploadDoc;