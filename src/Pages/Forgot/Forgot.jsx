import React from "react";
import "./Forgot.scss";
import Logo from "../../assets/logo.png";
import forgotpass from "../../assets/forgotpass.png";
import { Link } from "react-router-dom";
import Input from "../../comp/input/Input";

const Forgot = () => {
  return ( 
    <>
      <div className="forgot-parent parent">
        <div className="forgot-cont cont">
          <div className="left">
            <img src={Logo} alt="Logo" />

            <div className="ct">
              <h1>Forgot Password ?</h1>
              <p>
                To reset your password,please enter your email address below.
              </p>
            </div>

            <div className="form-row">
              <Input
                bd_color="white"
                lb_color="white"
                fc_color="white"
                text_color="white"
                label="Email"
              />
            </div>

            <Link className="btn forgot_btn" to="#">
              Send OTP
            </Link>

            <a href="/" className="forgot-password">
              Back to Login
            </a>
          </div>
          <div className="right">
            <img src={forgotpass} alt="forgotimage" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Forgot;
