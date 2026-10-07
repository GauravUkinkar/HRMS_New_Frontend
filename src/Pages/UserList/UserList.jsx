import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainPanel from "../../comp/MainPanel/MainPanel";
import { Space, Table, Input, Button } from "antd";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import "./userlist.scss";
import { UserContext } from "../../../Context";

const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

const UserList = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [alluser, setAllUser] = useState([]);
  const [showDeletedUsers, setShowDeletedUsers] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchInput = useRef(null);

  const formatUsers = (response) => {
    const data = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
        ? response.data
        : [];

    return data.map((item, index) => {
      const currentUser = item?.data || item || {};

      return {
        key:
          currentUser.uid ||
          currentUser.uId ||
          currentUser.userId ||
          index + 1,

        email: currentUser.email || "N/A",

        role: currentUser.role || "N/A",

        isDeleted: currentUser.isDeleted ?? null,

        uid:
          currentUser.uid ||
          currentUser.uId ||
          currentUser.userId ||
          "N/A",
      };
    });
  };

  const getAllUser = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}Admin/GetAllUser`,
        {
          withCredentials: true,
        }
      );

      const users = formatUsers(res.data);

      setAllUser(users);
    } catch (error) {
      console.error(
        "Get Active User Error:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load active users"
      );
    } finally {
      setLoading(false);
    }
  };

  const getDeletedUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}Admin/getAllDeletedUsers/deleted`,
        {
          withCredentials: true,
        }
      );

      const deletedUsers = formatUsers(res.data);

      setAllUser(deletedUsers);
    } catch (error) {
      console.error(
        "Get Deleted Users Error:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load deleted users"
      );

      setAllUser([]);
    } finally {
      setLoading(false);
    }
  };

  const handleActiveUsers = () => {
    setShowDeletedUsers(false);
    getAllUser();
  };

  const handleDeletedUsers = () => {
    setShowDeletedUsers(true);
    getDeletedUsers();
  };

  const deleteUser = async (uid) => {
    try {
      if (!uid) {
        toast.error("User ID is missing");
        return;
      }

      const response = await axios.delete(
        `${BASE_URL}Admin/deleteUserByUserId/${uid}`,
        {
          withCredentials: true,
        }
      );

      if (
        response?.status >= 200 &&
        response?.status < 300
      ) {
        toast.success("User deleted successfully");

        setAllUser((prevUsers) =>
          prevUsers.filter(
            (currentUser) =>
              String(currentUser.uid) !== String(uid)
          )
        );
      }
    } catch (error) {
      console.error(
        "Delete User Error:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  const handleDeleteUser = (uid) => {
    if (!uid) {
      toast.error("User ID is missing");
      return;
    }

    toast.warning(
      ({ closeToast }) => (
        <div>
          <div
            style={{
              marginBottom: "10px",
            }}
          >
            Are you sure you want to delete this user?
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                closeToast();
                deleteUser(uid);
              }}
              style={{
                border: "none",
                background: "#dc3545",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Confirm
            </button>

            <button
              type="button"
              onClick={closeToast}
              style={{
                border: "1px solid #ccc",
                background: "#fff",
                color: "#333",
                padding: "6px 14px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
          width: 220,
        }}
        onKeyDown={(event) =>
          event.stopPropagation()
        }
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0] || ""}
          onChange={(event) => {
            setSelectedKeys(
              event.target.value
                ? [event.target.value]
                : []
            );
          }}
          onPressEnter={() => {
            confirm();
          }}
          allowClear
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />

        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            size="small"
            onClick={() => confirm()}
          >
            Search
          </Button>

          <Button
            size="small"
            onClick={() => {
              clearFilters?.();

              confirm({
                closeDropdown: true,
              });
            }}
          >
            Reset
          </Button>

          <Button
            type="link"
            size="small"
            onClick={() => close()}
          >
            Close
          </Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered
            ? "#1677ff"
            : undefined,
        }}
      />
    ),

    onFilter: (value, record) =>
      String(record?.[dataIndex] || "")
        .toLowerCase()
        .includes(
          String(value || "").toLowerCase()
        ),

    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          searchInput.current?.select();
        }, 100);
      }
    },
  });

  const columns = [
    {
      title: "User ID",
      dataIndex: "uid",
      key: "uid",
      width: 150,
      fixed: "left",
      ...getColumnSearchProps("uid"),

      render: (uid) => uid || "N/A",
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 260,
      ...getColumnSearchProps("email"),

      render: (email) => email || "N/A",
    },

    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 180,
      ...getColumnSearchProps("role"),

      render: (role) => role || "N/A",
    },

    {
      title: "Status",
      dataIndex: "isDeleted",
      key: "status",
      width: 140,

      render: (_, record) => {
        const isActive =
          record?.isDeleted === false ||
          record?.isDeleted === "false";

        return (
          <span
            className={
              isActive
                ? "user-status active"
                : "user-status inactive"
            }
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },

    ...(!showDeletedUsers
      ? [
          {
            title: "Actions",
            key: "actions",
            width: 140,
            fixed: "right",

            render: (_, record) => (
              <Space size="middle">
                <DeleteOutlined
                  className="delete"
                  onClick={() =>
                    handleDeleteUser(
                      record?.uid
                    )
                  }
                />
              </Space>
            ),
          },
        ]
      : []),
  ];

  useEffect(() => {
    getAllUser();
  }, []);

  return (
    <>
      <MainPanel
        breadcrumbs={[
          {
            label: "Dashboard",
            link: "/dashboard",
          },
          {
            label: "User List",
          },
        ]}
        title={
          String(
            user?.role ||
              user?.crmRole ||
              ""
          )
            .trim()
            .toUpperCase() === "ADMIN"
            ? "Admin Dashboard"
            : ""
        }
      >
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        <div className="user-list">
          <div className="page-header">
            <h2>
              {showDeletedUsers
                ? "Deleted Users"
                : "All Users"}
            </h2>

            <div className="btn-group">
              <div className="count">
                Total Number Of Users:
                <span>
                  {alluser.length}
                </span>
              </div>

              <button
                type="button"
                className={
                  !showDeletedUsers
                    ? "active"
                    : ""
                }
                onClick={handleActiveUsers}
              >
                <span>
                  <FaPlus />
                </span>
                Active Users
              </button>

              <button
                type="button"
                className={
                  showDeletedUsers
                    ? "active"
                    : ""
                }
                onClick={handleDeletedUsers}
              >
                <span>
                  <FaEye />
                </span>
                Deleted User
              </button>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={alluser}
            loading={loading}
            bordered
            scroll={{
              x: "max-content",
            }}
            pagination={{
              defaultCurrent: 1,
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: [
                "10",
                "20",
                "50",
              ],
              showQuickJumper: true,

              showTotal: (
                total,
                range
              ) =>
                `${range[0]}-${range[1]} of ${total} users`,
            }}
            rowClassName={(_, index) =>
              index % 2 === 0
                ? "table-row-light"
                : "table-row-dark"
            }
          />
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
        />
      </MainPanel>
    </>
  );
};

export default UserList;