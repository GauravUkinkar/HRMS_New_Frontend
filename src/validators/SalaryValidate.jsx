export const ValidateSalary = (values) => {
  let error = {};

 

  if (values.paydate === "") {
    error.paydate = "Pay Date is Required";
  }

  if (values.month === "") {
    error.month = "Month is Required";
  }

  if (values.year === "") {
    error.year = "Year is Required";
  }

  if (values.totalWorkingDay === "") {
    error.totalWorkingDay = "Total Working Days are Required";
  }

  if (values.presentDay === "") {
    error.presentDay = "Present Days are Required";
  }

  if (values.grossSalary === "") {
    error.grossSalary = "Gross Salary is Required";
  }

  return error;
};