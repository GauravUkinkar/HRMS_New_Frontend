import React, { useEffect } from "react";
import "./AddSalary.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import SelectInput from "../../comp/selectInput/SelectInput";

import { MenuItem } from "@mui/material";
import { useParams } from "react-router-dom";

import Input from "../../comp/input/Input";
import UseForm from "../../UseForm";
import axios from "axios";
import { toast } from "react-toastify";

const EditSalary = () => {
  // Get employeeId from:
  // /editSalary/:employeeId
  const { employeeId } = useParams();

  const [salaryData, setSalaryData] = {
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
    employeeId: employeeId || "",
    uid: "",
    sid:"",
  };

  const {
    handleChange,

    values,
    error={} ,

    handleSubmit,
  } = UseForm(formObj);

//   // Set employeeId from URL
//   useEffect(() => {
//     if (employeeId) {
//       setValues((prev) => ({
//         ...prev,
//         employeeId: employeeId,
//       }));
//     }
//   }, [employeeId, setValues]);

  console.log("Employee ID from URL:", employeeId);
  console.log("Form Values:", values);
  const getSalary = async ()=>{
    try{
        setLoading(true);
        console.log(
            "Getting Salary:",
            employeeId
        );
        const response = await axios.get(
            `${BASE_URL}admin/getSalaryById/{sid}`,
            {
                withCredentials: true,
            }
        );
        console.log(
            "Salary API Response:",
            response.data
        );
        const salary =
        response.data?.data ||
        response.data;
        if (!salary) {
            toast.error(
                "Salary data not found"
            );
            return;
        }
        setSalaryData({
              email: salary.email || "",
          employeeSalary: salary.employeeSalary || "",
          grossSalary: salary.grossSalary || "",
          presentDay: salary.presentDay || "",
          paydate: salary.paydate || "",
          totalWorkingDay: salary.totalWorkingDay || "",
          salaryAdvance: salary.salaryAdvance || "",
          otherDiduction: salary.otherDiduction || "",
          professionalTax: salary.professionalTax || "",
          employeeName: salary.employeeName || "",
          insuranceCorporation: salary.insuranceCorporation || "",
          month: salary.month || "",
          year: salary.year || "",
          reimbursement: salary.reimbursement || "",
          employeeId: salary.employeeId || employeeId,
          uid: salary.uid || "",

        });
    }catch(error){
        console.error(
            "Get Salary Error:",
            error.response?.data || error
        );
        toast.error(
            "Unable to load salary details"
        );
    } finally {
        setLoading(false);
    }
};
useEffect(()=>{
    if (employeeId) {
        getSalary();
    }
},[employeeId])


  return (
    <MainPanel>
      <form onSubmit={handleSubmit} className="salary-parent">
        <h1>Edit Salary Slip</h1>
        <div className="inputs">
            <div className="form-row">
              {/* <SelectInput
                label="Select Employee"
                name="employeeName"
                error={error.employeeName}
                value={values.employeeName}
                onChange={handleChange}
                required
              >
                {employees.map((employees) => (
                  <MenuItem key={employees.data.id} value={employees.data.employeeName}>
                    {employees.data.employeeName}
                  </MenuItem>
                ))}
              </SelectInput>
              <Input
                name="employeeId"
                label="Employee ID"
                mq_label="PSPL"
                value={values.employeeId}
                error={error.employeeId}
                onChange={handleChange}
                required
              /> */}

              <SelectInput
                label="Select Employee"
                name="employeeName"
                error={error?.employeeName}
                value={values.employeeName}
                required
              >
          
                 
                
              </SelectInput>
              <Input
                name="employeeId"
                label="Employee ID"
                value={values.employeeId}
                error={error.employeeId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <Input
                name="paydate"
                label="pay Date"
                error={error?.paydate}
                value={values.paydate}
                onChange={handleChange}
                required
              />
              <SelectInput
                label="Select Month"
                name="month"
                value={values.month}
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
                value={values.year}
                error={error?.year}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <Input
                name="totalWorkingDay"
                label="Total Working Days"
                error={error?.totalWorkingDay}
                value={values.totalWorkingDay}
                onChange={handleChange}
                required
              />
              <Input
                name="presentDay"
                label="Total Present Days"
                value={values.presentDay}
                onChange={handleChange}
                error={error?.presentDay}
                required
              />
            </div>
            <div className="form-row">
              <Input
                name="grossSalary"
                label="Gross Salary"
                value={values.grossSalary ?? ""}
                onChange={handleChange}
                
                required
              />
              <Input
                name="salaryAdvance"
                label="Advance Salary"
                error={error?.salaryAdvance}
                value={values.salaryAdvance}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <Input
                name="insuranceCorporation"
                label="Insurance Corporation"
                error={error?.insuranceCorporation}
                value={values.insuranceCorporation}
                onChange={handleChange}
              />
              <Input
                name="otherDiduction"
                label="Other Deduction"
                error={error?.otherDiduction}
                value={values.otherDiduction}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <Input
                name="insurance premium"
                label="Insurance Premium"
                error={error?.professionalTax}
                value={values.professionalTax}
                onChange={handleChange}
              />
              <Input
                name="reimbursement"
                label="Riembursement"
                error={error?.reimbursement}
                value={values.reimbursement}
                onChange={handleChange}
              />
            </div>
          </div>

        <button className="btn" type="submit">
          Update Salary
        </button>
      </form>
    </MainPanel>
  );
};

export default EditSalary;