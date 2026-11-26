
import React, { useContext, useEffect, useState } from "react";
import { Table, Tag, Button, Modal } from "antd";
import {
  PlusOutlined,
  StopOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import MainPanel from "../../comp/MainPanel/MainPanel";
import "./HolidayCalender.scss";
import { UserContext } from "../../../Context";
import { useNavigate } from "react-router-dom";

const HolidayCalender = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [holidays, setHolidays] = useState([]);
  const [loader, setLoader] = useState(false);

  // Get user role
  const userRole = String(user?.role || user?.crmRole || "")
    .trim()
    .toUpperCase();

  // Only ADMIN and SUPERADMIN can add holidays
  const isAdmin = ["ADMIN", "SUPERADMIN"].includes(userRole);

  // Cancel Holiday
  const handleCancelHoliday = (record) => {
    Modal.confirm({
      title: "Cancel Holiday",
      content: `Are you sure you want to cancel "${record.description}"?`,
      okText: "Yes, Cancel",
      okButtonProps: { danger: true },
      cancelText: "No",

      onOk: async () => {
        try {
          const response = await axios.delete(
            `https://userservice.pandozasolutions.com/Admin/DeleteHoliday/${record.id}`,
            {
              withCredentials:true,
            }
          );
          toast.success(
            response.data?.responseMessage ||
            "Hoiliday cancelled successfully!"
          );
          getHolidays();
        } catch (error) {
          console.error(
            error.response?.data || error
          );
          toast.error(
            error.response?.data?.responseMessage ||
            "Unable to cancel holiday"
          );
        }
      },
    });
  };

  // Get All Holidays API
  const getHolidays = async () => {
    try {
      setLoader(true);

      const response = await axios.get(
        "https://userservice.pandozasolutions.com/AuthController/GetAllHoliday",
        {
          withCredentials: true,
        }
      );

      console.log("Holiday API Response:", response.data);

      const holidayList = Array.isArray(response.data)
        ? response.data
        : response.data?.data
          ? [response.data]
          : [];

      setHolidays(
        holidayList
          .filter((item) => item?.data)
          .map((item, index) => {
            const holiday = item.data;

            return {
              ...holiday,
              key: holiday.id ?? holiday.holidayId ?? index,

              date:
                holiday.date ||
                holiday.holidayDate ||
                holiday.holiday_date ||
                "",

              day: holiday.day || "",

              description:
                holiday.discription ||
                holiday.description ||
                holiday.holidayName ||
                holiday.name ||
                holiday.holiday ||
                "",

              status: holiday.status || "",
            };
          })
      );
    } catch (error) {
      console.error("Holiday API Error:", error);

      toast.error(
        error.response?.data?.responseMessage ||
        "Unable to fetch holiday details"
      );
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getHolidays();
  }, []);

  // Table Columns
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 180,

      render: (date) => {
        if (!date) return "-";

        const parsedDate = new Date(date);

        return !isNaN(parsedDate.getTime())
          ? parsedDate.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : date;
      },
    },

    {
      title: "Day",
      dataIndex: "day",
      key: "day",
      width: 150,

      render: (day) =>
        day ? <Tag color="blue">{day}</Tag> : "-",
    },

    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 500,

      render: (description) => description || "-",
    },

    // Actions visible only to ADMIN and SUPERADMIN
    ...(isAdmin
      ? [
          {
            title: "Actions",
            key: "actions",
            width: 180,
            align: "center",

            render: (_, record) => (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "center",
                }}
              >
                <Button
                  danger
                  size="small"
                  icon={<StopOutlined />}
                  disabled={
                    String(record.status || "").toUpperCase() ===
                    "CANCELLED"
                  }
                  onClick={() => handleCancelHoliday(record)}
                >
                  Cancel
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <MainPanel
      breadcrumbs={[
        { label: "Dashboard", link: "/" },
        { label: "Holiday Calendar" },
      ]}
      title={
        userRole === "EMPLOYEE"
          ? "Employee Dashboard"
          : "Admin Dashboard"
      }
    >
      <button
        type="button"
        className="back-btn"
        onClick={() => navigate("/")}
      >
        ← Back
      </button>

      <div className="calender-header">
        <h2>Holiday Calendar</h2>

        {/* Add Holiday button only for ADMIN and SUPERADMIN */}
        {isAdmin && (
          <Button
            className="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/addHoliday")}
          >
            Add Holiday
          </Button>
        )}
      </div>

      <div className="holiday-table">
        <Table
          columns={columns}
          dataSource={holidays}
          loading={loader}
          pagination={false}
          bordered
          scroll={{ x: 830 }}
          rowClassName={(record, index) =>
            `${index % 2 === 0 ? "table-row-light" : "table-row-dark"} ${
              String(record.status || "").toUpperCase() ===
              "CANCELLED"
                ? "cancelled-holiday"
                : ""
            }`
          }
        />
      </div>
    </MainPanel>
  );
};

export default HolidayCalender;
