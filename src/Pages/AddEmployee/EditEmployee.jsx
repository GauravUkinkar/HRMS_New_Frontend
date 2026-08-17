import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import MainPanel from "../../comp/MainPanel/MainPanel";
import "./AddEmployee.scss";

const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

const EditEmployee = () => {
    const { employeeId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [existingImage, setExistingImage] = useState("");

  

    // ==========================================
    // GET TEAMS
    // ==========================================
    const getTeams = async () => {
        try {
            const res = await axios.get(
                `${BASE_URL}Admin/GetAllTeam`,
                {
                    withCredentials: true,
                }
            );

            const teamData =
                res.data?.data || res.data || [];

            setTeams(teamData);
        } catch (error) {
            console.error(
                "Get Teams Error:",
                error.response?.data || error
            );
        }
    };

    // ==========================================
    // GET EMPLOYEE
    // ==========================================
    const getEmployee = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                `${BASE_URL}Admin/GetEmployee/${employeeId}`,
                {
                    withCredentials: true,
                }
            );

            console.log(
                "Employee API Response:",
                res.data
            );

            const employee =
                res.data?.data || res.data;

            // --------------------------------------
            // PREFILL FORM
            // --------------------------------------

            setFormData({
                employeeName:
                    employee.employeeName || "",

                employeeId:
                    employee.employeeId || "",

                gender:
                    employee.gender || "",

                employeeStatus:
                    employee.employeeStatus || "Active",

                designation:
                    employee.designation || "",

                department:
                    employee.department || "",

                dateOfJoining:
                    formatDate(employee.dateOfJoining),

                dateOfLiving:
                    formatDate(employee.dateOfLiving),

                contactNumber:
                    employee.contactNumber || "",

                ifscCode:
                    employee.ifscCode || "",

                dateOfBirth:
                    formatDate(employee.dateOfBirth),

                bloodGroup:
                    employee.bloodGroup || "",

                teamName:
                    employee.teamName || "",

                employementType:
                    employee.employementType || "",

                aadharNumber:
                    employee.aadharNumber || "",

                panNumber:
                    employee.panNumber || "",

                accountNumber:
                    employee.accountNumber || "",

                costtoCompany:
                    employee.costtoCompany || "",

                employeeSalary:
                    employee.employeeSalary || "",

                bankName:
                    employee.bankName || "",

                companyName:
                    employee.companyName || "",

                diduction:
                    employee.diduction || "",

                currentAddress:
                    employee.currentAddress || "",

                permanentAddress:
                    employee.permanentAddress || "",

                uanNo:
                    employee.uanNo || "",

                policyNumber:
                    employee.policyNumber || "",

                insuranceCompany:
                    employee.insuranceCompany || "",

                emergencyContactNumber:
                    employee.emergencyContactNumber || "",

                emergencyContactName:
                    employee.emergencyContactName || "",

                emergencyContactRelation:
                    employee.emergencyContactRelation || "",

                emergencyContactCurrentAddress:
                    employee.emergencyContactCurrentAddress || "",

                emergencyContactPermanentAddress:
                    employee.emergencyContactPermanentAddress || "",

                status:
                    employee.status || "ACTIVE",

                esicNumber:
                    employee.esicNumber || "",

                email:
                    employee.email || "",

                password:
                    employee.password || "",

                role:
                    employee.role || "",

                crmRole:
                    employee.crmRole || "",

                managerName:
                    employee.managerName || "",
            });

            // Existing image
            setExistingImage(
                employee.image || ""
            );

        } catch (error) {
            console.error(
                "Get Employee Error:",
                error.response?.data || error
            );

            toast.error(
                "Unable to load employee details"
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // DATE FORMAT
    // ==========================================
    const formatDate = (date) => {
        if (!date) return "";

        return String(date).substring(0, 10);
    };

    // ==========================================
    // INITIAL LOAD
    // ==========================================
    useEffect(() => {
        if (employeeId) {
            getEmployee();
        }

        getTeams();
    }, [employeeId]);

    // ==========================================
    // INPUT CHANGE
    // ==========================================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // ==========================================
    // UPDATE EMPLOYEE
    // ==========================================
   const handleUpdate = async () => {
    const formData = new FormData();

    formData.append(
        "employeeDto",
        JSON.stringify(values)
    );

    if (values.employee_image instanceof File) {
        formData.append(
            "image",
            values.employee_image
        );
    }

    await axios.post(
        `${BASE_URL}Admin/updateEmployee`,
        formData,
        {
            withCredentials: true,
        }
    );
};

    return (
        <MainPanel
            title="Edit Employee"
            breadcrumbs={[
                {
                    label: "Dashboard",
                    link: "/dashboard",
                },
                {
                    label: "Employees",
                    link: "/employees",
                },
                {
                    label: "Edit Employee",
                },
            ]}
        >


             <form onSubmit={handleUpdate} className="employee-parent">
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
            Update Employee
          </button>
        </form>
        </MainPanel >
    );
};

export default EditEmployee;