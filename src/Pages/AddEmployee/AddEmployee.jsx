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
        title="Add Employee"
        breadcrumbs={[
          { label: "Dashboard", link: "/dashboard" },
          { label: "Add Employee" },
        ]}
        <div className="employee-parent  ">
          <div className="empdetails">
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
          </div>
          <div className="personaldetails">
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
                <Input label="Date of Birth" required="true" type="date" />
                <Input label="Aadhar No" required="true" />
              </div>
              <div className="form-row">
                <Input label="Pan No" required="true" />
                <Input label="Current Address" required="true" />
              </div>
            </div>
          </div>

          <Link className="btn" to="/salaryDetails">
            Next
          </Link>
        </div>
      </MainPanel>
    </>
  );
};

export default AddEmployee;
