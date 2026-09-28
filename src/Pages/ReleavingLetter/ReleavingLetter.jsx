import React, { useContext, useEffect, useState } from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import { UserContext } from "../../../Context";
import "./ReleavingLetter.scss";
import { FaGlobe, FaLocationDot, FaPhoneVolume } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { IoIosMail } from "react-icons/io";
import Input from "../../comp/input/Input";
import { MenuItem } from "@mui/material";
import SelectInput from "../../comp/selectInput/SelectInput";

import PanLogo from "../../assets/pan-watermark.webp";
import logo_pan from "../../assets/offer-logo-pan.png";

import indianJourneyWatermark from "../../assets/tij-watermark.png";
import indianJourneyLogo from "../../assets/tij-logo.png";

import akkaWatermark from "../../assets/akka-foundation.png";
import akkaLogo from "../../assets/akka-foundation.png";

import nvmWatermark from "../../assets/nvm-watermark.png";
import nvmLogo from "../../assets/nvm-logo.png";

import right_corner from "../../assets/right-corner.png";
import left_corner from "../../assets/left-corner.png";

import axios from "axios";
import { toast } from "react-toastify";

const companyConfig = {
  "The Indian Journey": {
    logo: indianJourneyLogo,
    watermark: indianJourneyWatermark,
    address: "214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014",
    contact: "+91 76666 01972",
    location: "Pune",
    email: "info@pandozasolutions.com",
  },

  "Pandoza Solutions Pvt.Ltd": {
    logo: logo_pan,
    watermark: PanLogo,
    address: "214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014",
    contact: "+91 76666 01972",
    location: "Pune",
    email: "info@pandozasolutions.com",
  },

  "Akka Foundation": {
    logo: akkaLogo,
    watermark: akkaWatermark,
    address: "214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014",
    contact: "+91 76666 01972",
    location: "Pune",
    email: "info@pandozasolutions.com",
  },

  "Nvm Infratech Pvt.Ltd": {
    logo: nvmLogo,
    watermark: nvmWatermark,
    address: "214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014",
    contact: "+91 76666 01972",
    location: "Pune",
    email: "info@pandozasolutions.com",
  },
};

const ReleavingLetter = () => {
  const { user } = useContext(UserContext);
  console.log("USER CONTEXT DATA:", user);
  const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [employeeLoading, setEmployeeLoading] = useState(false);

  const [formData, setFormData] = useState({
    issuedDate: new Date().toISOString().split("T")[0],
    companyName: "",
    employeeName: "",
    designation: "",
    dateOfJoining: "",
    endDate: "",
    hrManagerName: "",
  });

  const selectedCompany =
    companyConfig[formData.companyName] ||
    companyConfig["Pandoza Solutions Pvt.Ltd"];

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
            "Unable to fetch employee",
        );
      } finally {
        setEmployeeLoading(false);
      }
    };

    getEmployeesByCompany();
  }, [formData.companyName, BASE_URL]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "";
    }

    return date.toISOString().split("T")[0];
  };

  const formatPreviewDate = (date) => {
    if (!date) return "DD-MM-YYYY";

    const parts = date.split("-");

    if (parts.length !== 3) {
      return date;
    }

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const handleEmployeeChange = (e) => {
    const employeeName = e.target.value;

    const selectedEmployee = employee.find(
      (emp) => emp.employeeName === employeeName,
    );

    console.log(
      "SELECTED EMPLOYEE JSON:",
      JSON.stringify(selectedEmployee, null, 2),
    );

    console.log("UID:", selectedEmployee?.uid);
    console.log("EMPLOYEE TYPE:", selectedEmployee?.employeeType);
    console.log("DEPARTMENT:", selectedEmployee?.department);
    console.log("GENDER:", selectedEmployee?.gender);
    console.log("SALARY:", selectedEmployee?.salary);

    if (!selectedEmployee) {
      setFormData((prev) => ({
        ...prev,
        employeeName: "",
        designation: "",
        dateOfJoining: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      employeeName: selectedEmployee.employeeName || "",
      designation: selectedEmployee.designation || "",
      dateOfJoining: formatDateForInput(selectedEmployee.dateOfJoining) || "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "companyName") {
      setFormData((prev) => ({
        ...prev,
        companyName: value,
        employeeName: "",
        designation: "",
        dateOfJoining: "",
        endDate: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const selectedEmployee = employee.find(
      (emp) => emp.employeeName === formData.employeeName
    );

    if (!selectedEmployee) {
      toast.error("Please select an employee");
      return;
    }

    const payload = {
      issuedDate: formData.issuedDate,
      companyName: formData.companyName,
      employeeName: formData.employeeName,
      designation: formData.designation,
      department: selectedEmployee?.department || null,
      hrManagerName: formData.hrManagerName,
      salary: Number(selectedEmployee?.salary) || 0,
      gender: selectedEmployee?.gender || null,
      employeeType: selectedEmployee?.employeeType || null,
      documentName: "Relieving Letter",
      uid: selectedEmployee?.uid,
      dateOfjoining: formData.dateOfJoining,
      endDate: formData.endDate,
      newDesignation: null,
      terminationType: null,
      worningType: null,
      documentUrl: null,
    };

    console.log(
      "RELIEVING LETTER PAYLOAD:",
      JSON.stringify(payload, null, 2)
    );

    const requestData = new FormData();

    // Backend expects @RequestPart("data")
    requestData.append("data", JSON.stringify(payload));

    // No file is required because backend has required = false

    const response = await axios.post(
      `${BASE_URL}Admin/addOfficialLetter`,
      requestData,
      {
        withCredentials: true,
      }
    );

    console.log(
      "ADD OFFICIAL LETTER RESPONSE:",
      response.data
    );

    if (response.data?.HttpStatus === "OK") {
      toast.success("Relieving letter added successfully!");

      setFormData({
        issuedDate: new Date().toISOString().split("T")[0],
        companyName: "",
        employeeName: "",
        designation: "",
        dateOfJoining: "",
        endDate: "",
        hrManagerName: "",
      });
    } else {
      toast.error(
        response.data?.message ||
          response.data?.responseMessage ||
          "Failed to add relieving letter"
      );
    }
  } catch (error) {
    console.error("ADD OFFICIAL LETTER ERROR:", error);
    console.error("STATUS:", error.response?.status);
    console.error("RESPONSE:", error.response?.data);

    toast.error(
      error.response?.data?.message ||
        error.response?.data?.responseMessage ||
        "Something went wrong while adding relieving letter"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <MainPanel>
        <div className="releavingletter-parent parent">
          <div className="releavingletter-cont cont">
            <form className="left-releaving" onSubmit={handleSubmit}>
              <Input
                label="Releaving-Letter Date"
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

                <MenuItem value="Pandoza Solutions Pvt.Ltd">
                  Pandoza Solutions Pvt.Ltd
                </MenuItem>

                <MenuItem value="Akka Foundation">Akka Foundation</MenuItem>

                <MenuItem value="Nvm Infratech Pvt.Ltd">
                  Nvm Infratech Pvt.Ltd
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
                name="dateOfJoining"
                value={formData.dateOfJoining}
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

            <div className="right-releaving">
              <div className="releaving-pdf-page">
                <img
                  className="leftcorner"
                  src={left_corner}
                  alt="left-corner"
                />

                <img
                  className="pan-water-mark"
                  src={selectedCompany.watermark}
                  alt="Company Watermark"
                />

                <div className="top">
                  <div className="date">
                    Date:
                    {formatPreviewDate(formData.issuedDate)}
                  </div>

                  <div className="logo">
                    <img
                      src={selectedCompany.logo}
                      alt={formData.companyName || "Company Logo"}
                    />
                  </div>
                </div>

                <div className="heading">
                  <h3>Releaving Letter</h3>
                </div>

                <div className="name">
                  <p>Dear</p>

                  <h4>{formData.employeeName || "Employee Name"}</h4>
                </div>

                <div className="gap"></div>

                <p>
                  This is to certify that{" "}
                  <strong>{formData.employeeName || "Employee Name"}</strong>{" "}
                  was employed with{" "}
                  <strong>{formData.companyName || "Company Name"}</strong> as a{" "}
                  <strong>{formData.designation || "Designation"}</strong> from{" "}
                  <strong>{formatPreviewDate(formData.dateOfJoining)}</strong>{" "}
                  to <strong>{formatPreviewDate(formData.endDate)}</strong>.
                </p>

                <div className="gap"></div>

                <p>
                  We hereby confirm that{" "}
                  <strong>{formData.employeeName || "the employee"}</strong> has
                  been relieved from their duties with the organization with
                  effect from{" "}
                  <strong>{formatPreviewDate(formData.endDate)}</strong>, after
                  completing all the required formalities and handing over their
                  responsibilities.
                </p>

                <div className="gap"></div>

                <p>
                  During their tenure with the organization, their conduct and
                  performance were found to be satisfactory.
                </p>

                <div className="gap"></div>

                <p>
                  We appreciate their contributions to{" "}
                  <strong>{formData.companyName || "the organization"}</strong>{" "}
                  and wish them all the very best in their future endeavors.
                </p>

                <div className="gap"></div>

                <p>Thanking you,</p>

                <p>Sincerely</p>

                <h4>For {formData.companyName || "Company Name"}</h4>

                <div className="gap"></div>
                <div className="gap"></div>
                <div className="gap"></div>
                <div className="gap"></div>

                <p>Hr Admin & Finance</p>

                <p>{formData.hrManagerName || "HR Manager"}</p>

                <div className="footer">
                  <Link
                    className="left"
                    to="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="icon">
                      <FaLocationDot />
                    </div>

                    <div className="address">
                      <h4>{formData.companyName || "Company Name"}</h4>

                      <p>
                        {selectedCompany.address}
                        <br />
                        CONTACT: {selectedCompany.contact}
                      </p>
                    </div>
                  </Link>

                  <div className="right">
                    <Link
                      className="contact"
                      to="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <div className="icon">
                        <FaPhoneVolume />
                      </div>

                      <p>{selectedCompany.contact}</p>
                    </Link>

                    <Link
                      className="mail"
                      to="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <div className="icon">
                        <IoIosMail />
                      </div>

                      <p>{selectedCompany.email}</p>
                    </Link>

                    <Link
                      className="globe"
                      to="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <div className="icon">
                        <FaGlobe />
                      </div>

                      <p>{selectedCompany.location}</p>
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

export default ReleavingLetter;
