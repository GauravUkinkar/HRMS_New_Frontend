import React, {
  useContext,
  useRef,
} from "react";

import "./Payslip.scss";

import { SlCalender } from "react-icons/sl";
import { IoMdDownload } from "react-icons/io";

import MainPanel from "../../comp/MainPanel/MainPanel";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";


import panLogo from "../../assets/offer-logo-pan.png";


import indianJourneyLogo from "../../assets/tij-logo.png";


import akkaLogo from "../../assets/akka-foundation.png";


import nvmLogo from "../../assets/nvm-logo.png";

import { UserContext } from "../../../Context";

const Payslip = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useContext(UserContext);

  const payslip = location.state?.payslip;

  console.log("PAYSLIP DATA RECEIVED:", payslip);

  const companyConfig = {
    "Pandoza Solutions Pvt Ltd": {
      logo: panLogo,

      color: "#1119e8",
      textColor: "#ffffff",
    },

    "Akka Foundation": {
      logo: akkaLogo,

      color: "#0b8b95",
      textColor: "#ffffff",
    },

    "The Indian Journey": {
      logo: indianJourneyLogo,

      color: "#0b8b95",
      textColor: "#ffffff",
    },

    "NVM Infratech": {
      logo: nvmLogo,

      color: "#0b8b95",
      textColor: "#ffffff",
    },
  };

  const rawCompanyName =
    payslip?.companyName ||
    payslip?.company ||
    payslip?.company_name ||
    user?.companyName ||
    user?.company ||
    "";

  const companyName = String(rawCompanyName).trim();

  const companyKey =
    Object.keys(companyConfig).find(
      (key) =>
        key.toLowerCase() ===
        companyName.toLowerCase()
    ) || "Pandoza Solutions Pvt Ltd";

  const currentCompany = companyConfig[companyKey];

  console.log(
    "COMPANY USED FOR PAYSLIP:",
    companyKey
  );

  const printRef = useRef(null);

  const formatAmount = (value) => {
    const amount = Number(value || 0);

    return amount.toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  const numberToWords = (value) => {
    let number = Number(value);

    if (!Number.isFinite(number)) {
      return "Zero Only";
    }

    number = Math.round(number);

    if (number === 0) {
      return "Zero Only";
    }

    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const convertTwoDigits = (num) => {
      if (num < 20) {
        return ones[num];
      }

      const ten = Math.floor(num / 10);
      const one = num % 10;

      return (
        tens[ten] +
        (one > 0 ? ` ${ones[one]}` : "")
      );
    };

    const convertNumber = (num) => {
      let result = "";

      if (num >= 10000000) {
        result +=
          convertNumber(
            Math.floor(num / 10000000)
          ) +
          " Crore ";

        num %= 10000000;
      }

      if (num >= 100000) {
        result +=
          convertNumber(
            Math.floor(num / 100000)
          ) +
          " Lakh ";

        num %= 100000;
      }

      if (num >= 1000) {
        result +=
          convertNumber(
            Math.floor(num / 1000)
          ) +
          " Thousand ";

        num %= 1000;
      }

      if (num >= 100) {
        result +=
          ones[
          Math.floor(num / 100)
          ] +
          " Hundred ";

        num %= 100;
      }

      if (num > 0) {
        result += convertTwoDigits(num);
      }

      return result.trim();
    };

    return `${convertNumber(number)} Only`;
  };

  const netSalaryInWords =
    numberToWords(
      payslip?.netSalary
    );

  const formatMonth = (
    month,
    year
  ) => {
    if (!month || !year) {
      return "-";
    }

    const monthText = String(month);

    return `${monthText.substring(
      0,
      3
    )} ${year}`.toUpperCase();
  };
  const getPreviousMonth = (month, year) => {
  if (!month || !year) {
    return "-";
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let monthIndex;

  // If API sends month as number
  if (!Number.isNaN(Number(month)) && Number(month) >= 1 && Number(month) <= 12) {
    monthIndex = Number(month) - 1;
  } else {
    // If API sends month as name
    monthIndex = monthNames.findIndex(
      (item) =>
        item.toLowerCase() === String(month).trim().toLowerCase()
    );
  }

  if (monthIndex === -1) {
    return "-";
  }

  const previousMonthIndex =
    monthIndex === 0 ? 11 : monthIndex - 1;

  const previousYear =
    monthIndex === 0 ? Number(year) - 1 : Number(year);

  return `${monthNames[previousMonthIndex]
    .substring(0, 3)
    .toUpperCase()} ${previousYear}`;
};

  const formatPayDate = () => {
    const payDate =
      payslip?.paydate ||
      payslip?.payDate;

    const month = payslip?.month;
    const year = payslip?.year;

    if (!payDate) {
      return `${month || ""} ${year || ""
        }`.trim();
    }

    if (
      /^[0-9]{1,2}$/.test(
        String(payDate).trim()
      )
    ) {
      return `${payDate} ${String(month || "")
        .toUpperCase()
        } ${year || ""}`.trim();
    }

    const parsedDate =
      new Date(payDate);

    if (
      !Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      const day =
        parsedDate.getDate();

      const monthName =
        parsedDate
          .toLocaleString(
            "en-US",
            {
              month: "long",
            }
          )
          .toUpperCase();

      const dateYear =
        parsedDate.getFullYear();

      return `${day} ${monthName} ${dateYear}`;
    }

    return String(payDate);
  };

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

  const handleDownload = async () => {
    const input = printRef.current;

    if (!input) {
      console.error(
        "Payslip PDF element not found"
      );
      return;
    }

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const images =
        input.querySelectorAll("img");

      await Promise.all(
        Array.from(images).map(
          (img) => {
            if (img.complete) {
              return Promise.resolve();
            }

            return new Promise(
              (resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
              }
            );
          }
        )
      );

      const canvas =
        await html2canvas(
          input,
          {
            scale: 4,
            useCORS: true,
            allowTaint: false,
            backgroundColor: "#ffffff",
            logging: false,
            imageTimeout: 0,
            removeContainer: true,
            foreignObjectRendering: false,
            scrollX: 0,
            scrollY: 0,
            windowWidth:
              input.scrollWidth,
            windowHeight:
              input.scrollHeight,
          }
        );

      const imgData =
        canvas.toDataURL(
          "image/png",
          1.0
        );

      const pdf =
        new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
          compress: false,
        });

      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const imageWidth = pageWidth;

      const imageHeight =
        (canvas.height *
          imageWidth) /
        canvas.width;

      let finalWidth =
        imageWidth;

      let finalHeight =
        imageHeight;

      if (
        imageHeight >
        pageHeight
      ) {
        finalHeight =
          pageHeight;

        finalWidth =
          (canvas.width *
            finalHeight) /
          canvas.height;
      }

      const x =
        (pageWidth -
          finalWidth) /
        2;

      const y = 0;

      pdf.addImage(
        imgData,
        "PNG",
        x,
        y,
        finalWidth,
        finalHeight,
        undefined,
        "NONE"
      );

      pdf.save(
        `Payslip-${payslip?.employeeId ||
        "Employee"
        }-${payslip?.month || ""
        }-${payslip?.year || ""
        }.pdf`
      );
    } catch (error) {
      console.error(
        "PDF Download Error:",
        error
      );
    }
  };

  if (!payslip) {
    return (
      <MainPanel>
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

  return (
    <MainPanel
      breadcrumbs={[
        {
          label: "Dashboard",
          link: "/dashboard",
        },
        {
          label: "Salary Slip",
        },
      ]}
      title={
        String(
          user?.role ||
          user?.crmRole ||
          ""
        )
          .trim()
          .toUpperCase() ===
          "EMPLOYEE"
          ? "Employee Dashboard"
          : "Admin Dashboard"
      }
    >
      <button
        type="button"
        className="back-btn"
        onClick={() =>
          navigate(
            "/payslipManagement"
          )
        }
      >
        ← Back
      </button>

      <div className="main-container">
        <div
          className="payslip-container"
          ref={printRef}
        >

          <div className="payslip-header">
            <div className="logo">
              <img
                src={
                  currentCompany.logo
                }
                alt={`${companyKey} Logo`}
              />
            </div>

<div className="month">
  <h3>
    {getPreviousMonth(
      payslip?.month,
      payslip?.year
    )}
  </h3>
</div>
          </div>

          <div className="summary">
            <div className="left">
              <h4>
                EMPLOYEE SUMMARY
              </h4>

              <div className="personal-info">
                <div className="left-info">
                  <p >
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
                  <p className="name">
                    :{" "}
                    {
                      payslip?.employeeName ||
                      "-"
                    }
                  </p>

                  <p>
                    :{" "}
                    {
                      payslip?.employeeId ||
                      "-"
                    }
                  </p>

                  <p>
                    :{" "}
                    {formatPayDate()}
                  </p>

                  <p>
                    :{" "}
                    {
                      payslip?.bankName ||
                      "-"
                    }
                  </p>

                  <p>
                    :{" "}
                    {
                      payslip?.accountNumber ||
                      payslip?.accountNo ||
                      "-"
                    }
                  </p>

                  <p>
                    :{" "}
                    {
                      payslip?.panNumber ||
                      payslip?.panNo ||
                      "-"
                    }
                  </p>

                  <p>
                    :{" "}
                    {
                      payslip?.uanNo ||
                      payslip?.uanNumber ||
                      "Not Added"
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="right">
              <div
                className="netpay"

              >
                <h2>
                  ₹{" "}
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
                  <SlCalender
                    className="calender"
                  />

                  <p>
                    Paid Days :{" "}
                    {
                      payslip?.presentDay ||
                      0
                    }
                  </p>
                </div>

                <div className="day">
                  <SlCalender
                    className="calender"
                  />

                  <p>
                    LOP Days :{" "}
                    {
                      payslip?.absentDays ||
                      0
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="tables">
            <div className="table-card">
              <h4>
                Earnings
              </h4>

              <div className="table-header">
                <span>
                  Amount
                </span>
              </div>

              <div className="middle">
                <div className="basic-earning">
                  <div className="row">
                    <span>
                      Basic
                    </span>

                    <span>
                      ₹
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
                      ₹
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
                      ₹
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
                      ₹
                      {formatAmount(
                        payslip?.otherAllowance
                      )}
                    </span>
                  </div>
                </div>

                <div className="total">
                  <span>
                    Gross Earnings
                  </span>

                  <span>
                    ₹
                    {formatAmount(
                      payslip?.grossSalary
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="table-card">
              <h4>
                Deduction
              </h4>

              <div className="table-header">
                <span>
                  Amount
                </span>
              </div>

              <div className="middle">
                <div className="basic-earning">
                  <div className="row">
                    <span>
                      Professional Tax
                    </span>

                    <span>
                      ₹
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
                      ₹
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
                      ₹
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
                      ₹
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
                      ₹
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
                      ₹
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
                      ₹
                      {formatAmount(
                        payslip?.insuranceCorporation
                      )}
                    </span>
                  </div>
                </div>

                <div className="total">
                  <span>
                    Total Deduction
                  </span>

                  <span>
                    ₹
                    {formatAmount(
                      totalDeductions
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="net-total">
            <div className="total-final">
              <h4>
                TOTAL NETPAYABLE
              </h4>

              <p>
                Gross Earnings - Total
                Deductions
              </p>
            </div>

            <div
              className="total-amount"            >
              <h2 className="final-amount">
                ₹{" "}
                {formatAmount(
                  payslip?.netSalary
                )}
              </h2>
            </div>
          </div>

          <div className="amount-words">
            <span>
              Amount In Words:
            </span>

            <strong>
              {netSalaryInWords}
            </strong>
          </div>

          <div className="note">
            <strong>
              Note-
            </strong>

            <span>
              This is a computer generated
              slip, does not require
              signature.
            </span>
          </div>
        </div>

        <div className="download">
          <button
            type="button"
            onClick={handleDownload}
          >
            <IoMdDownload />
            Download PDF
          </button>
        </div>
      </div>
    </MainPanel>
  );
};

export default Payslip;