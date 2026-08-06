import React from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import Input from "../../comp/input/Input";
import SelectInput from "../../comp/selectInput/SelectInput";
import "./AddSalary.scss";
import { MenuItem } from "@mui/material";

const AddSalary = () => {
  return (
    <>
      <MainPanel>
        <div className="salary-parent">
          <h1>Generate Salary Slip</h1>

          <div className="inputs">
            <div className="form-row">
              <SelectInput label="Select Employee">
                <MenuItem value="employee1">Employee 1</MenuItem>
              </SelectInput>
              <Input name="employeeId" label="Employee ID" mq_label="PSPL" />
            </div>
            <div className="form-row">
              <Input name="payDate" label="pay Date" />
              <SelectInput label="Select Month">
                <MenuItem value="January">January</MenuItem>
                <MenuItem value="February">February</MenuItem>
                <MenuItem value="March">March</MenuItem>
                <MenuItem value="April">April</MenuItem>
                <MenuItem value="May">May</MenuItem>
                <MenuItem value="June">June</MenuItem>
                <MenuItem value="July">July</MenuItem>
                <MenuItem value="August">August</MenuItem>
                <MenuItem value="September">September</MenuItem>
                <MenuItem value="October">October</MenuItem>
                <MenuItem value="November">November</MenuItem>
                <MenuItem value="December">December</MenuItem>
              </SelectInput>
              <Input name="year" label="Year" />
            </div>
            <div className="form-row">
                
                <Input name="total working days" label="Total Working Days" />
                <Input name="total present days" label="Total Present Days" />
            </div>
            <div className="form-row">
                <Input name="grossSalary" label="Gross Salary" />
                <Input name="advance salary" label="Advance Salary" />
                
            </div>
            <div className="form-row">
                <Input name="profession tax" label="Profession Tax" />
                <Input name="other deduction" label="Other Deduction" />
            </div>
            <div className="form-row">
                <Input name="insurance premium" label="Insurance Premium" />
                <Input name="pt refund amount" label="PT Refund Amount" />
            </div>
          </div>
                    <button className="btn" type="submit">
            Submit
          </button>
        </div>
      </MainPanel>
    </>
  );
};

export default AddSalary;
