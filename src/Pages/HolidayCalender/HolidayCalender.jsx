import React, { useContext, useEffect, useState } from "react";
import { Table, Tag, Button, Modal } from "antd";
import { PlusOutlined, StopOutlined, DeleteOutlined } from "@ant-design/icons";
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
  const isAdmin = ["ADMIN", "SUPERADMIN"].includes(
    String(user?.role || user?.crmRole || "")
      .trim()
      .toUpperCase(),
  );


  const handleCancelHoliday = (record) => {
    Modal.confirm({
      title: "Cancel Holiday",
      content: `Are you sure you want to cancel "${record.description}"?`,
      okText: "Yes, Cancel",
      okButtonProps: { danger: true },
      cancelText: "No",
      onOk: async () => {
        // Call your holiday cancellation API here.
        toast.info("Connect the Cancel Holiday API here.");
      },
    });
  };

  const handleDeleteHoliday = (record) => {
    Modal.confirm({
      title: "Delete Holiday",
      content: `Are you sure you want to delete "${record.description}"?`,
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "No",
      onOk: async () => {
        // Call your holiday deletion API here.
        toast.info("Connect the Delete Holiday API here.");
      },
    });
  };

  const getHolidays = async () => {
    try {
      setLoader(true);

      const response = await axios.get(
        "https://userservice.pandozasolutions.com/AuthController/GetAllHoliday",
        { withCredentials: true },
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
          }),
      );
    } catch (error) {
      console.error("Holiday API Error:", error);
      toast.error(
        error.response?.data?.responseMessage ||
          "Unable to fetch holiday details",
      );
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getHolidays();
  }, []);

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
      render: (day) => (day ? <Tag color="blue">{day}</Tag> : "-"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 500,
      render: (description) => description || "-",
    },
    ...(isAdmin
      ? [
          {
            title: "Actions",
            key: "actions",
            width: 180,
            align: "center",
            render: (_, record) => (
              <div
                style={{ display: "flex", gap: 8, justifyContent: "center" }}
              >
                <Button
                  danger
                  size="small"
                  icon={<StopOutlined />}
                  disabled={
                    String(record.status || "").toUpperCase() === "CANCELLED"
                  }
                  onClick={() => handleCancelHoliday(record)}
                >
                  Cancel
                </Button>

                <Button
                  danger
                  type="primary"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteHoliday(record)}
                >
                  Delete
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
        String(user?.role || user?.crmRole || "")
          .trim()
          .toUpperCase() === "EMPLOYEE"
          ? "Employee Dashboard"
          : "Admin Dashboard"
      }
    >
      <button
        type="button"
        className="back-btn"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        ← Back
      </button>
      <div className="calender-header">
        <h2>Holiday Calendar</h2>

        {isAdmin && (
  <Button
    className="add"
    type="button"
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
              String(record.status || "").toUpperCase() === "CANCELLED"
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
