import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainPanel from "../../comp/MainPanel/MainPanel";
import SelectInput from "../../comp/SelectInput/SelectInput";
import { MenuItem } from "@mui/material";
import Input from "../../comp/Input/Input";
import axios from "axios";
import { toast } from "react-toastify";

import "./AddEmployee.scss";

const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

const AddEmployee = () => {
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);

  const [values, setValues] = useState({
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
    costtoCompany: "",
    employeeSalary: "",
    bankName: "",
    companyName: "",
    diduction: "",
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
    status: "",
    esicNumber: "",
    email: "",
    password: "",
    role: "",
    crmRole: "",
    managerName: "",
    employee_image: null,
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Handle file upload
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setValues((prev) => ({
        ...prev,
        employee_image: file,
      }));
    }
  };

  // Basic validation
  const validateForm = () => {
    const newErrors = {};

    if (!values.employeeId.trim()) {
      newErrors.employeeId = "Employee ID is required";
    }

    if (!values.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!values.employeeName.trim()) {
      newErrors.employeeName = "Employee name is required";
    }

    if (!values.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    }

    if (!values.email.trim()) {
      newErrors.email = "Email is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Get teams
  const getTeams = async () => {
    try {
      const response = await axios.get(
        "https://internaltomcat.diwise.in/Pandoza_Admin/Admin/Team/getAllTeams"
      );

      setTeams(response.data || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  useEffect(() => {
    getTeams();
  }, []);

  // Add employee
  const addEmployee = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      let employeeId = values.employeeId || "";

      // Remove PSPL if user enters it manually
      employeeId = employeeId.replace(/^PSPL/i, "");

      const employeeDto = {
        ...values,
        employeeId: `PSPL${employeeId}`,
      };

      delete employeeDto.employee_image;

      const formData = new FormData();

      formData.append(
        "employeeDto",
        JSON.stringify(employeeDto)
      );

      if (values.employee_image) {
        formData.append(
          "image",
          values.employee_image
        );
      }

      const response = await axios.post(
        `${BASE_URL}Admin/AddEmployee`,
        formData,
        {
          withCredentials: true,
        }
      );

      console.log(
        "Add Employee Response:",
        response.data
      );

      toast.success("Employee added successfully!");

      navigate("/");
    } catch (error) {
      console.error(
        "Add Employee Error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to add employee"
      );
    }
  };

  return (
    <MainPanel
      title="Add Employee"
      breadcrumbs={[
        {
          label: "Dashboard",
          link: "/dashboard",
        },
        {
          label: "Add Employee",
        },
      ]}
    >
      <form
        className="employee-parent"
        onSubmit={addEmployee}
      >
        {/* BACK BUTTON */}

        <button
          type="button"
          className="previous-view-back"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        {/* ================= EMPLOYEE DETAILS ================= */}

        <div className="empdetails">
          <h1>Employee Details</h1>

          <div className="top-section">

            <div className="employee-details-inputs">

              <div className="inputs">

                {/* ROW 1 */}

                <div className="input-row">

                  <Input
                    label="Employee ID"
                    name="employeeId"
                    value={values.employeeId}
                    onChange={handleChange}
                    error={errors.employeeId}
                    placeholder="Employee ID"
                  />

                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="Password"
                  />

                  <SelectInput
                    label="Employee Status"
                    name="employeeStatus"
                    value={values.employeeStatus}
                    onChange={handleChange}
                  >
                    <MenuItem value="Active">
                      Active
                    </MenuItem>

                    <MenuItem value="Inactive">
                      Inactive
                    </MenuItem>
                  </SelectInput>

                  <SelectInput
                    label="Role"
                    name="role"
                    value={values.role}
                    onChange={handleChange}
                  >
                    <MenuItem value="Admin">
                      Admin
                    </MenuItem>

                    <MenuItem value="Employee">
                      Employee
                    </MenuItem>
                  </SelectInput>

                </div>

                {/* ROW 2 */}

                <div className="input-row">

                  <SelectInput
                    label="Employee Type"
                    name="employementType"
                    value={values.employementType}
                    onChange={handleChange}
                  >
                    <MenuItem value="Full Time">
                      Full Time
                    </MenuItem>

                    <MenuItem value="Part Time">
                      Part Time
                    </MenuItem>

                    <MenuItem value="Intern">
                      Intern
                    </MenuItem>

                    <MenuItem value="Contract">
                      Contract
                    </MenuItem>
                  </SelectInput>

                  <Input
                    label="Company Name"
                    name="companyName"
                    value={values.companyName}
                    onChange={handleChange}
                    placeholder="Company Name"
                  />

                  <Input
                    label="Date of Joining"
                    name="dateOfJoining"
                    type="date"
                    value={values.dateOfJoining}
                    onChange={handleChange}
                  />

                </div>

                {/* ROW 3 */}

                <div className="input-row">

                  <Input
                    label="Last Working Day"
                    name="dateOfLiving"
                    type="date"
                    value={values.dateOfLiving}
                    onChange={handleChange}
                  />

                  <Input
                    label="Department"
                    name="department"
                    value={values.department}
                    onChange={handleChange}
                    placeholder="Department"
                  />

                  <Input
                    label="Designation"
                    name="designation"
                    value={values.designation}
                    onChange={handleChange}
                    placeholder="Designation"
                  />

                </div>

              </div>
            </div>

            {/* EMPLOYEE PHOTO */}

            <div className="employee-photo-upload">

              <div className="employee-photo-preview">

                {values.employee_image ? (
                  <img
                    src={URL.createObjectURL(
                      values.employee_image
                    )}
                    alt="Employee"
                  />
                ) : (
                  <span>Photo</span>
                )}

              </div>

              <label className="photo-upload-btn">
                Upload Photo

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </label>

            </div>

          </div>
        </div>

        {/* ================= PERSONAL DETAILS ================= */}

        <div className="personaldetails">

          <h1>Personal Details</h1>

          <div className="inputs">

            {/* ROW 1 */}

            <div className="input-row">

              <Input
                label="Employee Name"
                name="employeeName"
                value={values.employeeName}
                onChange={handleChange}
                error={errors.employeeName}
                placeholder="Employee Name"
              />

              <SelectInput
                label="Gender"
                name="gender"
                value={values.gender}
                onChange={handleChange}
              >
                <MenuItem value="Male">
                  Male
                </MenuItem>

                <MenuItem value="Female">
                  Female
                </MenuItem>

                <MenuItem value="Other">
                  Other
                </MenuItem>
              </SelectInput>

              <Input
                label="Contact Number"
                name="contactNumber"
                value={values.contactNumber}
                onChange={handleChange}
                error={errors.contactNumber}
                placeholder="Contact Number"
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="Email"
              />

            </div>

            {/* ROW 2 */}

            <div className="input-row">

              <Input
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={values.dateOfBirth}
                onChange={handleChange}
              />

              <Input
                label="Aadhar No"
                name="aadharNumber"
                value={values.aadharNumber}
                onChange={handleChange}
                placeholder="Aadhar No"
              />

              <Input
                label="Pan No"
                name="panNumber"
                value={values.panNumber}
                onChange={handleChange}
                placeholder="Pan No"
              />

              <SelectInput
                label="Blood Group"
                name="bloodGroup"
                value={values.bloodGroup}
                onChange={handleChange}
              >
                <MenuItem value="A+">
                  A+
                </MenuItem>

                <MenuItem value="A-">
                  A-
                </MenuItem>

                <MenuItem value="B+">
                  B+
                </MenuItem>

                <MenuItem value="B-">
                  B-
                </MenuItem>

                <MenuItem value="O+">
                  O+
                </MenuItem>

                <MenuItem value="O-">
                  O-
                </MenuItem>

                <MenuItem value="AB+">
                  AB+
                </MenuItem>

                <MenuItem value="AB-">
                  AB-
                </MenuItem>
              </SelectInput>

            </div>

            {/* ROW 3 */}

            <div className="input-row">

              <Input
                label="Current Address"
                name="currentAddress"
                value={values.currentAddress}
                onChange={handleChange}
                placeholder="Current Address"
              />

              <Input
                label="Permanent Address"
                name="permanentAddress"
                value={values.permanentAddress}
                onChange={handleChange}
                placeholder="Permanent Address"
              />

            </div>

          </div>
        </div>

        {/* ================= EMERGENCY DETAILS ================= */}

        <div className="emergencydetails">

          <h1>Emergency Details</h1>

          <div className="inputs">

            <div className="input-row">

              <Input
                label="Emergency Contact Name"
                name="emergencyContactName"
                value={values.emergencyContactName}
                onChange={handleChange}
                placeholder="Contact Name"
              />

              <Input
                label="Emergency Contact Number"
                name="emergencyContactNumber"
                value={values.emergencyContactNumber}
                onChange={handleChange}
                placeholder="Contact Number"
              />

              <Input
                label="Relation"
                name="emergencyContactRelation"
                value={values.emergencyContactRelation}
                onChange={handleChange}
                placeholder="Relation"
              />

            </div>

            <div className="input-row">

              <Input
                label="Current Address"
                name="emergencyContactCurrentAddress"
                value={values.emergencyContactCurrentAddress}
                onChange={handleChange}
                placeholder="Current Address"
              />

              <Input
                label="Permanent Address"
                name="emergencyContactPermanentAddress"
                value={values.emergencyContactPermanentAddress}
                onChange={handleChange}
                placeholder="Permanent Address"
              />

            </div>

          </div>
        </div>

        {/* ================= SALARY DETAILS ================= */}

        <div className="salarydetails">

          <h1>Salary Details</h1>

          <div className="inputs">

            <div className="input-row">

              <Input
                label="Bank Name"
                name="bankName"
                value={values.bankName}
                onChange={handleChange}
                placeholder="Bank Name"
              />

              <Input
                label="Account Number"
                name="accountNumber"
                value={values.accountNumber}
                onChange={handleChange}
                placeholder="Account Number"
              />

              <Input
                label="IFSC Code"
                name="ifscCode"
                value={values.ifscCode}
                onChange={handleChange}
                placeholder="IFSC Code"
              />

              <Input
                label="Employee Salary"
                name="employeeSalary"
                value={values.employeeSalary}
                onChange={handleChange}
                placeholder="Employee Salary"
              />

            </div>

            <div className="input-row">

              <Input
                label="Cost to Company"
                name="costtoCompany"
                value={values.costtoCompany}
                onChange={handleChange}
                placeholder="Cost to Company"
              />

              <Input
                label="Deduction"
                name="diduction"
                value={values.diduction}
                onChange={handleChange}
                placeholder="Deduction"
              />

              <Input
                label="UAN No"
                name="uanNo"
                value={values.uanNo}
                onChange={handleChange}
                placeholder="UAN No"
              />

              <Input
                label="ESIC Number"
                name="esicNumber"
                value={values.esicNumber}
                onChange={handleChange}
                placeholder="ESIC Number"
              />

            </div>

            <div className="input-row">

              <Input
                label="Policy Number"
                name="policyNumber"
                value={values.policyNumber}
                onChange={handleChange}
                placeholder="Policy Number"
              />

              <Input
                label="Insurance Company"
                name="insuranceCompany"
                value={values.insuranceCompany}
                onChange={handleChange}
                placeholder="Insurance Company"
              />

            </div>

          </div>
        </div>

        {/* ================= CRM DETAILS ================= */}

        <div className="crmdetails">

          <h1>CRM Details</h1>

          <div className="inputs">

            <div className="input-row">

              <Input
                label="CRM Role"
                name="crmRole"
                value={values.crmRole}
                onChange={handleChange}
                placeholder="CRM Role"
              />

              <Input
                label="Manager Name"
                name="managerName"
                value={values.managerName}
                onChange={handleChange}
                placeholder="Manager Name"
              />

              <SelectInput
                label="Team Name"
                name="teamName"
                value={values.teamName}
                onChange={handleChange}
              >
                {teams.map((team, index) => (
                  <MenuItem
                    key={
                      team?.teamId ||
                      team?.id ||
                      index
                    }
                    value={
                      team?.teamName ||
                      team?.name
                    }
                  >
                    {team?.teamName ||
                      team?.name}
                  </MenuItem>
                ))}
              </SelectInput>

            </div>

          </div>
        </div>

        {/* ================= SUBMIT ================= */}

        <button
          type="submit"
          className="submit-btn"
        >
          Add Employee
        </button>

      </form>
    </MainPanel>
  );
};

export default AddEmployee;