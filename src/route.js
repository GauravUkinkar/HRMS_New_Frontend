import { lazy } from "react";
import Profile from "./Pages/EmployeeProfile/Profile";
import EditEmployee from "./Pages/AddEmployee/EditEmployee";
import EditSalary from "./Pages/AddSalary/EditSalary";
import UserList from "./Pages/UserList/UserList";
import LeaveManagement from "./Pages/LeaveManagement/LeaveManagement";
import Leave_details from "./Pages/LeaveManagement/Leave_details";


const Payslip = lazy(() => import("./Pages/Payslip/Payslip"));

const EmpList = lazy(() => import("./Pages/EmpList/EmpList"));
const AddEmployee = lazy(() => import("../src/Pages/AddEmployee/AddEmployee"));

const OfficialNotes = lazy(() => import("../src/Pages/OfficialNotes/OfficialNotes"));
const SalaryDetails = lazy(
  () => import("../src/Pages/AddEmployee/SalaryDetails"),
);

const UploadDoc = lazy(() => import("../src/Pages/UploadDoc/UploadDoc"));
const Viewdoc = lazy(() => import("../src/Pages/Viewdoc/Viewdoc"));
const Empviewdoc = lazy(() => import("../src/Pages/Empviewdoc/Empviewdoc"));
const AdminDash = lazy(() => import("../src/Pages/AdminDash/AdminDash"));
const Generatesalary = lazy(
  () => import("../src/Pages/Generatesalary/Generatesalary"),
);
const Attendance = lazy(() => import("./Pages/Attendence/Attendance"));
const AddSalary = lazy(() => import("./Pages/AddSalary/AddSalary"));
const SalaryManagement = lazy(
  () => import("./Pages/SalaryManagement/SalaryManagement"),
);
const OfferLetter = lazy(() => import("./Pages/OfferLetter/OfferLetter"));
const InternshipLetter = lazy(() => import("./Pages/InternshipLetter/Internshipletter"));

const PromotionLetter = lazy(() => import("./Pages/PromotionLetter/PromotionLetter"));

const ExperienceLetter = lazy(() => import("./Pages/ExperienceLetter/ExperienceLetter"));
const ReleavingLetter = lazy(() => import("./Pages/ReleavingLetter/ReleavingLetter"));


const OfferLetterManagement = lazy(
  () => import("./Pages/OfferLetterManagement/OfferLetterManagement"),
);
const IncrementLetter = lazy(
  () => import("./Pages/IncrementLetter/IncrementLetter"),
);
const Empdashboard = lazy(
  () => import("../src/Pages/Empdashboard/Empdashboard"),
);

export const routes = [
  {
    name: "All Employees",
    path: "/empList",
    comp: EmpList,
    adminonly: false,
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
    name: "Edit Salary",
    path: "/editSalary/:sId",
    comp: EditSalary,
    adminonly: true,
  },
  {
    name: "OfficialNotes",
    path: "/officialNotes",
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
    name: "Empdashboard",
    path: "/Empdashboard",
    comp: Empdashboard,
    adminonly: false,
  },

  {
    name: "Upload Documents",
    path: "/uploadDoc",
    comp: UploadDoc,
    adminonly: "false",
  },
  {
    name: "Viewdoc",
    path: "/Viewdoc",
    comp: Viewdoc,
    adminonly: false,
  },
  {
    name: "Empviewdoc",
    path: "/Empviewdoc",
    comp: Empviewdoc,
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
    name: "PromotionLetter",
    path: "/promotionLetter",
    comp: PromotionLetter,
    adminonly: true,
  },
      {
    name: "InternshipLetter",
    path: "/internshipLetter",
    comp: InternshipLetter,
    adminonly: true,
  },
    {
    name: "ExperienceLetter",
    path: "/experienceLetter",
    comp: ExperienceLetter,
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
    {
    name: "ReleavingLetter",
    path: "/releavingLetter",
    comp: ReleavingLetter,
    adminonly: true,
  },

  // sunil Shelke
  {
    name: "EmployeeProfile",
    path: "/EmployeeProfile/:employeeId",
    comp: Profile,
    adminonly: true,
  },
  {
    name: "EmployeeLeaves",
    path: "/EmployeeLeaves/:employeeId",
    comp: Leave_details,
    adminonly: true,
  },
];
