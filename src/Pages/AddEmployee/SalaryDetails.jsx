import React from "react";
import "./SalaryDetails.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import Input from "../../comp/input/Input";
import { Link } from "react-router-dom";

const SalaryDetails = () => {
  return (
    <>
      <MainPanel>
        <div className="salarydetails-parent">
          <div className="emergency-details">
            <h1>Emergency Details</h1>
            <div className="inputs">
              <div className="form-row">
                <Input label="Emergency Contact Name" required="true" />
                <Input label="Emergency Contact No" required="true" />
                <Input
                  label="Emergency Contact Person Relation"
                  required="true"
                />
              </div>
              <div className="form-row">
                <Input
                  label="Emergency Contact Person Address"
                  required="true"
                />
              </div>
            </div>
          </div>
          <div className="salary-details">
            <h1>Salary Details</h1>
            <div className="inputs">
              <div className="form-row">
                <Input label="Employee Salary" required="true" />
                <Input label="Cost to Comapany" required="true" />
                <Input label="Bank Name" required="true" />
              </div>
              <div className="form-row">
                <Input label="Account Number" required="true" />
                <Input label="IFSC Code" required="true" />
                <Input label="UAN Number" />
              </div>
              <div className="form-row">
                <Input label="Insurance Comapany Name" />
                <Input label="ESIC Number" />
                <Input label="Policy Number" />
              </div>
            </div>
          </div>

          <div className="buttons">
            <Link className="btn" to="/addEmployee">
              Previous
            </Link>
            <Link className="btn">Submit</Link>
          </div>
        </div>
      </MainPanel>
    </>
  );
};

export default SalaryDetails;
