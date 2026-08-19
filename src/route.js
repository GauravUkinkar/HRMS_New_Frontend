import { lazy } from "react";
import Profile from "./Pages/EmployeeProfile/Profile";
import EditEmployee from "./Pages/AddEmployee/EditEmployee";
import UserList from "./Pages/UserList/UserList";


const Payslip = lazy(() => import("./Pages/Payslip/Payslip"));


const LeaveManagement = lazy(() => import("./Pages/Leavemanagement/Leavemanagement"));
const EmpList = lazy(() => import("./Pages/EmpList/EmpList"));
const AddEmployee = lazy(() => import("../src/Pages/AddEmployee/AddEmployee"));
const OfficialNotes = lazy(() => import("../src/Pages/OfficialNotes/OfficialNotes"));
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
const Attendance = lazy(() => import("./Pages/Attendence/Attendance"));
const AddSalary = lazy(() => import("./Pages/AddSalary/AddSalary"));
const SalaryManagement = lazy(() => import("./Pages/SalaryManagement/SalaryManagement"));
const OfferLetter = lazy(() => import("./Pages/OfferLetter/OfferLetter"));
const OfferLetterManagement = lazy(() => import("./Pages/OfferLetterManagement/OfferLetterManagement"));
const IncrementLetter = lazy(() => import("./Pages/IncrementLetter/IncrementLetter"));





export const routes = [
  {
    name: "All Employees",
    path: "/empList",
    comp: EmpList,
    adminonly: false
  },

  {
    name: "All Users",
    path: "/userlist",
    comp: UserList,
    adminonly: true,
  },

  {
    name: "Add Employee",
    path: "/addEmployee",
    comp: AddEmployee,
    adminonly: true,
  },
  {
    name: "Edit Employee",
    path: "/editEmployee/:employeeId",
    comp: EditEmployee,
    adminonly: true,
  },
  {
    name: "OfficialNotes",
    path: "/OfficialNotes",
    comp: OfficialNotes,
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
  // {
  //   name: "EmployeeList",
  //   path: "/empList",
  //   comp: EmployeeList,
  //   adminonly: false,
  // },
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
  {
    name: "Attendance",
    path: "/attendance",
    comp: Attendance,
    adminonly: true,
  },
  {
    name: "Payslip",
    path: "/Payslip",
    comp: Payslip,
    adminonly: false,
  },
  {
    name: "AddSalary",
    path: "/addSalary",
    comp: AddSalary,
    adminonly: true,
  },
  {
    name: "SalaryManagement",
    path: "/salaryManagement",
    comp: SalaryManagement,
    adminonly: true,
  },
  {
    name: "OfferLetter",
    path: "/offerLetter",
    comp: OfferLetter,
    adminonly: true,
  },
  {
    name: "OfferLetterManagement",
    path: "/offerLettermanagement",
    comp: OfferLetterManagement,
    adminonly: true,
  },
  {
    name: "IncrementLetter",
    path: "/incrementLetter",
    comp: IncrementLetter,
    adminonly: true,
  },

  // sunil Shelke
  {
    name: "EmployeeProfile",
    path: "/EmployeeProfile/:employeeId",
    comp: Profile,
    adminonly: true,
  }






];
