import { lazy } from "react";

const HrmsDash = lazy(()=>import("../src/Pages/HrmsDash/HrmsDash"));
const Login = lazy(()=>import("../src/Pages/Login/Login"));

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
    }
]