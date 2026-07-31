import React from "react";
import "./Forgot.scss";
import Logo from "../../assets/logo.png";
import Input from "../../comp/input/Input";
import UseForm from "../../UseForm";

import { ForgotValidate } from "../../validators/ForgotValidate";
import axios from "axios";
import forgot from "../../assets/forgot.png";
import { useEffect } from "react";

const Forgot = () => {
  const formObj = {
    email: "",
    password: "",
  };

  const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

  const Forgot = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}AuthController/Forgot`,
        values,
      );
      if (response.status === 200) {
        const token = response?.data?.data?.token;
        localStorage.setItem("token", token);
      }
    } catch (error) {
      console.log(error);
    }
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
  } = UseForm(formObj, ForgotValidate, forgot);

  return (
    <>
      <div className="forgot-parent parent">
        <div className="forgot-cont cont">
          <form onSubmit={handleSubmit} className="left">
            <img src={Logo} alt="Logo" />

            <div class="ct">
              <h2>Forgot password ?</h2>
              <p>
                To reset your password,please enter your email address below.
              </p>
            </div>

            <div className="form-row">
              <Input
                name="email"
                required
                error={error.email}
                onChange={handleChange}
                value={values.email}
                onblur={handleBlur}
                text_color="white"
                fc_color="white"
                bd_color="white"
                lb_color="white"
                label="Enter your email address"
              />
            </div>

            <button type="submit" className="btn forgot_btn">
              Send OTP
            </button>

            <a href="/" className="forgot-password">
              Back to Login
            </a>
          </form>

          <div className="right">
            <img src={forgot} alt="forgotimage" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Forgot;
