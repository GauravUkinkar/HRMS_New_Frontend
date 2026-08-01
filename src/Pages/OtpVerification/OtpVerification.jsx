import React, { useState } from "react";
import "./OtpVerification.scss";
import Logo from "../../assets/PandozaLogo.png";
import otpimage from "../../assets/rightimg.webp";
import OTPInput from "react-otp-input";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import UseForm from "../../UseForm";
import { useEffect,useContext } from "react";
import { UserContext } from "../../../Context";
import { toast } from "react-toastify";
import {  useNavigate } from "react-router-dom";


const OtpVerification = () => {


const [otp,setOtp] =useState("")

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  console.log(email)

  const {setLoader} = useContext(UserContext);
  const navigate = useNavigate()
  const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

  const verifyOtp = async (e) =>{
     e.preventDefault();
    try{
      console.log("otp")
      
      setLoader(true)
      const response = await axios.post(
         `${BASE_URL}AuthController/VerifyOtp?Email=${email}&Otp=${otp}`,
         {},
      );
      if(response?.status === 200){
        toast.success("Otp Verified Successfully");
        navigate(`/changepass?email=${email}`)
      }
      console.log(response)
    } catch(error) {
      const message = error.response.data
      if(message?.responseMessage === "Invalid OTP"){
        toast.error(message?.responseMessage)
      }
    }finally{
      setLoader(false)
    }
  };


  return (
    <>
      <div className="verification-parent parent">
        <div className="verification-cont cont">
          <form className="left" onSubmit={verifyOtp}>
            <div className="logo">
              <img src={Logo} alt="Logo" />
            </div>
            <div className="des">
              <h1>Enter OTP</h1>
              <p>
                Please enter the 6-digit One Time <br /> Password sent to your
                email <br />
                <p className="mail">{email}</p>
              </p>
            </div>

            <div className="otp-container">
              <OTPInput
               value={otp}
                onChange={setOtp}
                numInputs={6}
                renderInput={(props) => (
                  <input style={{ width: "48px" }} {...props} />
                )}
              />
            </div>
            <button className="btn" type="submit">
              Verify OTP
            </button>
            <div className="links">
              <Link>Resend OTP</Link>
              <Link to="/login">Back to Login</Link>
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


export default OtpVerification;
