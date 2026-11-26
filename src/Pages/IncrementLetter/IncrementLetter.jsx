
import React, { useEffect, useRef, useState } from "react";
import "./IncrementLetter.scss";

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

import { FaLocationDot, FaPhoneVolume } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { FaGlobe } from "react-icons/fa";

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
  employeeId: "",
  uid: "",

  hrManagerName: "",
  salary: "",
  costtoCompany: "",
  designation: "",
  incrementPercentage: "",
  reviseCts: "",
};

// =====================================================
// INCREMENT LETTER PREVIEW
// =====================================================

const IncrementLetterPreview = ({
  formData,
  selectedCompany,
  formatDate,
  formatAmount,
}) => {
  return (
    <div className="increment-pdf-page">
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

        {/* DYNAMIC LOGO */}
        <div className="logo">
          <img
            src={selectedCompany.logo}
            alt={`${formData.companyName || "Company"} Logo`}
          />
        </div>
      </div>

      {/* HEADING */}
      <div className="heading">
        <h3>Increment Letter</h3>
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
        We are pleased to inform you that, in recognition of your
        continued hard work, dedication and valuable contributions
        to{" "}
        <strong>
          {formData.companyName || "Company Name"}
        </strong>
        , your compensation has been revised.
      </p>

      <div className="gap"></div>

      <p>
        With effect from{" "}
        <strong>{formatDate(formData.effectiveDate)}</strong>,
        your annual CTC has been revised from{" "}
        <strong>
          ₹{formatAmount(formData.costtoCompany)}
        </strong>{" "}
        to{" "}
        <strong>
          ₹{formatAmount(formData.reviseCts)}
        </strong>
        , representing an increment of{" "}
        <strong>
          {formData.incrementPercentage || "____"}%
        </strong>
        . The revised compensation will be applicable from
        the effective date mentioned above.
      </p>

      <div className="gap"></div>

      <p>
        All other terms and conditions of your employment remain
        unchanged.
      </p>

      <div className="gap"></div>

      <p>
        We truly appreciate your performance and look forward to
        your continued contribution to the growth and success of{" "}
        <strong>
          {formData.companyName || "Company Name"}
        </strong>
        .
      </p>

      <div className="gap"></div>

      <p>
        Congratulations and best wishes for your future endeavors!
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

const IncrementLetter = () => {
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
  companyConfig["Pandoza Solutions Pvt.Ltd"] ||
  {
    logo: panLogo,
    watermark: panWatermark,
    address: "214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014",
    contact: "+91 76666 01972",
    location: "Pune",
  };

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

        console.log("EMPLOYEE API RESPONSE:", response.data);

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

  console.log("SELECTED EMPLOYEE:", selectedEmployee);

  if (!selectedEmployee) {
    setFormData((prev) => ({
      ...prev,
      employeeName: "",
      employeeId: "",
      uid: "",
      designation: "",
      costtoCompany: "",
      salary: "",
    }));
    return;
  }

  setFormData((prev) => ({
    ...prev,
    employeeName: selectedEmployee.employeeName || "",
    employeeId: selectedEmployee.employeeId || "",
    uid: selectedEmployee.uid ?? "",
    designation: selectedEmployee.designation || "",
    costtoCompany: selectedEmployee.costtoCompany || "",
    salary: selectedEmployee.employeeSalary || "",
  }));
};

  // =====================================================
  // HANDLE INPUT CHANGE
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
  // AMOUNT FORMAT
  // =====================================================

  const formatAmount = (amount) => {
    if (
      amount === "" ||
      amount === null ||
      amount === undefined
    ) {
      return "________";
    }

    return Number(amount).toLocaleString("en-IN");
  };

  // =====================================================
  // GENERATE INCREMENT LETTER PDF
  // =====================================================

  const generateIncrementLetterPDF = async () => {
    if (!pdfRef.current) {
      throw new Error("Increment letter preview not found");
    }

    // Wait for fonts
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    // Wait for preview images
    const images = pdfRef.current.querySelectorAll("img");

    await Promise.all(
      Array.from(images).map((img) => {
        if (img.complete) {
          return Promise.resolve();
        }

        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    const pdfPages = pdfRef.current.querySelectorAll(
      ".increment-pdf-page"
    );

    if (!pdfPages.length) {
      throw new Error("No increment letter page found");
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

      const imgData = canvas.toDataURL("image/jpeg", 0.75);

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
  // SUBMIT INCREMENT LETTER
  // =====================================================


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    // STEP 1: GENERATE PDF
    const pdfBlob = await generateIncrementLetterPDF();

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
      `${employeeName}_Increment_Letter.pdf`,
      {
        type: "application/pdf",
      }
    );

    // STEP 4: CREATE DTO
    const data = {
      issuedDate: formData.issuedDate,
      employeeName: formData.employeeName,
      employeeId: formData.employeeId,
      uid: Number(formData.uid),

      salary: Number(formData.salary) || 0,
      hrManagerName: formData.hrManagerName,
      designation: formData.designation,

      gender: formData.gender || "Other",

      effectiveDate: formData.effectiveDate,

      incrementPercentage:
        Number(formData.incrementPercentage) || 0,

      previousCtc: Number(formData.costtoCompany) || 0,

      reviseCts: Number(formData.reviseCts) || 0,
    };

    console.log("INCREMENT LETTER DTO:", data);

    // STEP 5: CREATE FORMDATA
    const formDataToSend = new FormData();

    formDataToSend.append("file", pdfFile);
    formDataToSend.append("data", JSON.stringify(data));

    // STEP 6: API CALL
    const apiUrl = `${BASE_URL}Admin/addIncreamentLetter`;

    console.log("INCREMENT LETTER API URL:", apiUrl);

    const response = await axios.post(
      apiUrl,
      formDataToSend,
      {
        withCredentials: true,
      }
    );

    // STEP 7: CHECK RESPONSE
    console.log(
      "INCREMENT LETTER HTTP STATUS:",
      response.status
    );

    console.log(
      "INCREMENT LETTER API RESPONSE:",
      response.data
    );

    const responseData = response.data;

    const backendStatus = String(
      responseData?.status ?? ""
    ).toUpperCase();

    const successStatuses = [
      "OK",
      "SUCCESS",
      "CREATED",
      "200",
      "201",
      "TRUE",
    ];

    const failureStatuses = [
      "FAILED",
      "FAILURE",
      "ERROR",
      "FALSE",
      "BAD_REQUEST",
    ];

    const isSuccess =
      response.status >= 200 &&
      response.status < 300 &&
      (
        responseData?.status === undefined ||
        responseData?.status === null ||
        successStatuses.includes(backendStatus)
      ) &&
      !failureStatuses.includes(backendStatus);

    if (isSuccess) {
      toast.success(
        responseData?.responseMessage ||
        "Increment letter added successfully!"
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
        "Failed to add increment letter"
      );
    }

  } catch (error) {
    console.error(
      "INCREMENT LETTER API ERROR:",
      error.response?.data || error
    );

    console.error(
      "INCREMENT LETTER HTTP STATUS:",
      error.response?.status
    );

    toast.error(
      error.response?.data?.responseMessage ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong while adding increment letter"
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
      <div className="incrementletter-parent parent">
        <div className="incrementletter-cont cont">

          {/* LEFT FORM */}
          <form
            className="left-increment"
            onSubmit={handleSubmit}
          >
            <Input
              label="Increment Letter Date"
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

            {/* EFFECTIVE DATE */}
            <Input
              label="Effective Date"
              type="date"
              name="effectiveDate"
              value={formData.effectiveDate}
              onChange={handleChange}
              required
            />

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

            {/* SALARY */}
            <Input
              label="Salary"
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
            />

            {/* PREVIOUS CTC */}
            <Input
              label="Previous CTC"
              name="costtoCompany"
              type="number"
              value={formData.costtoCompany}
              onChange={handleChange}
              required
            />

            {/* INCREMENT PERCENTAGE */}
            <Input
              label="Increment Percentage"
              name="incrementPercentage"
              type="number"
              value={formData.incrementPercentage}
              onChange={handleChange}
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

            {/* REVISED CTC */}
            <Input
              label="Revised CTC"
              name="reviseCts"
              type="number"
              value={formData.reviseCts}
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
              {loading ? "Generating & Submitting..." : "Submit"}
            </button>
          </form>

          {/* RIGHT PDF PREVIEW */}
          <div className="right-increment">
            <div
              className="increment-pages-wrapper"
              ref={pdfRef}
            >
              <IncrementLetterPreview
                formData={formData}
                selectedCompany={selectedCompany}
                formatDate={formatDate}
                formatAmount={formatAmount}
              />
            </div>
          </div>

        </div>
      </div>
    </MainPanel>
  );
};

export default IncrementLetter;
