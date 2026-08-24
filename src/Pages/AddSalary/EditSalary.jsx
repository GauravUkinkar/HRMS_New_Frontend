import React, { useEffect, useState } from "react";
import "./AddSalary.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import SelectInput from "../../comp/selectInput/SelectInput";
import { useParams } from "react-router-dom";
import { MenuItem } from "@mui/material";
import Input from "../../comp/input/Input";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_SALARY_BACKEND_URL;

const EditSalary = () => {
  const { sId } = useParams();

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const [salaryData, setSalaryData] = useState({
    email: "",
    employeeSalary: "",
    grossSalary: "",
    presentDay: "",
    paydate: "",
    totalWorkingDay: "",
    salaryAdvance: "",
    otherDiduction: "",
    professionalTax: "",
    employeeName: "",
    insuranceCorporation: "",
    month: "",
    year: "",
    reimbursement: "",
    employeeId: "",
    uid: "",
    sId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSalaryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
const getSalary = async () => {
  if (!sId) {
    console.error("Salary ID is missing");
    return;
  }

  try {
    setLoading(true);

    console.log("Salary ID from URL:", sId);

    const response = await axios.get(
      `${BASE_URL}admin/getSalaryById`,
      {
        params: {
          sId: sId,
        },
        withCredentials: true,
      }
    );

    console.log("STATUS:", response.status);
    console.log("FULL RESPONSE:", response.data);

    const salary = response.data?.data;

    if (!salary) {
      toast.error("Salary data not found");
      return;
    }

    setSalaryData({
      email: salary.email ?? "",
      employeeSalary: salary.employeeSalary ?? "",
      grossSalary: salary.grossSalary ?? "",
      presentDay: salary.presentDay ?? "",
      paydate: salary.paydate ?? "",
      totalWorkingDay: salary.totalWorkingDay ?? "",
      salaryAdvance: salary.salaryAdvance ?? "",
      otherDiduction: salary.otherDiduction ?? "",
      professionalTax: salary.professionalTax ?? "",
      employeeName: salary.employeeName ?? "",
      insuranceCorporation: salary.insuranceCorporation ?? "",
      month: salary.month ?? "",
      year: salary.year ?? "",
      reimbursement: salary.reimbursement ?? "",
      employeeId: salary.employeeId ?? "",
      uid: salary.uid ?? "",
      sId: salary.sid ?? sId,
    });

  } catch (err) {
    console.error("GET SALARY ERROR:", err);
    console.error("Status:", err.response?.status);
    console.error("Response:", err.response?.data);

    toast.error(
      err.response?.data?.responseMessage ||
      "Unable to load salary details"
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    getSalary();
  }, [sId]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Updating salary:", salaryData);


  };

  return (
    <MainPanel>
      <form
        onSubmit={handleSubmit}
        className="salary-parent"
      >
        <h1>Edit Salary Slip</h1>

        {loading && <p>Loading salary details...</p>}

        <div className="inputs">

          {/* Employee */}
          <div className="form-row">

            <Input
              label="Employee Name"
              name="employeeName"
              error={error?.employeeName}
              value={salaryData.employeeName || ""}
              onChange={handleChange}
              required
            />

            <Input
              name="employeeId"
              label="Employee ID"
              value={salaryData.employeeId || ""}
              error={error?.employeeId}
              onChange={handleChange}
              required
            />

          </div>

          {/* Pay Date / Month / Year */}
          <div className="form-row">

            <Input
              name="paydate"
              label="Pay Date"
              error={error?.paydate}
              value={salaryData.paydate || ""}
              onChange={handleChange}
              required
            />

            <SelectInput
              label="Select Month"
              name="month"
              value={salaryData.month || ""}
              error={error?.month}
              onChange={handleChange}
              required
            >
              <MenuItem value="January">January</MenuItem>
              <MenuItem value="February">February</MenuItem>
              <MenuItem value="March">March</MenuItem>
              <MenuItem value="April">April</MenuItem>
              <MenuItem value="May">May</MenuItem>
              <MenuItem value="June">June</MenuItem>
              <MenuItem value="July">July</MenuItem>
              <MenuItem value="August">August</MenuItem>
              <MenuItem value="September">September</MenuItem>
              <MenuItem value="October">October</MenuItem>
              <MenuItem value="November">November</MenuItem>
              <MenuItem value="December">December</MenuItem>
            </SelectInput>

            <Input
              name="year"
              label="Year"
              value={salaryData.year || ""}
              error={error?.year}
              onChange={handleChange}
              required
            />

          </div>

          {/* Working Days */}
          <div className="form-row">

            <Input
              name="totalWorkingDay"
              label="Total Working Days"
              error={error?.totalWorkingDay}
              value={salaryData.totalWorkingDay || ""}
              onChange={handleChange}
              required
            />

            <Input
              name="presentDay"
              label="Total Present Days"
              value={salaryData.presentDay || ""}
              error={error?.presentDay}
              onChange={handleChange}
              required
            />

          </div>

          {/* Salary */}
          <div className="form-row">

            <Input
              name="grossSalary"
              label="Gross Salary"
              value={salaryData.grossSalary || ""}
              error={error?.grossSalary}
              onChange={handleChange}
              required
            />

            <Input
              name="salaryAdvance"
              label="Advance Salary"
              error={error?.salaryAdvance}
              value={salaryData.salaryAdvance || ""}
              onChange={handleChange}
            />

          </div>

          {/* Insurance / Deduction */}
          <div className="form-row">

            <Input
              name="insuranceCorporation"
              label="Insurance Corporation"
              error={error?.insuranceCorporation}
              value={salaryData.insuranceCorporation || ""}
              onChange={handleChange}
            />

            <Input
              name="otherDiduction"
              label="Other Deduction"
              error={error?.otherDiduction}
              value={salaryData.otherDiduction || ""}
              onChange={handleChange}
            />

          </div>

          {/* Professional Tax / Reimbursement */}
          <div className="form-row">

            <Input
              name="professionalTax"
              label="Professional Tax"
              error={error?.professionalTax}
              value={salaryData.professionalTax || ""}
              onChange={handleChange}
            />

            <Input
              name="reimbursement"
              label="Reimbursement"
              error={error?.reimbursement}
              value={salaryData.reimbursement || ""}
              onChange={handleChange}
            />

          </div>

        </div>

        <button
          className="btn"
          type="submit"
          disabled={loading}
        >
          Update Salary
        </button>

      </form>
    </MainPanel>
  );
};

export default EditSalary;