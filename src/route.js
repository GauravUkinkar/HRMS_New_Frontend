import { lazy } from "react";

const HrmsDash = lazy(()=>import("../src/Pages/HrmsDash/HrmsDash"));


export const routes = [
    {
        name:"HrmsDashboard",
        path:"/",
        comp:HrmsDash,
        adminonly:true
    }
]