
import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import MainPanel from "../../comp/MainPanel/MainPanel";
import { UserContext } from "../../../Context";
import "./TerminationLetter.scss";

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

const TerminationLetter = () => {
  const pdfRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

  const [loading, setLoading] = useState(false);

  const [employee, setEmployee] = useState([]);
  const [employeeLoading, setEmployeeLoading] = useState(false);

  const [formData, setFormData] = useState({
    issuedDate: new Date().toISOString().split("T")[0],
    companyName: "",
    employeeName: "",
    uid: "",
    effectiveDate: "",
    designation: "",
    terminationType: "",
    dateOfJoining: "",
    hrManagerName: "",
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
  const generateTerminationLetterPDF = async () => {
    if (!pdfRef.current) {
      throw new Error("Termination letter preview not found");
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

    pdf.addImage(
      imgData,
      "JPEG",
      x,
      0,
      finalWidth,
      finalHeight,
      undefined,
      "FAST"
    );

    return pdf;
  };

  // Submit termination letter
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate company and employee
    if (!formData.companyName || !formData.employeeName) {
      toast.error("Please select company and employee");
      return;
    }

    // Validate required fields
    if (
      !formData.hrManagerName ||
      !formData.designation ||
      !formData.terminationType ||
      !formData.dateOfJoining ||
      !formData.effectiveDate
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
      const pdf = await generateTerminationLetterPDF();

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
        `Termination_Letter_${safeEmployeeName}.pdf`,
        {
          type: "application/pdf",
        }
      );

      // STEP 5: PREPARE DTO
      // effectiveDate is intentionally excluded.
      // It appears in the PDF but is not sent to the API.
      const data = {
        issuedDate: formData.issuedDate,
        companyName: formData.companyName,
        employeeName: formData.employeeName,
        uid: formData.uid ? Number(formData.uid) : null,
        hrManagerName: formData.hrManagerName,
        terminationType: formData.terminationType,
        designation: formData.designation,
        dateOfJoining: formData.dateOfJoining,
        documentName: "Termination Letter",
      };

      // STEP 6: CREATE FORMDATA
      const formDataToSend = new FormData();

      formDataToSend.append("file", pdfFile);
      formDataToSend.append("data", JSON.stringify(data));

      console.log("Termination Letter DTO:", data);
      console.log("PDF Size:", pdfSizeMB.toFixed(2), "MB");

      // STEP 7: CALL API
      const response = await axios.post(
        `${BASE_URL}Admin/addOfficialLetter`,
        formDataToSend,
        {
          withCredentials: true,
        }
      );

      console.log("Termination Letter API Response:", response.data);

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
            "Failed to submit termination letter"
        );
      }

      // STEP 9: SUCCESS
      toast.success(
        response.data?.responseMessage ||
          "Termination letter submitted successfully!"
      );

      // STEP 10: RESET FORM
      setFormData({
        issuedDate: new Date().toISOString().split("T")[0],
        companyName: "",
        employeeName: "",
        uid: "",
        effectiveDate: "",
        hrManagerName: "",
        designation: "",
        terminationType: "",
        dateOfJoining: "",
      });

      setEmployee([]);
    } catch (error) {
      console.error("Termination Letter Submission Error:", error);

      toast.error(
        error.response?.data?.responseMessage ||
          error.response?.data?.message ||
          error.message ||
          "Unable to submit termination letter"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainPanel>
      <div className="terminationletter-parent parent">
        <div className="terminationletter-cont cont">

          {/* FORM */}
          <form
            className="left-termination"
            onSubmit={handleSubmit}
          >
            <Input
              label="Termination Letter Date"
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
                employee.map((emp, index) => (
                  <MenuItem
                    key={emp.uid || emp.employeeId || index}
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
              label="Reason for Termination"
              name="terminationType"
              value={formData.terminationType}
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
              label="Effective Date"
              type="date"
              name="effectiveDate"
              value={formData.effectiveDate}
              onChange={handleChange}
              required
            />

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

          {/* TERMINATION LETTER PREVIEW */}
          <div className="right-termination">
            <div
              className="termination-pdf-page"
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
                <h3>Termination Letter</h3>
              </div>

              <div className="name">
                <p>Dear</p>

                <h4>
                  {formData.employeeName || "Employee Name"}
                </h4>
              </div>

              <div className="gap"></div>

              <p>
                This letter is to formally inform you that your employment
                with{" "}
                <strong>
                  {formData.companyName || "Company Name"}
                </strong>{" "}
                is being terminated effective{" "}
                <strong>
                  {formatPreviewDate(formData.effectiveDate)}
                </strong>.
              </p>

              <div className="gap"></div>

              <p>
                We regret to inform you that this decision has been made
                due to{" "}
                <strong>
                  {formData.terminationType ||
                    "the circumstances communicated to you"}
                </strong>.
                After careful consideration and review of the circumstances,
                the company has decided to discontinue your employment with
                the organization.
              </p>

              <div className="gap"></div>

              <p>
                You are required to complete the necessary handover of your
                responsibilities, company property, documents, and other
                assets entrusted to you on or before your last working day.
              </p>

              <div className="gap"></div>

              <p>
                Your final settlement, including any applicable salary,
                benefits, and other dues, will be processed in accordance
                with the company's policies and applicable terms of
                employment.
              </p>

              <div className="gap"></div>

              <p>
                We request you to cooperate with the HR and management
                team during the exit and handover process to ensure a
                smooth transition.
              </p>

              <div className="gap"></div>

              <p>
                We thank you for your contributions during your tenure
                with{" "}
                <strong>
                  {formData.companyName || "Company Name"}
                </strong>{" "}
                and wish you the very best in your future endeavors.
              </p>

              <div className="gap"></div>

              <p>Thanking you,</p>
              <p>Sincerely</p>

              <h4>
                For {formData.companyName || "Company Name"}
              </h4>

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

export default TerminationLetter;
