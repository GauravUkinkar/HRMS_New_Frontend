import React, { useEffect, useState } from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import "./ReleavingLetter.scss";
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

const ReleavingLetter = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    issuedDate: new Date().toISOString().split("T")[0],
    companyName: "",
    employeeName: "",
    designation: "",
    dateOfJoining: "",
    endDate: "",
    hrManagerName: "",
    salary: "",
    gender: "",
    employeeType: "",
  });

  const [employee, setEmployee] = useState([]);
  const [employeeLoading, setEmployeeLoading] = useState(false);

  useEffect (() => {
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

          console.log("EMPOLYEE LIST:", employeeList);
          console.log(
            "EMPLOYEE LIST JSON:",
            JSON.stringify(employeeList, null, 2),
          );

          setEmployee(employeeList);
        } else {
          setEmployee([]);
          toast.error(response.data?.responseMessage || "No employees found");

        }
      } catch (error)
    }
  })
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
        dateOfJoining: formData.dateOfJoining,
        hrManagerName: formData.hrManagerName,
        salary: Number(formData.salary),
        gender: formData.gender,
        employeeType: formData.employeeType,
        documentName: "Relieving Letter",
      };
      console.log("API URL:", `${BASE_URL}Admin/addOfficialLetter`);
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
          
            "Releaving letter added successfully!",
        );
        setFormData({
          issuedDate: new Date().toISOString().split("T")[0],
          companyName: "",
          employeeName: "",
          designation: "",
          endDate: "",
          dateOfJoining: "",
          hrManagerName: "",
          salary: "",
          gender: "",
          employeeType: "",
          documentName: "Releaving Letter",
        });
      } else {
        toast.error(
          response.data?.responseMessage || "Failed to add Releaving letter",
        );
      }
    } catch (error) {
      console.error("API ERROR:", error);
      console.error("API ERROR RESPONSE:", error.response);
      console.error("API ERROR DATA:", error.response?.data);

      toast.error(
        error.response?.data?.responseMessage ||
          error.response?.data?.message ||
          "Something went wrong while adding releaving letter",
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
                label="Select Company Name"
                value={formData.companyName}
                onChange={handleChange}
                required
              >
                <MenuItem value="The Indian Journey">
                  The Indian Journey
                </MenuItem>
                <MenuItem value="Pandoza Solutions Pvt.Ltd.">
                  Pandoza Solutions Pvt.Ltd.
                </MenuItem>
                <MenuItem value="Akka Foundation">Akka Foundation</MenuItem>
                <MenuItem value="Nvm Infratech Pvt.Ltd">
                  Nvm Infratech Pvt.Ltd
                </MenuItem>
              </SelectInput>

              <Input
                label="Employee Name"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                required
              />
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
                {loading ? "Submitting..." :"Submit"}
               
              </button>
            </form>
            <div className="right-releaving">
              <div className="releaving-pdf-page">
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
                  <h3>Releaving Letter</h3>
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
                  We hereby confirm that he has been relieved from his duties
                  with the organization with effect from{" "}
                  <strong>25-08-2026</strong>, after completing all the required
                  formalities and handing over his responsibilities
                </p>
                <div className="gap"></div>
                <p>
                  During his tenure with the organization, his conduct and
                  performance were found to be satisfactory.
                </p>
                <div className="gap"></div>
                <p>
                  We appreciate his contributions to the organization and wish
                  him all the very best in his future endeavors.
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

export default ReleavingLetter;
