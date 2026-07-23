import React from 'react'
import "./SuccessPage.scss"
import Logo from "../../assets/logo.png"
import otpimage from "../../assets/otpimage.png"
import { Link } from 'react-router-dom'
import Success from "../../assets/success.png"
import right from "../../assets/right.png"
 
const SuccessPage = () => {
  return (
    <>
        <div className="verification-parent parent">
        <div className="verification-cont cont">
          <div className="left">
            <div className="logo">
              <img src={Logo} alt="Logo" />
            </div>
            <h1>Password Changed Successfully</h1>
            <p>
              Congratulations,admin@gmail.com! <br /> Your new password is now active.      
            </p>
            <img className='right' src={right} alt='right'/>

            <Link className="btn" to="#">Return To Login</Link>
            <div className="links">
                <Link>Logout</Link>
            </div>
          </div>
          <div className="right">
            <img src={Success} alt="Success" />
          </div>
        </div>
      </div>
      
    </>
  )
}

export default SuccessPage
