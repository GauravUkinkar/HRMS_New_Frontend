
import React, { useEffect, useRef, useState } from "react";
import "./PromotionLetter.scss";

import MainPanel from "../../comp/MainPanel/MainPanel";
import Input from "../../comp/input/Input";
import SelectInput from "../../comp/selectInput/SelectInput";

import { MenuItem } from "@mui/material";

import panWatermark from "../../assets/pan-watermark.webp";
import panLogo from "../../assets/offer-logo-pan.png";

import indianJourneyWatermark from "../../assets/tij-watermark.png";
import indianJourneyLogo from "../../assets/tij-logo.png";

import akkaWatermark from "../../assets/akka-foundation.png";
import akkaLogo from "../../assets/akka-foundation.png";

import nvmWatermark from "../../assets/nvm-watermark.png";
import nvmLogo from "../../assets/nvm-logo.png";

import right_corner from "../../assets/right-corner.png";
import left_corner from "../../assets/left-corner.png";

import {
  FaLocationDot,
  FaPhoneVolume,
  FaGlobe,
} from "react-icons/fa6";

import { IoIosMail } from "react-icons/io";
import { Link } from "react-router-dom";

import axios from "axios";
import { toast } from "react-toastify";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// =====================================================
// COMPANY CONFIGURATION
// =====================================================

const companyConfig = {
  "The Indian Journey": {
    logo: indianJourneyLogo,
    watermark: indianJourneyWatermark,
    address: "214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014",
    contact: "+91 76666 01972",
    location: "Pune",
  },

  "Pandoza Solutions Pvt.Ltd": {
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

  "NVM Infratech": {
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
  uid: "",
  designation: "",
  newDesignation: "",
  // startDate: "",
  hrManagerName: "",
};

// =====================================================
// PROMOTION LETTER PREVIEW
// =====================================================

const PromotionLetterPreview = ({
  formData,
  selectedCompany,
  formatDate,
}) => {
  return (
    <div className="promotion-pdf-page">

      {/* LEFT CORNER */}
      <img
        className="leftcorner"
        src={left_corner}
        alt="Left Corner"
      />

      {/* DYNAMIC WATERMARK */}
      <img
        className="pan-water-mark"
        src={selectedCompany.watermark}
        alt="Company Watermark"
      />

      {/* HEADER */}
      <div className="top">
        <div className="date">
          Date: {formatDate(formData.issuedDate)}
        </div>

        <div className="logo">
          <img
            src={selectedCompany.logo}
            alt={`${formData.companyName || "Company"} Logo`}
          />
        </div>
      </div>

      {/* HEADING */}
      <div className="heading">
        <h3>Promotion Letter</h3>
      </div>

      {/* EMPLOYEE NAME */}
      <div className="name">
        <p>Dear</p>

        <h4>
          {formData.employeeName || "EMPLOYEE NAME"}
        </h4>
      </div>

      <div className="gap"></div>

      {/* LETTER CONTENT */}
      <p>
        We are pleased to inform you that, in recognition of
        your performance, dedication, and contribution to the
        organization, you have been{" "}
        <strong>
          promoted to the position of{" "}
          {formData.newDesignation || "NEW DESIGNATION"}
        </strong>{" "}
        at{" "}
        <strong>
          {formData.companyName || "Company Name"}
        </strong>
        , effective from{" "}
        <strong>
          {formatDate(formData.startDate)}
        </strong>
        .
      </p>

      <div className="gap"></div>

      <p>
        During your tenure with the organization, you have
        consistently demonstrated professionalism, commitment,
        and a strong sense of responsibility towards your
        assigned duties as{" "}
        <strong>
          {formData.designation || "Previous Designation"}
        </strong>
        .
      </p>

      <div className="gap"></div>

      <p>
        We appreciate your valuable contributions and are
        confident that you will continue to perform with the
        same dedication and commitment in your new role.
      </p>

      <div className="gap"></div>

      <p>
        We wish you continued success and growth in your
        career with{" "}
        <strong>
          {formData.companyName || "Company Name"}
        </strong>
        .
      </p>

      <div className="gap"></div>

      <p>
        Congratulations on your well-deserved promotion!
      </p>

      <div className="gap"></div>
      <div className="gap"></div>

      {/* SIGNATURE */}
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
        {formData.hrManagerName || "HR Manager"}
      </p>

      {/* FOOTER */}
      <div className="footer">

        <Link className="left">
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

          <Link className="contact">
            <div className="icon">
              <FaPhoneVolume />
            </div>

            <p>{selectedCompany.contact}</p>
          </Link>

          <Link className="mail">
            <div className="icon">
              <IoIosMail />
            </div>

            <p>info@pandozasolutions.com</p>
          </Link>

          <Link className="globe">
            <div className="icon">
              <FaGlobe />
            </div>

            <p>www.pandozasolutions.com</p>
          </Link>

          <img
            src={right_corner}
            alt="Right Corner"
          />

        </div>
      </div>
    </div>
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const PromotionLetter = () => {

  const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

  const pdfRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(initialFormData);

  const [employee, setEmployee] = useState([]);

  const [employeeLoading, setEmployeeLoading] = useState(false);

  // =====================================================
  // SELECTED COMPANY
  // =====================================================

  const selectedCompany =
    companyConfig[formData.companyName] ||
    companyConfig["Pandoza Solutions Pvt.Ltd"];

  // =====================================================
  // FETCH EMPLOYEES BY COMPANY
  // =====================================================

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

        console.log(
          "EMPLOYEE API RESPONSE:",
          response.data
        );

        if (response.data?.status === "OK") {

          const employeeData = response.data?.data || [];

          const employeeList = employeeData
            .map((item) => item?.data || item)
            .filter(Boolean);

          setEmployee(employeeList);

        } else {

          setEmployee([]);

          toast.error(
            response.data?.responseMessage ||
            "No employees found"
          );
        }

      } catch (error) {

        console.error(
          "Get Employees By Company Error:",
          error.response?.data || error
        );

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

  // =====================================================
  // HANDLE EMPLOYEE CHANGE
  // =====================================================

  const handleEmployeeChange = (e) => {

    const employeeName = e.target.value;

    const selectedEmployee = employee.find(
      (emp) => emp.employeeName === employeeName
    );

    console.log(
      "SELECTED EMPLOYEE:",
      selectedEmployee
    );

    if (!selectedEmployee) {

      setFormData((prev) => ({
        ...prev,
        employeeName: "",
        uid: "",
        designation: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      employeeName: selectedEmployee.employeeName || "",
      uid: selectedEmployee.uid || "",
      designation: selectedEmployee.designation || "",
    }));
  };

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    // When company changes, clear previous employee details.
    if (name === "companyName") {

      setEmployee([]);

      setFormData((prev) => ({
        ...prev,
        companyName: value,
        employeeName: "",
        designation: "",
      }));

      return;
    }

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

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // GENERATE PROMOTION LETTER PDF
  // =====================================================

  const generatePromotionLetterPDF = async () => {

    if (!pdfRef.current) {
      throw new Error("Promotion letter preview not found");
    }

    // WAIT FOR FONTS
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    // WAIT FOR IMAGES
    const images = pdfRef.current.querySelectorAll("img");

    await Promise.all(
      Array.from(images).map((img) => {

        if (img.complete && img.naturalWidth > 0) {
          return Promise.resolve();
        }

        return new Promise((resolve) => {

          img.onload = resolve;
          img.onerror = resolve;

        });
      })
    );

    const pdfPages = pdfRef.current.querySelectorAll(
      ".promotion-pdf-page"
    );

    if (!pdfPages.length) {
      throw new Error("No promotion letter page found");
    }

    let pdf = null;

    for (let i = 0; i < pdfPages.length; i++) {

      const canvas = await html2canvas(pdfPages[i], {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL(
        "image/jpeg",
        0.75
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

  // =====================================================
  // SUBMIT PROMOTION LETTER
  // =====================================================


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    // STEP 1: GENERATE PDF
    const pdfBlob = await generatePromotionLetterPDF();

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

    const pdfFile = new File(
      [pdfBlob],
      `${employeeName}_Promotion_Letter.pdf`,
      {
        type: "application/pdf",
      }
    );

    // STEP 4: CREATE DTO
    const data = {
      issuedDate: formData.issuedDate,
      companyName: formData.companyName,
      employeeName: formData.employeeName,
      designation: formData.designation,
      uid: Number(formData.uid),
      newDesignation: formData.newDesignation,
    
      hrManagerName: formData.hrManagerName,
      documentName: "Promotion Letter",
    };

    console.log("PROMOTION LETTER DTO:", data);

    // STEP 5: CREATE FORMDATA
    const formDataToSend = new FormData();

    formDataToSend.append("file", pdfFile);
    formDataToSend.append("data", JSON.stringify(data));

    // STEP 6: API CALL
    const apiUrl = `${BASE_URL}Admin/addOfficialLetter`;

    console.log("PROMOTION LETTER API URL:", apiUrl);

    const response = await axios.post(
      apiUrl,
      formDataToSend,
      {
        withCredentials: true,
      }
    );

    // STEP 7: CHECK RESPONSE
    console.log("PROMOTION LETTER HTTP STATUS:", response.status);
    console.log("PROMOTION LETTER API RESPONSE:", response.data);

    const responseData = response.data;

    const backendStatus = String(
      responseData?.status ?? ""
    ).toUpperCase();

    const isSuccess =
      response.status >= 200 &&
      response.status < 300 &&
      !["FAILED", "FAILURE", "ERROR", "FALSE"].includes(
        backendStatus
      ) &&
      responseData?.status !== false;

    if (isSuccess) {
      toast.success(
        responseData?.responseMessage ||
        "Promotion letter added successfully!"
      );

      setFormData({
        ...initialFormData,
        issuedDate: new Date().toISOString().split("T")[0],
      });

      setEmployee([]);
    } else {
      toast.error(
        responseData?.responseMessage ||
        responseData?.message ||
        "Failed to add promotion letter"
      );
    }

  } catch (error) {
    console.error(
      "PROMOTION LETTER API ERROR:",
      error.response?.data || error
    );

    toast.error(
      error.response?.data?.responseMessage ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong while adding promotion letter"
    );

  } finally {
    setLoading(false);
  }
};


  // =====================================================
  // UI
  // =====================================================

  return (

    <MainPanel>

      <div className="promotionletter-parent parent">

        <div className="promotionletter-cont cont">

          {/* LEFT FORM */}
          <form
            className="left-promotion"
            onSubmit={handleSubmit}
          >

            {/* ISSUE DATE */}
            <Input
              label="Promotion Letter Date"
              type="date"
              name="issuedDate"
              value={formData.issuedDate}
              onChange={handleChange}
              required
            />

            {/* COMPANY */}
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

              <MenuItem value="NVM Infratech">
                NVM Infratech
              </MenuItem>

            </SelectInput>

            {/* EMPLOYEE NAME */}
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

                employee.map((emp ) => (

                  <MenuItem
                
                    value={emp.employeeName}
                  >
                    {emp.employeeName}
                  </MenuItem>

                ))

              )}

            </SelectInput>

            {/* PREVIOUS DESIGNATION */}
            <Input
              label="Previous Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />

            {/* NEW DESIGNATION */}
            <Input
              label="New Designation"
              name="newDesignation"
              value={formData.newDesignation}
              onChange={handleChange}
              required
            />

            {/* EFFECTIVE DATE */}
            <Input
              label="Promotion Effective Date"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />

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
              {loading
                ? "Generating & Submitting..."
                : "Submit"}
            </button>

          </form>

          {/* RIGHT PDF PREVIEW */}
          <div className="right-promotion">

            <div
              className="promotion-pages-wrapper"
              ref={pdfRef}
            >

              <PromotionLetterPreview
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

export default PromotionLetter;
