import React from "react";
import "./Payslip.scss";


const Payslip = () => {
  return (
    
    <div className="payslip-container">
      {/* HEADER */}
      <div className="header">
        <div className="logo">
          <h2>PANDOZA</h2>
          <p>We are the solution.</p>
        </div>

        <div className="month">
          <p>payslip for the month</p>
          <h3>MAY 2025</h3>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="summary">
        <div className="left">
          <h4>EMPLOYEE SUMMARY</h4>

          <p><strong>Employee Name :</strong> Rohan Prakash Deshmukh</p>
          <p><strong>Employee ID :</strong> PSPI4321</p>
          <p><strong>Pay Date :</strong> 7 JUNE 2025</p>
          <p><strong>Bank Name :</strong> HDFC Bank</p>
          <p><strong>Account No. :</strong> 233232332333233</p>
          <p><strong>PAN No. :</strong> EQPY3213F</p>
          <p><strong>UAN No. :</strong> 12343545665434</p>
        </div>

        <div className="right">
          <div className="netpay">
            <h2>Rs 80,000.00</h2>
            <p>Employee Net Pay</p>
          </div>

          <div className="days">
            <p>📅 Paid Days : 26</p>
            <p>📅 LOP Days : 2</p>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="tables">
        {/* EARNINGS */}
        <div className="table-card">
          <h4>EARNINGS</h4>

          <div className="table-header">
            <span>Particulars</span>
            <span>Amount (Rs)</span>
          </div>

          <div className="row"><span>Basic</span><span>70,000.00</span></div>
          <div className="row"><span>Dearness Allowance</span><span>8,000.00</span></div>
          <div className="row"><span>HRA</span><span>2,000.00</span></div>
          <div className="row"><span>Conveyance Allowance</span><span>1,000.00</span></div>
          <div className="row"><span>Medical Allowance</span><span>1,000.00</span></div>
          <div className="row"><span>Special Allowance</span><span>2,000.00</span></div>

          <div className="total">GROSS EARNINGS Rs85,505.00</div>
        </div>

        {/* DEDUCTION */}
        <div className="table-card">
          <h4>DEDUCTION</h4>

          <div className="table-header">
            <span>Particulars</span>
            <span>Amount (Rs)</span>
          </div>

          <div className="row"><span>Professional Tax</span><span>70,000.00</span></div>
          <div className="row"><span>Employee PF Share</span><span>8,000.00</span></div>
          <div className="row"><span>Employee ESIC</span><span>1,000.00</span></div>
          <div className="row"><span>Advance Salary</span><span>0.00</span></div>
          <div className="row"><span>Loss of Pay</span><span>2,000.00</span></div>
          <div className="row"><span>Other Deduction</span><span>2,000.00</span></div>
          <div className="row"><span>Insurance</span><span>0.00</span></div>

          <div className="total">GROSS DEDUCTIONS Rs5,505.00</div>
        </div>
      </div>

      {/* TOTAL */}
      <div className="net-total">
        <div>
          <h4>TOTAL NETPAYABLE</h4>
          <p>Gross Earnings - Total Deduction</p>
        </div>
        <h2>Rs 82,000.00</h2>
      </div>

      {/* BUTTON */}
      <div className="download">
        <button>⬇ Download PDF</button>
      </div>
    </div>

 
  );
};

export default Payslip;