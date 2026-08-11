import { Link } from "react-router-dom";
import MainPanel from "../../comp/MainPanel/MainPanel";
import Table_Comp from "../../comp/table/Table";
import "./EmployeeList.scss";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";

const EmployeeList = () => {
  const [data, setData] = useState();
  const [loader, setLoader] = useState(false)
  const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

  const deleteEmployee = () => {
    try {
      console.log("deletyedddded")
    } catch (error) {
      console.log(error)
    }
  }

  const columns = [
    {
      key: "employeeName",
      dataIndex: "employeeName",
      title: "Employee Name",
      search: true,
      fixed: "left"
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

    }, {
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

    }, {
      key: "UAN No",
      dataIndex: "UAN No",
      title: "UAN No",

    },
    {
      key: "Action",
      dataIndex: "Action",
      title: "Action",
      render: () => (
        <div>
          <span onClick={deleteEmployee} ><RiDeleteBin6Line /></span>
          <span><CiEdit /></span>
        </div>
      ),
    },
  ];

  const getAllEmployee = async () => {
    try {
      setLoader(true)
      const response = await axios.get(`${BASE_URL}Admin/GetAllEmployee`);
      setData(response?.data?.data)
      console.log(response)
    } catch (error) {
      console.log(error)
    } finally {
      setLoader(false)
    }
  }



  useEffect(() => {
    const fetchEmp = async () => {
      await getAllEmployee()
    }

    fetchEmp()
  }, [])

  return (
    <>
      <MainPanel title="Admin Dashboard">
        {loader && <p>laoding.....</p>}
        <div className="top-parent">
          <h1>Employees</h1>
          <button className="btn"><FaPlus />Add</button>
        </div>

        <Table_Comp columns={columns} data={data}
          xscroll={3000} />
      </MainPanel>
    </>
  );
};

export default EmployeeList;
