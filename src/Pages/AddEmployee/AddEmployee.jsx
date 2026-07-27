import React from "react";
import "./AddEmployee.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import SelectInput from "../../comp/selectInput/SelectInput";
import { MenuItem } from "@mui/material";
import Input from "../../comp/input/Input";
import { Link } from "react-router-dom";

const AddEmployee = () => {
  return (
    <>
      <MainPanel>
        <div className="employee-parent  ">
          <h1>Employee Details</h1>

          <div className="inputs">
            <div className="form-row">
              <Input label="Employee ID" mq_label="PSPL" required="true" />
              <Input label="UserName" required="true" />
              <SelectInput label="Role" required="true">
                <MenuItem>Admin </MenuItem>
                <MenuItem>SuperAdmin </MenuItem>
                <MenuItem>Employee </MenuItem>
              </SelectInput>
            </div>
            <div className="form-row">
              <SelectInput label="Employee Status" required="true">
                <MenuItem>On Board </MenuItem>
                <MenuItem>Provision </MenuItem>
                <MenuItem>Intern </MenuItem>
              </SelectInput>
              <SelectInput label="Company Name" required="true">
                <MenuItem>Pandoza Solutions Pvt.Ltd </MenuItem>
                <MenuItem>Akka Foundation </MenuItem>
                <MenuItem>NVM Infratech </MenuItem>
                <MenuItem>The Indian Journey </MenuItem>
              </SelectInput>
              <Input label="Date of Joining" required="true" type="date" />
            </div>
            <div className="form-row">
              <Input label="Last Working Day" type="date" />
              <Input label="Designation" required="true" />
              <Input label="Department" required="true" />
            </div>
          </div>
          <h1>Personal Details</h1>
          <div className="inputs">
            <div className="form-row">
              <Input label="Employee Name" required="true" />
              <SelectInput label="Gender">
                <MenuItem>Male</MenuItem>
                <MenuItem>Female</MenuItem>
                <MenuItem>Other</MenuItem>
              </SelectInput>
              <Input label="Contact Number" required="true" />
            </div>
            <div className="form-row">
                <Input label="Email" required="true" />
                <Input label="Date of Birth" required="true" type="date"/>
                <Input label="Aadhar No" required="true" />
                

            </div>
            <div className="form-row">
                <Input label="Pan No" required="true" />
                <Input label="Current Address" required="true" />

            </div>
          </div>
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
              <Input label="Emergency Contact Person Address" required="true" />
            </div>
          </div>
          {/* <h1>Salary Details</h1>
          <div className="inputs">
            <div className="form-row">
              <Input label="Employee Salary" required="true" />
              <Input label="Cost to Comapany" required="true" />
              <Input label="Bank Name" required="true" />
            </div>
            <div className="form-row">
              <Input label="Account Name" required="true" />
              <Input label="IFSC Code" required="true" />
              <Input label="UAN No" required="true" />
            </div>
            <div className="form-row">
              <Input label="Insurance Comapany Name" required="true" />
              <Input label="ESIC No" />
              <Input label="Policy No" />
            </div>
          </div> */}

          <Link className="btn">Next</Link>
        </div>
      </MainPanel>
    </>
  );
};

export default AddEmployee;
