import { lazy } from "react";


const HrmsDash = lazy(()=>import("../src/Pages/HrmsDash/HrmsDash"));
const Login = lazy(()=>import("../src/Pages/Login/Login"));
const OtpVerification =lazy(()=>import("./Pages/OtpVerification/OtpVerification"));

export const routes = [
    {
        name:"HrmsDashboard",
        path:"/",
        comp:HrmsDash,
        adminonly:true
    },

    {
         name:"Login",
        path:"/login",
        comp:Login,
        adminonly:false
    },
        {
         name:"OtpVerification",
        path:"/otpverification",
        comp:OtpVerification,
        adminonly:false
    }
]