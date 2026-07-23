import React from "react";
import "./OtpVerification.scss";
import Logo from "../../assets/PandozaLogo.png"

const OtpVerification = () => {
  return (
    <>
      <div className="verification-parent parent">
        <div className="verification-cont cont">
          <div className="left">
            <div className="logo">
              <img src={Logo} alt="Logo" />
            </div>
            <h1>OTP VERIFICATION</h1>
            <p>Please enter the 6-digit One Time <br/> Password sent to your email</p>
          </div>
          <div className="right"></div>
        </div>
      </div>
    </>
  );
};

export default OtpVerification;
