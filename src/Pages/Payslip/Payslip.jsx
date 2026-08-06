import React from "react";
import "./Payslip.scss";
import logo from "../../assets/logo.png";
import { SlCalender } from "react-icons/sl";
import { IoMdDownload } from "react-icons/io";

const Payslip = () => {
  return (
    <div className="main-container">
      <div className="payslip-container">
        <div className="header">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>

          <div className="month">
            <p>Payslip for the month</p>
            <h3>Aug 2026</h3>
          </div>
        </div>

        <div className="summary">
          <div className="left">
            <h4>EMPLOYEE SUMMARY</h4>

            <p>
              <strong>Employee Name :</strong> Rohan Prakash Deshmukh
            </p>
            <p>
              <strong>Employee ID :</strong> PSPI4321
            </p>
            <p>
              <strong>Pay Date :</strong> 7 JUNE 2025
            </p>
            <p>
              <strong>Bank Name :</strong> HDFC Bank
            </p>
            <p>
              <strong>Account No. :</strong> 233232332333233
            </p>
            <p>
              <strong>PAN No. :</strong> EQPY3213F
            </p>
            <p>
              <strong>UAN No. :</strong> 12343545665434
            </p>
          </div>

          <div className="right">
            <div className="netpay">
              <h2>Rs 80,000.00</h2>
              <p>Employee Net Pay</p>
            </div>

            <div className="days">
              <div className="day one">
                <SlCalender className="calender" />
                <p> Paid Days : 26</p>
              </div>
              <div className="day">
                <SlCalender className="calender" />
                <p> Paid Days : 26</p>
              </div>
            </div>
          </div>
        </div>

        
        <div className="tables">
          <div className="table-card">
            <h4>EARNINGS</h4>

            <div className="table-header">
              <span>Particulars</span>
              <span>Amount (Rs)</span>
            </div>

            <div className="row">
              <span>Basic</span>
              <span>70,000.00</span>
            </div>
            <div className="row">
              <span>Dearness Allowance</span>
              <span>8,000.00</span>
            </div>
            <div className="row">
              <span>HRA</span>
              <span>2,000.00</span>
            </div>
            <div className="row">
              <span>Conveyance Allowance</span>
              <span>1,000.00</span>
            </div>
            <div className="row">
              <span>Medical Allowance</span>
              <span>1,000.00</span>
            </div>
            <div className="row">
              <span>Special Allowance</span>
              <span>2,000.00</span>
            </div>

            <div className="total">
              <span>GROSS EARNINGS</span> <span>Rs 85,505.00</span>
            </div>
          </div>

          {/* DEDUCTION */}
          <div className="table-card">
            <h4>DEDUCTION</h4>

            <div className="table-header">
              <span>Particulars</span>
              <span>Amount (Rs)</span>
            </div>

            <div className="row">
              <span>Professional Tax</span>
              <span>70,000.00</span>
            </div>
            <div className="row">
              <span>Employee PF Share</span>
              <span>8,000.00</span>
            </div>
            <div className="row">
              <span>Employee ESIC</span>
              <span>1,000.00</span>
            </div>
            <div className="row">
              <span>Advance Salary</span>
              <span>0.00</span>
            </div>
            <div className="row">
              <span>Loss of Pay</span>
              <span>2,000.00</span>
            </div>
            <div className="row">
              <span>Other Deduction</span>
              <span>2,000.00</span>
            </div>
            <div className="row">
              <span>Insurance</span>
              <span>0.00</span>
            </div>

            <div className="total"><span>GROSS DEDUCTIONS</span> <span>Rs 5,505.00</span></div>
          </div>
        </div>

        {/* TOTAL */}
        <div className="net-total">
          <div className="total-final">
            <h4>TOTAL NETPAYABLE</h4>
            <p>Gross Earnings - Total Deduction</p>
          </div>
         <div className="total-amount">
           <h2>Rs 82,000.00</h2>
         </div>
        </div>

       <button className="Download-btn">
                 <IoMdDownload /> Download PDF
               </button>
        
      </div>
    </div>
  );
};

export default Payslip;
