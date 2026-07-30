import "./AddEmployee.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import SelectInput from "../../comp/selectInput/SelectInput";
import { MenuItem } from "@mui/material";
import Input from "../../comp/input/Input";

import UseForm from "../../UseForm";
import axios from "axios";
import { ValidateEmployee } from "../../validators/ValidEmployee";





  const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

const AddEmployee = () => {
  const formObj = {
    employeeName: "",
    employeeId: "",
    gender: "",
    employeeStatus: "",
    designation: "",
    department: "",
    dateOfJoining: "",
    dateOfLiving: "",
    contactNumber: "",
    ifscCode: "",
    dateOfBirth: "",
    aadharNumber: "",
    panNumber: "",
    accountNumber: "",
    costtoCompany: 0,
    employeeSalary: 0,
    bankName: "",
    companyName: "",
    diduction: 0,
    address: "",
    uanNo: "",
    policyNumber: "",
    insuranceCompany: "",
    emergencyContactNumber: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactAddress: "",
    status: "",
    esicNumber: "",
    editableAccess: true,
    email: "",
    password: "",
    role: "",
  };

  const addEmployee = async ()=>{
  try {
    const response = await axios.post(`${BASE_URL}Admin/AddEmployee`,values);
    console.log(response)
  } catch (error) {
    console.log(error)
  }
  }


  const {handleChange,
    handleSubmit,
    handleBlur,
    values,
    setValues,
    error,
    setError,
    isSubmitting} = UseForm(
      formObj,
     ValidateEmployee,
      addEmployee
    );

     

    console.log(error, "error")
  return (
    <>
      <MainPanel
        title="Add Employee"
        breadcrumbs={[
          { label: "Dashboard", link: "/dashboard" },
          { label: "Add Employee" },
        ]}
      >
        <form onSubmit={handleSubmit} className="employee-parent  ">
          <div className="empdetails">
            <h1>Employee Details</h1>

            <div className="inputs">
              <div className="form-row">
                <Input 
                error={error.employeeId}
                name="employeeId"
                value={values.employeeId}
                onChange={handleChange}
                label="Employee ID" mq_label="PSPL"  />
                <Input label="UserName" required />
                <SelectInput label="Role" required>
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
            <div className="personaldetails">
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
           <div className="personaldetails">
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

          <button className="btn" type="submit">
            Submit
          </button>
        </form>
      </MainPanel>
    </>
  );
};

export default AddEmployee;
