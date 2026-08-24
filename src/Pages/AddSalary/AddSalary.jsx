import { useEffect, useState } from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import Input from "../../comp/input/Input";
import SelectInput from "../../comp/selectInput/SelectInput";
import "./AddSalary.scss";
import { MenuItem } from "@mui/material";
import UseForm from "../../UseForm";
import { ValidateSalary } from "../../validators/SalaryValidate";
import axios from "axios";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_SALARY_BACKEND_URL;

const AddSalary = () => {
  const [employees, setEmployees] = useState([]);
  const formObj = {
    email:"",
    employeeSalary: "",
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
  };

  const getEmployees = async () => {
    try {
      const res = await axios.get(
        "https://userservicetest.pandozasolutions.com/Admin/GetAllEmployee",
        {
          withCredentials: true,
        },
      );
      console.log(res.data, "tfdghfghdfgduyghdfgdffd");
      setEmployees(res?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getEmployees();
  }, []);

  const generateSalary = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}admin/addNewSalary`,
        values,
        {
          withCredentials: true,
        },
      );
      toast.success("Salary added Successfully!");
     setValues({ ...formObj });
     
    setError({});

      console.log("Add Salary Response:", response.data);
    } catch (error) {
      toast.error("Salary already exists");
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);
    }
  };

  const {
  handleChange,
  setValues,
  values,
  error,
  setError,
  handleSubmit,
} = UseForm(formObj, ValidateSalary, generateSalary);

  return (
    <>
      <MainPanel>
        <form onSubmit={handleSubmit} className="salary-parent">
          <h1>Generate Salary Slip</h1>

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
                error={error.employeeName}
                value={values.employeeName}
                onChange={(e) => {
                  const selectedName = e.target.value;

                  const selectedEmployee = employees.find(
                    (employee) => employee.data.employeeName === selectedName,
                  );

                  setValues((prev) => ({
                    ...prev,
                    employeeName: selectedName,
                    employeeId: selectedEmployee?.data.employeeId || "",
                    grossSalary: selectedEmployee?.data.employeeSalary ?? 0,
                    uid: selectedEmployee?.data.uid ?? 0,
                  }));
                }}
                required
              >
                {employees.map((employee) => (
                  <MenuItem
                    key={employee.data.id}
                    value={employee.data.employeeName}
                  >
                    {employee.data.employeeName}
                  </MenuItem>
                ))}
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
                error={error.paydate}
                value={values.paydate}
                onChange={handleChange}
                required
              />
              <SelectInput
                label="Select Month"
                name="month"
                value={values.month}
                error={error.month}
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
                error={error.year}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <Input
                name="totalWorkingDay"
                label="Total Working Days"
                error={error.totalWorkingDay}
                value={values.totalWorkingDay}
                onChange={handleChange}
                required
              />
              <Input
                name="presentDay"
                label="Total Present Days"
                value={values.presentDay}
                onChange={handleChange}
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
                error={error.salaryAdvance}
                value={values.salaryAdvance}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <Input
                name="insuranceCorporation"
                label="Insurance Corporation"
                error={error.insuranceCorporation}
                value={values.insuranceCorporation}
                onChange={handleChange}
              />
              <Input
                name="otherDiduction"
                label="Other Deduction"
                error={error.otherDiduction}
                value={values.otherDiduction}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
            <Input
              name="professionalTax"
              label="Professional Tax"
              error={error?.professionalTax}
              value={values.professionalTax || ""}
              onChange={handleChange}
            />
              <Input
                name="reimbursement"
                label="Riembursement"
                error={error.reimbursement}
                value={values.reimbursement}
                onChange={handleChange}
              />
            </div>
          </div>
          <button className="btn" type="submit">
            Submit
          </button>
        </form>
      </MainPanel>
    </>
  );
};

export default AddSalary;
