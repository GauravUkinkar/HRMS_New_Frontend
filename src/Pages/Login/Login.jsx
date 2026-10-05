import "./Login.scss";
import Logo from "../../assets/logo.png";
import Input from "../../comp/input/Input";
import UseForm from "../../UseForm";
import { loginValidate } from "../../validators/LoginValidtate";

import LoginImg from "../../assets/login.png";
import { useContext, useEffect, useRef } from "react";
import { api } from "../../api";
import { toast } from "react-toastify";
import { UserContext } from "../../../Context";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Login = () => {
  const formObj = {
    email: "",
    password: "",
  };

  const { getEmpDetails, setLoader } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const autoLoginStarted = useRef(false);

  const login = async () => {
    try {
      setLoader(true);

      const response = await api.post("AuthController/Login", values);

      console.log("NORMAL LOGIN RESPONSE:", response);

      if (response.status === 200) {
        toast.success("Login Successfully");

        const userData = response.data.data;

        localStorage.setItem("LoggedIn", "true");
        localStorage.setItem("email", userData.email);
        localStorage.setItem("token", userData.token);
        localStorage.setItem("uid", userData.uid);
        localStorage.setItem("role", userData.role);

        await getEmpDetails();

        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log("NORMAL LOGIN ERROR:", error);
      console.log("ERROR RESPONSE:", error?.response?.data);

      const errormessage = error?.response?.data;

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
    error,
    setError,
  } = UseForm(formObj, loginValidate, login);

  useEffect(() => {
    const email = searchParams.get("email");
    const password = searchParams.get("password");

    console.log("CRM AUTO LOGIN PARAMS:", {
      email,
      hasPassword: !!password,
      passwordLength: password?.length,
    });

    if (!email || !password) {
      console.log("CRM AUTO LOGIN: Missing email or password");
      return;
    }

    if (autoLoginStarted.current) {
      return;
    }

    autoLoginStarted.current = true;

    const autoLogin = async () => {
      try {
        setLoader(true);

        console.log("CRM AUTO LOGIN: Calling API...");

        const response = await api.post("AuthController/Login", {
          email: email,
          password: password,
        });

        console.log("CRM AUTO LOGIN RESPONSE:", response);

        if (response?.status === 200) {
          const userData = response?.data?.data;

          console.log("CRM AUTO LOGIN SUCCESS:", {
            email: userData?.email,
            uid: userData?.uid,
            role: userData?.role,
            hasToken: !!userData?.token,
          });

          localStorage.setItem("LoggedIn", "true");
          localStorage.setItem("email", userData.email);
          localStorage.setItem("token", userData.token);
          localStorage.setItem("uid", userData.uid);
          localStorage.setItem("role", userData.role);

          console.log("CRM AUTO LOGIN: Token saved");

          await getEmpDetails();

          console.log("CRM AUTO LOGIN: Employee details loaded");

          window.location.replace("/");
        }
      } catch (error) {
        console.error("CRM AUTO LOGIN ERROR:", error);
        console.error(
          "CRM AUTO LOGIN ERROR RESPONSE:",
          error?.response?.data
        );

        const message =
          error?.response?.data?.responseMessage ||
          error?.response?.data?.password ||
          "Automatic CRM login failed";

        toast.error(message);
      } finally {
        setLoader(false);
      }
    };

    autoLogin();
  }, [searchParams]);

  return (
    <div className="login-parent parent">
      <div className="login-cont cont">
        <form onSubmit={handleSubmit} className="left">
          <img src={Logo} alt="Logo" />

          <div className="ct">
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
              onBlur={handleBlur}
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
              required
              text_color="white"
              error={error.password}
              onChange={handleChange}
              onBlur={handleBlur}
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
          <img src={LoginImg} alt="Login" />
        </div>
      </div>
    </div>
  );
};

export default Login;