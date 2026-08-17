import React, { useEffect, useState } from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import "./Profile.scss";
import maleUser from "../../assets/manuser.webp";
import femaleUser from "../../assets/women_user.png"
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import { SlDocs } from "react-icons/sl";
import { MdOutlineEditNote } from "react-icons/md";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;
const Profile = () => {
    const [loader, setLoader] = useState(false);

    // Sensitive information visibility
    const [showAadhar, setShowAadhar] = useState(false);
    const [showPan, setShowPan] = useState(false);
    const [showUan, setShowUan] = useState(false);
    const [showAccount, setShowAccount] = useState(false);
    const [showSalary, setShowSalary] = useState(false);
    const [showPackage, setShowPackage] = useState(false);
    const [showPolicy, setShowPolicy] = useState(false);
    const [showEsic, setShowEsic] = useState(false);

    // For Employee
    const { employeeId } = useParams();
    const [employeeprofile, setEmployeeProfile] = useState();
    const [imageError, setImageError] = useState(false);
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
            const res = await axios.get(
                `${BASE_URL}Admin/GetEmployeeById/${employeeId}`,
                { withCredentials: true });

            console.log("Employee Details:", res.data);
            setEmployeeProfile(res.data?.data);
            setImageError(false);
        } catch (error) {
            console.log(
                error.response?.data || error
            );
        }
    };
    useEffect(() => {
        if (employeeId) {
            getEmployee();
        }
    }, [employeeId]);

    return (
        <>
            <MainPanel title="Admin Dashboard">
                {loader && <p>loading.....</p>}
                <div className="bottom-side">

                    {/* LEFT SIDE */}
                    <div className="left-side">
                        <div className="img-group">
                            <img
                                src={
                                    !imageError && employeeprofile?.image
                                        ? employeeprofile.image
                                        : employeeprofile?.gender?.toLowerCase() === "female"
                                            ? femaleUser
                                            : maleUser
                                }
                                alt={employeeprofile?.employeeName || "Employee"}
                                onError={() => setImageError(true)}
                            />

                            <div className="emp-name">
                                {employeeprofile?.employeeName || "N/A"}
                            </div>

                            <div className="job-desc">
                                {employeeprofile?.designation || "N/A"}
                            </div>

                            <div className="btn-group">
                                <div className="eid">
                                    {employeeprofile?.employeeId || "N/A"}
                                </div>


                                <div
                                    className={`status ${employeeprofile?.employeeStatus?.toLowerCase() !== "active"
                                        ? "inactive"
                                        : ""
                                        }`}
                                >
                                    {employeeprofile?.employeeStatus || "N/A"}

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
                                    {employeeprofile?.companyName || "N/A"}
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Department
                                </p>

                                <span>:</span>

                                <p className="value">
                                    {employeeprofile?.department || "N/A"}
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Date Of Joining
                                </p>
                                <span>:</span>

                                <p className="value">
                                    {employeeprofile?.dateOfJoining || "N/A"}
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Contact Number
                                </p>
                                <span>:</span>
                                <p className="value">
                                    <a href={`tel:${employeeprofile?.contactNumber}`}>
                                        {employeeprofile?.contactNumber || "N/A"}
                                    </a>
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Date Of Birth
                                </p>

                                <span>:</span>

                                <p className="value">
                                    {employeeprofile?.dateOfBirth || "N/A"}
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Gender
                                </p>
                                <span>:</span>
                                <p className="value">
                                    {employeeprofile?.gender || "N/A"}
                                </p>
                            </div>
                            <div className="row-one">
                                <p className="label">
                                    Blood Group
                                </p>
                                <span>:</span>
                                <p className="value">
                                    {employeeprofile?.bloodGroup || "N/A"}
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

                            {/* Email ID */}
                            <div className="row-one">

                                <p className="label">Email Id</p>
                                <span className="coma">:</span>
                                <p className="value">
                                    <a href={`mailto:${employeeprofile?.email}`}>
                                        {employeeprofile?.email || "N/A"}
                                    </a>
                                </p>
                            </div>

                            {/* AADHAAR */}
                            <div className="row-one">

                                <p className="label">
                                    Aadhaar Card Number
                                </p>

                                <span className="coma">:</span>

                                <p className="value">
                                    <SensitiveValue
                                        value={employeeprofile?.aadharNumber || "N/A"}
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

                                <span className="coma">:</span>

                                <p className="value">
                                    <SensitiveValue
                                        value={employeeprofile?.panNumber}
                                        show={showPan}
                                        setShow={setShowPan}
                                    />
                                </p>

                            </div>

                            {/* UAN Number */}
                            <div className="row-one">

                                <p className="label">
                                    UAN Number
                                </p>

                                <span className="coma">:</span>

                                <p className="value">
                                    <SensitiveValue
                                        value={employeeprofile?.uanNo}
                                        show={showUan}
                                        setShow={setShowUan}
                                    />
                                </p>

                            </div>

                            {/* CURRENT ADDRESS */}
                            <div className="row-one">

                                <p className="label">
                                    Current Address
                                </p>

                                <span className="coma">:</span>

                                <p className="value">
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                            employeeprofile?.currentAddress || ""
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {employeeprofile?.currentAddress || "N/A"}
                                    </a>
                                </p>

                            </div>

                            {/* PERMANENT ADDRESS */}
                            <div className="row-one">

                                <p className="label">
                                    Permanent Address
                                </p>

                                <span className="coma">:</span>

                                <p className="value">
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                            employeeprofile?.permanentAddress || ""
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {employeeprofile?.permanentAddress || "N/A"}
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
                                    Name
                                </p>

                                <span className="coma">:</span>

                                <p className="value">
                                    {employeeprofile?.emergencyContactName || "N/A"}
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Number
                                </p>

                                <span className="coma">:</span>

                                <p className="value">
                                    <a href={`tel:${employeeprofile?.emergencyContactNumber}`}>
                                        {employeeprofile?.emergencyContactNumber || "N/A"}
                                    </a>

                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Relation
                                </p>

                                <span className="coma">:</span>

                                <p className="value">
                                    {employeeprofile?.emergencyContactRelation || "N/A"}
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Current Address
                                </p>

                                <span className="coma">:</span>

                                <p className="value">
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                            employeeprofile?.emergencyContactCurrentAddress || ""
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {employeeprofile?.emergencyContactCurrentAddress || "N/A"}
                                    </a>
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Permanent Address
                                </p>

                                <span className="coma">:</span>

                                <p className="value">
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                            employeeprofile?.emergencyContactPermanentAddress || ""
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {employeeprofile?.emergencyContactPermanentAddress || "N/A"}
                                    </a>
                                </p>
                            </div>

                        </div>

                        {/* SALARY DETAILS */}
                        <div className="salary-details">

                            <div className="heading">
                                Bank, Salary & Policy Details
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Bank Name
                                </p>

                                <span className="coma">:</span>

                                <p className="value">
                                    {employeeprofile?.bankName || "N/A"}
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Bank IFSC Code
                                </p>

                                <span className="coma">:</span>

                                <p className="value">
                                    {employeeprofile?.ifscCode || "N/A"}
                                </p>
                            </div>

                            {/* ACCOUNT NUMBER */}
                            <div className="row-one">

                                <p className="label">
                                    Account Number
                                </p>

                                <span className="coma">:</span>

                                <p className="value">

                                    <SensitiveValue
                                        value={employeeprofile?.accountNumber || "N/A"}
                                        show={showAccount}
                                        setShow={setShowAccount}
                                    />

                                </p>

                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Monthly Salary
                                </p>

                                <span className="coma">:</span>

                                <p className="value">
                                    <SensitiveValue
                                        value={`₹${Number(employeeprofile?.employeeSalary || 0).toLocaleString("en-IN")} .00`}
                                        show={showSalary}
                                        setShow={setShowSalary}
                                    />
                                </p>
                            </div>

                            <div className="row-one">
                                <p className="label">
                                    Yearly Package
                                </p>

                                <span className="coma">:</span>

                                <p className="value">
                                    <SensitiveValue
                                        value={`${employeeprofile?.costtoCompany || 0} LPA`}
                                        show={showPackage}
                                        setShow={setShowPackage}
                                    />
                                </p>
                            </div>

                            {/* Policy Number NUMBER */}
                            <div className="row-one">

                                <p className="label">
                                    Policy Number
                                </p>

                                <span className="coma">:</span>

                                <p className="value">

                                    <SensitiveValue
                                        value={employeeprofile?.policyNumber || "N/A"}
                                        show={showPolicy}
                                        setShow={setShowPolicy}
                                    />

                                </p>

                            </div>

                            {/* ESIC NUMBER */}
                            <div className="row-one">

                                <p className="label">
                                    ESIC Number
                                </p>

                                <span className="coma">:</span>

                                <p className="value">

                                    <SensitiveValue
                                        value={employeeprofile?.esicNumber || "N/A"}
                                        show={showEsic}
                                        setShow={setShowEsic}
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