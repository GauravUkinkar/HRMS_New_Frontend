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

  const addEmployee = async () => {
    try {
      const response = await axios.post(`${BASE_URL}Admin/AddEmployee`, values);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    setValues,
    error,
    setError,
    isSubmitting,
  } = UseForm(formObj, ValidateEmployee, addEmployee);

  console.log(error, "error");
  console.log(values, "values");
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
                  label="Employee ID"
                  mq_label="PSPL"
                  required
                />
                <Input
                  error={error.password}
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  label="Password"
                  required
                />
                <SelectInput
                  error={error.role}
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  label="Role"
                >
                  <MenuItem value="Admin">Admin </MenuItem>
                  <MenuItem value="SuperAdmin">SuperAdmin </MenuItem>
                  <MenuItem value="Employee">Employee </MenuItem>
                </SelectInput>
              </div>
              <div className="form-row">
                <SelectInput
                  error={error.status}
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  label="Employee Status"
                >
                  <MenuItem value="On Board">On Board </MenuItem>
                  <MenuItem value="Provision">Provision </MenuItem>
                  <MenuItem value="Intern">Intern </MenuItem>
                </SelectInput>
                <SelectInput
                  error={error.companyName}
                  name="companyName"
                  value={values.companyName}
                  onChange={handleChange}
                  label="Company Name"
                >
                  <MenuItem value="Pandoza Solutions Pvt.Ltd ">
                    Pandoza Solutions Pvt.Ltd{" "}
                  </MenuItem>
                  <MenuItem value="Akka Foundation ">Akka Foundation </MenuItem>
                  <MenuItem value="NVM Infratech ">NVM Infratech </MenuItem>
                  <MenuItem value="The Indian Journey">
                    The Indian Journey{" "}
                  </MenuItem>
                </SelectInput>
                <Input
                  error={error.dateOfJoining}
                  name="dateOfJoining"
                  value={values.dateOfJoining}
                  onChange={handleChange}
                  label="Date of Joining"
                  required
                  type="date"
                />
              </div>
              <div className="form-row">
                <Input
                  name="dateOfLiving"
                  value={values.dateOfLiving}
                  onChange={handleChange}
                  label="Last Working Day"
                  type="date"
                />
                <Input
                  error={error.department}
                  name="department"
                  value={values.department}
                  onChange={handleChange}
                  label="Department"
                />
                <Input
                  error={error.designation}
                  name="designation"
                  value={values.designation}
                  onChange={handleChange}
                  label="Designation"
                />
              </div>
            </div>
          </div>
          <div className="personaldetails">
            <h1>Personal Details</h1>
            <div className="inputs">
              <div className="form-row">
                <Input
                  error={error.employeeName}
                  name="employeeName"
                  value={values.employeeName}
                  onChange={handleChange}
                  label="Employee Name"
                  required
                />
                <SelectInput
                  label="Gender"
                  value={values.gender}
                  onChange={handleChange}
                  error={error.gender}
                  name="gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </SelectInput>
                <Input
                  error={error.contactNumber}
                  name="contactNumber"
                  value={values.contactNumber}
                  onChange={handleChange}
                  label="Contact Number"
                  required
                />
              </div>
              <div className="form-row">
                <Input
                  error={error.email}
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  label="Email"
                  required
                />
                <Input
                  error={error.dateOfBirth}
                  name="dateOfBirth"
                  value={values.dateOfBirth}
                  onChange={handleChange}
                  label="Date of Birth"
                  required
                  type="date"
                />
                <Input
                  error={error.aadharNumber}
                  name="aadharNumber"
                  value={values.aadharNumber}
                  onChange={handleChange}
                  label="Aadhar No"
                  required
                />
              </div>
              <div className="form-row">
                <Input
                  error={error.panNumber}
                  name="panNumber"
                  value={values.panNumber}
                  onChange={handleChange}
                  label="Pan No"
                  required
                />
                <Input
                  error={error.address}
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  label="Current Address"
                  required
                />
              </div>
            </div>
          </div>
          <div className="personaldetails">
            <h1>Emergency Details</h1>
            <div className="inputs">
              <div className="form-row">
                <Input
                  error={error.emergencyContactName}
                  name="emergencyContactName"
                  value={values.emergencyContactName}
                  onChange={handleChange}
                  label="Emergency Contact Name"
                  required
                />
                <Input
                  error={error.emergencyContactNumber}
                  name="emergencyContactNumber"
                  value={values.emergencyContactNumber}
                  onChange={handleChange}
                  label="Emergency Contact No"
                  required
                />
                <Input label="Emergency Contact Person Relation" />
              </div>
              <div className="form-row">
                <Input label="Emergency Contact Person Address" />
              </div>
            </div>
          </div>
          <div className="personaldetails">
            <h1>Salary Details</h1>
            <div className="inputs">
              <div className="form-row">
                <Input
                  error={error.employeeSalary}
                  name="employeeSalary"
                  value={values.employeeSalary}
                  onChange={handleChange}
                  label="Employee Salary"
                  required
                />
                <Input
                  error={error.costtoCompany}
                  name="costtoCompany"
                  value={values.costtoCompany}
                  onChange={handleChange}
                  label="Cost to Comapany"
                  required
                />
                <Input
                  error={error.bankName}
                  name="bankName"
                  value={values.bankName}
                  onChange={handleChange}
                  label="Bank Name"
                  required
                />
              </div>
              <div className="form-row">
                <Input
                  error={error.accountNumber}
                  name="accountNumber"
                  value={values.accountNumber}
                  onChange={handleChange}
                  label="Account Number"
                  required
                />
                <Input
                  error={error.ifscCode}
                  name="ifscCode"
                  value={values.ifscCode}
                  onChange={handleChange}
                  label="IFSC Code"
                  required
                />
                <Input
                
                  name="uanNo"
                  value={values.uanNo}
                  onChange={handleChange}
                label="UAN Number" />
              </div>
              <div className="form-row">
                <Input
                  name="insuranceCompany"
                  value={values.insuranceCompany}
                  onChange={handleChange}
                  label="Insurance Comapany Name"
                />
                <Input
                  name="esicNumber"
                  value={values.esicNumber}
                  onChange={handleChange}
                  label="ESIC Number"
                />
                <Input
                  name="policyNumber"
                  value={values.policyNumber}
                  onChange={handleChange}
                  label="Policy Number"
                />
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
