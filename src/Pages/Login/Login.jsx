
import "./login.scss";
import Logo from "../../assets/logo.png";
import login from "../../assets/login.webp";
import Input from "../../comp/input/Input";
import { Link } from "react-router-dom";

const ChangePass = () => {
  return (
    <>
      <div className="login-parent parent">
        <div className="login-cont cont">
          <div className="left">
            <div className="logo">
              <img src={Logo} alt="Logo" />
            </div>
            <h1>Hi There!</h1>
            <p>Have we met before?</p>

            <div className="inputs">
              <div className="form-row">
                <Input
                  text_color="white"
                  fc_color="white"
                  bd_color="white"
                  lb_color="white"
                  label="Email"
                />
              </div>

              <div className="form-row">
                <Input
                  text_color="white"
                  type="password"
                  fc_color="white"
                  bd_color="white"
                  lb_color="white"
                  label="Password"
                />
              </div>
            </div>
            <div className="password-footer">
              <div className="rem">
                 <input type="checkbox" className="checkbox"  />
              <label className="remember">
               
                
                Remember me
              </label>
              </div>

              <a href="/" className="forgot-password">
                Forgot my password
              </a>
            </div>
            <Link className="btn" to="#">
              Log in
            </Link>
          </div>

          <div className="right">
            <img src={login} alt="loginimage" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePass;
