export const ValidateEmployee = (values)=>{
 let error = {};

 if(values.employeeId === ""){
    error.employeeId = "Employee Id Required"
 }
 if(values.password ===""){
   error.password = "Password is Required"
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
    if(values.employeeName ===""){
   error.employeeName = "Employee Name is Required"
 }
      if(values.contactNumber ===""){
   error.contactNumber = "Contact Number is Required"
 }
     if(values.email ===""){
   error.email = "Email is Required"
 }
      if(values.dateOfBirth ===""){
   error.dateOfBirth = "Date of Birth is Required"
 }
       if(values.aadharNumber ===""){
   error.aadharNumber = "Aadhar Number is Required"
 }
        if(values.panNumber ===""){
   error.panNumber = "Pan Number is Required"
 }
      if(values.address ===""){
   error.address = "Email is Required"
 }
       if(values.emergencyContactName ===""){
   error.emergencyContactName = "Emergency Contact name is Required"
 }
        if(values.emergencyContactNumber ===""){
   error.emergencyContactNumber = "Emergency Number name is Required"
 }
 return error
}