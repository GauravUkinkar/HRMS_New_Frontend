import "./Sidebar.scss";

import logo from "../../assets/logo.png";
import logo2 from "../../assets/logopan.webp";

import { IoDocuments } from "react-icons/io5";
import { FiHome } from "react-icons/fi";
import { BsPerson } from "react-icons/bs";
import { LuLogOut } from "react-icons/lu";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuCalendarClock } from "react-icons/lu";
import { LuSquareUser } from "react-icons/lu";
import { MdPayments } from "react-icons/md";
import { LuCalendarCheck } from "react-icons/lu";
import { IoIosNotifications } from "react-icons/io";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

const Sidebar = ({
  active,
  setActive,
  closeSidebar,
}) => {
  const navigate = useNavigate();

  const [childIndex, setChildIndex] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        setRoleLoading(true);

        const response = await axios.get(
          `${BASE_URL}AuthController/getUserById`,
          {
            withCredentials: true,
          }
        );

        if (response.data?.status === "OK") {
          const role = response.data?.data?.role;

          setUserRole(
            role
              ? role.toString().trim().toUpperCase()
              : ""
          );
        } else {
          setUserRole("");
        }
      } catch (error) {
        console.error(
          "Sidebar user API error:",
          error
        );
        setUserRole("");
      } finally {
        setRoleLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  const role = userRole
    ?.toString()
    .trim()
    .toUpperCase();

  const isAdmin = role === "ADMIN";
  const isEmployee = role === "EMPLOYEE";

  const navs = [
    {
      icon: <FiHome />,
      name: "Dashboard",
      link: isAdmin ? "/" : "/Empdashboard",
    },

    {
      icon: <LuSquareUser />,
      name: "All Users",
      link: "/userlist",
      adminOnly: true,
    },

    {
      icon: <BsPerson />,
      name: "Employee",
      adminOnly: true,
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
        },
      ],
    },

    {
      icon: <LuCalendarClock />,
      name: "Leave Management",
      link: "/LeaveManagement",
    },

    {
      icon: <MdPayments />,
      name: "Salary Management",
      link: "/salaryManagement",
      adminOnly: true,
    },

    {
      icon: <IoDocuments />,
      name: "Official Documents",
      adminOnly: true,
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
          link: "/incrementLetter",
        },
        {
          name: "Generate Promotion Letter",
          link: "/promotionLetter",
        },
        {
          name: "Generate Experience Letter",
          link: "/experienceLetter",
        },
        {
          name: "Generate Releaving Letter",
          link: "/releavingLetter",
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
          link: "/internshipLetter",
        },
      ],
    },

    {
      icon: <LuCalendarCheck />,
      name: "Attendance",
      link: "/attendance",
      adminOnly: true,
    },

    {
      icon: <IoIosNotifications />,
      name: "Official Notes",
      link: "/officialNotes",
      adminOnly: true,
    },

    {
      icon: <IoDocumentTextOutline />,
      name: "Payslip",
      link: "/Payslip",
      employeeOnly: true,
    },
  ];

  const canShowMenu = (item) => {
    if (item.adminOnly && !isAdmin) {
      return false;
    }

    if (item.employeeOnly && !isEmployee) {
      return false;
    }

    return true;
  };

  const canShowChild = (child) => {
    if (child.adminOnly && !isAdmin) {
      return false;
    }

    if (child.employeeOnly && !isEmployee) {
      return false;
    }

    return true;
  };

  const handleParentClick = (item, index) => {
    if (!active) {
      setActive(true);
    }

    if (item.children) {
      const visibleChildren =
        item.children.filter(canShowChild);

      if (visibleChildren.length === 0) {
        return;
      }

      setChildIndex(
        childIndex === index
          ? null
          : index
      );

      return;
    }

    setChildIndex(null);

    if (closeSidebar) {
      closeSidebar();
    }
  };

  const handleChildClick = () => {
    setChildIndex(null);

    if (closeSidebar) {
      closeSidebar();
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${BASE_URL}AuthController/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      navigate("/login");
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );

      navigate("/login");
    }
  };

  if (roleLoading) {
    return (
      <div
        className="sidebar_parent"
        onClick={(e) => {
          e.stopPropagation();
          setActive(true);
        }}
      >
        <div className="top">
          <div className="logo">
            {!active ? (
              <img
                src={logo2}
                alt="Logo"
              />
            ) : (
              <img
                src={logo}
                alt="Logo"
              />
            )}
          </div>
        </div>

        <div className="logout">
          <span>
            <LuLogOut />
          </span>

          <span className="nav_text">
            Logout
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="sidebar_parent"
      onClick={(e) => {
        e.stopPropagation();
        setActive(true);
      }}
    >
      <div className="top">
        <div className="logo">
          {!active ? (
            <img
              src={logo2}
              alt="Logo"
            />
          ) : (
            <img
              src={logo}
              alt="Logo"
            />
          )}
        </div>

        <div className="navsection">
          {navs
            .filter(canShowMenu)
            .map((item, index) => {
              const visibleChildren =
                item.children
                  ? item.children.filter(
                      canShowChild
                    )
                  : [];

              if (
                item.children &&
                visibleChildren.length === 0
              ) {
                return null;
              }

              return (
                <div
                  className="nav_item"
                  key={item.name}
                >
                  {item.children ? (
                    <div
                      className={
                        childIndex === index
                          ? "link active"
                          : "link"
                      }
                      onClick={() =>
                        handleParentClick(
                          item,
                          index
                        )
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
                        handleParentClick(
                          item,
                          index
                        )
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

                  {item.children &&
                    childIndex === index && (
                      <div
                        className="child_list"
                        onMouseLeave={() =>
                          setChildIndex(null)
                        }
                      >
                        {visibleChildren.map(
                          (
                            child,
                            childIndex
                          ) => (
                            <Link
                              to={child.link}
                              key={`${child.name}-${childIndex}`}
                              onClick={
                                handleChildClick
                              }
                            >
                              {child.name}
                            </Link>
                          )
                        )}
                      </div>
                    )}
                </div>
              );
            })}
        </div>
      </div>

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