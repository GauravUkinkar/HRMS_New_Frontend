import MainPanel from "../../comp/MainPanel/MainPanel";
import "./Login.scss";
import Input from "../../comp/input/Input";
import SelectInput from "../../comp/selectInput/SelectInput";
import { MenuItem } from "@mui/material";
import bgimg from "../../assets/bgimg.png";

const Login = () => {
  return (
    <>
      <div className="login-parent parent">
        

        <div className="login-cont cont">

          <div className="login-card">

          <div className="logo">
            <div className="logo-icon">◉</div>

            <div>
              <h4>WorkPulse</h4>
              <span>HRMS</span>
            </div>
          </div>

          <h1>Hi there!</h1>
          <p className="subtitle">Have we met before?</p>

          <form>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="sarah@tubik"
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <div className="options">
              <label>
                <input type="checkbox" />
                Remember me
              </label>

              <a href="/">Forgot my password</a>
            </div>

            <button>Log in</button>

          </form>

        </div>

         <div className="illustration">

          <div className="glass-frame">

            <img
              src="/images/login-illustration.png"
              alt="Login Illustration"
            />

          </div>

        </div>


        </div>
      </div>
    </>
  );
};

export default Login;






      