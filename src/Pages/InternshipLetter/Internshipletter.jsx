
import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { toast } from "react-toastify";

import MainPanel from "../../comp/MainPanel/MainPanel";
import "./Intershipletter.scss";

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

const Internshipletter = () => {
  const pdfRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

  const [loading, setLoading] = useState(false);

  // Employee list
  const [employees, setEmployees] = useState([]);
  const [employeeLoading, setEmployeeLoading] = useState(false);

  const [formData, setFormData] = useState({
    issuedDate: new Date().toISOString().split("T")[0],
    companyName: "",
    internName: "",
    uid: "",
    internshipPosition: "",
    internshipStartDate: "",
    internshipEndDate: "",
    hrManagerName: "",
  });

  const selectedCompany =
    companyConfig[formData.companyName] ||
    companyConfig["Pandoza Solutions Pvt.Ltd"];

  // Fetch employees according to selected company
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!formData.companyName) {
        setEmployees([]);
        return;
      }

      try {
        setEmployeeLoading(true);
        setEmployees([]);

        const response = await axios.get(
          `${BASE_URL}Admin/GetAllEmployeeByCompanyName`,
          {
            params: {
              companyName: formData.companyName,
            },
            withCredentials: true,
          }
        );

        console.log("Get Employees API Response:", response.data);

        if (response.data?.status === "OK") {
          const employeeList = (response.data?.data || [])
            .map((item) => item?.data || item)
            .filter((item) => item && item.employeeName);

          setEmployees(employeeList);
        } else {
          setEmployees([]);
          toast.error(
            response.data?.responseMessage ||
              "No employees found for this company"
          );
        }
      } catch (error) {
        console.error("Fetch Employees Error:", error);
        setEmployees([]);

        toast.error(
          error.response?.data?.responseMessage ||
            "Unable to fetch employees"
        );
      } finally {
        setEmployeeLoading(false);
      }
    };

    fetchEmployees();
  }, [formData.companyName]);

  // Format date for preview
  const formatPreviewDate = (date) => {
    if (!date) return "DD-MM-YYYY";

    const parts = date.split("-");

    if (parts.length !== 3) return date;

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,

      // Clear selected employee when company changes
      ...(name === "companyName"
        ? {
            internName: "",
            uid: "",
          }
        : {}),
    }));
  };

  // Handle employee selection
  const handleEmployeeChange = (e) => {
    const selectedName = e.target.value;

    const selectedEmployee = employees.find(
      (employee) => employee.employeeName === selectedName
    );

    setFormData((prev) => ({
      ...prev,
      internName: selectedEmployee?.employeeName || "",
      uid: selectedEmployee?.uid ?? "",
    }));

    console.log("Selected Employee:", selectedEmployee);
    console.log("Selected Employee UID:", selectedEmployee?.uid);
  };

  // Generate internship letter PDF
  const generateInternshipLetterPDF = async () => {
    if (!pdfRef.current) {
      throw new Error("Internship letter preview not found");
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

  // Submit internship letter
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.companyName ||
      !formData.internName ||
      !formData.internshipPosition ||
      !formData.internshipStartDate ||
      !formData.internshipEndDate ||
      !formData.hrManagerName
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate employee UID
    if (
      formData.uid === "" ||
      formData.uid === null ||
      formData.uid === undefined
    ) {
      toast.error("Please select a valid employee");
      return;
    }

    // Validate internship dates
    if (
      new Date(formData.internshipEndDate) <
      new Date(formData.internshipStartDate)
    ) {
      toast.error("Internship end date cannot be before start date");
      return;
    }

    if (!pdfRef.current) {
      toast.error("Unable to generate PDF");
      return;
    }

    try {
      setLoading(true);

      // STEP 1: GENERATE PDF
      const pdf = await generateInternshipLetterPDF();

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
      const safeInternName = formData.internName
        .trim()
        .replace(/[^a-zA-Z0-9]/g, "_");

      const pdfFile = new File(
        [pdfBlob],
        `Internship_Letter_${safeInternName}.pdf`,
        {
          type: "application/pdf",
        }
      );

      // STEP 5: PREPARE DTO
      const data = {
        issuedDate: formData.issuedDate,
        companyName: formData.companyName,
        employeeName: formData.internName,
        designation: formData.internshipPosition,
        dateOfjoining: formData.internshipStartDate,
        endDate: formData.internshipEndDate,
        hrManagerName: formData.hrManagerName,
        documentName: "Internship Letter",
        uid: Number(formData.uid),
      };

      // STEP 6: CREATE FORMDATA
      const formDataToSend = new FormData();

      formDataToSend.append("file", pdfFile);
      formDataToSend.append("data", JSON.stringify(data));

      console.log("Internship Letter DTO:", data);
      console.log("Selected Employee UID:", formData.uid);
      console.log("PDF Size:", pdfSizeMB.toFixed(2), "MB");

      // STEP 7: CALL API
      const response = await axios.post(
        `${BASE_URL}Admin/addOfficialLetter`,
        formDataToSend,
        {
          withCredentials: true,
        }
      );

      console.log("Internship Letter API Response:", response.data);

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
            "Failed to submit internship letter"
        );
      }

      // STEP 9: SUCCESS
      toast.success(
        response.data?.responseMessage ||
          "Internship letter submitted successfully!"
      );

      // STEP 10: RESET FORM
      setFormData({
        issuedDate: new Date().toISOString().split("T")[0],
        companyName: "",
        internName: "",
        uid: "",
        internshipPosition: "",
        internshipStartDate: "",
        internshipEndDate: "",
        hrManagerName: "",
      });

      setEmployees([]);
    } catch (error) {
      console.error("Internship Letter Submission Error:", error);

      toast.error(
        error.response?.data?.responseMessage ||
          error.response?.data?.message ||
          error.message ||
          "Unable to submit internship letter"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainPanel>
      <div className="internshipletter-parent parent">
        <div className="internshipletter-cont cont">

          {/* FORM */}
          <form
            className="left-internship"
            onSubmit={handleSubmit}
          >
            <Input
              label="Internship Letter Date"
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

            {/* EMPLOYEE DROPDOWN */}
            <SelectInput
              name="internName"
              value={formData.internName}
              onChange={handleEmployeeChange}
              label="Select Intern Name"
              required
              disabled={!formData.companyName || employeeLoading}
            >
              {employeeLoading ? (
                <MenuItem disabled value="">
                  Loading employees...
                </MenuItem>
              ) : employees.length > 0 ? (
                employees.map((employee) => (
                  <MenuItem
                    key={employee.uid}
                    value={employee.employeeName}
                  >
                    {employee.employeeName}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled value="">
                  {formData.companyName
                    ? "No employees found"
                    : "Select company first"}
                </MenuItem>
              )}
            </SelectInput>

            <Input
              label="Internship Position"
              name="internshipPosition"
              value={formData.internshipPosition}
              onChange={handleChange}
              required
            />

            <Input
              label="Internship Start Date"
              type="date"
              name="internshipStartDate"
              value={formData.internshipStartDate}
              onChange={handleChange}
              required
            />

            <Input
              label="Internship End Date"
              type="date"
              name="internshipEndDate"
              value={formData.internshipEndDate}
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
              disabled={loading || employeeLoading}
            >
              {loading
                ? "Generating & Submitting..."
                : "Submit"}
            </button>
          </form>

          {/* INTERNSHIP LETTER PREVIEW */}
          <div className="right-internship">
            <div
              className="internship-pdf-page"
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
                <h3>Internship Letter</h3>
              </div>

              <div className="name">
                <p>Dear</p>

                <h4>
                  {formData.internName || "Intern Name"}
                </h4>
              </div>

              <div className="gap"></div>

              <p>
                We are pleased to inform you that you have been selected
                for an internship as a{" "}
                <strong>
                  {formData.internshipPosition || "Internship Position"}
                </strong>{" "}
                at{" "}
                <strong>
                  {formData.companyName || "Company Name"}
                </strong>
                , effective from{" "}
                <strong>
                  {formatPreviewDate(formData.internshipStartDate)}
                </strong>{" "}
                to{" "}
                <strong>
                  {formatPreviewDate(formData.internshipEndDate)}
                </strong>.
              </p>

              <div className="gap"></div>

              <p>
                During your internship, you will have the opportunity to
                gain practical knowledge and hands-on experience related
                to your field of work. You will be expected to carry out
                the responsibilities assigned to you with dedication,
                professionalism, and sincerity.
              </p>

              <div className="gap"></div>

              <p>
                We believe that this internship will provide you with
                valuable exposure and help you develop your professional
                skills and knowledge.
              </p>

              <div className="gap"></div>

              <p>
                We wish you a successful and rewarding internship with{" "}
                <strong>
                  {formData.companyName || "Company Name"}
                </strong>.
              </p>

              <div className="gap"></div>
              <div className="gap"></div>

              <p>Thanking you,</p>
              <p>Sincerely</p>

              <h4>
                For {formData.companyName || "Company Name"}
              </h4>

              <div className="gap"></div>
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

export default Internshipletter;
