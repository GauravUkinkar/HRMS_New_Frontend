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
              <p>: Rohan Prakash Deshmukh</p>
              <p>: PSPL3322</p>
              <p>: 7 JULY 2026</p>
              <p>: IDBI Bank</p>
              <p>: 34343434343433</p>
              <p>: DXSP344344C</p>
              <p>: Not Added</p>
             
            </div>
          </div>
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
                <p> LOP Days : 2</p>
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

          <div className="middle">
             <div className="basic-earning">
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
              <span>Other Allowance</span>
              <span>2,000.00</span>
            </div>
           </div>

            <div className="total">
              <span>GROSS EARNINGS</span> <span>Rs 85,505.00</span>
            </div>
          </div>
          </div>

         
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
       </div>

            <div className="total">
              <span>TOTAL DEDUCTIONS</span> <span>Rs 5,505.00</span>
            </div>
     </div>
          </div>
        </div>

        <div className="net-total">
          <div className="total-final">
            <h4>TOTAL NETPAYABLE</h4>
            <p>Gross Earnings - Total Deduction</p>
          </div>
          <div className="total-amount">
            <h2>Rs 80,000.00</h2>
          </div>
        </div>

        <div className="download">
          <button>
          <IoMdDownload /> Download PDF
        </button>
        </div>
      </div>
    </div>
  );
};

export default Payslip;
