import "./Sidebar.scss";

import logo from "../../assets/logo.png";
import logo2 from "../../assets/logopan.webp";
import { IoDocuments } from "react-icons/io5";
import { FiHome } from "react-icons/fi";
import { BsPerson } from "react-icons/bs";
import { LuLogOut } from "react-icons/lu";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuCalendarClock } from "react-icons/lu";
import { Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LuSquareUser } from "react-icons/lu";
import axios from "axios";
import { MdPayments } from "react-icons/md";
import { LuCalendarCheck } from "react-icons/lu";
import { IoIosNotifications } from "react-icons/io";
const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;



const Sidebar = ({ active, setActive, closeSidebar }) => {
  const navigate = useNavigate();

  const [childIndex, setChildIndex] = useState(null);

  const navs = [
    {
      icon: <FiHome />,
      name: "Dashboard",
      link: "/",
    },
    {
      icon: <LuSquareUser />,
      name: "All Users",
      link: "/userlist"
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
      icon: <IoDocumentTextOutline />,
      name: "Document Management",
      children: [
        {
          name: "Upload Documents",
          link: "/uploadDoc",
          employeeOnly: true,
        },
        {
          name: "View Documents",
          link: "/Viewdoc",
          adminOnly: true,
        }
      ]
    },
    {
      icon:<LuCalendarClock />,
      name: "Leave Management",
      link: "/LeaveManagement",
    },
    {
      icon: <MdPayments />,
      name: "Salary Management",
      link: "/salaryManagement",
    },

    {
      icon: <IoDocuments />,
      name: "Official Documents",
      children: [
        {
          name: "Generate Offer Letter",
          link: "/offerLetter",
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
          name: "Generate Increment Letter",
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
          name: "Generate Internship Letter",
          link: "/addEmployee",
        },
      ],
    },

    {
      icon: <LuCalendarCheck />,
      name: "Attendance",
      link: "/attendance",
    },

    {
      icon: <IoIosNotifications />,
      name: "Official Notes",
      link: "/officialNotes",
    },
  ];
  const logout = async () => {
  try{
    const response = await axios.post(
      `${BASE_URL}AuthController/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    console.log("Logout:",response.data);
    navigate("/login");
  } catch (error){
    console.error("Logout failed:",error);
    navigate("/login");
  }
};


  // ==========================================
  // CLICK PARENT MENU
  // ==========================================

  const handleParentClick = (item, index) => {

    // If sidebar is collapsed
    // first click should open it
    if (!active) {
      setActive(true);
    }

    // If item has children
    if (item.children) {

      

      setChildIndex(
        childIndex === index ? null : index
      );

      return;
    }

    // Normal link
    setChildIndex(null);

    // Close sidebar after navigation
    closeSidebar();
  };


  const handleChildClick = () => {

    setChildIndex(null);

    closeSidebar();
  };
  return (

    <div
      className="sidebar_parent"
      onClick={(e) => {
        e.stopPropagation();
        setActive(true);
      }}
    >

      {/* ================= TOP ================= */}

      <div className="top">

        {/* ================= LOGO ================= */}

        <div className="logo">

          {!active ? (
            <img src={logo2} alt="Logo" />
          ) : (
            <img src={logo} alt="Logo" />
          )}

        </div>


        {/* ================= NAVIGATION ================= */}

        <div className="navsection">

          {navs.map((item, index) => (

            <div className="nav_item" key={index}>

              {/* ================= PARENT ================= */}

              {item.children ? (
                <div
                  className={
                    childIndex === index
                      ? "link active"
                      : "link"
                  }
                  onClick={() =>
                    handleParentClick(item, index)
                  }
                >

                  <span className="nav_icon">
                    {item.icon}
                  </span>

                  <span className="nav_text">
                    {item.name}
                  </span>

                </div>

              ) : (

                <Link
                  className="link"
                  to={item.link}
                  onClick={() =>
                    handleParentClick(item, index)
                  }
                >

                  <span className="nav_icon">
                    {item.icon}
                  </span>

                  <span className="nav_text">
                    {item.name}
                  </span>

                </Link>

              )}


              {/* ================= CHILDREN ================= */}

              {item.children &&
                childIndex === index && (

                  <div
                    className="child_list"
                    onMouseLeave={() =>
                      setChildIndex(null)
                    }
                  >

                    {item.children.map(
                      (child, childIndex) => (

                        <Link
                          to={child.link}
                          key={childIndex}
                          onClick={handleChildClick}
                        >
                          {child.name}
                        </Link>

                      )
                    )}

                  </div>

                )}

            </div>

          ))}

        </div>

      </div>


      {/* ================= LOGOUT ================= */}

      <Link
        className="logout"
        to="/login"
        onClick={logout}
      >

        <span>
          <LuLogOut />
        </span>

        <span className="nav_text">
          Logout
        </span>

      </Link>

    </div>
  );
};

export default Sidebar;