
import React, { useContext, useRef, useState } from "react";
import "./JoiningLetter.scss";


import MainPanel from "../../comp/MainPanel/MainPanel";

import panWatermark from "../../assets/pan-watermark.webp";
import panLogo from "../../assets/offer-logo-pan.png";

import indianJourneyWatermark from "../../assets/tij-watermark.png";
import indianJourneyLogo from "../../assets/tij-logo.png";

import akkaWatermark from "../../assets/akka-foundation.png";
import akkaLogo from "../../assets/akka-foundation.png";

import nvmWatermark from "../../assets/nvm-watermark.png";
import nvmLogo from "../../assets/nvm-logo.png";

import Input from "../../comp/input/Input";
import SelectInput from "../../comp/selectInput/SelectInput";

import { MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { UserContext } from "../../../Context";

// =====================================================
// COMPANY CONFIG
// =====================================================

const companyConfig = {
  "The Indian Journey": {
    logo: indianJourneyLogo,
    watermark: indianJourneyWatermark,
    address: "214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014",
    contact: "+91 76666 01972",
    location: "Pune",
  },

  "Pandoza Solutions Pvt.Ltd.": {
    logo: panLogo,
    watermark: panWatermark,
    address: "214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014",
    contact: "+91 76666 01972",
    location: "Pune",
  },

  "Akka Foundation": {
    logo: akkaLogo,
    watermark: akkaWatermark,
    address: "214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014",
    contact: "+91 76666 01972",
    location: "Pune",
  },

  "Nvm Infratech Pvt.Ltd": {
    logo: nvmLogo,
    watermark: nvmWatermark,
    address: "214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014",
    contact: "+91 76666 01972",
    location: "Pune",
  },
};

// =====================================================
// INITIAL FORM DATA
// =====================================================



const initialFormData = {
  issuedDate: new Date().toISOString().split("T")[0],

  companyName: "",
  employeeName: "",
  email: "",
  gender: "",
  designation: "",
  department: "",
  dateOfjoining: "",
  employeeType: "",
  salary: "",
  hrManagerName: "",
};

// =====================================================
// JOINING LETTER PREVIEW
// =====================================================

const JoiningLetterPreview = ({
  formData,
  selectedCompany,
  formatDate,
}) => {
  return (
    
    <div className="joining-pdf-page">

      {/* WATERMARK */}

      <img
        className="joining-water-mark"
        src={selectedCompany.watermark}
        alt="Company Watermark"
      />

      {/* HEADER */}

      <div className="joining-header">

        <div className="joining-date">
          Date: {formatDate(formData.issuedDate)}
        </div>

        <div className="joining-logo">
          <img
            src={selectedCompany.logo}
            alt={formData.companyName || "Company Logo"}
          />
        </div>

      </div>

      {/* HEADING */}

      <div className="joining-heading">
        <h3>JOINING LETTER</h3>
      </div>

      {/* CONTENT */}

      <div className="joining-content">

        <p>Dear</p>

        <p className="employee-name">
          <strong>
            {formData.employeeName || "Employee Name"}
          </strong>
        </p>

        <p>
          We are pleased to confirm that you have joined{" "}
          <strong>
            {formData.companyName || "Company Name"}
          </strong>{" "}
          as{" "}
          <strong>
            {formData.designation || "Designation"}
          </strong>{" "}
          in the{" "}
          <strong>
            {formData.department || "Department"}
          </strong>{" "}
          department with effect from{" "}
          <strong>
            {formatDate(formData.dateOfjoining)}
          </strong>.
        </p>

        <p>
          We are delighted to welcome you to our
          organization and look forward to your
          valuable contribution towards the growth
          and success of{" "}
          <strong>
            {formData.companyName || "Company Name"}
          </strong>.
        </p>

        <p>
          Your employment will be governed by the
          terms and conditions mentioned in your
          offer letter and the policies, rules and
          regulations of the organization as amended
          from time to time.
        </p>

        <p>
          You are expected to discharge your duties
          and responsibilities diligently and maintain
          professional conduct throughout your
          employment with the organization.
        </p>

        <p>
          Your initial place of work will be at our{" "}
          <strong>{selectedCompany.location}</strong>{" "}
          office.
        </p>

        <p>
          We wish you a successful and rewarding
          career with{" "}
          <strong>
            {formData.companyName || "Company Name"}
          </strong>.
        </p>

        <p>
          We look forward to a long and mutually
          beneficial association with you.
        </p>

        {/* SIGNATURE */}

        <div className="joining-signature">

          <p>Thanking you,</p>

          <p>
            For{" "}
            <strong>
              {formData.companyName || "Company Name"}
            </strong>
          </p>

          <div className="signature-gap"></div>

          <p>
            <strong>
              {formData.hrManagerName || "HR Manager"}
            </strong>
          </p>

          <p>HR &amp; Admin Manager</p>

        </div>

      </div>

      {/* FOOTER */}

      <p className="joining-footer">
        {selectedCompany.address}
        {" | CONTACT: "}
        {selectedCompany.contact}
      </p>

    </div>
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const JoiningLetter = () => {
    const { user } = useContext(UserContext);
  const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

  const pdfRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(initialFormData);

  // =====================================================
  // SELECTED COMPANY
  // =====================================================

  const selectedCompany =
    companyConfig[formData.companyName] ||
    companyConfig["Pandoza Solutions Pvt.Ltd."];

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "DD MMM YYYY";
    }

    const parts = date.split("-");

    if (parts.length === 3) {
      const [year, month, day] = parts;

      const monthNames = [
        "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec",
      ];

      return `${day} ${monthNames[Number(month) - 1]} ${year}`;
    }

    return date;
  };

  // =====================================================
  // GENERATE JOINING LETTER PDF
  // =====================================================

  const generateJoiningLetterPDF = async () => {
    if (!pdfRef.current) {
      throw new Error("Joining letter preview not found");
    }

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    const pdfPages = pdfRef.current.querySelectorAll(
      ".joining-pdf-page"
    );

    if (!pdfPages.length) {
      throw new Error("No joining letter pages found");
    }

    let pdf = null;

    for (let i = 0; i < pdfPages.length; i++) {
      const page = pdfPages[i];

      const canvas = await html2canvas(page, {
        scale: 1.3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.65);

      const pageWidth = 700;
      const pageHeight = 1120;

      if (!pdf) {
        pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: [pageWidth, pageHeight],
          compress: true,
          precision: 2,
        });
      } else {
        pdf.addPage(
          [pageWidth, pageHeight],
          "portrait"
        );
      }

      pdf.addImage(
        imgData,
        "JPEG",
        0,
        0,
        pageWidth,
        pageHeight,
        undefined,
        "FAST"
      );
    }

    return pdf.output("blob");
  };

  // =====================================================
  // SUBMIT JOINING LETTER
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // STEP 1: GENERATE PDF

      const pdfBlob = await generateJoiningLetterPDF();

      if (!pdfBlob) {
        throw new Error("PDF generation failed");
      }

      // STEP 2: CHECK PDF SIZE

      const pdfSizeMB = pdfBlob.size / (1024 * 1024);

      if (pdfSizeMB > 2) {
        toast.error(
          `PDF size is ${pdfSizeMB.toFixed(2)} MB. Maximum allowed size is 2 MB.`
        );

        return;
      }

      // STEP 3: CREATE PDF FILE

      const employeeName =
        formData.employeeName?.trim() || "Employee";

      const pdfFileName = `${employeeName}_Joining_Letter.pdf`;

      const pdfFile = new File(
        [pdfBlob],
        pdfFileName,
        {
          type: "application/pdf",
        }
      );

      // STEP 4: CREATE API PAYLOAD

      const offerAndJoiningLetterDto = {
        issuedDate: formData.issuedDate,
        companyName: formData.companyName,
        employeeName: formData.employeeName,
        designation: formData.designation,
        department: formData.department,
        dateOfjoining: formData.dateOfjoining,
        hrManagerName: formData.hrManagerName,
        salary: Number(formData.salary) || 0,
        gender: formData.gender,
        email: formData.email,
        employeeType: formData.employeeType,
        documentName: "Joining Letter",
      };

      console.log(
        "Joining Letter Payload:",
        offerAndJoiningLetterDto
      );

      // STEP 5: CREATE MULTIPART FORMDATA

      const formDataToSend = new FormData();

      formDataToSend.append("file", pdfFile);

      // Keep the same field name as working Offer Letter API
      formDataToSend.append(
        "offerAndJoiningLetterDto ",
        JSON.stringify(offerAndJoiningLetterDto)
      );

      // STEP 6: API CALL

      const apiUrl = `${BASE_URL}Admin/AddOfferAndJoiningLetter`;

      console.log("Joining Letter API URL:", apiUrl);

      const response = await axios.post(
        apiUrl,
        formDataToSend,
        {
          withCredentials: true,
        }
      );

      console.log(
        "Joining Letter API Response:",
        response.data
      );

      // STEP 7: SUCCESS

      if (response.data?.status === "OK") {
        toast.success(
          response.data?.responseMessage ||
          "Joining letter added successfully!"
        );

        // RESET FORM

        setFormData({
          ...initialFormData,
          issuedDate: new Date().toISOString().split("T")[0],
        });

      } else {
        toast.error(
          response.data?.responseMessage ||
          "Failed to add joining letter"
        );
      }

    } catch (error) {
      console.error(
        "Joining Letter API Error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.responseMessage ||
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while adding joining letter"
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <MainPanel
              breadcrumbs={[
        { label: "Dashboard", link: "/dashboard" },
        { label: "Joining Letter" },
      ]}
      title={
        String(user?.role || user?.crmRole || "")
          .trim()
          .toUpperCase() === "ADMIN"
          ? "Admin Dashboard"
          : " "
      }
    >

      <div className="joiningleter-parent parent">

        <div className="joiningleter-cont cont">

          {/* LEFT FORM */}

          <form
            className="left-joining"
            onSubmit={handleSubmit}
          >

            {/* JOINING LETTER DATE */}

            <Input
              label="Joining-Letter Date"
              type="date"
              name="issuedDate"
              value={formData.issuedDate}
              onChange={handleChange}
              required
            />

            {/* COMPANY */}

            <SelectInput
              name="companyName"
              label="Select Company Name"
              value={formData.companyName}
              onChange={handleChange}
              required
            >
              <MenuItem value="The Indian Journey">
                The Indian Journey
              </MenuItem>

              <MenuItem value="Pandoza Solutions Pvt.Ltd.">
                Pandoza Solutions Pvt.Ltd.
              </MenuItem>

              <MenuItem value="Akka Foundation">
                Akka Foundation
              </MenuItem>

              <MenuItem value="Nvm Infratech Pvt.Ltd">
                Nvm Infratech Pvt.Ltd
              </MenuItem>
            </SelectInput>

            {/* JOINING DATE */}

            <Input
              label="Joining Date"
              type="date"
              name="dateOfjoining"
              value={formData.dateOfjoining}
              onChange={handleChange}
              required
            />

            {/* EMPLOYEE NAME */}

            <Input
              label="Employee Name"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
              required
            />

            {/* EMAIL */}

            <Input
              label="Email ID"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />


            {/* DESIGNATION */}

            <Input
              label="Employee Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />

            {/* DEPARTMENT */}

            <Input
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            />

            {/* EMPLOYEE TYPE */}



            {/* HR MANAGER */}

            <Input
              label="HR Manager Name"
              name="hrManagerName"
              value={formData.hrManagerName}
              onChange={handleChange}
              required
            />

            {/* SUBMIT */}

            <button
              className="btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>

          </form>

          {/* RIGHT PDF PREVIEW */}

          <div className="right-joining">

            <div
              className="joining-pages-wrapper"
              ref={pdfRef}
            >
              <JoiningLetterPreview
                formData={formData}
                selectedCompany={selectedCompany}
                formatDate={formatDate}
              />
            </div>

          </div>

        </div>

      </div>

    </MainPanel>
  );
};

export default JoiningLetter;
