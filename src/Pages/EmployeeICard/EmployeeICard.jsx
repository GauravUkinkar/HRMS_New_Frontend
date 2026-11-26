
import React, {
    useContext,
    useRef,
    useState,
    useEffect,
} from "react";

import { useNavigate } from "react-router-dom";
import MainPanel from "../../comp/MainPanel/MainPanel";
import "./EmployeeiCard.scss";

import img1 from "../../assets/offer-logo-pan.png";
import img2 from "../../assets/tij-logo.png";
import img3 from "../../assets/nvm-logo.png";
import img4 from "../../assets/akka-foundation.png";

import {
    Space,
    Table,
    Input,
    Button,
    Tooltip,
    Modal,
} from "antd";

import {
    SearchOutlined,
    EyeOutlined,
    FilePdfOutlined,
} from "@ant-design/icons";

import { UserContext } from "../../../Context";
import axios from "axios";
import { toast } from "react-toastify";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;
///
const ICARD_API = "";

const companyBranding = {
    pandoza: {
        name: "Pandoza Solutions PVT. LTD.",
        logo: img1,
        primary: "#1688c7",
        secondary: "#07518a",
        accent: "#e6f5fc",
    },

    indianJourney: {
        name: "The Indian Journey",
        logo: img2,
        primary: "#e87524",
        secondary: "#6bf349",
        accent: "#e8ffea",
    },

    nvm: {
        name: "NVM Infratech",
        logo: img3,
        primary: "red",
        secondary: "#142d55",
        accent: "#edf2fa",
    },

    akka: {
        name: "Akka Foundation",
        logo: img4,
        primary: "#F58220",
        secondary: "#C65316",
        accent: "#FFF3E8",
    },
};

const getCompanyBranding = (companyName = "") => {
    const company = String(companyName)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

    if (company.includes("indianjourney")) {
        return companyBranding.indianJourney;
    }

    if (company.includes("nvminfratech") || company === "nvm") {
        return companyBranding.nvm;
    }

    if (company.includes("akkafoundation") || company === "akka") {
        return companyBranding.akka;
    }

    return companyBranding.pandoza;
};

const EmployeeICard = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [allemployee, setAllEmployee] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [viewModal, setViewModal] = useState(false);
    const [generating, setGenerating] = useState(false);

    const searchInput = useRef(null);
    const idCardRef = useRef(null);

    const formatName = (name = "") => {
        return String(name)
            .trim()
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const getFirstAndLastName = (name = "") => {
        const nameParts = formatName(name)
            .split(/\s+/)
            .filter(Boolean);

        return {
            firstName: nameParts[0] || "",
            lastName:
                nameParts.length > 1
                    ? nameParts[nameParts.length - 1]
                    : "",
        };
    };

    const getAllEmployee = async () => {
        setLoading(true);

        try {
            const res = await axios.get(
                `${BASE_URL}Admin/GetAllEmployee`,
                {
                    withCredentials: true,
                }
            );

            const employees = Array.isArray(res?.data)
                ? res.data
                    .map((item, index) => {
                        const employee = item?.data || {};

                        return {
                            key:
                                employee.uid ||
                                employee.employeeId ||
                                index + 1,

                            uid: employee.uid || "",
                            empId: employee.employeeId || "",
                            company: employee.companyName || "",
                            name: employee.employeeName || "",
                            designation: employee.designation || "",
                            email: employee.email || "",
                            phone: employee.contactNumber || "",
                            address: employee.currentAddress || "",
                            bloodGroup: employee.bloodGroup || "",
                            photo: employee.image || "",
                        };
                    })
                    .filter(
                        (item) => item.empId || item.uid
                    )
                : [];

            setAllEmployee(employees);
        } catch (error) {
            console.error("Get All Employee Error:", error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to load employees"
            );

            setAllEmployee([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllEmployee();
    }, []);

    const handleView = (record) => {
        setSelectedEmployee(record);
        setViewModal(true);
    };

    const handleCloseModal = () => {
        if (generating) return;

        setViewModal(false);
        setSelectedEmployee(null);
    };

    const handleGenerateICard = async () => {
        if (!selectedEmployee) {
            toast.error("Please select an employee");
            return;
        }

        if (!selectedEmployee.empId) {
            toast.error("Employee ID is missing");
            return;
        }

        if (!ICARD_API.trim()) {
            toast.error("Please add the Employee ID Card API endpoint");
            return;
        }

        if (!idCardRef.current) {
            toast.error("Employee ID Card is not available");
            return;
        }

        setGenerating(true);

        try {
            const cardElement = idCardRef.current;

            const canvas = await html2canvas(cardElement, {
                scale: 3,
                useCORS: true,
                allowTaint: false,
                backgroundColor: "#ffffff",
                logging: false,
                imageTimeout: 15000,
            });

            const imageData = canvas.toDataURL("image/jpeg", 1);

            const pdfWidth = 85.6;
            const pdfHeight = 136.5;

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: [pdfWidth, pdfHeight],
            });

            pdf.addImage(
                imageData,
                "JPEG",
                0,
                0,
                pdfWidth,
                pdfHeight
            );

            const pdfBlob = pdf.output("blob");

            const fileName = `${selectedEmployee.empId}_ID_Card.pdf`;

            const formData = new FormData();

            formData.append("file", pdfBlob, fileName);

            formData.append(
                "data",
                JSON.stringify({
                    employeeId: selectedEmployee.empId,
                    documentName: fileName,
                })
            );

            const response = await axios.post(
                `${BASE_URL}${ICARD_API}`,
                formData,
                {
                    withCredentials: true,
                }
            );

            toast.success(
                response?.data?.message ||
                "Employee ID Card generated successfully"
            );
        } catch (error) {
            console.error("Generate Employee ID Card Error:", error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to generate Employee ID Card"
            );
        } finally {
            setGenerating(false);
        }
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
                onKeyDown={(event) => event.stopPropagation()}
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
                    onPressEnter={() => confirm()}
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
                    color: filtered ? "#1677ff" : undefined,
                }}
            />
        ),

        onFilter: (value, record) => {
            const recordValue = record?.[dataIndex];

            const searchableValue =
                dataIndex === "name"
                    ? formatName(recordValue)
                    : String(recordValue || "");

            return searchableValue
                .toLowerCase()
                .includes(String(value || "").toLowerCase());
        },

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
            title: "Company Name",
            dataIndex: "company",
            key: "company",
            width: 220,
            ...getColumnSearchProps("company"),
        },
        {
            title: "Emp ID",
            dataIndex: "empId",
            key: "empId",
            width: 130,
            ...getColumnSearchProps("empId"),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 180,
            ...getColumnSearchProps("name"),
            render: (name) => formatName(name),
        },
        {
            title: "Mail ID",
            dataIndex: "email",
            key: "email",
            width: 240,
            ...getColumnSearchProps("email"),
        },
        {
            title: "Designation",
            dataIndex: "designation",
            key: "designation",
            width: 170,
            ...getColumnSearchProps("designation"),
        },
        {
            title: "Phone No.",
            dataIndex: "phone",
            key: "phone",
            width: 150,
            ...getColumnSearchProps("phone"),
        },
        {
            title: "Blood Group",
            dataIndex: "bloodGroup",
            key: "bloodGroup",
            width: 130,
            ...getColumnSearchProps("bloodGroup"),
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            width: 220,
            ...getColumnSearchProps("address"),
        },
        {
            title: "Actions",
            key: "actions",
            width: 100,
            fixed: "right",
            align: "center",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="View Employee ID Card">
                        <EyeOutlined
                            className="employee-view"
                            onClick={() => handleView(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const selectedBrand = selectedEmployee
        ? getCompanyBranding(selectedEmployee.company)
        : companyBranding.pandoza;

    return (
        <>
            <MainPanel
                breadcrumbs={[
                    {
                        label: "Dashboard",
                        link: "/",
                    },
                    {
                        label: "Employee ID Card",
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

                <div className="employeeicard-parent">
                    <div className="page-header">
                        <h2>Employee ID Card</h2>

                        <div className="btn-group">
                            <div className="count">
                                Total Number Of Employees:
                                <span>{allemployee.length}</span>
                            </div>
                        </div>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={allemployee}
                        rowKey="key"
                        loading={loading}
                        bordered
                        scroll={{
                            x: "max-content",
                        }}
                        pagination={{
                            defaultCurrent: 1,
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ["10", "20", "50"],
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} employees`,
                        }}
                        rowClassName={(_, index) =>
                            index % 2 === 0
                                ? "table-row-light"
                                : "table-row-dark"
                        }
                    />
                </div>

                <Modal
                    title="Employee ID Card"
                    className="Employee_Details"
                    open={viewModal}
                    onCancel={handleCloseModal}
                    footer={[
                        <Button
                            key="generate"
                            type="primary"
                            icon={<FilePdfOutlined />}
                            loading={generating}
                            disabled={generating}
                            onClick={handleGenerateICard}
                        >
                            Generate
                        </Button>,

                        <Button
                            key="close"
                            disabled={generating}
                            onClick={handleCloseModal}
                        >
                            Close
                        </Button>,
                    ]}
                    centered
                    width={490}
                    closable={!generating}
                    maskClosable={!generating}
                >
                    {selectedEmployee && (
                        <div
                            ref={idCardRef}
                            className="employee-id-card"
                            style={{
                                "--card-primary": selectedBrand.primary,
                                "--card-secondary": selectedBrand.secondary,
                                "--card-accent": selectedBrand.accent,
                            }}
                        >
                            <div className="employee-card-sidebar">
                                <h2>
                                    {selectedBrand.name}
                                </h2>
                            </div>

                            <div className="employee-card-content">
                                <div className="employee-company">
                                    <img
                                        src={selectedBrand.logo}
                                        alt={selectedBrand.name}
                                        crossOrigin="anonymous"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = img1;
                                        }}
                                    />
                                </div>

                                <div className="employee-card-photo">
                                    <img
                                        src={selectedEmployee.photo || ""}
                                        alt={formatName(selectedEmployee.name)}
                                    />
                                </div>

                                <div className="employee-card-name">
                                    <h2>
                                        {getFirstAndLastName(selectedEmployee.name).firstName}{" "}

                                        <span>
                                            {getFirstAndLastName(selectedEmployee.name).lastName}
                                        </span>
                                    </h2>

                                    <p>
                                        ({selectedEmployee.designation})
                                    </p>
                                </div>

                                <div className="employee-card-details">
                                    <div className="employee-card-row">
                                        <span>Emp Id</span>
                                        <strong>:</strong>
                                        <p>
                                            {selectedEmployee.empId || "N/A"}
                                        </p>
                                    </div>

                                    <div className="employee-card-row">
                                        <span>Email</span>
                                        <strong>:</strong>
                                        <p>
                                            {selectedEmployee.email || "N/A"}
                                        </p>
                                    </div>

                                    <div className="employee-card-row">
                                        <span>Phone</span>
                                        <strong>:</strong>
                                        <p>
                                            {selectedEmployee.phone || "N/A"}
                                        </p>
                                    </div>

                                    <div className="employee-card-row">
                                        <span>Blood G.</span>
                                        <strong>:</strong>
                                        <p>
                                            {selectedEmployee.bloodGroup || "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div className="employee-card-address">
                                    <h3>Address</h3>

                                    <p>
                                        {selectedEmployee.address || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </MainPanel>
        </>
    );
};

export default EmployeeICard;
