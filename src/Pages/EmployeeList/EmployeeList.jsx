import { Link } from "react-router-dom";
import MainPanel from "../../comp/MainPanel/MainPanel";
import Table_Comp from "../../comp/table/Table";
import "./EmployeeList.scss";
import { RiDeleteBin6Line } from "react-icons/ri";

import { CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";

const EmployeeList = () => {
  const columns = [
    {
      key: "Employee Name",
      dataIndex: "Employee Name",
      title: "Employee Name",
      search: true,
    },
    {
      key: "Employee Id",
      dataIndex: "Employee Id",
      title: "Employee Id",
      search: true,
    },
        {
      key: "Gender",
      dataIndex: "Gender",
      title: "Gender",
    },
        {
      key: "Employee Status",
      dataIndex: "Employee Status",
      title: "Employee Status",
    },
            {
      key: "Designation",
      dataIndex: "Designation",
      title: "Designation",
    },
    {
      key: "Department",
      dataIndex: "Department",
      title: "Department",
    },
       {
      key: "Date of joining",
      dataIndex: "Department",
      title: "Department",
    },
        {
      key: "Contact",
      dataIndex: "Contact",
      title: "Contact",
 
    },
    {
      key: "Email",
      dataIndex: "Email",
      title: "Email",
      search: true,
    },
        {
      key: "IFSC Code",
      dataIndex: "IFSC Code",
      title: "IFSC Code",
  
    },
    {
      key: "Date of Birth",
      dataIndex: "Date of Birth",
      title: "Date of Birth",
  
    },
            {
      key: "AadharCard No",
      dataIndex: "AadharCard No",
      title: "AadharCard No",
  
    },        {
      key: "PanCard No",
      dataIndex: "PanCard No",
      title: "PanCard No",
   
    },
    {
          key: "Account No",
      dataIndex: "Account No",
      title: "Account No",
     
    },
    {
          key: "Cost to Company",
      dataIndex: "Cost to Company",
      title: "Cost to Company",

    },
        {
          key: "Employee Salary",
      dataIndex: "Employee Salary",
      title: "Employee Salary",
  
    },
        {
          key: "Bank Name",
      dataIndex: "Bank Name",
      title: "Bank Name",
      search: true,
    },
           {
          key: "Company Name",
      dataIndex: "Company Name",
      title: "Company Name",
      search: true,
    },
           {
          key: "Image",
      dataIndex: "Image",
      title: "Image",
  
    },
               {
          key: "Address",
      dataIndex: "Address",
      title: "Address",

    },           {
          key: "UAN No",
      dataIndex: "UAN No",
      title: "UAN No",
 
    },
    {
      key: "Action",
      dataIndex: "Action",
      title: "Action",
      render: () => (
        <Link>
          <RiDeleteBin6Line />
          <CiEdit />
        </Link>
      ),
    },
  ];

  const data = [
    {
      name: "Ketan r d",
      
    },
  ];
  return (
    <>
      <MainPanel title="Admin Dashboard">
        <div className="top-parent">
          <h1>Employees</h1>
          <button className="btn"><FaPlus />Add</button>
        </div>

        <Table_Comp columns={columns} data={data} />
      </MainPanel>
    </>
  );
};

export default EmployeeList;
