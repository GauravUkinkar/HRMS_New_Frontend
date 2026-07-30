import { lazy } from "react";



const HrmsDash = lazy(()=>import("../src/Pages/HrmsDash/HrmsDash"));
const Login = lazy(()=>import("../src/Pages/Login/Login"));
const OtpVerification =lazy(()=>import("./Pages/OtpVerification/OtpVerification"));
const ChangePass =lazy(()=>import("../src/Pages/ChangePass/ChangePass"));
const SuccessPage =lazy(()=>import("../src/Pages/SuccessPage/SuccessPage"));
const AddEmployee =lazy(()=>import("../src/Pages/AddEmployee/AddEmployee"));
const SalaryDetails =lazy(()=>import("../src/Pages/AddEmployee/SalaryDetails"));
const UploadDoc =lazy(()=>import("../src/Pages/UploadDoc/UploadDoc"));
const Viewdoc =lazy(()=>import("../src/Pages/Viewdoc/Viewdoc"));
const EmployeeList =lazy(()=>import("../src/Pages/EmployeeList/EmployeeList"));
const AdminDash =lazy(()=>import("../src/Pages/AdminDash/AdminDash"));


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
        comp:SuccessPage,
        adminonly:false
    },
    {
        name:"Add Employee",
        path:"/addEmployee",
        comp:AddEmployee,
        adminonly:true
    },
        {
        name:"SalaryDetails",
        path:"/salaryDetails",
        comp:SalaryDetails,
        adminonly:true
    },
            {
        name:"UploadDoc",
        path:"/uploadDoc",
        comp:UploadDoc,
        adminonly:false
    },
                {
        name:"Viewdoc",
        path:"/Viewdoc",
        comp:Viewdoc,
        adminonly:false
    },
                    {
        name:"EmployeeList",
        path:"/empList",
        comp:EmployeeList,
        adminonly:false
    },
                        {
        name:"AdminDash",
        path:"/adminDash",
        comp:AdminDash,
        adminonly:true
    }
]