import "./AddEmployee.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import SelectInput from "../../comp/selectInput/SelectInput";
import { MenuItem } from "@mui/material";
import Input from "../../comp/input/Input";

import UseForm from "../../UseForm";
import axios from "axios";
import { ValidateEmployee } from "../../validators/ValidEmployee";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

const AddEmployee = () => {
  const [teams, setTeams] = useState([]);
  const [value, setValue] = useState([]);

  const formObj = {
    employeeName: "",
    employeeId: "",
    gender: "",
    employeeStatus: "Active",
    designation: "",
    department: "",
    dateOfJoining: "",
    dateOfLiving: "",
    contactNumber: "",
    ifscCode: "",
    dateOfBirth: "",
    bloodGroup: "",
    teamName: "",
    employementType: "",
    aadharNumber: "",
    panNumber: "",
    accountNumber: "",
    costtoCompany: 0,
    employeeSalary: 0,
    bankName: "",
    companyName: "",
    diduction: 0,
    currentAddress: "",
    permanentAddress: "",
    uanNo: "",
    policyNumber: "",
    insuranceCompany: "",
    emergencyContactNumber: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactCurrentAddress: "",
    emergencyContactPermanentAddress: "",
    status: "ACTIVE",
    esicNumber: "",
    email: "",
    password: "",
    role: "",
    crmRole: "",
    managerName: "",

    employee_image: null,
  };

  const addEmployee = async () => {
    try {
      const formData = new FormData();

      // Remove image from employee JSON
      const employeeData = {
        ...values,
      };

      delete employeeData.employee_image;

      // Add employee JSON
      formData.append(
        "employeeDto",
        JSON.stringify(employeeData)
      );

      // Add image using BACKEND field name: "image"
      if (values.employee_image) {
        formData.append(
          "image",
          values.employee_image
        );
      }

      console.log("Employee DTO:", employeeData);
      console.log("Image:", values.employee_image);

      const response = await axios.post(
        `${BASE_URL}Admin/AddEmployee`,
        formData,
        {
          withCredentials: true,
        }
      );

      toast.success("Employee added successfully!");

      setValues(formObj);
      setError({});

      console.log(
        "Add Employee Response:",
        response.data
      );

    } catch (error) {
      console.error("Add Employee Error:", error);
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);
    }
  };

  const getTeams = async () => {
    try {
      // const res = await axios.get(`${BASE_URL}Admin/Team/getAllTeams`);
      const res = await axios.get(
        "https://internaltomcat.diwise.in/Pandoza_Admin/Admin/Team/getAllTeams"
      );

      console.log(res.data, "sklfjskdlfklfsdjksdflkklsdfkjljksfd");
      setTeams(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTeams();
  }, []);

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
        <form onSubmit={handleSubmit} className="employee-parent">
          <div className="empdetails">
            <h1>Employee Details</h1>

            <div className="top-section">
              <div className="inputs employee-details-inputs">
                {/* Row 1 */}
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
                    name="employeeStatus"
                    label="Employee Status"
                    value={values.employeeStatus}
                    onChange={handleChange}
                    disabled={true}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                  </SelectInput>

                  <SelectInput
                    error={error.role}
                    name="role"
                    value={values.role}
                    onChange={handleChange}
                    label="Role"
                  >
                    <MenuItem value="ADMIN">Admin</MenuItem>
                    <MenuItem value="SUPERADMIN">SuperAdmin</MenuItem>
                    <MenuItem value="EMPLOYEE">Employee</MenuItem>
                  </SelectInput>
                </div>

                {/* Row 2 */}
                <div className="form-row">
                  <SelectInput
                    error={error.employementType}
                    name="employementType"
                    value={values.employementType}
                    onChange={handleChange}
                    label="Employee Type"
                  >
                    <MenuItem value="Full-time">Full-time</MenuItem>
                    <MenuItem value="Part-time">Part-time</MenuItem>
                    <MenuItem value="Freelance">Freelance</MenuItem>
                    <MenuItem value="Intern">Intern</MenuItem>
                  </SelectInput>

                  <SelectInput
                    error={error.companyName}
                    name="companyName"
                    value={values.companyName}
                    onChange={handleChange}
                    label="Company Name"
                  >
                    <MenuItem value="Pandoza Solutions Pvt.Ltd">
                      Pandoza Solutions Pvt.Ltd
                    </MenuItem>

                    <MenuItem value="Akka Foundation">
                      Akka Foundation
                    </MenuItem>

                    <MenuItem value="NVM Infratech">
                      NVM Infratech
                    </MenuItem>

                    <MenuItem value="The Indian Journey">
                      The Indian Journey
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

                {/* Row 3 */}
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

              <div className="employee-photo-upload">

                <div className="employee-photo-preview">
                  {values.employee_image ? (
                    <img
                      src={URL.createObjectURL(values.employee_image)}
                      alt="Employee"
                    />
                  ) : (
                    <span>Photo</span>
                  )}
                </div>

                <label
                  htmlFor="employee-image"
                  className="photo-upload-btn"
                >
                  Upload Photo
                </label>

                <input
                  id="employee-image"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (!file) return;

                    setValues((prev) => ({
                      ...prev,
                      employee_image: file,
                    }));
                  }}
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
                  onChange={(e) => {
                    e.target.value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);

                    handleChange(e);
                  }}
                  label="Contact Number"
                  required
                />

                <Input
                  error={error.email}
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  label="Email"
                  required
                />
              </div>

              <div className="form-row">
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
                  onChange={(e) => {
                    e.target.value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 12);

                    handleChange(e);
                  }}
                  label="Aadhar No"
                  required
                />

                <Input
                  error={error.panNumber}
                  name="panNumber"
                  value={values.panNumber}
                  onChange={(e) => {
                    e.target.value = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "")
                      .slice(0, 10);

                    handleChange(e);
                  }}
                  label="Pan No"
                  required
                />

                <SelectInput
                  error={error.bloodGroup}
                  name="bloodGroup"
                  value={values.bloodGroup}
                  onChange={handleChange}
                  label="Blood Group"
                  required
                >
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>

                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>

                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>

                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                </SelectInput>
              </div>

              <div className="form-row">
                <Input
                  error={error.currentAddress}
                  name="currentAddress"
                  value={values.currentAddress}
                  onChange={handleChange}
                  label="Current Address"
                  required
                />

                <Input
                  error={error.permanentAddress}
                  name="permanentAddress"
                  value={values.permanentAddress}
                  onChange={handleChange}
                  label="Permanent Address"
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
                  onChange={(e) => {
                    e.target.value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);

                    handleChange(e);
                  }}
                  label="Emergency Contact No"
                  required
                />

                <SelectInput
                  label="Emergency Contact Person Relation"
                  name="emergencyContactRelation"
                  value={values.emergencyContactRelation}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Father">Father</MenuItem>
                  <MenuItem value="Mother">Mother</MenuItem>
                  <MenuItem value="Friend">Friend</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </SelectInput>
              </div>

              <div className="form-row">
                <Input
                  label="Emergency Contact Person Current Address"
                  name="emergencyContactCurrentAddress"
                  value={values.emergencyContactCurrentAddress}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Emergency Contact Person Permanent Address"
                  name="emergencyContactPermanentAddress"
                  value={values.emergencyContactPermanentAddress}
                  onChange={handleChange}
                  required
                />
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
                  onChange={(e) => {
                    e.target.value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 12);

                    handleChange(e);
                  }}
                  label="UAN Number"
                />
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

          <div className="crmdetails">
            <h1>CRM Details</h1>

            <div className="inputs">
              <div className="form-row">
                <SelectInput
                  error={error.crmRole}
                  name="crmRole"
                  value={values.crmRole}
                  onChange={handleChange}
                  label="CRM Role"
                  required
                >
                  <MenuItem value="ADMIN">Admin </MenuItem>
                  <MenuItem value="MANAGER">Manager </MenuItem>
                  <MenuItem value="EMPLOYEE">Employee </MenuItem>
                </SelectInput>

                <SelectInput
                  error={error.managerName}
                  name="managerName"
                  value={values.managerName}
                  onChange={handleChange}
                  label="Manager Name"
                  required
                >
                  {teams.map((team) => (
                    <MenuItem
                      key={team.data.id}
                      value={team.data.manegerName} // GET API field
                    >
                      {team.data.manegerName}
                    </MenuItem>
                  ))}
                </SelectInput>

                <SelectInput
                  name="teamName"
                  value={values.teamName}
                  onChange={handleChange}
                  label="Team Name"
                  required
                >
                  {teams.map((team) => (
                    <MenuItem key={team.data.id} value={team.data.name}>
                      {team.data.name}
                    </MenuItem>
                  ))}
                </SelectInput>
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