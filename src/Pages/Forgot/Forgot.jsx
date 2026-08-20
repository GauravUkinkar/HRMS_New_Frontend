import React from "react";
import "./Forgot.scss";
import Logo from "../../assets/logo.png";
import Input from "../../comp/input/Input";
import UseForm from "../../UseForm";
import { api } from "../../api";
import { ForgotValidate } from "../../validators/ForgotValidate";
import axios from "axios";
import forgot from "../../assets/forgot.png";
import { useEffect,useContext } from "react";
import { UserContext } from "../../../Context";
import { toast } from "react-toastify";
import {  Link, useNavigate } from "react-router-dom";
const Forgot = () => {
  const formObj = {
    email: "",
  };

  const {setLoader} = useContext(UserContext);
const navigate = useNavigate()

  const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

  const Forgot = async () => {
    try {
      setLoader(true)
      const response = await axios.post(
        `${BASE_URL}AuthController/SendOtp?Email=${values.email}`,
        {},
      );
      if(response?.status === 200){
        toast.success("Send Otp Success");
        navigate(`/otpverification?email=${values.email}`)
      }
      console.log(response)
    } catch (error) {
      const message = error.response.data
      if(message?.responseMessage === "Invalid credentials"){
        toast.error(message?.responseMessage)
      }
      
    }finally{
      setLoader(false)
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
  } = UseForm(formObj, ForgotValidate, Forgot);

  

  return (
    <>
      <div className="forgot-parent parent">
        <div className="forgot-cont cont">
          <form onSubmit={handleSubmit} className="left">
            <img src={Logo} alt="Logo" />

            <div class="ct">
              <h2>Forgot password ?</h2>
              <p>
                To reset your password , please enter your email address below.
              </p>
            </div>

            <div className="form-row">
              <Input
                name="email"
                required
                type="email"
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

            <Link to="/login" className="forgot-password">
              Back to Login
            </Link>
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
