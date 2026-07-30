export const ValidateEmployee = (values)=>{
 let error = {};

 if(values.employeeId === ""){
    error.employeeId = "Employee Id Required"
 }
 if(values.employeeName ===""){
   error.employeeName = "Employee Name is Required"
 }
  if(values.role ===""){
   error.role = "Role is Required"
 }
  if(values.status ===""){
   error.status = "Status is Required"
 }
 if(values.companyName ===""){
   error.companyName = "Company Name is Required"
 }
  if(values.department ===""){
   error.department = "Department is Required"
 }
   if(values.designation ===""){
   error.designation = "Designation is Required"
 }
 return error
}