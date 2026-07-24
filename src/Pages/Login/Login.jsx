import "./Login.scss";
import Logo from "../../assets/logo.png";
import Input from "../../comp/input/Input";
import UseForm from "../../UseForm";
import { loginValidate } from "../../validators/LoginValidtate";
import axios from "axios";
import LoginImg from "../../assets/login.png"
const Login = () => {
  const formObj = {
    email: "",
    password: "",
  };

  const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

  const login = async () => {
    try {
      const response = await axios.post(`${BASE_URL}AuthController/Login`,values);
      if(response.status === 200){
        const token = response?.data?.data?.token
           localStorage.setItem("token",token)
      }
    } catch (error) {
      console.log(error)
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

  console.log(values)
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
              error={error.email}
                onChange={handleChange}
                value={values.email}
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

              <a href="/" className="forgot-password">
                Forgot password
              </a>
            </div>
            <button type="submit" className="btn login_btn" >
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
