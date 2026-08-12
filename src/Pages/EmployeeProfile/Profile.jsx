import React, { useEffect, useState } from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import "./Profile.scss";
import img1 from "../../assets/manuser.webp";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { Link } from "react-router-dom";
import { SlDocs } from "react-icons/sl";
import { MdOutlineEditNote } from "react-icons/md";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;
const Profile = () => {
    const [loader, setLoader] = useState(false);

    // Sensitive information visibility
    const [showAadhar, setShowAadhar] = useState(false);
    const [showPan, setShowPan] = useState(false);
    const [showAccount, setShowAccount] = useState(false);
    const [showSalary, setShowSalary] = useState(false);
    const [showPackage, setShowPackage] = useState(false);

    // For Employee
    const [employeeprofile, setEmployeeProfile] = useState([]);
    // Mask function
    const maskValue = (value, visibleCount = 4) => {
        if (!value) return "";

        if (value.length <= visibleCount) {
            return value;
        }

        return "*".repeat(value.length - visibleCount) + value.slice(-visibleCount);
    };

    // Reusable sensitive value component
    const SensitiveValue = ({ value, show, setShow }) => {
        return (
            <span className="sensitive-value">
                <span className="sensitive-text">
                    {show ? value : maskValue(value)}
                </span>

                <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShow(!show)}
                    aria-label={show ? "Hide value" : "Show value"}
                >
                    {show ? <IoIosEyeOff /> : <IoIosEye />}
                </button>
            </span>
        );
    };
    const getEmployee = async () => {
        try {
            const res = await axios.get(`${BASE_URL}Admin/GetEmployee//${employeeId}`,
                {
                    withCredentials: true,
                }
            );
            console.log(res.data,"lkjsdfjsdfjkjkdfskjdfsljdkfs");
        } catch (error) {
            console.log(error);

        }
    }
useEffect(()=>{
    getEmployee();
},[]);

    return (
        <>
            <MainPanel title="Admin Dashboard">

                {loader && <p>loading.....</p>}

                <div className="bottom-side">

                    {/* LEFT SIDE */}
                    <div className="left-side">

                        <div className="img-group">

                            <img
                                src={img1}
                                alt="Employee Image"
                            />

                            <div className="emp-name">
                                Sunil Shelke
                            </div>

                            <div className="job-desc">
                                WEBSITE DEVELOPER
                            </div>

                            <div className="btn-group">
                                <div className="eid">
                                    PSPL112233
                                </div>

                                <div className="status">
                                    ACTIVE
                                </div>
                            </div>

                        </div>

                        <div className="status-content">

                            <div className="row-one">
                                <p className="label">
                                    Employment Type
                                </p>

                                <span>:</span>

                                <p className="value">
                                    Full Time
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Company Name
                                </p>

                                <span>:</span>

                                <p className="value">
                                    Pandoza Solutions Pvt Ltd.
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Department
                                </p>

                                <span>:</span>

                                <p className="value">
                                    Technical
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Date Of Joining
                                </p>

                                <span>:</span>

                                <p className="value">
                                    1 Apr 2022
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Contact Number
                                </p>

                                <span>:</span>

                                <p className="value">
                                    <a href="tel:+917083445507">
                                        7083445507
                                    </a>
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Email Id
                                </p>

                                <span>:</span>

                                <p className="value">
                                    <a href="mailto:shelkesunil072@gmail.com">
                                        shelkesunil072@gmail.com
                                    </a>
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Date Of Birth
                                </p>

                                <span>:</span>

                                <p className="value">
                                    1 Jan 1998
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Gender
                                </p>

                                <span>:</span>

                                <p className="value">
                                    Male
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Blood Group
                                </p>

                                <span>:</span>

                                <p className="value">
                                    B+ve
                                </p>
                            </div>

                        </div>

                        <div className="btn-groups">
                            <Link to="#"><SlDocs /><span>View Document</span></Link>
                            <Link to="#"><MdOutlineEditNote /> <span>Edit Details</span></Link>
                        </div>

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="right-side">

                        {/* PERSONAL DETAILS */}
                        <div className="personal-details">

                            <div className="heading">
                                Personal Details
                            </div>

                            {/* AADHAAR */}
                            <div className="row-one">

                                <p className="label">
                                    Aadhaar Card Number
                                </p>

                                <span>:</span>

                                <p className="value">
                                    <SensitiveValue
                                        value="543694185005"
                                        show={showAadhar}
                                        setShow={setShowAadhar}
                                    />
                                </p>

                            </div>

                            {/* PAN */}
                            <div className="row-one">

                                <p className="label">
                                    PAN Card Number
                                </p>

                                <span>:</span>

                                <p className="value">
                                    <SensitiveValue
                                        value="KEDPS6754F"
                                        show={showPan}
                                        setShow={setShowPan}
                                    />
                                </p>

                            </div>

                            {/* CURRENT ADDRESS */}
                            <div className="row-one">

                                <p className="label">
                                    Current Address
                                </p>

                                <span>:</span>

                                <p className="value">
                                    <a
                                        href="https://www.google.com/maps/search/?api=1&query=Ahilyanagar%2C%20Maharashtra%2C%20India"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Lorem ipsum dolor sit amet
                                        consectetur adipisicing elit.
                                    </a>
                                </p>

                            </div>

                            {/* PERMANENT ADDRESS */}
                            <div className="row-one">

                                <p className="label">
                                    Permanent Address
                                </p>

                                <span>:</span>

                                <p className="value">
                                    <a
                                        href="https://www.google.com/maps/search/?api=1&query=Ahilyanagar%2C%20Maharashtra%2C%20India"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Lorem ipsum dolor sit amet
                                        consectetur adipisicing elit.
                                    </a>
                                </p>

                            </div>

                        </div>

                        {/* EMERGENCY DETAILS */}
                        <div className="emergency-details">

                            <div className="heading">
                                Emergency Contact Details
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Contact Name
                                </p>

                                <span>:</span>

                                <p className="value">
                                    Lorem, ipsum.
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Contact Person Number
                                </p>

                                <span>:</span>

                                <p className="value">
                                    <a href="tel:+917878745896">
                                        +91 7878745896
                                    </a>
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Contact Person Relation
                                </p>

                                <span>:</span>

                                <p className="value">
                                    Friend
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Current Address
                                </p>

                                <span>:</span>

                                <p className="value">
                                    <a
                                        href="https://www.google.com/maps/search/?api=1&query=Ahilyanagar%2C%20Maharashtra%2C%20India"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Lorem ipsum dolor sit amet
                                        consectetur adipisicing elit.
                                    </a>
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Permanent Address
                                </p>

                                <span>:</span>

                                <p className="value">
                                    <a
                                        href="https://www.google.com/maps/search/?api=1&query=Ahilyanagar%2C%20Maharashtra%2C%20India"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Lorem ipsum dolor sit amet
                                        consectetur adipisicing elit.
                                    </a>
                                </p>
                            </div>

                        </div>

                        {/* SALARY DETAILS */}
                        <div className="salary-details">

                            <div className="heading">
                                Bank or Salary Details
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Bank Name
                                </p>

                                <span>:</span>

                                <p className="value">
                                    State Bank Of India
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Bank IFSC Code
                                </p>

                                <span>:</span>

                                <p className="value">
                                    SBI0029
                                </p>
                            </div>

                            {/* ACCOUNT NUMBER */}
                            <div className="row-one">

                                <p className="label">
                                    Account Number
                                </p>

                                <span>:</span>

                                <p className="value">

                                    <SensitiveValue
                                        value="123456789012"
                                        show={showAccount}
                                        setShow={setShowAccount}
                                    />

                                </p>

                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Monthly Salary
                                </p>

                                <span>:</span>

                                <p className="value">
                                    <SensitiveValue
                                        value="₹40,000.00"
                                        show={showSalary}
                                        setShow={setShowSalary}
                                    />
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Yearly Package
                                </p>

                                <span>:</span>

                                <p className="value">
                                    <SensitiveValue
                                        value="4.8 LPA"
                                        show={showPackage}
                                        setShow={setShowPackage}
                                    />
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </MainPanel>
        </>
    );
};

export default Profile;