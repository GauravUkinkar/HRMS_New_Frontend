import { useEffect, useState } from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import "./PromotionLetter.scss";
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

const PromotionLetter = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    issuedDate: new Date().toISOString().split("T")[0],
    companyName: "",
    employeeName: "",
    designation: "",
    newDesignation: "",
    startDate: "",
    hrManagerName: "",
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
        designation: "",
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      employeeName: selectedEmployee.employeeName,
      designation: selectedEmployee.designation || "",
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
        newDesignation: formData.newDesignation,
        startDate: formData.startDate,
        hrManagerName: formData.hrManagerName,
        documentName: "Promotion Letter",
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
        toast.success("Promotion letter added successfully!");

        setFormData({
          issuedDate: new Date().toISOString().split("T")[0],
          companyName: "",
          employeeName: "",
          designation: "",
          newDesignation: "",
          startDate: "",
          hrManagerName: "",
          documentName: "Promotion Letter",
        });
      } else {
        toast.error(
          response.data?.responseMessage || "Failed to add promotion letter",
        );
      }
    } catch (error) {
      console.error("API ERROR:", error);
      console.error("API ERROR RESPONSE:", error.response);
      console.error("API ERROR DATA:", error.response?.data);

      toast.error(
        error.response?.data?.responseMessage ||
          error.response?.data?.message ||
          "Something went wrong while adding promotion letter",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MainPanel>
        <div className="promotionletter-parent parent">
          <div className="promotionletter-cont cont">
            <form className="left-promotion" onSubmit={handleSubmit}>
              <Input
                label="Promotion-Letter Date"
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
                name="employeeName"
                value={formData.employeeName}
                onChange={handleEmployeeChange}
                label="Employee Name"
                required
              >
                {employeeLoading ? (
                  <MenuItem disabled>Loading employees...</MenuItem>
                ) : employee.length > 0 ? (
                  employee.map((emp, index) => (
                    <MenuItem
                      key={emp.employeeId || emp.uid || index}
                      value={emp.employeeName}
                    >
                      {emp.employeeName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No employees found</MenuItem>
                )}
              </SelectInput>
              <Input
                label="Previous Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
              />
              <Input
                label="New Designation"
                name="newDesignation"
                value={formData.newDesignation}
                onChange={handleChange}
                required
              />
              <Input
                label="Promotion Effective Date"
                type="date"
                name="startDate"
                value={formData.startDate}
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
                {loading ? "Submitting.." : "Submit"}
              </button>
            </form>
            <div className="right-promotion">
              <div className="promotion-pdf-page">
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
                  <h3>Promotion Letter</h3>
                </div>
                <div className="name">
                  <p>Dear</p>
                  <h4>KARTIK HATTE</h4>
                </div>
                <div className="gap"></div>
                <p>
                  We are pleased to inform you that, in recognition of your
                  performance, dedication, and contribution to the organization,
                  you have been{" "}
                  <strong>
                    promoted to the position of Senior Software Developer
                  </strong>{" "}
                  at <strong>Pandoza Solutions Pvt. Ltd.</strong>, effective
                  from <strong>25-08-2026</strong>.
                </p>
                <div className="gap"></div>
                <p>
                  During your tenure with the organization, you have
                  consistently demonstrated professionalism, commitment, and a
                  strong sense of responsibility towards your assigned duties.
                </p>
                <div className="gap"></div>
                <p>
                  We appreciate your valuable contributions and are confident
                  that you will continue to perform with the same dedication and
                  commitment in your new role.
                </p>
                <div className="gap"></div>
                <p>
                  We wish you continued success and growth in your career with
                  <strong>Pandoza Solutions Pvt. Ltd.</strong>
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

export default PromotionLetter;
