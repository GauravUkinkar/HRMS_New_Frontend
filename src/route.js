import { lazy } from "react";


const HrmsDash = lazy(()=>import("../src/Pages/HrmsDash/HrmsDash"));
const Login = lazy(()=>import("../src/Pages/Login/Login"));
const Forgot = lazy(()=>import("../src/Pages/Forgot/Forgot"));
const OtpVerification =lazy(()=>import("./Pages/OtpVerification/OtpVerification"));
const ChangePass =lazy(()=>import("../src/Pages/ChangePass/ChangePass"));
const SuccessPage =lazy(()=>import("../src/Pages/SuccessPage/SuccessPage"));
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
    },
            {
         name:"ChangePass",
        path:"/changepass",
        comp:ChangePass,
        adminonly:false
    },
               {
         name:"SuccessPage",
        path:"/successpage",
        comp:SuccessPage,
        adminonly:false
    }
    ,
               {
         name:"Forgot",
        path:"/forgot",
        comp:Forgot,
        adminonly:false
    }
]