import React, { useEffect, useRef, useState } from "react";
import {
    Table,
    Space,
    Input,
    Button,
    message,
} from "antd";
import { DeleteOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import "./LeaveManagement.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import { useNavigate } from "react-router-dom";


const BASE_URL = import.meta.env.VITE_SALARY_BACKEND_URL;

const LeaveManagement = () => {

    const navigate = useNavigate();
    const [leaveData, setLeaveData] = useState([]);
    const [statusFilter, setStatusFilter] =
        useState(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] =
        useState(null);
    const searchInput = useRef(null);
    const normalizeStatus = (status) => {
        if (!status) {
            return "Pending";
        }

        const value = status
            .toString()
            .trim()
            .toLowerCase();

        if (value === "pending") {
            return "Pending";
        }

        if (value === "approved") {
            return "Approved";
        }

        if (value === "rejected") {
            return "Rejected";
        }

        return status;
    };

    const getAllLeaves = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${BASE_URL}admin/getAllLeaves`,
                {
                    withCredentials: true,
                }
            );

            console.log(
                "GETALLLEAVES",
                response.data
            );

            const leaves =
                response.data?.data || [];

            const formattedData = leaves.map(
                (item) => ({
                    key: item.lid,

                    lid: item.lid,

                    uid: item.uid,

                    employeeName:
                        item.employeeName || "-",

                    employeeId:
                        item.employeeId || "-",

                    leaveType:
                        item.leaveReason || "-",

                    reason:
                        item.leaveReason || "-",

                    days:
                        item.totalleaveDays || 0,

                    from:
                        item.leaveDates?.length
                            ? item.leaveDates[0]?.date ||
                            "-"
                            : "-",

                    to:
                        item.leaveDates?.length
                            ? item.leaveDates[
                                item.leaveDates.length - 1
                            ]?.date || "-"
                            : "-",

                    leaveDates:
                        item.leaveDates || [],

                    entryDate:
                        item.entryDate || null,

                    status: normalizeStatus(
                        item.approved
                    ),
                })
            );

            console.log(
                "FORMATTED LEAVE DATA",
                formattedData
            );

            setLeaveData(formattedData);
        } catch (error) {
            console.error(
                "GET ALL LEAVES ERROR",
                error.response?.data || error
            );

            message.error(
                "Failed to fetch leaves"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllLeaves();
    }, []);

    const handleLeaveStatus = async (
        lid,
        status
    ) => {

        console.log("LID:", lid);
        console.log("STATUS:", status);

        if (
            lid === undefined ||
            lid === null ||
            lid === ""
        ) {
            message.error(
                "Leave ID is missing"
            );
            return;
        }

        try {
            setActionLoading(
                `${lid}-${status}`
            );

            const response = await axios.post(
                `${BASE_URL}admin/approveLeave`,
                null,
                {
                    params: {
                        lid: lid,
                        status: status,
                    },
                    withCredentials: true,
                }
            );

            console.log(
                "APPROVE LEAVE RESPONSE",
                response.data
            );

            if (
                status === "approved"
            ) {
                message.success(
                    "Leave approved successfully"
                );
            } else if (
                status === "rejected"
            ) {
                message.success(
                    "Leave rejected successfully"
                );
            }

            await getAllLeaves();

            if (
                statusFilter &&
                statusFilter !== "Pending"
            ) {
                setStatusFilter(null);
            }
        } catch (error) {
            console.error(
                "APPROVE/REJECT ERROR",
                error.response?.data || error
            );

            console.error(
                "STATUS CODE",
                error.response?.status
            );

            console.error(
                "REQUEST URL",
                error.config?.url
            );

            console.error(
                "REQUEST PARAMS",
                error.config?.params
            );

            message.error(
                error.response?.data?.message ||
                "Failed to update leave status"
            );
        } finally {
            setActionLoading(null);
        }
    };

    const handleApprove = (record) => {
        console.log(
            "APPROVE RECORD",
            record
        );

        console.log(
            "APPROVE LID",
            record.lid
        );

        handleLeaveStatus(
            record.lid,
            "approved"
        );
    };

    const handleReject = (record) => {
        console.log(
            "REJECT RECORD",
            record
        );

        console.log(
            "REJECT LID",
            record.lid
        );

        handleLeaveStatus(
            record.lid,
            "rejected"
        );
    };

    const handleDelete = async (record) => {
        console.log("DELETE RECORD:", record);
        console.log("DELETE LID:", record.lid);

        if (
            record.lid === undefined ||
            record.lid === null
        ) {
            message.error("Leave ID is missing");
            return;
        }

        try {
            setActionLoading(`delete-${record.lid}`);

            const response = await axios.delete(
                `${BASE_URL}AuthController/deleteLeave`,
                {
                    params: {
                        lId: record.lid,
                    },
                    withCredentials: true,
                }
            );

            console.log(
                "DELETE LEAVE RESPONSE:",
                response.data
            );

            message.success(
                "Leave deleted successfully"
            );

            await getAllLeaves();
        } catch (error) {
            console.error(
                "DELETE LEAVE ERROR:",
                error.response?.data || error
            );

            console.error(
                "DELETE STATUS:",
                error.response?.status
            );

            message.error(
                error.response?.data?.message ||
                "Failed to delete leave"
            );
        } finally {
            setActionLoading(null);
        }
    };

    const handleSearch = (
        selectedKeys,
        confirm
    ) => {
        confirm();
    };

    const handleReset = (
        clearFilters,
        confirm
    ) => {
        clearFilters();
        confirm();
    };

    const getColumnSearchProps = (
        dataIndex,
        placeholder
    ) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) =>
                    e.stopPropagation()
                }
            >
                <Input
                    ref={searchInput}
                    placeholder={placeholder}
                    value={
                        selectedKeys[0] || ""
                    }
                    onChange={(e) => {
                        setSelectedKeys(
                            e.target.value
                                ? [e.target.value]
                                : []
                        );
                    }}
                    onPressEnter={() =>
                        handleSearch(
                            selectedKeys,
                            confirm
                        )
                    }
                    style={{
                        marginBottom: 8,
                        display: "block",
                        width: 220,
                    }}
                />

                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(
                                selectedKeys,
                                confirm
                            )
                        }
                        icon={
                            <SearchOutlined />
                        }
                        size="small"
                    >
                        Search
                    </Button>

                    <Button
                        onClick={() =>
                            handleReset(
                                clearFilters,
                                confirm
                            )
                        }
                        size="small"
                    >
                        Reset
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

        onFilter: (
            value,
            record
        ) => {
            const recordValue =
                record[dataIndex];

            if (
                recordValue === undefined ||
                recordValue === null
            ) {
                return false;
            }

            return recordValue
                .toString()
                .toLowerCase()
                .includes(
                    value
                        .toString()
                        .toLowerCase()
                );
        },

        filterDropdownProps: {
            onOpenChange: (
                visible
            ) => {
                if (visible) {
                    setTimeout(() => {
                        searchInput.current?.select();
                    }, 100);
                }
            },
        },
    });



    const pendingCount =
        leaveData.filter(
            (item) =>
                item.status ===
                "Pending"
        ).length;

    const approvedCount =
        leaveData.filter(
            (item) =>
                item.status ===
                "Approved"
        ).length;

    const rejectedCount =
        leaveData.filter(
            (item) =>
                item.status ===
                "Rejected"
        ).length;

    const filteredLeaveData =
        statusFilter
            ? leaveData.filter(
                (item) =>
                    item.status ===
                    statusFilter
            )
            : leaveData;

    const columns = [
        {
            title: "Employee Name",
            dataIndex:
                "employeeName",
            key: "employeeName",
            width: 220,
            fixed: "left",

            ...getColumnSearchProps(
                "employeeName",
                "Search employee name"
            ),
        },

        {
            title: "Employee ID",
            dataIndex:
                "employeeId",
            key: "employeeId",
            width: 160,
            fixed: "left",

            ...getColumnSearchProps(
                "employeeId",
                "Search employee ID"
            ),
        },

        {
            title: "Leave Type",
            dataIndex:
                "leaveType",
            key: "leaveType",
            width: 160,

            ...getColumnSearchProps(
                "leaveType",
                "Search leave type"
            ),
        },

        {
            title: "From",
            dataIndex: "from",
            key: "from",
            width: 140,
        },

        {
            title: "To",
            dataIndex: "to",
            key: "to",
            width: 140,
        },

        {
            title: "Days",
            dataIndex: "days",
            key: "days",
            width: 100,
            align: "center",
        },

        {
            title: "Reason",
            dataIndex: "reason",
            key: "reason",
            width: 220,

            render: (reason) => (
                <span
                    title={reason}
                    style={{
                        display: "inline-block",
                        maxWidth: "200px",
                        whiteSpace:
                            "nowrap",
                        overflow:
                            "hidden",
                        textOverflow:
                            "ellipsis",
                    }}
                >
                    {reason || "-"}
                </span>
            ),

            ...getColumnSearchProps(
                "reason",
                "Search reason"
            ),
        },

        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 250,
            align: "center",

            render: (
                status,
                record
            ) => {
                const currentStatus =
                    status
                        ?.toString()
                        .trim()
                        .toLowerCase();

                if (
                    currentStatus ===
                    "pending"
                ) {
                    return (
                        <Space>
                            <Button
                                className="approve-action-btn"
                                size="small"
                                loading={
                                    actionLoading ===
                                    `${record.lid}-approved`
                                }
                                disabled={
                                    actionLoading !==
                                    null
                                }
                                onClick={() =>
                                    handleApprove(
                                        record
                                    )
                                }
                            >
                                Approve
                            </Button>

                            <Button
                                className="reject-action-btn"
                                size="small"
                                loading={
                                    actionLoading ===
                                    `${record.lid}-rejected`
                                }
                                disabled={
                                    actionLoading !==
                                    null
                                }
                                onClick={() =>
                                    handleReject(
                                        record
                                    )
                                }
                            >
                                Reject
                            </Button>
                        </Space>
                    );
                }

                if (
                    currentStatus ===
                    "approved"
                ) {
                    return (
                        <span className="approved-status">
                            Approved
                        </span>
                    );
                }

                if (
                    currentStatus ===
                    "rejected"
                ) {
                    return (
                        <span className="rejected-status">
                            Rejected
                        </span>
                    );
                }

                return null;
            },
        },

        {
            title: "Actions",
            key: "actions",
            width: 120,
            fixed: "right",

            render: (_, record) => (
                <Space size="middle">
                    <EyeOutlined
                        className="view-action-icon"
                        onClick={() =>
                            navigate(`/EmployeeLeaves/${record.employeeId}`)
                        }
                    />

                    <DeleteOutlined
                        className="delete-action-icon"
                        onClick={() => handleDelete(record)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <MainPanel>
            <div className="leave-list">
                <div className="page-header">
                    <h2>
                        Leave Management
                    </h2>

                    <div className="btn-group">


                        <div
                            className={`pending ${statusFilter ===
                                "Pending"
                                ? "active-filter"
                                : ""
                                }`}
                            onClick={() =>
                                setStatusFilter(
                                    "Pending"
                                )
                            }
                        >
                            <span>
                                Pending Leaves
                            </span>

                            <span>
                                {pendingCount}
                            </span>
                        </div>

                        <div
                            className={`approved ${statusFilter ===
                                "Approved"
                                ? "active-filter"
                                : ""
                                }`}
                            onClick={() =>
                                setStatusFilter(
                                    "Approved"
                                )
                            }
                        >
                            <span>
                                Approved Leaves
                            </span>

                            <span>
                                {approvedCount}
                            </span>
                        </div>

                        <div
                            className={`rejected ${statusFilter ===
                                "Rejected"
                                ? "active-filter"
                                : ""
                                }`}
                            onClick={() =>
                                setStatusFilter(
                                    "Rejected"
                                )
                            }
                        >
                            <span>
                                Rejected Leaves
                            </span>

                            <span>
                                {rejectedCount}
                            </span>
                        </div>
                    </div>
                </div>

                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={
                        filteredLeaveData
                    }
                    bordered
                    scroll={{
                        x: "max-content",
                    }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: [
                            "10",
                            "20",
                            "50",
                            "100",
                        ],
                    }}
                    rowClassName={(
                        _record,
                        index
                    ) =>
                        index % 2 === 0
                            ? "table-row-light"
                            : "table-row-dark"
                    }
                />
            </div>
        </MainPanel>
    );
};

export default LeaveManagement;