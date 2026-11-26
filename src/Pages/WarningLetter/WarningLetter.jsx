
import React, { useContext, useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import MainPanel from "../../comp/MainPanel/MainPanel";
import { UserContext } from "../../../Context";
import "./WarningLetter.scss";

import {
  FaGlobe,
  FaLocationDot,
  FaPhoneVolume,
} from "react-icons/fa6";

import { Link } from "react-router-dom";
import { IoIosMail } from "react-icons/io";

import Input from "../../comp/input/Input";
import { MenuItem } from "@mui/material";
import SelectInput from "../../comp/selectInput/SelectInput";

import PanLogo from "../../assets/pan-watermark.webp";
import logo_pan from "../../assets/offer-logo-pan.png";

import indianJourneyWatermark from "../../assets/tij-watermark.png";
import indianJourneyLogo from "../../assets/tij-logo.png";

import akkaWatermark from "../../assets/akka-foundation.png";
import akkaLogo from "../../assets/akka-foundation.png";

import nvmWatermark from "../../assets/nvm-watermark.png";
import nvmLogo from "../../assets/nvm-logo.png";

import right_corner from "../../assets/right-corner.png";
import left_corner from "../../assets/left-corner.png";

import axios from "axios";
import { toast } from "react-toastify";

// Company configuration
const companyConfig = {
  "The Indian Journey": {
    logo: indianJourneyLogo,
    watermark: indianJourneyWatermark,
    address: "214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014",
    contact: "+91 76666 01972",
    location: "Pune",
    email: "info@pandozasolutions.com",
  },

  "Pandoza Solutions Pvt.Ltd": {
    logo: logo_pan,
    watermark: PanLogo,
    address: "214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014",
    contact: "+91 76666 01972",
    location: "Pune",
    email: "info@pandozasolutions.com",
  },

  "Akka Foundation": {
    logo: akkaLogo,
    watermark: akkaWatermark,
    address: "214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014",
    contact: "+91 76666 01972",
    location: "Pune",
    email: "info@pandozasolutions.com",
  },

  "Nvm Infratech": {
    logo: nvmLogo,
    watermark: nvmWatermark,
    address: "214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014",
    contact: "+91 76666 01972",
    location: "Pune",
    email: "info@pandozasolutions.com",
  },
};

const WarningLetter = () => {
  const pdfRef = useRef(null);

  const { user } = useContext(UserContext);

  const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

  const [loading, setLoading] = useState(false);

  const [employee, setEmployee] = useState([]);
  const [employeeLoading, setEmployeeLoading] = useState(false);

  const [formData, setFormData] = useState({
    issuedDate: new Date().toISOString().split("T")[0],
    companyName: "",
    employeeName: "",
    uid: "",
    hrManagerName: "",
    designation: "",
    worningType: "",
    dateOfJoining: "",
  });

  const selectedCompany =
    companyConfig[formData.companyName] ||
    companyConfig["Pandoza Solutions Pvt.Ltd"];

  // Format date for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "";
    }

    return date.toISOString().split("T")[0];
  };

  // Format date for preview
  const formatPreviewDate = (date) => {
    if (!date) return "DD-MM-YYYY";

    const parts = date.split("-");

    if (parts.length !== 3) return date;

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  // Fetch employees based on selected company
  useEffect(() => {
    const getEmployeesByCompany = async () => {
      if (!formData.companyName) {
        setEmployee([]);
        return;
      }

      try {
        setEmployeeLoading(true);

        const response = await axios.get(
          `${BASE_URL}Admin/GetAllEmployeeByCompanyName`,
          {
            params: {
              companyName: formData.companyName,
            },
            withCredentials: true,
          }
        );

        console.log("FULL API RESPONSE:", response.data);

        if (response.data?.status === "OK") {
          const employeeData = response.data?.data || [];

          const employeeList = employeeData
            .map((item) => item?.data || item)
            .filter(Boolean);

          setEmployee(employeeList);

          console.log("EMPLOYEE LIST:", employeeList);
        } else {
          setEmployee([]);

          toast.error(
            response.data?.responseMessage || "No employees found"
          );
        }
      } catch (error) {
        console.error("Get Employees By Company Error:", error);

        setEmployee([]);

        toast.error(
          error.response?.data?.responseMessage ||
            error.response?.data?.message ||
            "Unable to fetch employees"
        );
      } finally {
        setEmployeeLoading(false);
      }
    };

    getEmployeesByCompany();
  }, [formData.companyName, BASE_URL]);

  // Employee selection
  const handleEmployeeChange = (e) => {
    const employeeName = e.target.value;

    const selectedEmployee = employee.find(
      (emp) => emp.employeeName === employeeName
    );

    if (!selectedEmployee) {
      setFormData((prev) => ({
        ...prev,
        employeeName: "",
        uid: "",
        designation: "",
        dateOfJoining: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      employeeName: selectedEmployee.employeeName || "",
      uid: selectedEmployee.uid ?? "",
      designation: selectedEmployee.designation || "",
      dateOfJoining:
        formatDateForInput(selectedEmployee.dateOfJoining) || "",
    }));
  };

  // Form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "companyName") {
      setFormData((prev) => ({
        ...prev,
        companyName: value,
        employeeName: "",
        uid: "",
        designation: "",
        dateOfJoining: "",
      }));

      setEmployee([]);

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Generate PDF
  const generateWarningLetterPDF = async () => {
    if (!pdfRef.current) {
      throw new Error("Warning letter preview not found");
    }

    // Wait for fonts
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    // Wait for images
    const images = Array.from(
      pdfRef.current.querySelectorAll("img")
    );

    await Promise.all(
      images.map((img) => {
        if (img.complete) {
          return Promise.resolve();
        }

        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    const canvas = await html2canvas(pdfRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      scrollX: 0,
      scrollY: 0,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imageWidth = canvas.width;
    const imageHeight = canvas.height;

    const ratio = Math.min(
      pdfWidth / imageWidth,
      pdfHeight / imageHeight
    );

    const finalWidth = imageWidth * ratio;
    const finalHeight = imageHeight * ratio;

    const x = (pdfWidth - finalWidth) / 2;
    const y = 0;

    pdf.addImage(
      imgData,
      "JPEG",
      x,
      y,
      finalWidth,
      finalHeight,
      undefined,
      "FAST"
    );

    return pdf;
  };

  // Submit warning letter
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.companyName || !formData.employeeName) {
      toast.error("Please select company and employee");
      return;
    }

    if (
      !formData.hrManagerName ||
      !formData.designation ||
      !formData.worningType ||
      !formData.dateOfJoining
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!pdfRef.current) {
      toast.error("Unable to generate PDF");
      return;
    }

    try {
      setLoading(true);

      // STEP 1: GENERATE PDF
      const pdf = await generateWarningLetterPDF();

      if (!pdf) {
        throw new Error("PDF generation failed");
      }

      // STEP 2: CONVERT PDF TO BLOB
      const pdfBlob = pdf.output("blob");

      if (!pdfBlob) {
        throw new Error("PDF conversion failed");
      }

      // STEP 3: CHECK PDF SIZE
      const pdfSizeMB = pdfBlob.size / (1024 * 1024);

      if (pdfSizeMB > 2) {
        toast.error("PDF size must be less than 2 MB");
        return;
      }

      // STEP 4: CREATE PDF FILE
      const safeEmployeeName = formData.employeeName
        .trim()
        .replace(/[^a-zA-Z0-9]/g, "_");

      const pdfFile = new File(
        [pdfBlob],
        `Warning_Letter_${safeEmployeeName}.pdf`,
        {
          type: "application/pdf",
        }
      );

      // STEP 5: PREPARE DTO
      const data = {
        issuedDate: formData.issuedDate,
        companyName: formData.companyName,
        employeeName: formData.employeeName,
        uid: formData.uid ? Number(formData.uid) : null,

        hrManagerName: formData.hrManagerName,
        worningType: formData.worningType,
        designation: formData.designation,
        dateOfjoining: formData.dateOfJoining,

        documentName: "Warning Letter",
      };

      // STEP 6: CREATE FORMDATA
      const formDataToSend = new FormData();

      formDataToSend.append("file", pdfFile);
      formDataToSend.append("data", JSON.stringify(data));

      console.log("Warning Letter DTO:", data);
      console.log("PDF Size:", pdfSizeMB.toFixed(2), "MB");

      // STEP 7: CALL API
      const response = await axios.post(
        `${BASE_URL}Admin/addOfficialLetter`,
        formDataToSend,
        {
          withCredentials: true,
        }
      );

      console.log("Warning Letter API Response:", response.data);

      // STEP 8: CHECK RESPONSE
      const responseStatus = String(
        response.data?.status || ""
      ).toUpperCase();

      if (
        ["FAILED", "FAILURE", "ERROR", "FALSE"].includes(responseStatus) ||
        response.data?.status === false
      ) {
        throw new Error(
          response.data?.responseMessage ||
            "Failed to submit warning letter"
        );
      }

      // STEP 9: SUCCESS
      toast.success(
        response.data?.responseMessage ||
          "Warning letter submitted successfully!"
      );

      // STEP 10: RESET FORM
      setFormData({
        issuedDate: new Date().toISOString().split("T")[0],
        companyName: "",
        employeeName: "",
        uid: "",
        hrManagerName: "",
        designation: "",
        worningType: "",
        dateOfJoining: "",
      });

      setEmployee([]);
    } catch (error) {
      console.error("Warning Letter Submission Error:", error);

      toast.error(
        error.response?.data?.responseMessage ||
          error.response?.data?.message ||
          error.message ||
          "Unable to submit warning letter"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainPanel>
      <div className="warningletter-parent parent">
        <div className="warningletter-cont cont">

          {/* FORM */}
          <form className="left-warning" onSubmit={handleSubmit}>

            <Input
              label="Warning Letter Date"
              type="date"
              name="issuedDate"
              value={formData.issuedDate}
              onChange={handleChange}
              required
            />

            <SelectInput
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              label="Select Company Name"
              required
            >
              <MenuItem value="The Indian Journey">
                The Indian Journey
              </MenuItem>

              <MenuItem value="Pandoza Solutions Pvt.Ltd">
                Pandoza Solutions Pvt.Ltd
              </MenuItem>

              <MenuItem value="Akka Foundation">
                Akka Foundation
              </MenuItem>

              <MenuItem value="Nvm Infratech">
                Nvm Infratech
              </MenuItem>
            </SelectInput>

            <SelectInput
              label="Employee Name"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleEmployeeChange}
              required
            >
              {employeeLoading ? (
                <MenuItem disabled>
                  Loading employees...
                </MenuItem>
              ) : employee.length === 0 ? (
                <MenuItem disabled>
                  No employees found
                </MenuItem>
              ) : (
                employee.map((emp) => (
                  <MenuItem

                    value={emp.employeeName}
                  >
                    {emp.employeeName}
                  </MenuItem>
                ))
              )}
            </SelectInput>

            <Input
              label="Date of Joining"
              name="dateOfJoining"
              value={formData.dateOfJoining}
              onChange={handleChange}
              type="date"
              required
            />

            <Input
              label="Employee Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />

            <SelectInput
              label="Reason for Warning"
              name="worningType"
              value={formData.worningType}
              onChange={handleChange}
              required
            >
              <MenuItem value="Performance Issues">
                Performance Issues
              </MenuItem>

              <MenuItem value="Misconduct">
                Misconduct
              </MenuItem>

              <MenuItem value="Policy Violation">
                Policy Violation
              </MenuItem>

              <MenuItem value="Redundancy">
                Redundancy
              </MenuItem>

              <MenuItem value="Absenteeism">
                Absenteeism
              </MenuItem>

              <MenuItem value="Contract Completion">
                Contract Completion
              </MenuItem>

              <MenuItem value="Other">
                Other
              </MenuItem>
            </SelectInput>

            <Input
              label="HR Manager Name"
              name="hrManagerName"
              value={formData.hrManagerName}
              onChange={handleChange}
              required
            />

            <button
              className="btn"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Generating & Submitting..."
                : "Submit"}
            </button>
          </form>

          {/* WARNING LETTER PREVIEW */}
          <div className="right-warning">
            <div
              className="warning-pdf-page"
              ref={pdfRef}
            >

              <img
                className="leftcorner"
                src={left_corner}
                alt="left-corner"
              />

              <img
                className="pan-water-mark"
                src={selectedCompany.watermark}
                alt="Company Watermark"
              />

              <div className="top">
                <div className="date">
                  Date: {formatPreviewDate(formData.issuedDate)}
                </div>

                <div className="logo">
                  <img
                    src={selectedCompany.logo}
                    alt={formData.companyName || "Company Logo"}
                  />
                </div>
              </div>

              <div className="heading">
                <h3>Warning Letter</h3>
              </div>

              <div className="name">
                <p>Dear</p>

                <h4>
                  {formData.employeeName || "Employee Name"}
                </h4>
              </div>

              <div className="gap"></div>

              <p>
                This letter serves as a formal warning regarding your
                conduct/performance during your employment with{" "}
                <strong>
                  {formData.companyName || "Company Name"}
                </strong>.
              </p>

              <div className="gap"></div>

              <p>
                It has been brought to our attention that{" "}
                <strong>
                  {formData.worningType || "the matter communicated to you"}
                </strong>.
                This matter is considered serious and is not in accordance
                with the standards, policies, and expectations of the
                organization.
              </p>

              <div className="gap"></div>

              <p>
                You are hereby advised to take immediate corrective action
                and ensure that such issues are not repeated in the future.
                You are expected to maintain the required standards of
                professionalism, discipline, performance, and conduct
                while carrying out your responsibilities.
              </p>

              <div className="gap"></div>

              <p>
                Please consider this letter as a formal warning. Any
                further occurrence of similar issues or failure to
                demonstrate the required improvement may result in further
                disciplinary action, up to and including termination of
                employment, in accordance with company policies.
              </p>

              <div className="gap"></div>

              <p>
                We expect you to treat this matter seriously and
                demonstrate immediate and sustained improvement.
              </p>

              <div className="gap"></div>

              <p>
                We appreciate your cooperation and look forward to seeing
                positive changes in your conduct and performance.
              </p>

              <div className="gap"></div>

              <p>Thanking you,</p>
              <p>Sincerely</p>

              <h4>
                For {formData.companyName || "Company Name"}
              </h4>

              <div className="gap"></div>
              <div className="gap"></div>
              <div className="gap"></div>

              <p>HR Admin &amp; Finance</p>

              <p>
                {formData.hrManagerName || "HR Manager Name"}
              </p>

              {/* FOOTER */}
              <div className="footer">

                <Link
                  className="left"
                  to="#"
                  onClick={(e) => e.preventDefault()}
                >
                  <div className="icon">
                    <FaLocationDot />
                  </div>

                  <div className="address">
                    <h4>
                      {formData.companyName || "Company Name"}
                    </h4>

                    <p>
                      {selectedCompany.address}
                      <br />
                      CONTACT: {selectedCompany.contact}
                    </p>
                  </div>
                </Link>

                <div className="right">

                  <Link
                    className="contact"
                    to="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="icon">
                      <FaPhoneVolume />
                    </div>

                    <p>{selectedCompany.contact}</p>
                  </Link>

                  <Link
                    className="mail"
                    to="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="icon">
                      <IoIosMail />
                    </div>

                    <p>{selectedCompany.email}</p>
                  </Link>

                  <Link
                    className="globe"
                    to="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="icon">
                      <FaGlobe />
                    </div>

                    <p>{selectedCompany.location}</p>
                  </Link>

                  <img
                    src={right_corner}
                    alt="right-corner"
                  />

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </MainPanel>
  );
};

export default WarningLetter;
