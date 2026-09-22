import React, { useContext, useEffect, useState } from "react";
import "./UploadDoc.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import FileUpload from "../../comp/FileUpload/FileUpload";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../../../Context";

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

const UploadDoc = () => {
  const { user } = useContext(UserContext);

  const [documents, setDocuments] = useState(initialDocuments);
  const [availableDocuments, setAvailableDocuments] = useState({});
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [updating, setUpdating] = useState(false);

  const employeeId = user?.employeeId;

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

    if (!file) return;

    setDocuments((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  const isDocumentAvailable = (name) => {
    const selectedFile = documents[name];
    const existingFile = availableDocuments?.[name];

    return Boolean(selectedFile || existingFile);
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
      toast.error("Please select at least one new document");
      return;
    }

    try {
      setUpdating(true);

      const formData = new FormData();

      selectedDocuments.forEach(([name, file]) => {
        formData.append(name, file);
      });

      const response = await axios.put(
        `${BASE_URL}uploadDoc/update`,
        formData,
        {
          params: {
            uId: uid,
          },
          withCredentials: true,
        }
      );

      if (response?.status === 200 || response?.status === 201) {
        toast.success("Documents updated successfully");

        setDocuments(initialDocuments);

        await getEmployeeDocuments();
      }
    } catch (error) {
      console.error(
        "Update Documents Error:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to update documents"
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <MainPanel
      title={
        String(user?.role || user?.crmRole || "")
          .trim()
          .toUpperCase() === "EMPLOYEE"
          ? "Employee Dashboard"
          : "Admin Dashboard"
      }
    >
      <div className="upload-parent">
        <h1>Update Documents</h1>

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
                  file={
                    documents.adharCard ||
                    availableDocuments?.adharCard
                  }
                  onChange={(e) =>
                    handleFileChange("adharCard", e)
                  }
                />

                <FileUpload
                  file={
                    documents.panCard ||
                    availableDocuments?.panCard
                  }
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
                {updating ? "Updating..." : "Update Documents"}
              </button>
            </div>
          </form>
        )}
      </div>
    </MainPanel>
  );
};

export default UploadDoc;