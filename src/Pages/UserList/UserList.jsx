import { useEffect, useState } from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import { Space, Table } from "antd";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import "./userlist.scss";
const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

const UserList = () => {
    const [alluser, setAllUser] = useState([]);
    const [showDeletedUsers, setShowDeletedUsers] =
        useState(false);
    const [loading, setLoading] = useState(false);

    const formatUsers = (response) => {
        const data = Array.isArray(response)
            ? response : Array.isArray(response?.data)
                ? response.data
                : [];
        return data.map((item, index) => {
            const user = item?.data || item || {};

            return {
                key: user.uid ||
                    user.uId ||
                    user.userId ||
                    index + 1,
                email: user.email || "N/A",
                role: user.role || "N/A",
                isDeleted: user.isDeleted ?? null,
                uid: user.uid || "N/A",
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
            console.log("Active Users Response:", res.data);
            const users = formatUsers(res.data);
            console.log("Formatted Active Users:", users);
            setAllUser(users);
        } catch (error) {
            console.error("Get Active User Error:", error.response?.data || error);
            toast.error(error.response?.data?.message || "Failed to load active users");
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
            console.log("Deleted Users Full Response:", res.data);
            const deletedUsers = formatUsers(res.data);
            console.log("Formatted Deleted Users:", deletedUsers);
            setAllUser(deletedUsers);
        } catch (error) {
            console.error("Get Deleted Users Error:", error.response?.data || error);
            toast.error(error.response?.data?.message || "Failed to load deleted users");
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

    const handleDeleteUser = (uid) => {
        if (!uid) {
            toast.error("User ID is missing");
            return;
        }
        toast.warning(
            ({ closeToast }) => (
                <div>
                    <div
                        style={{ marginBottom: "10px", }}
                    >
                        Are you sure you want to delete
                        this user?
                    </div>
                    <div
                        style={{
                            display: "flex", gap: "8px",
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
                                border:
                                    "1px solid #ccc",
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

    const deleteUser = async (uid) => {
        try {
            console.log("Deleting User UID:", uid);
            const response = await axios.delete(
                `${BASE_URL}Admin/deleteUserByUserId/${uid}`,
                {
                    withCredentials: true,
                }
            );


            console.log(
                "Delete User Response:",
                response.data
            );


            toast.success(
                "User deleted successfully"
            );
            setAllUser((prevUsers) =>
                prevUsers.filter(
                    (user) => user.uid !== uid));
        } catch (error) {
            console.error(
                "Delete User Error:",
                error.response?.data || error
            );
            toast.error(
                error.response?.data?.message ||
                "Failed to delete user"
            );

        }

    };

    useEffect(() => {
        getAllUser();
    }, []);

    const columns = [
        {
            title: (
                <>
                    User ID <SearchOutlined />
                </>
            ),
            dataIndex: "uid",
            key: "uid",
            width: 150,
            fixed: "left",
        },
        ...(!showDeletedUsers
            ? []
            : []),

        {
            title: (
                <>Email <SearchOutlined /></>
            ),
            dataIndex: "email",
            key: "email",
            width: 260,
        },
        {
            title: (
                <>
                    Role <SearchOutlined />
                </>
            ),
            dataIndex: "role",
            key: "role",
            width: 260,
        },
        {
            title: "Status",
            dataIndex: "isDeleted",
            key: "status",
            width: 140,
            render: (_, record) => {
                const isActive =
                    record.isDeleted === false ||
                    record.isDeleted === "false";
                return (
                    <span
                        className={
                            isActive
                                ? "user-status active"
                                : "user-status inactive"
                        }
                    >
                        {isActive
                            ? "Active"
                            : "Inactive"}
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


                            {/* DELETE */}
                            <DeleteOutlined
                                className="delete"
                                onClick={() => handleDeleteUser(record.uid)
                                }
                            />

                        </Space>
                    ),
                },
            ]
            : []),
    ];

    return (

        <>
            <MainPanel
                title="User List "
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "User List" },
                ]}

            >
                <div className="user-list">
                    <div className="page-header">
                        <h2>
                            {showDeletedUsers
                                ? "Deleted Users"
                                : "All Users"}
                        </h2>
                        <div className="btn-group">
                            <div className="count">
                                Total Number Of Users: <span>{alluser.length}</span>
                            </div>
                            <button
                                type="button"
                                className={
                                    !showDeletedUsers
                                        ? "active"
                                        : ""
                                }
                                onClick={handleActiveUsers}>
                                <span><FaPlus /></span>
                                Active Users
                            </button>
                            <button
                                type="button"
                                className={
                                    showDeletedUsers
                                        ? "active"
                                        : ""}
                                onClick={handleDeletedUsers}
                            >
                                <span><FaEye /></span>Deleted User
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
                            pageSize: 20,
                            showSizeChanger: true,
                        }}

                        rowClassName={
                            (_, index) =>
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