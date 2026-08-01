import React from "react";
import "./ChangePass.scss";
import Logo from "../../assets/logo.png";
import otpimage from "../../assets/rightimg.webp";
import Input from "../../comp/input/Input";
import { Link } from "react-router-dom";
import UseForm from "../../UseForm";
import { validatePassword } from "../../validators/ValidatePassword";
import axios from "axios";

const ChangePass = () => {
  const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;
  const formObj = {
    email: "",
    newPassword: "",
    confirmPassword: "",
  };

  const updatePassword = async () => {
    try {
      const response = await axios.put(`${BASE_URL}AuthController/updatePassword`,values)
    } catch (error) {}
  };

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    setValues,
    error,
    setError,
    isSubmitting,
  } = UseForm(formObj, validatePassword, updatePassword);

  return (
    <>
      <div className="password-parent parent">
        <div className="password-cont cont">
          <form onSubmit={handleSubmit} className="left">
            <div className="logo">
              <img src={Logo} alt="Logo" />
            </div>
            <div className="pass-des">
              <h1>Change Password</h1>
              <p>
                Please enter the 6-digit One Time <br /> Password sent to your
                email <br />
                <p className="mail">admin@gmail.com</p>
              </p>
            </div>

            <div className="inputs">
              <div className="form-row">
                <Input
                  name="newPassword"
                  required
                  error={error.newPassword}
                  onChange={handleChange}
                  value={values.newPassword}
                  onblur={handleBlur}
                  text_color="white"
                  type="password"
                  fc_color="white"
                  bd_color="white"
                  lb_color="white"
                  label="Enter New Password"
                />
              </div>
              <div className="form-row">
                <Input
                  name="confirmPassword"
                  required
                  error={error.confirmPassword}
                  onChange={handleChange}
                  value={values.confirmPassword}
                  onblur={handleBlur}
                  text_color="white"
                  type="password"
                  fc_color="white"
                  bd_color="white"
                  lb_color="white"
                  label="Confirm New Password"
                />
              </div>
            </div>
            <button className="btn" type="submit">
              Verify OTP
            </button>
            <div className="links">
              <Link to="/otpverification">Back To Previous Screen</Link>
              <Link>Cancel</Link>
            </div>
          </form>
          <div className="right">
            <img src={otpimage} alt="otpimage" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePass;
