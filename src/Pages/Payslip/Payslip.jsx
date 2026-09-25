import React, {
  useContext,
  useRef,
} from "react";

import "./Payslip.scss";

import { SlCalender } from "react-icons/sl";
import { IoMdDownload } from "react-icons/io";

import MainPanel from "../../comp/MainPanel/MainPanel";

import { useLocation } from "react-router-dom";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import panWatermark from "../../assets/pan-watermark.webp";
import panLogo from "../../assets/offer-logo-pan.png";

import indianJourneyWatermark from "../../assets/tij-watermark.png";
import indianJourneyLogo from "../../assets/tij-logo.png";

import akkaWatermark from "../../assets/akka-foundation.png";
import akkaLogo from "../../assets/akka-foundation.png";

import nvmWatermark from "../../assets/nvm-watermark.png";
import nvmLogo from "../../assets/nvm-logo.png";

import { UserContext } from "../../../Context";
import { IoMdArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";



const Payslip = () => {
  // ==========================================
  // LOCATION
  // ==========================================

  const location = useLocation();

  /*
   * This is the employee record sent from
   * SalaryManagement when View is clicked.
   */

  const payslip = location.state?.payslip;

  console.log(
    "PAYSLIP DATA RECEIVED:",
    payslip
  );

  // ==========================================
  // USER
  // ==========================================

  const { user } = useContext(
    UserContext
  );

  // ==========================================
  // COMPANY CONFIGURATION
  // ==========================================

  const companyConfig = {
    "Pandoza Solutions Pvt Ltd": {
      logo: panLogo,
      watermark: panWatermark,
      color: "#0b8b95",
      textColor: "#ffffff",
    },

    "Akka Foundation": {
      logo: akkaLogo,
      watermark: akkaWatermark,
      color: "#0b8b95",
      textColor: "#ffffff",
    },

    "The Indian Journey": {
      logo: indianJourneyLogo,
      watermark: indianJourneyWatermark,
      color: "#0b8b95",
      textColor: "#ffffff",
    },

    "NVM Infratech": {
      logo: nvmLogo,
      watermark: nvmWatermark,
      color: "#0b8b95",
      textColor: "#ffffff",
    },
  };

  /*
   * Try company name from:
   *
   * 1. Selected salary record
   * 2. Logged-in user
   *
   * If neither exists, use Pandoza as fallback
   * so the payslip still opens.
   */

  const rawCompanyName =
    payslip?.companyName ||
    payslip?.company ||
    payslip?.company_name ||
    user?.companyName ||
    user?.company ||
    "";

  const companyName =
    String(rawCompanyName)
      .trim();

  /*
   * Find company without depending on exact
   * uppercase/lowercase matching.
   */

  const companyKey =
    Object.keys(companyConfig).find(
      (key) =>
        key.toLowerCase() ===
        companyName.toLowerCase()
    ) ||
    "Pandoza Solutions Pvt Ltd";

  const currentCompany =
    companyConfig[companyKey];

  console.log(
    "COMPANY USED FOR PAYSLIP:",
    companyKey
  );

  // ==========================================
  // PRINT REF
  // ==========================================

  const printRef = useRef(null);

  // ==========================================
  // FORMAT AMOUNT
  // ==========================================

  const formatAmount = (value) => {
    const amount =
      Number(value || 0);

    return amount.toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // ==========================================
  // FORMAT MONTH
  // ==========================================

  const formatMonth = (
    month,
    year
  ) => {
    if (!month || !year) {
      return "-";
    }

    const monthText =
      String(month);

    return `${monthText.substring(
      0,
      3
    )} ${year}`;
  };

  // ==========================================
  // TOTAL DEDUCTIONS
  // ==========================================

  const totalDeductions =
    Number(
      payslip?.employeePf || 0
    ) +
    Number(
      payslip?.employeeEsic || 0
    ) +
    Number(
      payslip?.professionalTax || 0
    ) +
    Number(
      payslip?.salaryAdvance || 0
    ) +
    Number(
      payslip?.lop || 0
    ) +
    Number(
      payslip?.otherDiduction || 0
    ) +
    Number(
      payslip?.insuranceCorporation || 0
    );

  // ==========================================
  // DOWNLOAD PDF
  // ==========================================

  const handleDownload = async () => {
    const input =
      printRef.current;

    if (!input) return;

    try {
      const canvas =
        await html2canvas(
          input,
          {
            scale: 2,
            useCORS: true,
            backgroundColor:
              "#ffffff",
            logging: false,
          }
        );

      const imgData =
        canvas.toDataURL(
          "image/png"
        );

      const pdf = new jsPDF(
        "p",
        "mm",
        "a4"
      );

      const imgProps =
        pdf.getImageProperties(
          imgData
        );

      const pdfWidth =
        pdf.internal.pageSize.getWidth();

      const pdfHeight =
        (imgProps.height *
          pdfWidth) /
        imgProps.width;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      pdf.save(
        `Payslip-${
          payslip?.employeeId ||
          "Employee"
        }-${
          payslip?.month || ""
        }-${
          payslip?.year || ""
        }.pdf`
      );
    } catch (error) {
      console.error(
        "PDF Download Error:",
        error
      );
    }
  };

  // ==========================================
  // NO PAYSLIP DATA
  // ==========================================

  if (!payslip) {
    return (
      <MainPanel
      
      >
        <div className="main-container">
          <div className="payslip-container">
            <p>
              Payslip data not found.
            </p>

            <p>
              Please go back to Salary
              Management and click the
              View button again.
            </p>
          </div>
        </div>
      </MainPanel>
    );
  }

  // ==========================================
  // PAYSLIP
  // ==========================================

  return (
    <MainPanel
                  breadcrumbs={[
          { label: "Dashboard", link: "/dashboard" },
          { label: "Salary Slip" },
        ]}
        
        title={
          String(user?.role || user?.crmRole || "")
            .trim()
            .toUpperCase() === "EMPLOYEE"
            ? "Employee Dashboard"
            : "Admin Dashboard"
        }
    >
              <Link to="/">
              <button className="btn1"><IoMdArrowBack />Back</button></Link>
      <div className="main-container">

        <div
          className="payslip-container"
          ref={printRef}
        >

          {/* ======================================
              WATERMARK
          ====================================== */}

          <div className="watermark">
            <img
              src={
                currentCompany.watermark
              }
              alt={`${companyKey} Watermark`}
            />
          </div>

          {/* ======================================
              HEADER
          ====================================== */}

          <div className="header">

            <div className="logo">
              <img
                src={
                  currentCompany.logo
                }
                alt={`${companyKey} Logo`}
              />
            </div>

            <div className="month">

              <p>
                Payslip for the month
              </p>

              <h3>
                {formatMonth(
                  payslip?.month,
                  payslip?.year
                )}
              </h3>

            </div>

          </div>

          {/* ======================================
              EMPLOYEE SUMMARY
          ====================================== */}

          <div className="summary">

            <div className="left">

              <h4>
                EMPLOYEE SUMMARY
              </h4>

              <div className="personal-info">

                <div className="left-info">

                  <p>
                    Employee Name
                  </p>

                  <p>
                    Employee ID
                  </p>

                  <p>
                    Pay Date
                  </p>

                  <p>
                    Bank Name
                  </p>

                  <p>
                    Account No.
                  </p>

                  <p>
                    PAN No.
                  </p>

                  <p>
                    UAN No.
                  </p>

                </div>

                <div className="right-info">

                  <p>
                    :{" "}
                    {payslip?.employeeName ||
                      "-"}
                  </p>

                  <p>
                    :{" "}
                    {payslip?.employeeId ||
                      "-"}
                  </p>

                  <p>
                    :{" "}
                    {payslip?.paydate ||
                      payslip?.payDate ||
                      "-"}{" "}
                    {payslip?.month ||
                      ""}{" "}
                    {payslip?.year ||
                      ""}
                  </p>

                  <p>
                    :{" "}
                    {payslip?.bankName ||
                      "-"}
                  </p>

                  <p>
                    :{" "}
                    {payslip?.accountNumber ||
                      payslip?.accountNo ||
                      "-"}
                  </p>

                  <p>
                    :{" "}
                    {payslip?.panNumber ||
                      payslip?.panNo ||
                      "-"}
                  </p>

                  <p>
                    :{" "}
                    {payslip?.uanNo ||
                      payslip?.uanNumber ||
                      "Not Added"}
                  </p>

                </div>

              </div>

            </div>

            {/* ==================================
                NET PAY
            ================================== */}

            <div className="right">

              <div
                className="netpay"
                style={{
                  backgroundColor:
                    currentCompany.color,

                  color:
                    currentCompany.textColor,
                }}
              >

                <h2>
                  Rs{" "}
                  {formatAmount(
                    payslip?.netSalary
                  )}
                </h2>

                <p>
                  Employee Net Pay
                </p>

              </div>

              <div className="days">

                <div className="day one">

                  <SlCalender className="calender" />

                  <p>
                    Paid Days :{" "}
                    {payslip?.presentDay ||
                      0}
                  </p>

                </div>

                <div className="day">

                  <SlCalender className="calender" />

                  <p>
                    LOP Days :{" "}
                    {payslip?.absentDays ||
                      0}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ======================================
              TABLES
          ====================================== */}

          <div className="tables">

            {/* ====================================
                EARNINGS
            ==================================== */}

            <div className="table-card">

              <h4>
                EARNINGS
              </h4>

              <div className="table-header">

                <span>
                  Particulars
                </span>

                <span>
                  Amount (Rs)
                </span>

              </div>

              <div className="middle">

                <div className="basic-earning">

                  <div className="row">

                    <span>
                      Basic
                    </span>

                    <span>
                      {formatAmount(
                        payslip?.basicSalary
                      )}
                    </span>

                  </div>

                  <div className="row">

                    <span>
                      Dearness Allowance
                    </span>

                    <span>
                      {formatAmount(
                        payslip?.da
                      )}
                    </span>

                  </div>

                  <div className="row">

                    <span>
                      HRA
                    </span>

                    <span>
                      {formatAmount(
                        payslip?.hra
                      )}
                    </span>

                  </div>

                  <div className="row">

                    <span>
                      Other Allowance
                    </span>

                    <span>
                      {formatAmount(
                        payslip?.otherAllowance
                      )}
                    </span>

                  </div>

                </div>

                <div className="total">

                  <span>
                    GROSS EARNINGS
                  </span>

                  <span>
                    Rs{" "}
                    {formatAmount(
                      payslip?.grossSalary
                    )}
                  </span>

                </div>

              </div>

            </div>

            {/* ====================================
                DEDUCTIONS
            ==================================== */}

            <div className="table-card">

              <h4>
                DEDUCTION
              </h4>

              <div className="table-header">

                <span>
                  Particulars
                </span>

                <span>
                  Amount (Rs)
                </span>

              </div>

              <div className="middle">

                <div className="basic-earning">

                  <div className="row">

                    <span>
                      Professional Tax
                    </span>

                    <span>
                      {formatAmount(
                        payslip?.professionalTax
                      )}
                    </span>

                  </div>

                  <div className="row">

                    <span>
                      Employee PF Share
                    </span>

                    <span>
                      {formatAmount(
                        payslip?.employeePf
                      )}
                    </span>

                  </div>

                  <div className="row">

                    <span>
                      Employee ESIC
                    </span>

                    <span>
                      {formatAmount(
                        payslip?.employeeEsic
                      )}
                    </span>

                  </div>

                  <div className="row">

                    <span>
                      Advance Salary
                    </span>

                    <span>
                      {formatAmount(
                        payslip?.salaryAdvance
                      )}
                    </span>

                  </div>

                  <div className="row">

                    <span>
                      Loss of Pay
                    </span>

                    <span>
                      {formatAmount(
                        payslip?.lop
                      )}
                    </span>

                  </div>

                  <div className="row">

                    <span>
                      Other Deduction
                    </span>

                    <span>
                      {formatAmount(
                        payslip?.otherDiduction
                      )}
                    </span>

                  </div>

                  <div className="row">

                    <span>
                      Insurance
                    </span>

                    <span>
                      {formatAmount(
                        payslip?.insuranceCorporation
                      )}
                    </span>

                  </div>

                </div>

                <div className="total">

                  <span>
                    TOTAL DEDUCTIONS
                  </span>

                  <span>
                    Rs{" "}
                    {formatAmount(
                      totalDeductions
                    )}
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* ======================================
              FINAL NET PAY
          ====================================== */}

          <div className="net-total">

            <div className="total-final">

              <h4>
                TOTAL NETPAYABLE
              </h4>

              <p>
                Gross Earnings -
                Total Deduction
              </p>

            </div>

            <div className="total-amount">

              <h2>
                Rs{" "}
                {formatAmount(
                  payslip?.netSalary
                )}
              </h2>

            </div>

          </div>

          {/* ======================================
              DOWNLOAD BUTTON
          ====================================== */}

          <div className="download">

            <button
              type="button"
              onClick={
                handleDownload
              }
            >
              <IoMdDownload />

              Download PDF
            </button>

          </div>

        </div>

      </div>
    </MainPanel>
  );
};

export default Payslip;