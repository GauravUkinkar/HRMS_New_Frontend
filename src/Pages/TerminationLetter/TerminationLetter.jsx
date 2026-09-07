import { useEffect, useState } from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import "./TerminationLetter.scss";
import { FaGlobe, FaLocationDot, FaPhoneVolume } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { IoIosMail } from "react-icons/io";
import Input from "../../comp/input/Input";
import { MenuItem } from "@mui/material";
import SelectInput from "../../comp/selectInput/SelectInput";
import PanLogo from "../../assets/pan-watermark.webp";
import logo_pan from "../../assets/offer-logo-pan.png";
import right_corner from "../../assets/right-corner.png";
import left_corner from "../../assets/left-corner.png";
import axios from "axios";
import { toast } from "react-toastify";

const TerminationLetter = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    issuedDate: new Date().toISOString().split("T")[0],
    companyName: "",
    employeeName: "",
    employeeId: "",
    effectiveDate: "",
    hrManagerName: "",
    designation: "",
    terminationType: "",
    dateOfJoining: "",
  });

  const [employee, setEmployee] = useState([]);
  const [employeeLoading, setEmployeeLoading] = useState(false);

  useEffect(() => {
    const getEmployeesByCompany = async () => {
      if (!formData.companyName) {
        setEmployee([]);
        return;
      }

      try {
        setEmployeeLoading(true);

        const response = await axios.get(
          `${BASE_URL}Admin/GetAllEmployeeByCompanyName`,
          {
            params: {
              companyName: formData.companyName,
            },
            withCredentials: true,
          },
        );

        console.log("FULL API RESPONSE:", response.data);

        if (response.data?.status === "OK") {
          const employeeData = response.data?.data || [];
          const employeeList = employeeData
            .map((item) => item?.data || item)
            .filter(Boolean);

          console.log("EMPLOYEE LIST:", employeeList);
          console.log(
            "EMPLOYEE LIST JSON:",
            JSON.stringify(employeeList, null, 2),
          );
          setEmployee(employeeList);
        } else {
          setEmployee([]);

          toast.error(response.data?.responseMessage || "No employees found");
        }
      } catch (error) {
        console.error("Get Employees By Company Error:", error);
        console.error("Status:", error.response?.status);
        console.error("Response:", error.response?.data);

        setEmployee([]);

        toast.error(
          error.response?.data?.responseMessage ||
            error.response?.data?.message ||
            "Unable to fetch employees",
        );
      } finally {
        setEmployeeLoading(false);
      }
    };

    getEmployeesByCompany();
  }, [formData.companyName, BASE_URL]);

  const handleEmployeeChange = (e) => {
    const employeeName = e.target.value;

    const selectedEmployee = employee.find(
      (employee) => employee.employeeName === employeeName,
    );
    console.log("Selected Employee:", selectedEmployee);
    if (!selectedEmployee) {
      setFormData((prev) => ({
        ...prev,
        employeeName: "",
        employeeId: "",
        designation: "",
        dateOfJoining: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      employeeName: selectedEmployee.employeeName,
      employeeId: selectedEmployee.employeeId,
      designation: selectedEmployee.designation || "",
      dateOfJoining: selectedEmployee.dateOfJoining ||"",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FORM DATA:", formData);

    try {
      setLoading(true);

      const payload = {
        issuedDate: formData.issuedDate,
        companyName: formData.companyName,
        employeeName: formData.employeeName,
        effectiveDate: formData.effectiveDate,
        hrManagerName: formData.hrManagerName,
        terminationType: formData.terminationType,
        designation: formData.designation,
        dateOfJoining: formData.dateOfJoining,
      };
      console.log("API PAYLOAD:", payload);

      const response = await axios.post(
        `${BASE_URL}Admin/addOfficialLetter`,
        payload,
        {
          withCredentials: true,
        },
      );
      console.log("API RESPONSE:", response);

      if (response.data?.status === "OK") {
        toast.success(
          
            "Termination letter added successfully!",
        );

        setFormData({
          issuedDate: new Date().toISOString().split("T")[0],
          companyName: "",
          employeeName: "",
          employeeId: "",
          effectiveDate: "",
          hrManagerName: "",
          designation: "",
          terminationType: "",
          dateOfJoining: "",
        });
      } else {
        toast.error(
          response.data?.responseMessage || "Failed to add termination letter",
        );
      }
    } catch (error) {
      console.error("API ERROR:", error);
      console.error("API ERROR RESPONSE:", error.response);
      console.error("API ERROR DATA:", error.response?.data);

      toast.error(
        error.response?.data?.responseMessage ||
          error.response?.data?.message ||
          "Something went wrong while adding termination letter",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <MainPanel>
        <div className="terminationletter-parent parent">
          <div className="terminationletter-cont cont">
            <form className="left-termination" onSubmit={handleSubmit}>
              <Input
                label="Termination-Letter Date"
                type="date"
                name="issuedDate"
                value={formData.issuedDate.split("T")[0]}
                onChange={handleChange}
                required
              />
              <SelectInput
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                label="Select Company Name"
                required
              >
                <MenuItem value="The Indian Journey">
                  The Indian Journey
                </MenuItem>

                <MenuItem value="Pandoza Solutions Pvt Ltd">
                  Pandoza Solutions Pvt Ltd
                </MenuItem>

                <MenuItem value="Akka Foundation">Akka Foundation</MenuItem>

                <MenuItem value="Nvm Infratech Pvt Ltd">
                  Nvm Infratech Pvt Ltd
                </MenuItem>
              </SelectInput>

              <SelectInput
                label="Employee Name"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleEmployeeChange}
                required
              >
                {employeeLoading ? (
                  <MenuItem disabled>Loading employees...</MenuItem>
                ) : employee.length === 0 ? (
                  <MenuItem disabled>No employees found</MenuItem>
                ) : (
                  employee.map((emp, index) => (
                    <MenuItem
                      key={emp.employeeId || emp.eid || index}
                      value={emp.employeeName}
                    >
                      {emp.employeeName}
                    </MenuItem>
                  ))
                )}
              </SelectInput>

              <Input
                label="Date of Joining"
                name="startDate"
              
                value={formData.dateOfJoining}
                onChange={handleChange}
                required
              />

              <Input
                label="Employee Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
              />

              <SelectInput
                label="Reason for Termination"
                name="terminationType"
                value={formData.terminationType}
                onChange={handleChange}
                required
              >
                <MenuItem value="Performance Issues">Performance Issues</MenuItem>
                <MenuItem value="Misconduct">Misconduct</MenuItem>
                <MenuItem value="Policy Violation">Policy Violation</MenuItem>
                <MenuItem value="Redundancy">Redundancy</MenuItem>
                <MenuItem value="Absenteeism">Absenteeism</MenuItem>
                <MenuItem value="Contract Completion">Contract Completion</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </SelectInput>
              <Input
                label="Effective Date"
                type="date"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleChange}
                required
              />

              <Input
                label="Hr Manager Name"
                name="hrManagerName"
                value={formData.hrManagerName}
                onChange={handleChange}
                required
              />
              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
            <div className="right-termination">
              <div className="termination-pdf-page">
                <img
                  className="leftcorner"
                  src={left_corner}
                  alt="left-corner"
                />
                <img className="pan-water-mark" src={PanLogo} alt="PanLogo" />
                <div className="top">
                  <div className="date">{formData.issuedDate || "DD-MM-YYYY"}</div>
                  <div className="logo">
                    <img src={logo_pan} alt="OfferLogoPan" />
                  </div>
                </div>
                <div className="heading">
                  <h3>Termination Letter</h3>
                </div>

                <div className="name">
                  <p>Dear</p>
                  <h4>{formData.employeeName || "EMPLOYEE NAME"}</h4>
                </div>

                <div className="gap"></div>

                <p>
                  This letter is to formally inform you that your employment
                  with <strong>{formData.companyName || "Company Name"}</strong>{" "}
                  is being terminated effective{" "}
                  <strong>{formData.effectiveDate || "DD-MM-YYYY"}</strong>.
                </p>

                <div className="gap"></div>

                <p>
                  We regret to inform you that this decision has been made due
                  to{" "}
                  <strong>
                    {formData.terminationReason ||
                      "the circumstances communicated to you"}
                  </strong>
                  . After careful consideration and review of the circumstances,
                  the company has decided to discontinue your employment with
                  the organization.
                </p>

                <div className="gap"></div>

                <p>
                  You are required to complete the necessary handover of your
                  responsibilities, company property, documents, and other
                  assets entrusted to you on or before your last working day.
                </p>

                <div className="gap"></div>

                <p>
                  Your final settlement, including any applicable salary,
                  benefits, and other dues, will be processed in accordance with
                  the company's policies and applicable terms of employment.
                </p>

                <div className="gap"></div>

                <p>
                  We request you to cooperate with the HR and management team
                  during the exit and handover process to ensure a smooth
                  transition.
                </p>

                <div className="gap"></div>

                <p>
                  We thank you for your contributions during your tenure with{" "}
                  <strong>{formData.companyName || "Company Name"}</strong> and
                  wish you the very best in your future endeavors.
                </p>

                <div className="gap"></div>

                <p>Thanking you,</p>
                <p>Sincerely</p>

                <h4>For {formData.companyName || "Company Name"}</h4>

                <div className="gap"></div>
                <div className="gap"></div>

                <p>HR Admin & Finance</p>
                <p>{formData.hrManagerName || "HR Manager Name"}</p>

                <div className="footer">
                  <Link className="left">
                    <div className="icon">
                      <FaLocationDot />
                    </div>
                    <div className="address">
                      <h4>Pandoza Solutions Pvt. Ltd.</h4>
                      <p>
                        214, 10 BIZ PARK,
                        <br /> VIMANNAGAR, PUNE – 411014 <br /> CONTACT: +91
                        76666 01972
                      </p>
                    </div>
                  </Link>
                  <div className="right">
                    <Link className="contact">
                      <div className="icon">
                        <FaPhoneVolume />
                      </div>
                      <p>+91 7666601972</p>
                    </Link>
                    <Link className="mail">
                      <div className="icon">
                        <IoIosMail />
                      </div>
                      <p>info@pandozasolutions.com</p>
                    </Link>
                    <Link className="globe">
                      <div className="icon">
                        <FaGlobe />
                      </div>
                      <p>+91 7666601972</p>
                    </Link>
                    <img src={right_corner} alt="right-corner" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainPanel>
    </>
  );
};

export default TerminationLetter;
