import "./Sidebar.scss";
import logo from "../../assets/logo.png";
import logo2 from "../../assets/logopan.webp";
import { FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState } from "react";
import { BsPerson } from "react-icons/bs";
import { LuLogOut } from "react-icons/lu";
import { IoCloudUploadOutline } from "react-icons/io5";

const Sidebar = ({ active }) => {
  const [childindex, setChildIndex] = useState();
  const navs = [
    {
      icon: <FiHome />,
      name: "Dashboard",
      link: "/",
    },
    {
      icon: <BsPerson />,
      name: "Employee",
      children: [
        {
          name: "Add Employee",
          link: "/addEmployee",
        },
       
        {
          name: "List All Employee",
          link: "/empList",
        },
      ],
    },
    {
      icon: <FiHome />,
      name: "Document Management",
      link: "/",
    },

     {
      icon: <FiHome />,
      name: "Leave Management",
      link: "/LeaveManagement",
    },
    
    {
      icon:<IoCloudUploadOutline />,
      name: "Salary Management",
      link: "/salaryManagement",
      
    },
    {
      icon: <FiHome />,
      name: "User Management",
      link: "/",
    },
    {
      icon: <BsPerson />,
      name: "Official Documents",
      children: [
        {
          name: "Generate Offer Letter",
          link: "/addEmployee",
        },
        {
          name: "Generate Joining Letter",
          link: "/addEmployee",
        },
        {
          name: "Generate Employee ID Card",
          link: "/addEmployee",
        },
        {
          name: "Generate Incriment Letter",
          link: "/addEmployee",
        },
        {
          name: "Generate Promotion Letter",
          link: "/addEmployee",
        },
        {
          name: "Generate Experience Letter",
          link: "/addEmployee",
        },
        {
          name: "Generate Releaving Letter",
          link: "/addEmployee",
        },
        {
          name: "Generate Warning Letter",
          link: "/addEmployee",
        },
        {
          name: "Generate Termination Letter",
          link: "/addEmployee",
        },
        {
          name: "Generate Intership Letter",
          link: "/addEmployee",
        },
        
       
        
      ],
    },
    {
      icon: <FiHome />,
      name: "Attendence",
      link: "/attendance",
    },
     {
      icon: <FiHome />,
      name: "Official Notes",
      link: "/",
    },
  ];
  return (
    <>
      <div class="sidebar_parent">
        <div class="top">
          <div class="logo">
            {!active ? <img src={logo} alt="" /> : <img src={logo2} alt="" />}
          </div>

          <div class="navsection">
            {navs &&
              navs.map((item, index) => (
                <Link
                  onClick={() => item?.children && setChildIndex(index)}
                  className={childindex === index ? "link active" : "link"}
                  to={item.link}
                >
                  <span>{item.icon}</span>
                  {item.name}

                  {index === childindex && (
                    <div
                      class="child_list"
                      onMouseLeave={() => setChildIndex()}
                     
                    >
                      {item.children?.map((child, index) => (
                        <Link  to={child.link} key={index}>{child.name}</Link>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
          </div>
        </div>

        <Link className="logout">
          <span>
            <LuLogOut />
          </span>
          Logout
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
