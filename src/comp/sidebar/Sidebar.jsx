import "./Sidebar.scss";
import logo from "../../assets/logo.png";
import logo2 from "../../assets/logopan.webp";
import { FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState } from "react";
import { BsPerson } from "react-icons/bs";
import { LuLogOut } from "react-icons/lu";

const Sidebar = ({ active }) => {
    const [childindex,setChildIndex] = useState()
  const navs = [
    {
      icon: <FiHome />,
      name: "Dashboard",
      link: "/",
    },
    {
      icon:<BsPerson />,
      name: "Employee",
      children: [
        {
          name: "Add Employee",
          link: "/addEmployee",
        },
        {
          name: "Register User",
          link: "/addEmployee",
        },
      ],
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
                <Link onClick={() => item?.children && setChildIndex(index)} className="link" to={item.link}>
                  <span>{item.icon}</span>
                  {item.name}

                  {index === childindex &&
                    <div class="child_list" onMouseLeave={()=>setChildIndex()}>
                   {     item.children?.map((child, index) => <Link key={index} >
                    {child.name}</Link>)}
                    </div>
                    
                    }
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
