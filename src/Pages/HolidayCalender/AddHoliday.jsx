import React, { useContext, useState } from "react";
import { Button, DatePicker, Input, Radio } from "antd";
import {
  CalendarOutlined,
  FileTextOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import MainPanel from "../../comp/MainPanel/MainPanel";
import { UserContext } from "../../../Context";
import "./AddHoliday.scss";

const { TextArea } = Input;

const AddHoliday = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: null,
    day: "",
    description: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(false);

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date,
      day: date ? date.format("dddd") : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date) {
      toast.error("Please select a holiday date");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a holiday description");
      return;
    }

    // Connect your Add Holiday API here.
    // API endpoint and payload format are not yet provided.
    toast.info("Please connect the Add Holiday API to save this holiday.");
  };

  const isEmployee =
    String(user?.role || user?.crmRole || "").trim().toUpperCase() ===
    "EMPLOYEE";

  return (
    <MainPanel
      breadcrumbs={[
        { label: "Dashboard", link: "/" },
        { label: "Holiday Calendar", link: "/holidayCalender" },
        { label: "Add Holiday" },
      ]}
      title={isEmployee ? "Employee Dashboard" : "Admin Dashboard"}
    >
      <div className="add-holiday-page">
        <div className="add-holiday-heading">
          <div className="heading-icon">
            <CalendarOutlined />
          </div>

          <div>
            <h2>Add Holiday</h2>
            <p>Create a new holiday for your organization</p>
          </div>
        </div>

        <form className="add-holiday-card" onSubmit={handleSubmit}>
          <div className="holiday-form-grid">
            <div className="holiday-field">
              <label>
                Holiday Date <span>*</span>
              </label>

              <DatePicker
                className="holiday-input"
                placeholder="Select holiday date"
                format="DD MMM YYYY"
                value={formData.date}
                onChange={handleDateChange}
                suffixIcon={<CalendarOutlined />}
                disabled={loading}
              />
            </div>

            <div className="holiday-field">
              <label>
                Day <span>*</span>
              </label>

              <Input
                className="holiday-input day-input"
                value={formData.day}
                placeholder="Automatically selected"
                prefix={<CalendarOutlined />}
                readOnly
              />
            </div>

            <div className="holiday-field description-field">
              <label>
                Description <span>*</span>
              </label>

              <TextArea
                className="holiday-description"
                placeholder="Enter holiday description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                maxLength={250}
                showCount
                disabled={loading}
              />
            </div>

            <div className="holiday-field status-field">
              <label>
                Status <span>*</span>
              </label>

              <Radio.Group
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                disabled={loading}
              >
                <Radio value="ACTIVE">Active</Radio>
                <Radio value="CANCELLED">Cancelled</Radio>
              </Radio.Group>
            </div>
          </div>

          <div className="holiday-form-footer">
            <Button
              className="cancel-holiday-btn"
              icon={<CloseOutlined />}
              onClick={() => navigate("/holidayCalender")}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              className="save-holiday-btn"
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
            >
              Save Holiday
            </Button>
          </div>
        </form>
      </div>
    </MainPanel>
  );
};

export default AddHoliday;