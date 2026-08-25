import { lazy } from "react";

import Profile from "./Pages/EmployeeProfile/Profile";
import EditEmployee from "./Pages/AddEmployee/EditEmployee";
import EditSalary from "./Pages/AddSalary/EditSalary";
import UserList from "./Pages/UserList/UserList";
import LeaveManagement from "./Pages/LeaveManagement/LeaveManagement";
import Leave_details from "./Pages/LeaveManagement/Leave_details";

const Payslip = lazy(() =>
  import("./Pages/Payslip/Payslip")
);

const EmpList = lazy(() =>
  import("./Pages/EmpList/EmpList")
);

const AddEmployee = lazy(() =>
  import("./Pages/AddEmployee/AddEmployee")
);

const OfficialNotes = lazy(() =>
  import("./Pages/OfficialNotes/OfficialNotes")
);

const SalaryDetails = lazy(() =>
  import("./Pages/AddEmployee/SalaryDetails")
);

const UploadDoc = lazy(() =>
  import("./Pages/UploadDoc/UploadDoc")
);

const Viewdoc = lazy(() =>
  import("./Pages/Viewdoc/Viewdoc")
);

const Empviewdoc = lazy(() =>
  import("./Pages/Empviewdoc/Empviewdoc")
);

const AdminDash = lazy(() =>
  import("./Pages/AdminDash/AdminDash")
);

const Generatesalary = lazy(() =>
  import("./Pages/Generatesalary/Generatesalary")
);

const Attendance = lazy(() =>
  import("./Pages/Attendence/Attendance")
);

const AddSalary = lazy(() =>
  import("./Pages/AddSalary/AddSalary")
);

const SalaryManagement = lazy(() =>
  import("./Pages/SalaryManagement/SalaryManagement")
);

const OfferLetter = lazy(() =>
  import("./Pages/OfferLetter/OfferLetter")
);

const OfferLetterManagement = lazy(() =>
  import("./Pages/OfferLetterManagement/OfferLetterManagement")
);

const IncrementLetter = lazy(() =>
  import("./Pages/IncrementLetter/IncrementLetter")
);
const ReleavingLetter = lazy(() =>
  import("./Pages/ReleavingLetter/ReleavingLetter")
);

const Empdashboard = lazy(() =>
  import("./Pages/Empdashboard/Empdashboard")
);

export const routes = [

  {
    name: "All Employees",
    path: "/empList",
    comp: EmpList,
    adminonly: false,
    employeeonly: false,
  },

  {
    name: "Empdashboard",
    path: "/Empdashboard",
    comp: Empdashboard,
    adminonly: false,
    employeeonly: true,
  },

  {
    name: "Upload Documents",
    path: "/uploadDoc",
    comp: UploadDoc,
    adminonly: false,
    employeeonly: true,
  },

  {
    name: "Viewdoc",
    path: "/Viewdoc",
    comp: Viewdoc,
    adminonly: false,
    employeeonly: true,
  },

  {
    name: "Empviewdoc",
    path: "/Empviewdoc",
    comp: Empviewdoc,
    adminonly: false,
    employeeonly: true,
  },

  {
    name: "LeaveManagement",
    path: "/LeaveManagement",
    comp: LeaveManagement,
    adminonly: false,
    employeeonly: true,
  },

  {
    name: "Payslip",
    path: "/Payslip",
    comp: Payslip,
    adminonly: false,
    employeeonly: true,
  },


  /* =====================================================
     ADMIN
  ===================================================== */

  {
    name: "All Users",
    path: "/userlist",
    comp: UserList,
    adminonly: true,
    employeeonly: false,
  },

  {
    name: "Add Employee",
    path: "/addEmployee",
    comp: AddEmployee,
    adminonly: true,
    employeeonly: false,
  },

  {
    name: "Edit Employee",
    path: "/editEmployee/:employeeId",
    comp: EditEmployee,
    adminonly: true,
    employeeonly: false,
  },

  {
    name: "Edit Salary",
    path: "/editSalary/:sId",
    comp: EditSalary,
    adminonly: true,
    employeeonly: false,
  },

  {
    name: "OfficialNotes",
    path: "/officialNotes",
    comp: OfficialNotes,
    adminonly: true,
    employeeonly: false,
  },

  {
    name: "SalaryDetails",
    path: "/salaryDetails",
    comp: SalaryDetails,
    adminonly: true,
    employeeonly: false,
  },

  {
    name: "AdminDash",
    path: "/",
    comp: AdminDash,
    adminonly: true,
    employeeonly: false,
  },

  {
    name: "Generatesalary",
    path: "/generatesalary",
    comp: Generatesalary,
    adminonly: true,
    employeeonly: false,
  },

  {
    name: "Attendance",
    path: "/attendance",
    comp: Attendance,
    adminonly: true,
    employeeonly: false,
  },

  {
    name: "AddSalary",
    path: "/addSalary",
    comp: AddSalary,
    adminonly: true,
    employeeonly: false,
  },

  {
    name: "SalaryManagement",
    path: "/salaryManagement",
    comp: SalaryManagement,
    adminonly: true,
    employeeonly: false,
  },

  {
    name: "OfferLetter",
    path: "/offerLetter",
    comp: OfferLetter,
    adminonly: true,
    employeeonly: false,
  },
  {
    name: "OfferLetterManagement",
    path: "/offerLettermanagement",
    comp: OfferLetterManagement,
    adminonly: true,
    employeeonly: false,
  },

  {
    name: "IncrementLetter",
    path: "/incrementLetter",
    comp: IncrementLetter,
    adminonly: true,
    employeeonly: false,
  },
  {
    name: "ReleavingLetter",
    path: "/releavingLetter",
    comp: ReleavingLetter,
    adminonly: true,
  },

  {
    name: "EmployeeProfile",
    path: "/EmployeeProfile/:employeeId",
    comp: Profile,
    adminonly: true,
    employeeonly: false,
  },

  {
    name: "EmployeeLeaves",
    path: "/EmployeeLeaves/:employeeId",
    comp: Leave_details,
    adminonly: true,
    employeeonly: false,
  },
];