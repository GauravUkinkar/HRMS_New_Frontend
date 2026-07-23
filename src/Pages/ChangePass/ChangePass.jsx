import React from "react";
import "./ChangePass.scss";
import Logo from "../../assets/logo.png";
import otpimage from "../../assets/otpimage.png";
import Input from "../../comp/input/Input";
import { Link } from "react-router-dom";

const ChangePass = () => {
  return (
    <>
      <div className="verification-parent parent">
        <div className="verification-cont cont">
          <div className="left">
            <div className="logo">
              <img src={Logo} alt="Logo" />
            </div>
            <h1>Change Password</h1>
            <p>
              Please enter the 6-digit One Time <br /> Password sent to your
              email <br />
              <p className="mail">admin@gmail.com</p>
            </p>
            <div className="inputs">
               

                <div className="form-row">
                    <Input
                    text_color="white"
                    type="password"
                    fc_color="white"
                    bd_color="white"
                    lb_color="white"
                label= "Enter New Password"/>
                </div>
                <div className="form-row">
                    <Input
                     text_color="white"
                    type="password"
                    fc_color="white"
                    bd_color="white"
                    lb_color="white"
                label= "Confirm New Password"/>
                </div>
            </div>
            <Link className="btn" to="#" >Verify OTP</Link>
            <div className="links">
                <Link to="/otpverification">Back To Previous Screen</Link>
                <Link>Cancel</Link>
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

export default ChangePass;
