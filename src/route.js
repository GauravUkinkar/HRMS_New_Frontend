import { lazy } from "react";




const LeaveManagement = lazy(() => import("./Pages/Leavemanagement/Leavemanagement"));
const EmpList = lazy(() => import("./Pages/EmpList/EmpList"));
const AddEmployee = lazy(() => import("../src/Pages/AddEmployee/AddEmployee"));
const SalaryDetails = lazy(
  () => import("../src/Pages/AddEmployee/SalaryDetails"),
);
const UploadDoc = lazy(() => import("../src/Pages/UploadDoc/UploadDoc"));
const Viewdoc = lazy(() => import("../src/Pages/Viewdoc/Viewdoc"));
const EmployeeList = lazy(
  () => import("../src/Pages/EmployeeList/EmployeeList"),
);
const AdminDash = lazy(() => import("../src/Pages/AdminDash/AdminDash"));

const Generatesalary = lazy(
  () => import("../src/Pages/Generatesalary/Generatesalary"),
);

export const routes = [
  {
    name:"All Employees", 
    path:"/empList",
    comp:EmpList, 
    adminonly:false
  },

  {
    name: "Add Employee",
    path: "/addEmployee",
    comp: AddEmployee,
    adminonly: true,
  },
  {
    name: "SalaryDetails",
    path: "/salaryDetails",
    comp: SalaryDetails,
    adminonly: true,
  },
  {
    name: "UploadDoc",
    path: "/uploadDoc",
    comp: UploadDoc,
    adminonly: false,
  },
  {
    name: "Viewdoc",
    path: "/Viewdoc",
    comp: Viewdoc,
    adminonly: false,
  },
  {
    name: "EmployeeList",
    path: "/empList",
    comp: EmployeeList,
    adminonly: false,
  },
  {
    name: "AdminDash",
    path: "/",
    comp: AdminDash,
  
  },
  {
    name: "Generatesalary",
    path: "/generatesalary",
    comp: Generatesalary,
    adminonly: true,
  },
 {
    name: "LeaveManagement",
    path: "/LeaveManagement",
    comp: LeaveManagement,
    adminonly: false,
  },
 
 
  

  
];
