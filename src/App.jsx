import { Route, Routes } from "react-router-dom";
import "./App.scss";
import { routes } from "./route";
import { ToastContainer } from "react-toastify";
import AuthRoute from "./AuthRoute";
import Login from "./Pages/Login/Login";
import OtpVerification from "./Pages/OtpVerification/OtpVerification";
import ChangePass from "./Pages/ChangePass/ChangePass";
import SuccessPage from "./Pages/SuccessPage/SuccessPage";
import Forgot from "./Pages/Forgot/Forgot";
import Loader from "./comp/Loader/Loader";
import { useContext } from "react";
import { UserContext } from "../Context";


function App() {
  const {loader} = useContext(UserContext)
  return (
    <>
    <ToastContainer/>
   { loader && <Loader/>}
      <Routes>
       

         <Route path="/login" element={<Login />} />
         <Route path="/otpverification" element={<OtpVerification />} />
         <Route path="/changepass" element={<ChangePass />} />
         <Route path="/successpage" element={<SuccessPage />} />
         <Route path="/forgot" element={<Forgot />} />
        {routes.map((item, index) =>(
            <Route key={index} path={item.path} element={<AuthRoute  adminonly={item.adminonly}><item.comp /></AuthRoute>} />
        ))}
      </Routes>
    </>
  );
}

export default App;
