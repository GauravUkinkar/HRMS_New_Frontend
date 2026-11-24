import React, { useContext, useRef, useState } from "react";
import "./OfferLetter.scss";

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
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { UserContext } from "../../../Context";


import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const companyConfig = {
  "The Indian Journey": {
    logo: indianJourneyLogo,
    watermark: indianJourneyWatermark,
    address:
      "214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014",
    contact: "+91 76666 01972",

    location: "Pune",
  },

  "Pandoza Solutions Pvt.Ltd.": {
    logo: panLogo,
    watermark: panWatermark,

    address:
      "214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014",
    contact: "+91 76666 01972",

    location: "Pune",
  },

  "Akka Foundation": {
    logo: akkaLogo,
    watermark: akkaWatermark,
    address:
      "214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014",
    contact: "+91 76666 01972",

    location: "Pune",
  },

  "Nvm Infratech Pvt.Ltd": {
    logo: nvmLogo,
    watermark: nvmWatermark,
    address:
      "214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014",
    contact: "+91 76666 01972",

    location: "Pune",
  },
};

const InternshipOfferLetter = ({
  formData,
  selectedCompany,
  formatDate,
}) => {
  const pronoun =
    formData.gender === "Male"
      ? { possessive: "his", reflexive: "him" }
      : formData.gender === "Female"
        ? { possessive: "her", reflexive: "her" }
        : { possessive: "their", reflexive: "them" };

  return (
    <div className="page-wrapper">

      <div className="internship-pdf-page">
        <img
          className="pan-water-mark"
          src={selectedCompany.watermark}
          alt="Company Watermark"
        />

        <div className="internship-header">
          <div className="internship-logo">
            <img
              src={selectedCompany.logo}
              alt={formData.companyName || "Company Logo"}
            />
          </div>
        </div>

        <div className="internship-heading">
          <h3>To Whom It May Concern</h3>
          <h3>Internship Offer Letter</h3>
        </div>

        <div className="internship-content">
          <p>Dear,</p>

          <p className="employeename">{formData.employeeName || "Employee Name"}</p>

          <p>
            We are pleased to offer <strong> {formData.employeeName || "Employee Name"}</strong> an
            internship position at {formData.companyName || "Company Name"}

            commencing from <strong>{formatDate(formData.dateOfjoining)}</strong>
            for a duration of three (3) months.
          </p>

          <p>
            During the internship period, {formData.employeeName || "Employee Name"}
            will be entitled to a monthly stipend of{" "}
            <strong>{Number(formData.salary || 0).toLocaleString("en-IN")}</strong>,
            which will be calculated based on the number of working days attended.
            Please note that <strong>no paid leave will be granted</strong> during
            the internship period.
          </p>

          <p>
            This internship is intended to provide practical exposure and
            professional development in the relevant domain. Furthermore, {pronoun.possessive}{" "}
            performance will be closely monitored and evaluated throughout the
            internship. Based on {pronoun.possessive} overall performance and
            conduct, a decision regarding {pronoun.possessive} confirmation as a
            permanent employee may be made at the end of the internship.
          </p>

          <p>
            We welcome {formData.employeeName || "Employee Name"} to our team and
            look forward to a productive and rewarding association.
          </p>

          <p>For any further details, feel free to contact us.</p>

          <div className="internship-signature">
            <p>{formData.hrManagerName || "HR Manager"}</p>
            <p>HR &amp; Admin Manager</p>
            <p>{formData.companyName || "Company Name"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const OfferLetter = () => {
  const navigate = useNavigate();
    const { user } = useContext(UserContext);

  const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;



  const pdfRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    issuedDate: new Date().toISOString().split("T")[0],
    companyName: "",
    employeeName: "",
    designation: "",
    department: "",
    dateOfjoining: "",
    hrManagerName: "",
    salary: "",
    email: "",
    gender: "",
    employeeType: "",
  });


  const selectedCompany =
    companyConfig[formData.companyName] ||
    companyConfig["Pandoza Solutions Pvt.Ltd."];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDate = (date) => {
    if (!date) {
      return "DD MMM YYYY";
    }

    const parts = date.split("-");

    if (parts.length === 3) {
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];

      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

      return `${day} ${monthNames[Number(month) - 1]} ${year}`;
    }

    return date;
  };



  const monthlySalary = Number(formData.salary) || 0;
  const annualSalary = monthlySalary * 12;

  // Salary Breakup
  const basic = monthlySalary * 0.50;
  const da = basic * 0.20;
  const hra = basic * 0.50;
  const otherAllowance = basic * 0.30;

  // Annual Salary Components
  const annualBasic = basic * 12;
  const annualDa = da * 12;
  const annualHra = hra * 12;
  const annualOtherAllowance = otherAllowance * 12;

  // Professional Tax
  const pt = 200;
  const annualPt = pt * 12;

  // PF Calculation
  const pfBase = basic + da;

  let pf = 0;

  if (monthlySalary > 25000) {
    pf = 3000;
  } else if (monthlySalary > 15000) {
    pf = pfBase * 0.12;
  } else {
    pf = 0;
  }

  const annualPf = pf * 12;

  // ESIC Calculation
  const esicBase = basic + da;
  const esicApplicable = esicBase <= 21000;

  // Using the percentages specified by you
  const employeeEsic = esicApplicable
    ? esicBase * 0.00075
    : 0;

  const employerEsic = esicApplicable
    ? esicBase * 0.000325
    : 0;

  const annualEmployeeEsic = employeeEsic * 12;
  const annualEmployerEsic = employerEsic * 12;

  // Total Employee Deductions
  const totalDeduction = pt + pf + employeeEsic;
  const annualTotalDeduction =
    annualPt + annualPf + annualEmployeeEsic;

  // Net Salary
  const netSalary = monthlySalary - totalDeduction;
  const annualNetSalary = annualSalary - annualTotalDeduction;

  // Employer Contribution
  const totalEmployerContribution = employerEsic;

  // CTC
  const monthlyCtc = monthlySalary + totalEmployerContribution;
  const annualCtc = monthlyCtc * 12;



  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN"
    );
  };

  const generateOfferLetterPDF = async () => {
    if (!pdfRef.current) {
      throw new Error("Offer letter preview not found");
    }

    // Wait until fonts are loaded
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    const pdfPages = pdfRef.current.querySelectorAll(
      ".internship-pdf-page, " +
      ".offer-pdf-page, " +
      ".salary-pdf-page, " +
      ".terms-condition-page, " +
      ".eight-twelve-page, " +
      ".new-page, " +
      ".acceptance-page, " +
      ".third-last-page, " +
      ".secondlast-page, " +
      ".last-page"
    );

    if (!pdfPages.length) {
      throw new Error("No offer letter pages found");
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

      const imgData = canvas.toDataURL(
        "image/jpeg",
        0.65
      );

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.group("🚀 OFFER LETTER SUBMISSION");
    console.log("📝 FORM DATA:", formData);
    console.table(formData);
    console.groupEnd();

    try {
      setLoading(true);

      // ==========================================
      // STEP 1: GENERATE PDF
      // ==========================================
      console.group("📄 PDF GENERATION");

      console.log("Generating offer letter PDF...");

      const pdfBlob = await generateOfferLetterPDF();

      if (!pdfBlob) {
        throw new Error("PDF generation failed");
      }

      // ==========================================
      // CHECK PDF SIZE
      // ==========================================

      const pdfSizeMB = pdfBlob.size / (1024 * 1024);

      console.log("📄 PDF SIZE:", pdfSizeMB.toFixed(2), "MB");

      if (pdfSizeMB > 2) {
        console.error("❌ PDF exceeds 2 MB limit");

        toast.error(
          `PDF size is ${pdfSizeMB.toFixed(2)} MB. Maximum allowed size is 2 MB.`
        );

        return;
      }

      if (!pdfBlob) {
        throw new Error("PDF generation failed");
      }

      console.log("✅ PDF generated successfully");
      console.log("PDF Blob:", pdfBlob);
      console.log("PDF Size:", pdfBlob.size, "bytes");
      console.log("PDF Size:", (pdfBlob.size / 1024).toFixed(2), "KB");
      console.log("PDF Type:", pdfBlob.type);

      console.groupEnd();

      // ==========================================
      // STEP 2: CREATE PDF FILE
      // ==========================================
      const employeeName =
        formData.employeeName?.trim() || "Employee";

      const pdfFileName = `${employeeName}_Offer_Letter.pdf`;

      const pdfFile = new File(
        [pdfBlob],
        pdfFileName,
        {
          type: "application/pdf",
        }
      );

      console.group("📁 PDF FILE DETAILS");

      console.log("File Name:", pdfFile.name);
      console.log("File Size:", pdfFile.size, "bytes");
      console.log(
        "File Size:",
        (pdfFile.size / 1024).toFixed(2),
        "KB"
      );
      console.log("File Type:", pdfFile.type);
      console.log("Last Modified:", pdfFile.lastModified);

      console.groupEnd();

      // ==========================================
      // STEP 3: CREATE API PAYLOAD
      // ==========================================

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
        documentName: "Offer Letter",

      };

      console.group("📦 API PAYLOAD DATA");

      console.log("Payload Object:", offerAndJoiningLetterDto);

      console.log(
        "Payload JSON:",
        JSON.stringify(offerAndJoiningLetterDto, null, 2)
      );

      console.table(offerAndJoiningLetterDto);

      console.groupEnd();

      // ==========================================
      // STEP 4: CREATE FORMDATA
      // ==========================================

      const formDataToSend = new FormData();

      formDataToSend.append("file", pdfFile);
      formDataToSend.append("offerAndJoiningLetterDto ", JSON.stringify(offerAndJoiningLetterDto));

      // ==========================================
      // STEP 5: CHECK FORMDATA
      // ==========================================

      console.group("📤 MULTIPART FORMDATA");

      for (const [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log("FILE FIELD:", key);

          console.table({
            fieldName: key,
            fileName: value.name,
            fileSize: value.size,
            fileType: value.type,
          });
        } else {
          console.log("DATA FIELD:", key);
          console.log("VALUE:", value);

          try {
            console.log(
              "PARSED JSON:",
              JSON.parse(value)
            );

            console.table(JSON.parse(value));
          } catch (error) {
            console.log(error);
          }
        }
      }

      console.groupEnd();

      // ==========================================
      // STEP 6: API URL
      // ==========================================

      const apiUrl = `${BASE_URL}Admin/AddOfferAndJoiningLetter`;

      console.group("🌐 API REQUEST");

      console.log("API URL:", apiUrl);
      console.log("Method:", "POST");
      console.log("Credentials:", "withCredentials: true");
      console.log("Content Type:", "multipart/form-data");

      console.groupEnd();

      // ==========================================
      // STEP 7: CALL API
      // ==========================================

      console.log("⏳ Sending request to API...");
      console.log("📤 FINAL JSON SENT TO BACKEND:", offerAndJoiningLetterDto);
      console.log("📤 PDF FILE SENT:", {
        name: pdfFile.name,
        size: pdfFile.size,
        sizeMB: (pdfFile.size / (1024 * 1024)).toFixed(2),
        type: pdfFile.type,
      });
      const response = await axios.post(
        apiUrl,
        formDataToSend,
        {
          withCredentials: true,
        }
      );

      // ==========================================
      // STEP 8: API RESPONSE
      // ==========================================

      console.group("✅ API RESPONSE");

      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);
      console.log("Response Data:", response.data);
      console.table(response.data);

      console.groupEnd();

      // ==========================================
      // STEP 9: SUCCESS
      // ==========================================

      if (response.data?.status === "OK") {
        toast.success(
          response.data?.responseMessage ||
          "Offer letter added successfully!"
        );

        console.log("🎉 OFFER LETTER SUBMITTED SUCCESSFULLY");

        // Reset Form
        setFormData({
          issuedDate: new Date()
            .toISOString()
            .split("T")[0],

          companyName: "",
          employeeName: "",
          designation: "",
          department: "",
          dateOfjoining: "",
          hrManagerName: "",
          salary: "",
          gender: "",
          email: "",
          employeeType: "",
        });

      } else {
        console.warn("⚠️ API returned unsuccessful response");

        toast.error(
          response.data?.responseMessage ||
          "Failed to add offer letter"
        );
      }

    } catch (error) {

      // ==========================================
      // STEP 10: ERROR DETAILS
      // ==========================================

      console.group("❌ OFFER LETTER API ERROR");

      console.error("Full Error:", error);
      console.error("Error Message:", error.message);
      console.error("Error Response:", error.response);
      console.error("Error Response Data:", error.response?.data);
      console.error("Error Status:", error.response?.status);
      console.error("Error Headers:", error.response?.headers);
      console.error("Request Config:", error.config);

      console.groupEnd();

      toast.error(
        error.response?.data?.responseMessage ||
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while adding offer letter"
      );

    } finally {
      setLoading(false);
    }
  };
  return (
    <>
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
      }>
        <div className="offerletter-parent parent">
          <div className="offerletter-cont cont">
            <form
              className="left-offer"
              onSubmit={handleSubmit}
            >

              <Input
                label="Offer-Letter Date"
                type="date"
                name="issuedDate"
                value={
                  formData.issuedDate
                    ? formData.issuedDate.split("T")[0]
                    : ""
                }
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



              <Input
                label="Employee Name"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                required
              />


              <Input
                label="Email ID"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
              <SelectInput
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >

                <MenuItem value="Male">
                  Male
                </MenuItem>

                <MenuItem value="Female">
                  Female
                </MenuItem>

                <MenuItem value="Other">
                  Other
                </MenuItem>

              </SelectInput>

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

              <SelectInput
                name="employeeType"
                label="Employee Type"
                value={formData.employeeType}
                onChange={handleChange}
                required
              >

                <MenuItem value="Full-time">
                  Full-time
                </MenuItem>

                <MenuItem value="Part-time">
                  Part-time
                </MenuItem>

                <MenuItem value="Freelance">
                  Freelance
                </MenuItem>

                <MenuItem value="Intern">
                  Intern
                </MenuItem>

              </SelectInput>

              {/* SALARY */}

              <Input
                label="Salary"
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
              />

              {/* HR MANAGER */}

              <Input
                label="Hr Manager Name"
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
                {loading
                  ? "Submitting..."
                  : "Submit"}
              </button>

            </form>



            <div className="right-offer">
              <div className="pages-wrapper " ref={pdfRef}>

                {formData.employeeType === "Intern" ? (
                  <InternshipOfferLetter
                    formData={formData}
                    selectedCompany={selectedCompany}
                    formatDate={formatDate}
                  />
                ) : (
                  <>
                    <div className="offer-pdf-page">

                      <img
                        className="pan-water-mark"
                        src={selectedCompany.watermark}
                        alt="Company Watermark"
                      />

                      <div className="top">
                        <div className="date">
                          Date:{" "}
                          {formatDate(
                            formData.issuedDate
                          )}
                        </div>

                        <div className="logo">
                          <img
                            src={selectedCompany.logo}
                            alt={
                              formData.companyName ||
                              "Company Logo"
                            }
                          />
                        </div>
                      </div>

                      <div className="heading">
                        <h3>
                          Letter of Offer
                        </h3>
                      </div>
                      <div className="name">
                        <p>Dear</p>
                        <h4>
                          {formData.employeeName ||
                            "N/A"}
                        </h4>
                      </div>
                      <div className="gap"></div>
                      <p>
                        Further to your interview, we
                        are pleased to offer you the
                        position of{" "}
                        <strong>
                          {formData.designation ||
                            "N/A"}
                        </strong>{" "}
                        in our organization. Please
                        refer to the attached Annexure-1
                        for your salary structure and an
                        explanation of its components.
                      </p>

                      <div className="gap"></div>
                      <p>
                        On joining, you will be subject
                        to the employee policies and
                        practices of{" "}
                        <strong>
                          {formData.companyName ||
                            "N/A"}
                        </strong>
                        . A summary of the present
                        policies is included in Annexure-2
                        to this offer letter for your
                        reference. Also, refer to
                        Annexure-3 for the list of
                        documents to be submitted at the
                        time of your joining.
                      </p>

                      <div className="gap"></div>
                      <p>
                        You are required to join duties
                        with effect from{" "}
                        <strong>
                          {formatDate(
                            formData.dateOfjoining
                          )}
                        </strong>{" "}
                        at our <strong>{selectedCompany.location}</strong>{" "}
                        office for this offer to be
                        valid. You will be on probation
                        for a period of 3 months.
                      </p>

                      <div className="gap"></div>

                      <p>
                        Kindly report at the following
                        address, at 10:00 a.m. on your
                        date of joining – <strong>
                          {formatDate(
                            formData.dateOfjoining
                          )}
                        </strong>{" "}
                      </p>

                      <div className="gap"></div>

                      <div className="address">

                        <h4>
                          {formData.companyName ||
                            "N/A"}
                        </h4>

                        <p>
                          {selectedCompany.address}
                        </p>

                      </div>

                      <div className="gap"></div>

                      <p>
                        {formData.companyName ||
                          "N/A"}{" "}
                        holds the right to cancel this
                        offer with or without a reason
                        at any time before you join.{" "}
                        {formData.companyName ||
                          "N/A"}{" "}
                        may defer and/or cancel this offer
                        at any time before or after your
                        joining in case any information
                        furnished by you is found
                        incorrect or misleading.
                      </p>

                      <div className="gap"></div>

                      <p>
                        We look forward to your joining{" "}
                        {formData.companyName ||
                          "N/A"}{" "}
                        at the earliest and wish you a
                        successful career with us.
                      </p>

                      <div className="gap"></div>

                      <p>
                        Thanking you,
                      </p>

                      <p>
                        Sincerely
                      </p>

                      <p>
                        For{" "}
                        <strong>   {formData.companyName ||
                          "N/A"}</strong>

                      </p>

                      <div className="gap"></div>
                      <div className="gap"></div>
                      <div className="gap"></div>

                      <p>
                        Hr Admin & Finance
                      </p>

                      <p>
                        <strong> {formData.hrManagerName ||
                          "N/A"}</strong>

                      </p>

                      <div className="gap"></div>

                      {/* DYNAMIC FOOTER */}

                      <p className="footer">
                        {selectedCompany.address}
                        {" | CONTACT: "}
                        {selectedCompany.contact}
                      </p>

                    </div>



                    <div className="salary-pdf-page">

                      {/* DYNAMIC WATERMARK */}

                      <img
                        className="pan-water-mark"
                        src={selectedCompany.watermark}
                        alt="Company Watermark"
                      />

                      {/* DYNAMIC LOGO */}

                      <div className="logo">

                        <img
                          src={selectedCompany.logo}
                          alt={
                            formData.companyName ||
                            "Company Logo"
                          }
                        />

                      </div>

                      <div className="top">

                        <h3>
                          ANNEXURE-1
                        </h3>

                        <div className="small-gap"></div>

                        <h3>
                          SALARY BREAKUP
                        </h3>

                      </div>

                      <div className="gap"></div>

                      <div className="info">

                        <p>
                          <span>
                            Name:{" "}
                            <span>
                              <strong>  {formData.employeeName ||
                                "N/A"}</strong>

                            </span>
                          </span>
                        </p>

                        <p>
                          <span>
                            Designation:{" "}
                            <strong>{formData.designation ||
                              "N/A"}</strong>
                          </span>
                        </p>

                        <p>
                          <span>
                            Date of Joining:{" "}
                            <strong>{formatDate(
                              formData.dateOfjoining
                            )}</strong>
                          </span>
                        </p>

                        <p>
                          <span>
                            Department:{" "}
                            <strong>{formData.department ||
                              "N/A"}</strong>
                          </span>
                        </p>

                        <p>
                          <span>
                            Employee Type:{" "}
                            <strong>{formData.employeeType ||
                              "N/A"}</strong>
                          </span>
                        </p>

                        <p>
                          <span>
                            Gender:{" "}
                            <strong>{formData.gender ||
                              "N/A"}</strong>
                          </span>
                        </p>

                        <p>
                          <span>
                            Location:{" "}
                            <strong>{selectedCompany.location ||
                              "N/A"}</strong>
                          </span>
                        </p>

                      </div>

                      <div className="gap"></div>
                      <div className="gap"></div>

                      <table className="salary-table">
                        <thead>
                          <tr>
                            <th>No.</th>
                            <th>Component of Salary</th>
                            <th>Amount Rs (Monthly)</th>
                            <th>Amount Rs (Annually)</th>
                          </tr>
                        </thead>

                        <tbody>
                          {/* A */}
                          <tr>
                            <td>A</td>
                            <td>
                              <strong>Monthly Salary components</strong>
                            </td>
                            <td>{formatAmount(monthlySalary)}/-</td>
                            <td>{formatAmount(annualSalary)}/-</td>
                          </tr>

                          {/* BASIC */}
                          <tr>
                            <td></td>
                            <td>Basic</td>
                            <td>{formatAmount(basic)}/-</td>
                            <td>{formatAmount(annualBasic)}/-</td>
                          </tr>

                          {/* DA */}
                          <tr>
                            <td></td>
                            <td>DA</td>
                            <td>{formatAmount(da)}/-</td>
                            <td>{formatAmount(annualDa)}/-</td>
                          </tr>

                          {/* HRA */}
                          <tr>
                            <td></td>
                            <td>HRA</td>
                            <td>{formatAmount(hra)}/-</td>
                            <td>{formatAmount(annualHra)}/-</td>
                          </tr>

                          {/* OTHER ALLOWANCE */}
                          <tr>
                            <td></td>
                            <td>Other Allowance</td>
                            <td>{formatAmount(otherAllowance)}/-</td>
                            <td>{formatAmount(annualOtherAllowance)}/-</td>
                          </tr>

                          {/* GROSS SALARY */}
                          <tr>
                            <td></td>
                            <td>
                              <strong>ANNUAL FIXED GROSS SALARY (A)</strong>
                            </td>
                            <td>
                              <strong>{formatAmount(monthlySalary)}/-</strong>
                            </td>
                            <td>
                              <strong>{formatAmount(annualSalary)}/-</strong>
                            </td>
                          </tr>

                          {/* B - DEDUCTIONS */}
                          <tr>
                            <td>B</td>
                            <td>
                              <strong>Employee Deductions</strong>
                            </td>
                            <td></td>
                            <td></td>
                          </tr>

                          {/* PROFESSIONAL TAX */}
                          <tr>
                            <td></td>
                            <td>Professional Tax (PT)</td>
                            <td>{formatAmount(pt)}/-</td>
                            <td>{formatAmount(annualPt)}/-</td>
                          </tr>

                          {/* PF */}
                          <tr>
                            <td></td>
                            <td>Provident Fund (PF)</td>
                            <td>{formatAmount(pf)}/-</td>
                            <td>{formatAmount(annualPf)}/-</td>
                          </tr>

                          {/* EMPLOYEE ESIC */}
                          <tr>
                            <td></td>
                            <td>Employee ESIC</td>
                            <td>{formatAmount(employeeEsic)}/-</td>
                            <td>{formatAmount(annualEmployeeEsic)}/-</td>
                          </tr>

                          {/* TOTAL DEDUCTION */}
                          <tr>
                            <td></td>
                            <td>
                              <strong>TOTAL DEDUCTION (B)</strong>
                            </td>
                            <td>
                              <strong>{formatAmount(totalDeduction)}/-</strong>
                            </td>
                            <td>
                              <strong>{formatAmount(annualTotalDeduction)}/-</strong>
                            </td>
                          </tr>

                          {/* NET SALARY */}
                          <tr>
                            <td>C</td>
                            <td>
                              <strong>NET SALARY (A-B)</strong>
                            </td>
                            <td>
                              <strong>{formatAmount(netSalary)}/-</strong>
                            </td>
                            <td>
                              <strong>{formatAmount(annualNetSalary)}/-</strong>
                            </td>
                          </tr>

                          {/* EMPLOYER CONTRIBUTION */}
                          <tr>
                            <td>D</td>
                            <td>
                              <strong>Employer Contribution</strong>
                            </td>
                            <td></td>
                            <td></td>
                          </tr>

                          {/* EMPLOYER ESIC */}
                          <tr>
                            <td></td>
                            <td>Employer ESIC</td>
                            <td>{formatAmount(employerEsic)}/-</td>
                            <td>{formatAmount(annualEmployerEsic)}/-</td>
                          </tr>

                          {/* CTC */}
                          <tr>
                            <td>E</td>
                            <td>
                              <strong>TOTAL COST TO COMPANY (CTC)</strong>
                            </td>
                            <td>
                              <strong>{formatAmount(monthlyCtc)}/-</strong>
                            </td>
                            <td>
                              <strong>{formatAmount(annualCtc)}/-</strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>




                      <p className="footer">
                        {selectedCompany.address}
                        {" | CONTACT: "}
                        {selectedCompany.contact}
                      </p>

                    </div>

                    {/* ==================================================
                    PAGE 3 - EXPLANATION
                ================================================== */}

                    <div className="terms-condition-page">

                      <img
                        className="pan-water-mark"
                        src={selectedCompany.watermark}
                        alt="Company Watermark"
                      />

                      <div className="gap"></div>
                      <div className="gap"></div>

                      <div className="logo">

                        <img
                          src={selectedCompany.logo}
                          alt={
                            formData.companyName ||
                            "Company Logo"
                          }
                        />

                      </div>

                      <div className="gap"></div>

                      <h4>
                        Explanation of terms used:
                      </h4>

                      <div className="gap"></div>

                      <div className="salary-description">

                        <p>
                          *Professional Tax deduction
                          for the month of February will
                          be ₹300.
                        </p>


                        <div className="gap"></div>
                        <div className="salary-description">

                          <p>
                            * Professional Tax is ₹200 per month.
                          </p>


                          <div className="gap"></div>
                          <p>
                            ** Provident Fund (PF) is calculated based on the applicable salary criteria.
                          </p>


                          <div className="gap"></div>
                          <p>
                            *** ESIC is applicable when Basic Salary + DA is ₹21,000 or below.
                          </p>

                          <p>
                            Employee ESIC is deducted from the employee's salary.
                            Employer ESIC is a company contribution and is not deducted
                            from employee take-home salary.
                          </p>

                        </div>

                        <div className="gap"></div>
                        <p>
                          <strong>
                            I. Basic :
                          </strong>{" "}
                          This is the base component of
                          the salary to which many other
                          components are linked. The
                          amount is fully taxable.
                        </p>

                      </div>

                      <div className="gap"></div>

                      <div className="salary-description">

                        <p>
                          <strong>
                            II. HRA :
                          </strong>{" "}
                          This amount will not be taxable
                          if you submit the appropriate
                          rent agreement and rent receipts.
                          Tax benefit calculation will be
                          done on the basis of provisions
                          of the Income Tax Act, of 1961.
                        </p>

                      </div>

                      <div className="gap"></div>

                      <div className="salary-description">

                        <p>
                          <strong>
                            III. Special Allowance :
                          </strong>{" "}
                          This will vary as it is based on
                          the difference between your gross
                          salary and other components that
                          make up the entire salary. It is
                          a fully taxable component.
                        </p>

                      </div>




                      <div className="gap"></div>
                      <p>
                        <strong>
                          IV. Special Allowance :
                        </strong>{" "}
                        This will vary as it is based on
                        the difference between your gross
                        salary and other components that
                        make up the entire salary. It is
                        a fully taxable component.
                      </p>
                      <div className="gap"></div>

                      <p className="footer">
                        {selectedCompany.address}
                        {" | CONTACT: "}
                        {selectedCompany.contact}
                      </p>

                    </div>

                    {/* ==================================================
                    PAGE 4 - ANNEXURE 2
                ================================================== */}

                    <div className="eight-twelve-page">

                      <img
                        className="pan-water-mark"
                        src={selectedCompany.watermark}
                        alt="Company Watermark"
                      />

                      <div className="gap"></div>
                      <div className="gap"></div>

                      <div className="logo">

                        <img
                          src={selectedCompany.logo}
                          alt={
                            formData.companyName ||
                            "Company Logo"
                          }
                        />

                      </div>

                      <div className="top">

                        <h3>
                          ANNEXURE-2
                        </h3>

                        <h3>
                          Additional Terms and
                          Conditions of Offer
                        </h3>

                      </div>

                      <div className="gap"></div>

                      <strong>
                        1. Date of joining:
                      </strong>

                      <div className="small-gap"></div>

                      <p>
                        This offer for employment is
                        subject to your joining and
                        reporting to the designated{" "}
                        {formData.companyName ||
                          "Company Name"}{" "}
                        location on failing which this
                        offer will stand withdrawn.
                      </p>

                      <div className="gap"></div>

                      <strong>
                        2. Work location and transfer:
                      </strong>

                      <div className="small-gap"></div>

                      <p>
                        Your initial location after
                        joining will be at{" "}
                        {formData.companyName ||
                          "Company Name"}{" "}
                        <strong>
                          {selectedCompany.location}
                        </strong>{" "}
                        office. This offer is subject to
                        your preparedness to work in any
                        of the locations of{" "}
                        {formData.companyName ||
                          "Company Name"}{" "}
                        or its affiliates.
                      </p>

                      <div className="gap"></div>

                      <strong>
                        3. Mandatory tenure of employment:
                      </strong>

                      <div className="small-gap"></div>

                      <p>
                        On joining{" "}
                        {formData.companyName ||
                          "Company Name"}
                        , you will continue to be employed
                        with the company for a minimum
                        period of one year.
                      </p>

                      <div className="gap"></div>

                      <strong>
                        Background verification:
                      </strong>

                      <div className="small-gap"></div>

                      <p>
                        This offer for employment is
                        subject to the satisfactory
                        completion of your background
                        reference check.
                      </p>

                      <div className="gap"></div>

                      <p className="footer">
                        {selectedCompany.address}
                        {" | CONTACT: "}
                        {selectedCompany.contact}
                      </p>

                    </div>

                    {/* ==================================================
                    PAGE 5
                ================================================== */}

                    <div className="new-page">

                      <img
                        className="pan-water-mark"
                        src={selectedCompany.watermark}
                        alt="Company Watermark"
                      />

                      <div className="gap"></div>
                      <div className="gap"></div>

                      <div className="logo">

                        <img
                          src={selectedCompany.logo}
                          alt={
                            formData.companyName ||
                            "Company Logo"
                          }
                        />

                      </div>

                      <div className="gap"></div>
                      <div className="gap"></div>

                      <strong>
                        5. Travel and passport:
                      </strong>

                      <div className="small-gap"></div>

                      <p>
                        You should possess a valid passport
                        during your employment with{" "}
                        {formData.companyName ||
                          "Company Name"}. In case you do
                        not have a valid passport at the
                        time of joining, you should get one
                        issued within three months from the
                        date of joining.
                      </p>

                      <div className="gap"></div>

                      <strong>
                        6. Confidentiality and return of
                        materials:
                      </strong>

                      <div className="small-gap"></div>

                      <p>
                        You will be required to maintain
                        organizational secrecy and
                        confidentiality with respect to
                        information and procedures followed
                        in{" "}
                        {formData.companyName ||
                          "Company Name"}.
                      </p>

                      <div className="gap"></div>

                      <strong>
                        7. Non-competition:
                      </strong>

                      <div className="small-gap"></div>

                      <p>
                        During the term of your employment
                        with{" "}
                        {formData.companyName ||
                          "Company Name"}, you will not
                        engage in any other employment,
                        occupation, consulting, or other
                        business activity related to the
                        business in which the company is
                        involved.
                      </p>

                      <div className="gap"></div>

                      <strong>
                        8. Leaves and holidays:
                      </strong>

                      <div className="small-gap"></div>

                      <p>
                        The company will announce the list
                        of holidays at the beginning of
                        each calendar year. Employees are
                        entitled to{" "}
                        <strong>
                          two paid leaves per month
                        </strong>
                        .
                      </p>

                      <div className="small-gap"></div>

                      <p>
                        To request a leave, employees are
                        required to{" "}
                        <strong>
                          submit their leave application at
                          least four days in advance
                        </strong>
                        .
                      </p>

                      <div className="gap"></div>
                      <div className="gap"></div>

                      <strong>
                        *It Will be applicable after
                        probation period.
                      </strong>

                      <p className="footer">
                        {selectedCompany.address}
                        {" | CONTACT: "}
                        {selectedCompany.contact}
                      </p>

                    </div>

                    {/* ==================================================
                    PAGE 6
                ================================================== */}

                    <div className="acceptance-page">

                      <img
                        className="pan-water-mark"
                        src={selectedCompany.watermark}
                        alt="Company Watermark"
                      />

                      <div className="gap"></div>
                      <div className="gap"></div>

                      <div className="logo">

                        <img
                          src={selectedCompany.logo}
                          alt={
                            formData.companyName ||
                            "Company Logo"
                          }
                        />

                      </div>

                      <div className="gap"></div>
                      <div className="gap"></div>

                      <strong>
                        9. Dress code:
                      </strong>

                      <div className="small-gap"></div>

                      <p>
                        The work dress code ranges from
                        Formal to Business Casual to
                        Casual.{" "}
                        {formData.companyName ||
                          "Company Name"}
                        ’s objective in establishing a
                        dress code is to allow our
                        employees to work comfortably in
                        the workplace while projecting a
                        professional image.
                      </p>

                      <div className="gap"></div>

                      <p>
                        You are required to wear formal on
                        your date of joining, which is:
                        <br />

                        <strong>
                          * For Gentlemen
                        </strong>
                        : Formal full-sleeve shirts and
                        trousers with a tie and polished
                        formal shoes.

                        <br />

                        <strong>
                          * For Ladies
                        </strong>
                        : Western formals, salwar-kameez
                        or formal saris with sandals.
                      </p>

                      <div className="gap"></div>

                      <strong>
                        10. Termination and resignation:
                      </strong>

                      <div className="small-gap"></div>

                      <div className="a-point">

                        <p>
                          A.{" "}
                          <strong>
                            Termination :
                          </strong>{" "}
                          {formData.companyName ||
                            "Company Name"}{" "}
                          reserves the right to terminate
                          the services of an employee.
                        </p>

                      </div>

                      <div className="small-gap"></div>

                      <div className="subpoints">

                        <p>
                          a. With or without cause by
                          providing immediate termination.
                        </p>

                        <div className="small-gap"></div>

                        <p>
                          b. Without notice in the
                          following cases:
                        </p>

                      </div>

                      <ul className="listing">

                        <li>
                          If the employee is absent or on
                          unauthorized leave without
                          notice in writing or without
                          sufficient reasons for 5 days
                          or more.
                        </li>

                        <div className="small-gap"></div>

                        <li>
                          If the employee goes on a strike
                          or supports a strike in
                          contravention of any law.
                        </li>

                        <div className="small-gap"></div>

                        <li>
                          The employee causes damage to
                          the physical or intellectual
                          property of{" "}
                          {formData.companyName ||
                            "Company Name"}.
                        </li>

                      </ul>

                      <div className="a-point">

                        <div className="gap"></div>

                        <p>
                          B.{" "}
                          <strong>
                            Resignation :
                          </strong>{" "}
                          For resigning from{" "}
                          {formData.companyName ||
                            "Company Name"}, you are
                          required to serve a 1 months’
                          notice period as per the policy
                          of resignation.
                        </p>

                      </div>

                      <p className="footer">
                        {selectedCompany.address}
                        {" | CONTACT: "}
                        {selectedCompany.contact}
                      </p>

                    </div>

                    {/* ==================================================
                    PAGE 7
                ================================================== */}

                    <div className="third-last-page">

                      <img
                        className="pan-water-mark"
                        src={selectedCompany.watermark}
                        alt="Company Watermark"
                      />

                      <div className="gap"></div>
                      <div className="gap"></div>

                      <div className="logo">

                        <img
                          src={selectedCompany.logo}
                          alt={
                            formData.companyName ||
                            "Company Logo"
                          }
                        />

                      </div>

                      <div className="gap"></div>
                      <div className="gap"></div>

                      <strong>
                        11. Rules and regulations:
                      </strong>

                      <div className="small-gap"></div>

                      <p>
                        You will be subject to all rules
                        and regulations of{" "}
                        {formData.companyName ||
                          "Company Name"}{" "}
                        that are in force and shall abide
                        by them until in employment with
                        the organization.
                      </p>

                      <div className="gap"></div>

                      <strong>
                        12. Acceptance:
                      </strong>

                      <p>
                        If the terms and conditions of this
                        offer are acceptable to you, kindly
                        return a duplicate of this letter
                        of offer duly signed with your
                        acceptance.
                      </p>

                      <div className="small-gap"></div>

                      <p>
                        Before the date of joining, kindly
                        forward a copy of your resignation
                        letter and the acceptance of the
                        same from your HR to
                      </p>

                      <a
                        href="mailto:info@pandozasolutions.com"
                        target="_blank"
                        rel="noreferrer"
                      >
                        info@pandozasolutions.com
                      </a>

                      <p>
                        You can also mail us at
                      </p>

                      <a
                        href="mailto:info@pandozasolutions.com"
                        target="_blank"
                        rel="noreferrer"
                      >
                        info@pandozasolutions.com
                      </a>

                      <p>
                        if you have any queries.
                      </p>

                      <p className="footer">
                        {selectedCompany.address}
                        {" | CONTACT: "}
                        {selectedCompany.contact}
                      </p>

                    </div>

                    {/* ==================================================
                    PAGE 8 - ANNEXURE 3
                ================================================== */}

                    <div className="secondlast-page">

                      <img
                        className="pan-water-mark"
                        src={selectedCompany.watermark}
                        alt="Company Watermark"
                      />

                      <div className="gap"></div>
                      <div className="gap"></div>

                      <div className="logo">

                        <img
                          src={selectedCompany.logo}
                          alt={
                            formData.companyName ||
                            "Company Logo"
                          }
                        />

                      </div>

                      <div className="gap"></div>

                      <div className="top">

                        <h3>
                          ANNEXURE-3
                        </h3>

                      </div>

                      <div className="gap"></div>

                      <ul className="edu-doc">

                        <h3>
                          Educational documents:
                        </h3>

                        <div className="small-gap"></div>

                        <li>
                          10th and 12th/Diploma mark sheets
                        </li>

                        <div className="small-gap"></div>

                        <li>
                          Degree certificate and mark
                          sheet
                        </li>

                        <div className="small-gap"></div>

                        <li>
                          PG certificate and mark sheet
                        </li>

                        <div className="small-gap"></div>

                        <li>
                          Any Certification mark
                          sheet/certificate
                        </li>

                      </ul>

                      <ul className="emp-doc">

                        <h3>
                          Employment documents:
                        </h3>

                        <div className="small-gap"></div>

                        <li>
                          Relieving and Experience letters
                          from past employers
                        </li>

                        <div className="small-gap"></div>

                        <li>
                          Last 3 salary slips
                        </li>

                        <div className="small-gap"></div>

                        <li>
                          Salary proof of fixed and
                          variable components
                        </li>

                        <div className="small-gap"></div>

                        <li>
                          Bank statement for last 3
                          months
                        </li>

                      </ul>

                      <ul className="emp-doc">

                        <h3>
                          Personal documents:
                        </h3>

                        <div className="small-gap"></div>

                        <li>
                          Marriage certificate
                        </li>

                        <div className="small-gap"></div>

                        <li>
                          3 passport-size photographs
                        </li>

                        <div className="small-gap"></div>

                        <li>
                          Passport Copy
                        </li>

                        <div className="small-gap"></div>

                        <li>
                          PAN Card
                        </li>

                        <div className="small-gap"></div>

                        <li>
                          Aadhar Card
                        </li>

                      </ul>

                      <div className="gap"></div>

                      <p>
                        Before the date of joining, kindly
                        forward a copy of your resignation
                        letter and the acceptance of the
                        same from your HR to
                      </p>

                      <a
                        href="mailto:info@pandozasolutions.com"
                        target="_blank"
                        rel="noreferrer"
                      >
                        info@pandozasolutions.com
                      </a>

                      <p className="footer">
                        {selectedCompany.address}
                        {" | CONTACT: "}
                        {selectedCompany.contact}
                      </p>

                    </div>

                    {/* ==================================================
                    PAGE 9 - ACCEPTANCE
                ================================================== */}

                    <div className="last-page">

                      <img
                        className="pan-water-mark"
                        src={selectedCompany.watermark}
                        alt="Company Watermark"
                      />

                      <div className="gap"></div>
                      <div className="gap"></div>

                      <div className="logo">

                        <img
                          src={selectedCompany.logo}
                          alt={
                            formData.companyName ||
                            "Company Logo"
                          }
                        />

                      </div>

                      <div className="gap"></div>
                      <div className="gap"></div>

                      <div className="top">

                        <h3>
                          ACCEPTANCE OF OFFER
                        </h3>

                      </div>

                      <div className="gap"></div>

                      <p>
                        I have read the offer letter and
                        the annexed policies. I hereby
                        accept the offer on the aforesaid
                        terms.
                      </p>

                      <div className="small-gap"></div>

                      <p>
                        I shall join duties with effect
                        from the date mentioned hereinabove.
                        In case of delays in joining, I
                        shall inform the concerned
                        authority one week in advance in
                        writing.
                      </p>

                      <div className="small-gap"></div>

                      <p>
                        Name:{" "}
                        <strong>
                          {formData.employeeName ||
                            "Employee Name"}
                        </strong>
                      </p>

                      <div className="small-gap"></div>

                      <p>
                        Date:{" "}
                        <strong>
                          {formatDate(
                            formData.dateOfjoining
                          )}
                        </strong>
                      </p>

                      <div className="small-gap"></div>

                      <p>
                        Signature:
                      </p>

                      <div className="small-gap"></div>

                      <p>
                        Place:{" "}
                        <strong>
                          {selectedCompany.location}
                        </strong>
                      </p>

                      <p className="footer">
                        {selectedCompany.address}
                        {" | CONTACT: "}
                        {selectedCompany.contact}
                      </p>

                    </div>


                  </>
                )}
              </div>

            </div>

          </div>

        </div>
      </MainPanel>
    </>
  );
};

export default OfferLetter;