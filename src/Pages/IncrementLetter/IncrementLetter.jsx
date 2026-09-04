import React, { useEffect, useState } from "react";
import "./IncrementLetter.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import Input from "../../comp/input/Input";
import { MenuItem } from "@mui/material";
import SelectInput from "../../comp/selectInput/SelectInput";
import PanLogo from "../../assets/pan-watermark.webp";
import logo_pan from "../../assets/offer-logo-pan.png";
import right_corner from "../../assets/right-corner.png";
import left_corner from "../../assets/left-corner.png";
import { FaLocationDot } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { FaPhoneVolume } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { FaGlobe } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const IncrementLetter = () => {
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
    salary: "",
    costtoCompany: "",
    designation: "",
    incrementPercentage: "",
    reviseCts: "",
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
        }
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
          JSON.stringify(employeeList, null, 2)
        );

        setEmployee(employeeList);
      } else {
        setEmployee([]);

        toast.error(
          response.data?.responseMessage || "No employees found"
        );
      }
    } catch (error) {
      console.error("Get Employees By Company Error:", error);
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);

      setEmployee([]);

      toast.error(
        error.response?.data?.responseMessage ||
          error.response?.data?.message ||
          "Unable to fetch employees"
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
        costtoCompany: "",
        salary: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      employeeName: selectedEmployee.employeeName,
      employeeId: selectedEmployee.employeeId,
      designation: selectedEmployee.designation || "",
      costtoCompany: selectedEmployee.costtoCompany || "",
      salary: selectedEmployee.employeeSalary || "",
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
        salary: Number(formData.salary),
        incrementPercentage: formData.incrementPercentage,
        reviseCts: formData.reviseCts,
      };
      console.log("API PAYLOAD:", payload);

      const response = await axios.post(
        `${BASE_URL}Admin/addIncreamentLetter`,
        payload,
        {
          withCredentials: true,
        },
      );

      console.log("API RESPONSE:", response);

      if (response.data?.status === "OK") {
        toast.success(
          response.data?.responseMessage ||
            "Increment letter added successfully!",
        );

        setFormData({
          issuedDate: new Date().toISOString().split("T")[0],
          companyName: "",
          employeeName: "",
          effectiveDate: "",
          hrManagerName: "",
          salary: "",
          incrementPercentage: "",
          reviseCts: "",
        });
      } else {
        toast.error(
          response.data?.responseMessage || "Failed to add increament letter",
        );
      }
    } catch (error) {
      console.error("API ERROR:", error);
      console.error("API ERROR RESPONSE:", error.response);
      console.error("API ERROR DATA:", error.response?.data);

      toast.error(
        error.response?.data?.responseMessage ||
          error.response?.data?.message ||
          "Something went wrong while adding increament letter",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MainPanel>
        <div className="incrementletter-parent parent">
          <div className="incrementletter-cont cont">
            <form className="left-increment" onSubmit={handleSubmit}>
              <Input
                label="Increament-Letter Date"
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

  <MenuItem value="Akka Foundation">
    Akka Foundation
  </MenuItem>

  <MenuItem value="Nvm Infratech Pvt Ltd">
    Nvm Infratech Pvt Ltd
  </MenuItem>
</SelectInput>
              <Input
                label="Effective Date"
                type="date"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleChange}
                required
              />
<SelectInput
  label="Employee Name"
  name="employeeName"
  value={formData.employeeName}
  onChange={handleEmployeeChange}
  required
>
  {employeeLoading ? (
    <MenuItem disabled>
      Loading employees...
    </MenuItem>
  ) : employee.length === 0 ? (
    <MenuItem disabled>
      No employees found
    </MenuItem>
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
                label="Salary"
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
              />
              <Input
                label="Previous CTC"
                name="costtoCompany"
                type="number"
                value={formData.costtoCompany}
                onChange={handleChange}
                required
           
              />
              <Input
                label="Increment Percentage"
                name="incrementPercentage"
                value={formData.incrementPercentage}
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
              <Input
                label="Revised CTC"
                name="reviseCts"
                value={formData.reviseCts}
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
            <div className="right-increment">
              <div className="increment-pdf-page">
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
                  <h3>Increment Letter</h3>
                </div>
                <div className="name">
                  <p>Dear</p>
                  <h4>KARTIK HATTE</h4>
                </div>
                <div className="gap"></div>
                <p>
                  We are pleased to inform you that, in recognition of your
                  continued hard work, dedication and valuable contributions to
                  <strong>Pandoza Solutions Pvt. Ltd.</strong> , your
                  compensation has been revised.
                </p>
                <div className="gap"></div>
                <p>
                  With effect from 01-03-19, your annual CTC has been revised
                  from <strong>₹6,00,000 to ₹6,60,000,</strong> representing an
                  increment of <strong>10%</strong>. The revised compensation
                  will be applicable from the effective date mentioned above.
                </p>
                <div className="gap"></div>
                <p>
                  All other terms and conditions of your employment remain
                  unchanged.
                </p>
                <div className="gap"></div>
                <p>
                  We truly appreciate your performance and look forward to your
                  continued contribution to the growth and success of
                  <strong>Pandoza Solutions Pvt. Ltd.</strong>
                </p>
                <div className="gap"></div>
                <p>
                  Congratulations and best wishes for your future endeavors!
                </p>

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

export default IncrementLetter;
