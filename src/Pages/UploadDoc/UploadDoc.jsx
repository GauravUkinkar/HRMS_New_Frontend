import React, { useState } from "react";
import "./UploadDoc.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import FileUpload from "../../comp/FileUpload/FileUpload";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

const UploadDoc = () => {

  const [documents, setDocuments] = useState({
    aadharCard: null,
    panCard: null,
    tenthCertificate: null,
    twelfthCertificate: null,
    degreeCertificate: null,
    diplomaCertificate: null,
    postGraduationCertificate: null,
    relievingCertificate: null,
    experienceLetter: null,
    bankStatement: null,
    salarySlip1: null,
    salarySlip2: null,
  });

  const [loading, setLoading] = useState(false);

  const getCurrentUserUid = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}Admin/getUserById`,
        {
          withCredentials: true,
        }
      );

      console.log(
        "Current User Response:",
        response.data
      );

      const uid =
        response.data?.uid ??
        response.data?.data?.uid;

      console.log(
        "Logged-in User UID:",
        uid
      );

      return uid;

    } catch (error) {
      console.error(
        "Get Current User Error:",
        error.response?.data || error
      );

      return null;
    }
  };

  const handleFileChange = (
    name,
    event
  ) => {
    const file =
      event.target.files?.[0];
    if (!file) {
      return;
    }
    setDocuments((prev) => ({
      ...prev,
      [name]: file,
    }));
    console.log(
      `${name}:`,
      file
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const uid =
        await getCurrentUserUid();
      if (!uid) {
        toast.error(
          "Unable to get logged-in user UID"
        );
        return;
      }

      console.log(
        "Uploading documents for UID:",
        uid
      );

      const requiredDocuments = [
        {
          key: "aadharCard",
          label: "Aadhar Card",
        },
        {
          key: "panCard",
          label: "Pan Card",
        },
        {
          key: "tenthCertificate",
          label: "10th Certificate",
        },
        {
          key: "twelfthCertificate",
          label: "12th Certificate",
        },
        {
          key: "degreeCertificate",
          label: "Degree Certificate",
        },
        {
          key: "relievingCertificate",
          label: "Releiving Certificate",
        },
      ];

      for (
        const document of requiredDocuments
      ) {
        if (
          !documents[document.key]
        ) {
          toast.error(
            `Please upload ${document.label}`
          );

          return;
        }
      }

      const formData =
        new FormData();
      Object.entries(
        documents
      ).forEach(
        ([key, file]) => {
          if (file) {
            formData.append(
              key,
              file
            );
          }
        }
      );

      console.log(
        "========== DOCUMENT UPLOAD =========="
      );

      console.log(
        "UID:",
        uid
      );

      for (
        const [
          key,
          value,
        ] of formData.entries()
      ) {
        console.log(
          key,
          value
        );
      }
      const response =
        await axios.post(
          `${BASE_URL}uploadDoc/upload`,
          formData,
          {
            params: {
              uid: uid,
            },

            withCredentials: true,
          }
        );
      console.log(
        "Upload Response:",
        response.data
      );

      toast.success(
        "Documents uploaded successfully!"
      );
      setDocuments({
        aadharCard: null,
        panCard: null,
        tenthCertificate: null,
        twelfthCertificate: null,
        degreeCertificate: null,
        diplomaCertificate: null,
        postGraduationCertificate: null,
        relievingCertificate: null,
        experienceLetter: null,
        bankStatement: null,
        salarySlip1: null,
        salarySlip2: null,
      });

    } catch (error) {
      console.error(
        "Upload Documents Error:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to upload documents"
      );

    } finally {
      setLoading(false);
    }
  };
  return (
    <MainPanel
      title="Upload Documents"
      breadcrumbs={[
        {
          label: "Dashboard",
          link: "/dashboard",
        },
        {
          label: "Documents",
        },
      ]}
    >
      <form
        className="upload-parent"
        onSubmit={handleSubmit}
      >
        <h1>
          Upload Documents
        </h1>

        <div className="inputs">
          <div className="form-row">

            <FileUpload
              label="Aadhar Card"
              required
              onChange={(e) =>
                handleFileChange(
                  "aadharCard",
                  e
                )
              }
            />

            <FileUpload
              label="Pan Card"
              required
              onChange={(e) =>
                handleFileChange(
                  "panCard",
                  e
                )
              }
            />

          </div>
          <div className="form-row">
            <FileUpload
              label="10th Certificate"
              required
              onChange={(e) =>
                handleFileChange(
                  "tenthCertificate",
                  e
                )
              }
            />
            <FileUpload
              label="12th Certificate"
              required
              onChange={(e) =>
                handleFileChange(
                  "twelfthCertificate",
                  e
                )
              }
            />

          </div>
          <div className="form-row">
            <FileUpload
              label="Degree Certificate"
              required
              onChange={(e) =>
                handleFileChange(
                  "degreeCertificate",
                  e
                )
              }
            />
            <FileUpload
              label="Diploma Certificate"
              onChange={(e) =>
                handleFileChange(
                  "diplomaCertificate",
                  e
                )
              }
            />

          </div>
          <div className="form-row">
            <FileUpload
              label="Post-Graduation Certificate"
              onChange={(e) =>
                handleFileChange(
                  "postGraduationCertificate",
                  e
                )
              }
            />

            <FileUpload
              label="Releiving Certificate"
              required
              onChange={(e) =>
                handleFileChange(
                  "relievingCertificate",
                  e
                )
              }
            />

          </div>
          <div className="form-row">
            <FileUpload
              label="Experience Letter"
              onChange={(e) =>
                handleFileChange(
                  "experienceLetter",
                  e
                )
              }
            />
            <FileUpload
              label="Bank Statement"
              onChange={(e) =>
                handleFileChange(
                  "bankStatement",
                  e
                )
              }
            />

          </div>

          <div className="form-row">

            <FileUpload
              label="Salary-Slip1"
              onChange={(e) =>
                handleFileChange(
                  "salarySlip1",
                  e
                )
              }
            />

            <FileUpload
              label="Salary-Slip2"
              onChange={(e) =>
                handleFileChange(
                  "salarySlip2",
                  e
                )
              }
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn"
          disabled={loading}
        >
          {loading
            ? "Uploading..."
            : "Submit"}
        </button>

      </form>
    </MainPanel>
  );
};

export default UploadDoc;