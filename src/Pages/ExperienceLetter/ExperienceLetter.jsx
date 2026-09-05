import React, { useEffect, useState } from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import "./ExperienceLetter.scss";
import SelectInput from "../../comp/selectInput/SelectInput";
import { MenuItem } from "@mui/material";
import Input from "../../comp/input/Input";
import { FaGlobe, FaLocationDot, FaPhoneVolume } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { IoIosMail } from "react-icons/io";
import PanLogo from "../../assets/pan-watermark.webp";
import logo_pan from "../../assets/offer-logo-pan.png";
import right_corner from "../../assets/right-corner.png";
import left_corner from "../../assets/left-corner.png";
import axios from "axios";
import { toast } from "react-toastify";

const ExperienceLetter = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    issuedDate: new Date().toISOString().split("T")[0],
    companyName: "",
    employeeName: "",
    employeeId: "",
    designation: "",
    startDate: "",
    endDate: "",
    hrManagerName: "",
  });
  const [employee, setEmployee] = useState([]);
  const [employeeLoading, setEmployeeLoading] = useState(false);

  useEffect(() => {
    const getEmployyesByCompany = async () => {
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

          toast.error(response.data?.responseMessage || "No Employees found");
        }
      } catch (error) {
        console.error("Get Employees By Company Error:", error);
        console.error("Status:", error.response?.status);
        console.error("Response:", error.response?.data);

        setEmployee([]);

        toast.error(
          error.response?.data?.responseMessage ||
            error.resposne?.data?.message ||
            "Unable to fetch employees",
        );
      } finally {
        setEmployeeLoading(false);
      }
    };

    getEmployyesByCompany();
  }, [formData.companyName, BASE_URL]);
  const handleEmployeeChange = (e) => {
    const formatDateForInput = (dateString) => {
      if (!dateString) return "";

      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "";
      }

      return date.toISOString().split("T")[0];
    };
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
        startDate: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      employeeName: selectedEmployee.employeeName,
      employeeId: selectedEmployee.employeeId,
      designation: selectedEmployee.designation || "",
      startDate: formatDateForInput(selectedEmployee.dateOfJoining) || "",
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
        designation: formData.designation,
        endDate: formData.endDate,
        startDate: formData.startDate,
        hrManagerName: formData.hrManagerName,
        documentName: "Experiment Letter",
      };

      console.log("API PAYLOAD:", [payload]);

      const response = await axios.post(
        `${BASE_URL}Admin/addOfficialLetter`,
        payload,
        {
          withCredentials: true,
        },
      );

      console.log("API RESPONSE:", response);

      if (response.data?.status === "OK") {
        toast.success("Experience letter added successfully!");
        setFormData({
          issuedDate: new Date().toISOString().split("T")[0],
          companyName: "",
          employeeName: "",
          designation: "",
          endDate: "",
          startDate: "",
          hrManagerName: "",
          documentName: "Experience Letter",
        });
      } else {
        toast.error(response.data?.responseMessage || "Failed to add letter");
      }
    } catch (error) {
      console.error("API ERROR:", error);
      console.error("AIP ERROR RESPONSE:", error.response);
      console.error("API ERROR DATA:", error.response?.data);

      toast.error(
        error.response?.data?.responseMessage ||
          error.response?.data?.message ||
          "Something went wrong while adding experience letter",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MainPanel>
        <div className="experienceletter-parent parent">
          <div className="experienceletter-cont cont">
            <form className="left-experience" onSubmit={handleSubmit}>
              <Input
                label="Experience-Letter Date"
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
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
              />
              <Input
                label="Joining Date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                type="date"
                required
              />
              <Input
                label="Relieving Date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                type="date"
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
            <div className="right-experience">
              <div className="experience-pdf-page">
                <img
                  className="leftcorner"
                  src={left_corner}
                  alt="left-corner"
                />
                <img className="pan-water-mark" src={PanLogo} alt="PanLogo" />
                <div className="top">
                  <div className="date">Date:01-03-19</div>
                  <div className="logo">
                    <img src={logo_pan} alt="OfferLogoPan" />
                  </div>
                </div>
                <div className="heading">
                  <h3>Experience Letter</h3>
                </div>
                <div className="name">
                  <p>Dear</p>
                  <h4>KARTIK HATTE</h4>
                </div>
                <div className="gap"></div>
                <p>
                  This is to certify that Kartik Hatte was employed with{" "}
                  <strong>Pandoza Solutions Pvt. Ltd.</strong> as a Software
                  Developer from <strong>01-03-2023</strong> to{" "}
                  <strong>25-08-2026</strong>.
                </p>
                <div className="gap"></div>
                <p>
                  During his tenure with the organization, he was responsible
                  for carrying out his assigned duties and responsibilities
                  efficiently and professionally.
                </p>
                <div className="gap"></div>
                <p>
                  We found him to be sincere, hardworking, dedicated, and
                  committed towards his work. His conduct and performance during
                  his employment were satisfactory.
                </p>
                <div className="gap"></div>
                <p>
                  We truly appreciate your performance and look forward to your
                  continued contribution to the growth and success of
                  <strong>Pandoza Solutions Pvt. Ltd.</strong>
                </p>
                <div className="gap"></div>
                <p>We wish him all the very best for his future endeavors.</p>

                <div className="gap"></div>

                <div className="gap"></div>
                <p>Thanking you,</p>
                <p>Sincerely</p>
                <h4>For Pandoza Solutions Pvt. Ltd.. </h4>
                <div className="gap"></div>
                <div className="gap"></div>
                <div className="gap"></div>
                <div className="gap"></div>
                <p>Hr Admin & Finance</p>
                <p>Gaurav Ukinkar</p>

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

export default ExperienceLetter;
