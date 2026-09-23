import React from "react";
import "./Payslip.scss";
import logo from "../../../src/assets/offer-logo-pan.png";
import watermark from "../../assets/pan-watermark.webp";
import { SlCalender } from "react-icons/sl";
import { IoMdDownload } from "react-icons/io";
import MainPanel from "../../comp/MainPanel/MainPanel";
import { useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";

const Payslip = () => {
  const downloadPDF = () => {
  const element = document.querySelector(".payslip-container");

  if (!element) return;

  const options = {
    margin: 0,
    filename: `Payslip-${payslip?.employeeId || "Employee"}-${payslip?.month || ""}-${payslip?.year || ""}.pdf`,
    image: {
      type: "jpeg",
      quality: 0.98,
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
  };

  html2pdf()
    .set(options)
    .from(element)
    .save();
};
  const location = useLocation();

  const payslip = location.state?.payslip;

  const formatAmount = (value) => {
    const amount = Number(value || 0);

    return amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatMonth = (month, year) => {
    if (!month || !year) return "-";

    return `${month.substring(0, 3)} ${year}`;
  };

  return (
    <MainPanel>
      <div className="main-container">
        <div className="payslip-container">

          <div className="watermark">
            <img src={watermark} alt="watermark" />
          </div>

          {/* HEADER */}
          <div className="header">
            <div className="logo">
              <img src={logo} alt="Logo" />
            </div>

            <div className="month">
              <p>Payslip for the month</p>
              <h3>
                {formatMonth(payslip?.month, payslip?.year)}
              </h3>
            </div>
          </div>

          {/* EMPLOYEE SUMMARY */}
          <div className="summary">

            <div className="left">

              <h4>EMPLOYEE SUMMARY</h4>

              <div className="personal-info">

                <div className="left-info">
                  <p>Employee Name</p>
                  <p>Employee ID</p>
                  <p>Pay Date</p>
                  <p>Bank Name</p>
                  <p>Account No.</p>
                  <p>PAN No.</p>
                  <p>UAN No.</p>
                </div>

                <div className="right-info">

                  <p>
                    : {payslip?.employeeName || "-"}
                  </p>

                  <p>
                    : {payslip?.employeeId || "-"}
                  </p>

                  <p>
                    : {payslip?.paydate || "-"}{" "}
                    {payslip?.month || ""}{" "}
                    {payslip?.year || ""}
                  </p>

                  <p>
                    : {payslip?.bankName || "-"}
                  </p>

                  <p>
                    : {payslip?.accountNumber || "-"}
                  </p>

                  <p>
                    : {payslip?.panNumber || "-"}
                  </p>

                  <p>
                    : {payslip?.uanNo || "Not Added"}
                  </p>

                </div>

              </div>
            </div>

            {/* NET PAY */}
            <div className="right">

              <div className="netpay">

                <h2>
                  Rs {formatAmount(payslip?.netSalary)}
                </h2>

                <p>Employee Net Pay</p>

              </div>

              <div className="days">

                <div className="day one">

                  <SlCalender className="calender" />

                  <p>
                    Paid Days : {payslip?.presentDay || 0}
                  </p>

                </div>

                <div className="day">

                  <SlCalender className="calender" />

                  <p>
                    LOP Days : {payslip?.absentDays || 0}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* TABLES */}
          <div className="tables">

            {/* EARNINGS */}
            <div className="table-card">

              <h4>EARNINGS</h4>

              <div className="table-header">
                <span>Particulars</span>
                <span>Amount (Rs)</span>
              </div>

              <div className="middle">

                <div className="basic-earning">

                  <div className="row">
                    <span>Basic</span>
                    <span>
                      {formatAmount(payslip?.basicSalary)}
                    </span>
                  </div>

                  <div className="row">
                    <span>Dearness Allowance</span>
                    <span>
                      {formatAmount(payslip?.da)}
                    </span>
                  </div>

                  <div className="row">
                    <span>HRA</span>
                    <span>
                      {formatAmount(payslip?.hra)}
                    </span>
                  </div>

                  <div className="row">
                    <span>Other Allowance</span>
                    <span>
                      {formatAmount(payslip?.otherAllowance)}
                    </span>
                  </div>

                </div>

                <div className="total">

                  <span>GROSS EARNINGS</span>

                  <span>
                    Rs {formatAmount(payslip?.grossSalary)}
                  </span>

                </div>

              </div>

            </div>

            {/* DEDUCTIONS */}
            <div className="table-card">

              <h4>DEDUCTION</h4>

              <div className="table-header">
                <span>Particulars</span>
                <span>Amount (Rs)</span>
              </div>

              <div className="middle">

                <div className="basic-earning">

                  <div className="row">
                    <span>Professional Tax</span>
                    <span>
                      {formatAmount(payslip?.professionalTax)}
                    </span>
                  </div>

                  <div className="row">
                    <span>Employee PF Share</span>
                    <span>
                      {formatAmount(payslip?.employeePf)}
                    </span>
                  </div>

                  <div className="row">
                    <span>Employee ESIC</span>
                    <span>
                      {formatAmount(payslip?.employeeEsic)}
                    </span>
                  </div>

                  <div className="row">
                    <span>Advance Salary</span>
                    <span>
                      {formatAmount(payslip?.salaryAdvance)}
                    </span>
                  </div>

                  <div className="row">
                    <span>Loss of Pay</span>
                    <span>
                      {formatAmount(payslip?.lop)}
                    </span>
                  </div>

                  <div className="row">
                    <span>Other Deduction</span>
                    <span>
                      {formatAmount(payslip?.otherDiduction)}
                    </span>
                  </div>

                  <div className="row">
                    <span>Insurance</span>
                    <span>
                      {formatAmount(
                        payslip?.insuranceCorporation
                      )}
                    </span>
                  </div>

                </div>

                <div className="total">

                  <span>TOTAL DEDUCTIONS</span>

                  <span>
                    Rs{" "}
                    {formatAmount(
                      Number(payslip?.employeePf || 0) +
                        Number(payslip?.employeeEsic || 0) +
                        Number(payslip?.professionalTax || 0) +
                        Number(payslip?.salaryAdvance || 0) +
                        Number(payslip?.lop || 0) +
                        Number(payslip?.otherDiduction || 0) +
                        Number(payslip?.insuranceCorporation || 0)
                    )}
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* FINAL NET PAY */}
          <div className="net-total">

            <div className="total-final">

              <h4>TOTAL NETPAYABLE</h4>

              <p>
                Gross Earnings - Total Deduction
              </p>

            </div>

            <div className="total-amount">

              <h2>
                Rs {formatAmount(payslip?.netSalary)}
              </h2>

            </div>

          </div>

          {/* DOWNLOAD */}
<div className="download">
  <button onClick={() => window.print()}>
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