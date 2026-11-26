import React, { useEffect, useState, useRef } from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import "./ExperienceLetter.scss";
import SelectInput from "../../comp/selectInput/SelectInput";
import { MenuItem } from "@mui/material";
import Input from "../../comp/input/Input";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { FaGlobe, FaLocationDot, FaPhoneVolume } from "react-icons/fa6";

import { Link } from "react-router-dom";
import { IoIosMail } from "react-icons/io";

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

const ExperienceLetter = () => {
  const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

  const pdfRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [employeeLoading, setEmployeeLoading] = useState(false);

  const [formData, setFormData] = useState({
    issuedDate: new Date().toISOString().split("T")[0],
    companyName: "",
    employeeName: "",
    employeeId: "",
    uid: "",
    designation: "",
    startDate: "",
    endDate: "",
    hrManagerName: "",
  });

  const selectedCompany =
    companyConfig[formData.companyName] ||
    companyConfig["Pandoza Solutions Pvt.Ltd"];

  // Fetch employees by company
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
          },
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

          toast.error(response.data?.responseMessage || "No Employees found");
        }
      } catch (error) {
        console.error("Get Employees By Company Error:", error);

        setEmployee([]);

        toast.error(
          error.response?.data?.responseMessage ||
            error.response?.data?.message ||
            "Unable to fetch employees",
        );
      } finally {
        setEmployeeLoading(false);
      }
    };

    getEmployeesByCompany();
  }, [formData.companyName, BASE_URL]);

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

    if (parts.length !== 3) {
      return date;
    }

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  // Employee selection
  const handleEmployeeChange = (e) => {
    const employeeName = e.target.value;

    const selectedEmployee = employee.find(
      (emp) => emp.employeeName === employeeName,
    );

    console.log("SELECTED EMPLOYEE:", selectedEmployee);

    if (!selectedEmployee) {
      setFormData((prev) => ({
        ...prev,
        employeeName: "",
        employeeId: "",
        uid: "",
        designation: "",
        startDate: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      employeeName: selectedEmployee.employeeName || "",
      employeeId: selectedEmployee.employeeId || "",
      uid: selectedEmployee.uid ?? "",
      designation: selectedEmployee.designation || "",
      startDate: formatDateForInput(selectedEmployee.dateOfJoining) || "",
    }));
  };

  // Form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "companyName") {
      setFormData((prev) => ({
        ...prev,
        companyName: value,
        employeeName: "",
        employeeId: "",
        uid: "",
        designation: "",
        startDate: "",
        endDate: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Generate PDF
  const generateExperienceLetterPDF = async () => {
    if (!pdfRef.current) {
      throw new Error("Experience letter preview not found");
    }

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    // Wait for images to load
    const images = Array.from(pdfRef.current.querySelectorAll("img"));

    await Promise.all(
      images.map((img) => {
        if (img.complete) {
          return Promise.resolve();
        }

        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }),
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

    // Fit letter inside A4
    const ratio = Math.min(pdfWidth / imageWidth, pdfHeight / imageHeight);

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
      "FAST",
    );

    return pdf;
  };

  // Submit and download PDF directly

  const handleSubmit = async (e) => {
    e.preventDefault();

    // STEP 1: VALIDATE FORM
    if (
      !formData.companyName ||
      !formData.employeeName ||
      !formData.uid ||
      !formData.designation ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.hrManagerName
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!pdfRef.current) {
      toast.error("Experience letter preview not found");
      return;
    }

    try {
      setLoading(true);

      // STEP 2: GENERATE PDF
      const pdf = await generateExperienceLetterPDF();

      if (!pdf) {
        throw new Error("PDF generation failed");
      }

      // STEP 3: CONVERT PDF TO BLOB
      const pdfBlob = pdf.output("blob");

      if (!pdfBlob) {
        throw new Error("Unable to convert PDF to Blob");
      }

      // STEP 4: CHECK PDF SIZE
      const pdfSizeMB = pdfBlob.size / (1024 * 1024);

      if (pdfSizeMB > 2) {
        toast.error(
          `PDF size is ${pdfSizeMB.toFixed(2)} MB. Maximum allowed size is 2 MB.`,
        );
        return;
      }

      // STEP 5: CREATE PDF FILE
      const employeeName = formData.employeeName
        .trim()
        .replace(/[^a-zA-Z0-9]/g, "_");

      const pdfFile = new File(
        [pdfBlob],
        `Experience_Letter_${employeeName}.pdf`,
        {
          type: "application/pdf",
        },
      );

      // STEP 6: CREATE BACKEND DTO
      const data = {
        issuedDate: formData.issuedDate,
        companyName: formData.companyName,
        employeeName: formData.employeeName,
        uid: Number(formData.uid),
        designation: formData.designation,
        dateOfjoining: formData.startDate,
        endDate: formData.endDate,
        hrManagerName: formData.hrManagerName,
        documentName: "Experience Letter",
      };

      console.log("EXPERIENCE LETTER DTO:", data);

      // STEP 7: CREATE FORMDATA
      const formDataToSend = new FormData();

      formDataToSend.append("file", pdfFile);
      formDataToSend.append("data", JSON.stringify(data));

      // STEP 8: API CALL
      const apiUrl = `${BASE_URL}Admin/addOfficialLetter`;

      console.log("EXPERIENCE LETTER API URL:", apiUrl);

      const response = await axios.post(apiUrl, formDataToSend, {
        withCredentials: true,
      });

      // STEP 9: HANDLE RESPONSE
      console.log("EXPERIENCE LETTER HTTP STATUS:", response.status);

      console.log("EXPERIENCE LETTER API RESPONSE:", response.data);

      const responseData = response.data;

      const backendStatus = String(responseData?.status ?? "").toUpperCase();

      const isSuccess =
        response.status >= 200 &&
        response.status < 300 &&
        !["FAILED", "FAILURE", "ERROR", "FALSE"].includes(backendStatus) &&
        responseData?.status !== false;

      if (isSuccess) {
        toast.success(
          responseData?.responseMessage ||
            "Experience letter added successfully!",
        );

        // STEP 10: RESET FORM
        setFormData({
          issuedDate: new Date().toISOString().split("T")[0],
          companyName: "",
          employeeName: "",
          employeeId: "",
          uid: "",
          designation: "",
          startDate: "",
          endDate: "",
          hrManagerName: "",
        });

        setEmployee([]);
      } else {
        toast.error(
          responseData?.responseMessage ||
            responseData?.message ||
            "Failed to add experience letter",
        );
      }
    } catch (error) {
      console.error(
        "EXPERIENCE LETTER API ERROR:",
        error.response?.data || error,
      );

      console.error("EXPERIENCE LETTER HTTP STATUS:", error.response?.status);

      toast.error(
        error.response?.data?.responseMessage ||
          error.response?.data?.message ||
          error.message ||
          "Something went wrong while adding experience letter",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainPanel>
      <div className="experienceletter-parent parent">
        <div className="experienceletter-cont cont">
          {/* FORM */}
          <form className="left-experience" onSubmit={handleSubmit}>
            <Input
              label="Experience Letter Date"
              type="date"
              name="issuedDate"
              value={formData.issuedDate.split("T")[0]}
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
              <MenuItem value="The Indian Journey">The Indian Journey</MenuItem>

              <MenuItem value="Pandoza Solutions Pvt.Ltd">
                Pandoza Solutions Pvt.Ltd
              </MenuItem>

              <MenuItem value="Akka Foundation">Akka Foundation</MenuItem>

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
                <MenuItem disabled>Loading employees...</MenuItem>
              ) : employee.length === 0 ? (
                <MenuItem disabled>No employees found</MenuItem>
              ) : (
                employee.map((emp, index) => (
                  <MenuItem
                    key={emp.employeeId || emp.eid || index}
                    value={emp.employeeName}
                  >
                    {emp.employeeName}
                  </MenuItem>
                ))
              )}
            </SelectInput>

            <Input
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />

            <Input
              label="Joining Date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              type="date"
              required
            />

            <Input
              label="Relieving Date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              type="date"
              required
            />

            <Input
              label="HR Manager Name"
              name="hrManagerName"
              value={formData.hrManagerName}
              onChange={handleChange}
              required
            />

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Generating & Submitting..." : "Submit"}
            </button>
          </form>

          {/* EXPERIENCE LETTER PREVIEW */}
          <div className="right-experience">
            <div className="experience-pdf-page" ref={pdfRef}>
              <img className="leftcorner" src={left_corner} alt="left-corner" />

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
                <h3>Experience Letter</h3>
              </div>

              <div className="name">
                <p>Dear</p>

                <h4>{formData.employeeName || "Employee Name"}</h4>
              </div>

              <div className="gap"></div>

              <p>
                This is to certify that{" "}
                <strong>{formData.employeeName || "Employee Name"}</strong> was
                employed with{" "}
                <strong>{formData.companyName || "Company Name"}</strong> as a{" "}
                <strong>{formData.designation || "Designation"}</strong> from{" "}
                <strong>{formatPreviewDate(formData.startDate)}</strong> to{" "}
                <strong>{formatPreviewDate(formData.endDate)}</strong>.
              </p>

              <div className="gap"></div>

              <p>
                During his tenure with the organization, he was responsible for
                carrying out his assigned duties and responsibilities
                efficiently and professionally.
              </p>

              <div className="gap"></div>

              <p>
                We found him to be sincere, hardworking, dedicated, and
                committed towards his work. His conduct and performance during
                his employment were satisfactory.
              </p>

              <div className="gap"></div>

              <p>
                We truly appreciate your performance and look forward to your
                continued contribution to the growth and success of{" "}
                <strong>{formData.companyName || "Company Name"}</strong>.
              </p>

              <div className="gap"></div>

              <p>We wish him all the very best for his future endeavour .</p>

              <div className="gap"></div>
              <div className="gap"></div>

              <p>Thanking you,</p>

              <p>Sincerely</p>

              <h4>For {formData.companyName || "Company Name"}</h4>

              <div className="gap"></div>
              <div className="gap"></div>
              <div className="gap"></div>
              <div className="gap"></div>

              <p>HR Admin &amp; Finance</p>

              <p>{formData.hrManagerName || "HR Manager"}</p>

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
                    <h4>{formData.companyName || "Company Name"}</h4>

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

                  <img src={right_corner} alt="right-corner" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainPanel>
  );
};

export default ExperienceLetter;
