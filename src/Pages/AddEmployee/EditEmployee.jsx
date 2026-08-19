import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MenuItem } from "@mui/material";

import MainPanel from "../../comp/MainPanel/MainPanel";
import SelectInput from "../../comp/selectInput/SelectInput";
import Input from "../../comp/input/Input";
import "./AddEmployee.scss";
const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;
const EditEmployee = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [teams, setTeams] = useState([]);
  const [existingImage, setExistingImage] = useState("");
  const [employeeData, setEmployeeData] = useState({
    employeeName: "",
    employeeId: "",
    employementType: "",
    employee_status: "Active",
    employeeStatus: "Active",
    gender: "",
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
    status: "ACTIVE",
    esicNumber: "",
    editableAccess: true,
    email: "",
    password: "",
    role: "",
    bloodGroup: "",
    crmRole: "",
    managerName: "",
    teamName: "",
    // Image file
    employee_image: null,
  });

  // FORMAT DATE

  const formatDate = (date) => {
    if (!date) return "";
    const dateString = String(date);
    // Already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    // ISO format: 2026-08-19T00:00:00
    if (dateString.includes("T")) {
      return dateString.split("T")[0];
    }

    const parsedDate = new Date(dateString);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toISOString().split("T")[0];
  };

  // GET TEAMS
  const getTeams = async () => {
    try {
      // const response = await axios.get(
      //   `${BASE_URL}Admin/GetAllTeam`,
      //   {
      //     withCredentials: true,
      //   }
      // );
      const res = await axios.get(
        "https://internaltomcat.diwise.in/Pandoza_Admin/Admin/Team/getAllTeams"
      );
      console.log("Teams API Response:", res.data);

      const teamData =
        res.data?.data ||
        res.data ||
        [];

      setTeams(
        Array.isArray(teamData)
          ? teamData
          : []
      );
    } catch (error) {
      console.error(
        "Get Teams Error:",
        error.response?.data || error
      );
    }
  };

  // =====================================================
  // GET EMPLOYEE
  // =====================================================

  const getEmployee = async () => {
    try {
      setLoading(true);

      console.log(
        "Getting Employee:",
        employeeId
      );

      const response = await axios.get(
        `${BASE_URL}Admin/GetEmployeeById/${employeeId}`,
        {
          withCredentials: true,
        }
      );

      console.log(
        "Employee API Response:",
        response.data
      );

      const employee =
        response.data?.data ||
        response.data;

      if (!employee) {
        toast.error(
          "Employee data not found"
        );

        return;
      }

      setEmployeeData({
        eid: employee.eid,
        employeeName: employee.employeeName || "",
        employeeId: employee.employeeId
          ? String(employee.employeeId).replace(/^PSPL/i, "")
          : "",

        employee_status:
          employee.employee_status ||
          employee.employeeStatus ||
          "Active",

        employeeStatus:
          employee.employeeStatus ||
          employee.employee_status ||
          "Active",

        gender: employee.gender || "",
        designation: employee.designation || "",
        department: employee.department || "",

        employementType:
          employee.employementType || "",

        dateOfJoining:
          formatDate(
            employee.dateOfJoining
          ),

        dateOfLiving:
          formatDate(
            employee.dateOfLiving
          ),

        contactNumber:
          employee.contactNumber || "",

        ifscCode:
          employee.ifscCode || "",

        dateOfBirth:
          formatDate(
            employee.dateOfBirth
          ),

        bloodGroup:
          employee.bloodGroup || "",

        teamName:
          employee.teamName || "",


        aadharNumber:
          employee.aadharNumber || "",

        panNumber:
          employee.panNumber || "",

        accountNumber:
          employee.accountNumber || "",

        costtoCompany:
          employee.costtoCompany ?? "",

        employeeSalary:
          employee.employeeSalary ?? "",

        bankName:
          employee.bankName || "",

        companyName:
          employee.companyName || "",

        diduction:
          employee.diduction ?? "",

        currentAddress:
          employee.currentAddress ||
          employee.address ||
          "",

        permanentAddress:
          employee.permanentAddress || "",

        uanNo:
          employee.uanNo || "",

        policyNumber:
          employee.policyNumber || "",

        insuranceCompany:
          employee.insuranceCompany || "",

        emergencyContactNumber:
          employee.emergencyContactNumber ||
          "",

        emergencyContactName:
          employee.emergencyContactName ||
          "",

        emergencyContactRelation:
          employee.emergencyContactRelation ||
          "",

        emergencyContactCurrentAddress:
          employee.emergencyContactCurrentAddress ||
          "",

        emergencyContactPermanentAddress:
          employee.emergencyContactPermanentAddress ||
          "",

        status:
          employee.status ||
          "",

        esicNumber:
          employee.esicNumber || "",

        editableAccess:
          employee.editableAccess ??
          true,

        email:
          employee.email || "",

        password:
          employee.password || "",

        role:
          employee.role || "",

        crmRole:
          employee.crmRole || "N/A",

        managerName:
          employee.managerName || "",

        employee_image: null,
      });

      // =================================================
      // EXISTING IMAGE
      // =================================================

      setExistingImage(
        employee.image ||
        employee.employee_image ||
        ""
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

  // =====================================================
  // USE EFFECT
  // =====================================================

  useEffect(() => {
    if (employeeId) {
      getEmployee();
    }

    getTeams();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      files,
    } = e.target;

    if (type === "file") {
      const file =
        files?.[0] || null;

      setEmployeeData((prev) => ({
        ...prev,
        employee_image: file,
      }));

      return;
    }

    setEmployeeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // HANDLE UPDATE
  // =====================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    console.log(
      "========== UPDATE EMPLOYEE START =========="
    );

    console.log(
      "Employee ID:",
      employeeId
    );

    console.log(
      "Employee Data:",
      employeeData
    );

    try {
      setLoading(true);

      // =================================================
      // CREATE MULTIPART FORM DATA
      // =================================================

      const multipartData =
        new FormData();

      // =================================================
      // REMOVE IMAGE FROM JSON
      // =================================================

      const {
        employee_image,
        ...employeeDto
      } = employeeData;

      // Make sure employee ID is present
      const enteredEmployeeId =
        String(employeeDto.employeeId || "").trim();

      if (enteredEmployeeId) {
        employeeDto.employeeId =
          enteredEmployeeId.toUpperCase().startsWith("PSPL")
            ? enteredEmployeeId.toUpperCase()
            : `PSPL${enteredEmployeeId}`;
      } else {
        employeeDto.employeeId = employeeId;
      }

      multipartData.append(
        "employeeDto",
        JSON.stringify(employeeDto)
      );

      // =================================================
      // ADD IMAGE
      // =================================================

      if (
        employee_image instanceof File
      ) {
        multipartData.append(
          "image",
          employee_image
        );
      }

      // =================================================
      // DEBUG FORMDATA
      // =================================================

      console.log(
        "========== FORM DATA =========="
      );

      for (
        const [
          key,
          value,
        ] of multipartData.entries()
      ) {
        if (value instanceof File) {
          console.log(key, {
            name: value.name,
            type: value.type,
            size: value.size,
          });
        } else {
          console.log(
            key,
            value
          );
        }
      }

      // =================================================
      // API CALL
      // =================================================

      console.log(
        "========== CALLING UPDATE API =========="
      );

      const response =
        await axios.post(
          `${BASE_URL}Admin/updateEmployee`,
          multipartData,
          {
            withCredentials: true,
          }
        );

      // =================================================
      // SUCCESS
      // =================================================

      console.log(
        "========== UPDATE SUCCESS =========="
      );

      console.log(
        "Status:",
        response.status
      );

      console.log(
        "Response:",
        response.data
      );

      toast.success(
        "Employee updated successfully!"
      );

      // Go back to employee list
      navigate("/employees");
    } catch (error) {
      // =================================================
      // ERROR
      // =================================================

      console.log(
        "========== UPDATE ERROR =========="
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      console.error(
        "Full Error:",
        error
      );

      toast.error(
        error.response?.data?.responseMessage ||
        error.response?.data?.message ||
        "Failed to update employee"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading && !employeeData.employeeId) {
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
        <div
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >
          Loading employee details...
        </div>
      </MainPanel>
    );
  }


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
              <div className="form-row">
                <Input
                  error={error.employeeId}
                  name="employeeId"
                  value={employeeData.employeeId}
                  onChange={handleChange}
                  label="Employee ID"
                  mq_label="PSPL"
                  required
                />

                <Input
                  error={error.password}
                  name="password"
                  value={employeeData.password}
                  onChange={handleChange}
                  label="Password"
                  required
                />

                <SelectInput
                  name="employeeStatus"
                  label="Employee Status"
                  value={employeeData.employeeStatus}
                  onChange={handleChange}
                  disabled
                >
                  <MenuItem value="Active"> Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </SelectInput>

                <SelectInput
                  error={error.role}
                  name="role"
                  value={employeeData.role}
                  onChange={handleChange}
                  label="Role"
                >
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="SUPERADMIN">SuperAdmin</MenuItem>
                  <MenuItem value="EMPLOYEE">Employee</MenuItem>
                </SelectInput>
              </div>
              {/* ================= ROW 2 ================= */}

              <div className="form-row">
                <SelectInput
                  error={error.employementType}
                  name="employementType"
                  value={employeeData.employementType}
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
                  value={employeeData.companyName}
                  onChange={handleChange}
                  label="Company Name"
                >
                  <MenuItem value="Pandoza Solutions Pvt.Ltd">Pandoza Solutions Pvt.Ltd</MenuItem>
                  <MenuItem value="Akka Foundation">Akka Foundation</MenuItem>
                  <MenuItem value="NVM Infratech">NVM Infratech</MenuItem>

                  <MenuItem value="The Indian Journey">
                    The Indian Journey
                  </MenuItem>
                </SelectInput>

                <Input
                  error={error.dateOfJoining}
                  name="dateOfJoining"
                  value={employeeData.dateOfJoining}
                  onChange={handleChange}
                  label="Date of Joining"
                  required
                  type="date"
                />

              </div>

              {/* ================= ROW 3 ================= */}

              <div className="form-row">
                <Input
                  name="dateOfLiving"
                  value={employeeData.dateOfLiving}
                  onChange={handleChange}
                  label="Last Working Day"
                  type="date"
                />
                <Input
                  error={error.department}
                  name="department"
                  value={employeeData.department}
                  onChange={handleChange}
                  label="Department"
                />
                {/* <SelectInput
                  error={
                    error.department
                  }
                  name="department"
                  value={
                    employeeData.department
                  }
                  onChange={
                    handleChange
                  }
                  label="Department"
                  required
                >
                  <MenuItem value="HR">
                    HR
                  </MenuItem>

                  <MenuItem value="Technical">
                    Technical
                  </MenuItem>

                  <MenuItem value="Finance">
                    Finance
                  </MenuItem>

                  <MenuItem value="Marketing">
                    Marketing
                  </MenuItem>

                  <MenuItem value="Sales">
                    Sales
                  </MenuItem>
                </SelectInput> */}
                <Input
                  error={error.designation}
                  name="designation"
                  value={employeeData.designation}
                  onChange={handleChange}
                  label="Designation"
                  required
                />

              </div>
            </div>
            <div className="employee-photo-upload">

              <div className="employee-photo-preview">
                {employeeData.employee_image ? (
                  // Newly selected image
                  <img
                    src={URL.createObjectURL(employeeData.employee_image)}
                    alt="Employee"
                  />
                ) : existingImage ? (
                  // Existing image from API
                  <img
                    src={existingImage}
                    alt="Employee"
                  />
                ) : (
                  <span>Photo</span>
                )}
              </div>

              {/* Upload button */}
              <label
                htmlFor="employee-image"
                className="photo-upload-btn"
              >
                Upload Photo
              </label>

              {/* Hidden file input */}
              <input
                id="employee-image"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (!file) return;

                  setEmployeeData((prev) => ({
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
                value={employeeData.employeeName}
                onChange={handleChange}
                label="Employee Name"
                required
              />

              <SelectInput
                label="Gender"
                value={employeeData.gender}
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
                value={employeeData.contactNumber}
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
                value={employeeData.email}
                onChange={handleChange}
                label="Email"
                required
              />
            </div>

            <div className="form-row">
              <Input
                error={error.dateOfBirth}
                name="dateOfBirth"
                value={employeeData.dateOfBirth}
                onChange={handleChange}
                label="Date of Birth"
                required
                type="date"
              />

              <Input
                error={error.aadharNumber}
                name="aadharNumber"
                value={employeeData.aadharNumber}
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
                value={employeeData.panNumber}
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
                value={employeeData.bloodGroup}
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
                value={employeeData.currentAddress}
                onChange={handleChange}
                label="Current Address"
                required
              />

              <Input
                error={error.permanentAddress}
                name="permanentAddress"
                value={employeeData.permanentAddress}
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
                error={
                  error.emergencyContactName
                }
                name="emergencyContactName"
                value={
                  employeeData.emergencyContactName
                }
                onChange={
                  handleChange
                }
                label="Emergency Contact Name"
                required
              />

              <Input
                error={
                  error.emergencyContactNumber
                }
                name="emergencyContactNumber"
                value={
                  employeeData.emergencyContactNumber
                }
                onChange={(e) => {
                  e.target.value =
                    e.target.value
                      .replace(
                        /\D/g,
                        ""
                      )
                      .slice(
                        0,
                        10
                      );

                  handleChange(e);
                }}
                label="Emergency Contact No"
                required
              />

              <SelectInput
                label="Emergency Contact Person Relation"
                name="emergencyContactRelation"
                value={
                  employeeData.emergencyContactRelation
                }
                onChange={
                  handleChange
                }
                required
              >
                <MenuItem value="Father">
                  Father
                </MenuItem>

                <MenuItem value="Mother">
                  Mother
                </MenuItem>

                <MenuItem value="Friend">
                  Friend
                </MenuItem>

                <MenuItem value="Other">
                  Other
                </MenuItem>
              </SelectInput>

            </div>

            {/* ================= ROW 2 ================= */}

            <div className="form-row">

              <Input
                label="Emergency Contact Person Current Address"
                name="emergencyContactCurrentAddress"
                value={
                  employeeData.emergencyContactCurrentAddress
                }
                onChange={
                  handleChange
                }
                required
              />

              <Input
                label="Emergency Contact Person Permanent Address"
                name="emergencyContactPermanentAddress"
                value={
                  employeeData.emergencyContactPermanentAddress
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

          </div>
        </div>

        {/* =================================================
            SALARY DETAILS
        ================================================= */}

        <div className="personaldetails">

          <h1>
            Salary Details
          </h1>

          <div className="inputs">

            {/* ================= ROW 1 ================= */}

            <div className="form-row">

              <Input
                error={
                  error.employeeSalary
                }
                name="employeeSalary"
                value={
                  employeeData.employeeSalary
                }
                onChange={
                  handleChange
                }
                label="Employee Salary"
                required
              />

              <Input
                error={
                  error.costtoCompany
                }
                name="costtoCompany"
                value={
                  employeeData.costtoCompany
                }
                onChange={
                  handleChange
                }
                label="Cost to Company"
                required
              />

              <Input
                error={
                  error.bankName
                }
                name="bankName"
                value={
                  employeeData.bankName
                }
                onChange={
                  handleChange
                }
                label="Bank Name"
                required
              />

            </div>

            {/* ================= ROW 2 ================= */}

            <div className="form-row">

              <Input
                error={
                  error.accountNumber
                }
                name="accountNumber"
                value={
                  employeeData.accountNumber
                }
                onChange={
                  handleChange
                }
                label="Account Number"
                required
              />

              <Input
                error={
                  error.ifscCode
                }
                name="ifscCode"
                value={
                  employeeData.ifscCode
                }
                onChange={(e) => {
                  e.target.value =
                    e.target.value
                      .toUpperCase()
                      .slice(
                        0,
                        11
                      );

                  handleChange(e);
                }}
                label="IFSC Code"
                required
              />

              <Input
                name="uanNo"
                value={
                  employeeData.uanNo
                }
                onChange={(e) => {
                  e.target.value =
                    e.target.value
                      .replace(
                        /\D/g,
                        ""
                      )
                      .slice(
                        0,
                        12
                      );

                  handleChange(e);
                }}
                label="UAN Number"
              />

            </div>

            {/* ================= ROW 3 ================= */}

            <div className="form-row">

              <Input
                name="insuranceCompany"
                value={
                  employeeData.insuranceCompany
                }
                onChange={
                  handleChange
                }
                label="Insurance Company Name"
              />

              <Input
                name="esicNumber"
                value={
                  employeeData.esicNumber
                }
                onChange={
                  handleChange
                }
                label="ESIC Number"
              />

              <Input
                name="policyNumber"
                value={
                  employeeData.policyNumber
                }
                onChange={
                  handleChange
                }
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
                value={employeeData.crmRole}
                onChange={handleChange}
                label="CRM Role"
                required
              >
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="MANAGER">Manager</MenuItem>
                <MenuItem value="EMPLOYEE">Employee</MenuItem>
              </SelectInput>

              {/* MANAGER */}

              <SelectInput
                error={
                  error.managerName
                }
                name="managerName"
                value={
                  employeeData.managerName
                }
                onChange={
                  handleChange
                }
                label="Manager Name"
                required
              >
                {teams.map(
                  (team, index) => {
                    const data =
                      team?.data ||
                      team;

                    const managerName =
                      data?.manegerName ||
                      data?.managerName ||
                      "";

                    if (
                      !managerName
                    ) {
                      return null;
                    }

                    return (
                      <MenuItem
                        key={
                          data?.id ||
                          index
                        }
                        value={
                          managerName
                        }
                      >
                        {
                          managerName
                        }
                      </MenuItem>
                    );
                  }
                )}
              </SelectInput>

              {/* TEAM */}

              <SelectInput
                name="teamName"
                value={employeeData.teamName}
                onChange={handleChange}
                label="Team Name"
                required
              >
                {teams.map(
                  (team, index) => {
                    const data = team?.data || team;
                    const teamName =
                      data?.name ||
                      data?.teamName ||
                      "";

                    if (
                      !teamName
                    ) {
                      return null;
                    }

                    return (
                      <MenuItem key={data?.id || index}
                        value={teamName}
                      >
                        {teamName}
                      </MenuItem>
                    );
                  }
                )}
              </SelectInput>
            </div>
          </div>
        </div>
        <button
          className="btn"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Updating..."
            : "Update Employee"}
        </button>

      </form>
    </MainPanel>
  );
};

export default EditEmployee;