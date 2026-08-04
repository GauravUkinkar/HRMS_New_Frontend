import "./Login.scss";
import Logo from "../../assets/logo.png";
import Input from "../../comp/input/Input";
import UseForm from "../../UseForm";
import { loginValidate } from "../../validators/LoginValidtate";

import LoginImg from "../../assets/login.png";
import { useContext } from "react";
import { api } from "../../api";
import { toast } from "react-toastify";
import { UserContext } from "../../../Context";
import { Link, replace, useNavigate } from "react-router-dom";
const Login = () => {
  const formObj = {
    email: "",
    password: "",
  };
  const { getEmpDetails, setLoader } = useContext(UserContext);
  const navigate = useNavigate();

  const login = async () => {
    try {
      setLoader(true);
      const response = await api.post(`AuthController/Login`, values);

      if (response.status === 200) {
        toast.success("Login Successfully");
        localStorage.setItem("LoggedIn", true);
        await getEmpDetails();
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log(error.response);
      const errormessage = error.response?.data;
      if (errormessage?.password) {
        setError((prev) => ({
          ...prev,
          password: errormessage.password,
        }));
        toast.error(errormessage.password);
      }
      if (errormessage?.responseMessage) {
        toast.error(errormessage.responseMessage);
      }
      

    } finally {
      setLoader(false);
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
  } = UseForm(formObj, loginValidate, login);

  return (
    <>
      <div className="login-parent parent">
        <div className="login-cont cont">
          <form onSubmit={handleSubmit} className="left">
            <img src={Logo} alt="Logo" />

            <div class="ct">
              <h1>Hi There!</h1>
              <p>Have we met before?</p>
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
                label="Email"
              />
            </div>

            <div className="form-row">
              <Input
                name="password"
                text_color="white"
                error={error.password}
                onChange={handleChange}
                onblur={handleBlur}
                value={values.password}
                type="password"
                fc_color="white"
                bd_color="white"
                lb_color="white"
                label="Password"
              />
            </div>

            <div className="password-footer">
              <div className="rem">
                <input type="checkbox" className="checkbox" />
                <label className="remember">Remember me</label>
              </div>

              <Link to="/forgot" className="forgot-password">
                Forgot password
              </Link>
            </div>
            <button type="submit" className="btn login_btn">
              Log in
            </button>
          </form>

          <div className="right">
            <img src={LoginImg} alt="loginimage" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
