import React from "react";
import "./OtpVerification.scss";
import Logo from "../../assets/PandozaLogo.png";
import otpimage from "../../assets/rightimg.webp";
import OTPInput from "react-otp-input";
import { Link } from "react-router-dom";

const OtpVerification = () => {
const VerifyOTP = () => {
  const formObj = {
    otp: "",
  };

  const { getEmpDetails, setLoader } = useContext(UserContext);
  const navigate = useNavigate();

  const verifyOtp = async () => {
    try {
      setLoader(true);

      const response = await api.post(
        "AuthController/VerifyOtp", 
        values
      );

      if (response.status === 200) {
        toast.success("OTP Verified Successfully");

        localStorage.setItem("LoggedIn", true);

        getEmpDetails();

     
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "OTP Verification Failed"
      );
    } finally {
      setLoader(false);
    }
  };

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    error,
  } = UseForm(formObj, otpValidate, verifyOtp);
  return (
    <>
      <div className="verification-parent parent">
        <div className="verification-cont cont">
          <div className="left">
            <div className="logo">
              <img src={Logo} alt="Logo" />
            </div>
            <div className="des">
              <h1>Enter OTP</h1>
              <p>
                Please enter the 6-digit One Time <br /> Password sent to your
                email <br />
                <p className="mail">admin@gmail.com</p>
              </p>
            </div>

            <div className="otp-container">
              <OTPInput
                numInputs={6}
                renderInput={(props) => (
                  <input style={{ width: "48px" }} {...props} />
                )}
              />
            </div>
            <Link className="btn" to="/changepass">
              Verify OTP
            </Link>
            <div className="links">
              <Link>Resend OTP</Link>
              <Link>Back to Login</Link>
            </div>
          </div>
          <div className="right">
            <img src={otpimage} alt="otpimage" />
          </div>
        </div>
      </div>
    </>
  );
};

export default OtpVerification;
