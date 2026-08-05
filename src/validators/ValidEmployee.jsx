export const ValidateEmployee = (values)=>{
 let error = {};

 if(values.employeeId === ""){
    error.employeeId = "Employee Id Required"
 }
if (values.password === "") {
  error.password = "Password is required";
} else if (values.password.length < 8) {
  error.password = "Password must be at least 8 characters";
} else if (!/[A-Z]/.test(values.password)) {
  error.password = "Password must contain at least one uppercase letter";
} else if (!/[a-z]/.test(values.password)) {
  error.password = "Password must contain at least one lowercase letter";
} else if (!/[0-9]/.test(values.password)) {
  error.password = "Password must contain at least one number";
} else if (!/[!@#$%^&*(),.?":{}|<>]/.test(values.password)) {
  error.password = "Password must contain at least one special character";
}

  if(values.role === ""){
   error.role = "Role is Required"
 }
  if(values.status === ""){
   error.status = "Status is Required"
 }
 if(values.gender === ""){
      error.gender = "gender is Required"
 }
 if(values.companyName === ""){
   error.companyName = "Company Name is Required"
 }
  if(values.department === ""){
   error.department = "Department is Required"
 }
   if(values.designation === ""){
   error.designation = "Designation is Required"
 }
    if(values.employeeName ===""){
   error.employeeName = "Employee Name is Required"
 }
if (values.contactNumber === "") {
  error.contactNumber = "Contact Number is required";
} else if (!/^[6-9]\d{9}$/.test(values.contactNumber)) {
  error.contactNumber =
    "Contact Number must be a valid 10-digit mobile number";
}
if (values.email === "") {
  error.email = "Email is required";
} else if (
  !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(values.email)
) {
  error.email = "Please enter a valid email address";
}
      if(values.dateOfBirth ===""){
   error.dateOfBirth = "Date of Birth is Required"
 }
if (values.aadharNumber === "") {
  error.aadharNumber = "Aadhaar Number is required";
} else if (!/^\d{12}$/.test(values.aadharNumber)) {
  error.aadharNumber = "Aadhaar Number must be exactly 12 digits";
}
if (values.panNumber === "") {
  error.panNumber = "PAN Number is required";
} else if (
  !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(values.panNumber.toUpperCase())
) {
  error.panNumber = "Please enter a valid PAN Number";
}
      if(values.address ===""){
   error.address = "Address is Required"
 }
       if(values.emergencyContactName ===""){
   error.emergencyContactName = "Emergency Contact name is Required"
 }
        if(values.emergencyContactNumber ===""){
   error.emergencyContactNumber = "Emergency Number name is Required";
 } else if (!/^[6-9]\d{9}$/.test(values.emergencyContactNumber)){
  error.emergencyContactNumber="Emergency Contact Number must be a valid 10-digit mobile number";
 }
         if(values.employeeSalary ===""){
   error.employeeSalary = "Employee Salary is Required"
 }
          if(values.costtoCompany ===""){
   error.costtoCompany = "Cost to Company is Required"
 }
           if(values.bankName ===""){
   error.bankName = "Bank Name is Required"
 }
if (values.accountNumber === "") {
  error.accountNumber = "Account Number is required";
} else if (!/^\d{9,18}$/.test(values.accountNumber)) {
  error.accountNumber =
    "Account Number must be between 9 and 18 digits";
}
             if(values.ifscCode ===""){
   error.ifscCode = "IFSC Code is Required"
 }
              if(values.bloodGroup ===""){
   error.bloodGroup = "Blood Group is Required"
 }
               if(values.managerName ===""){
   error.managerName = "Manager Name is Required"
 }
               if(values.crmRole ===""){
   error.crmRole = "CRM Role is Required"
 }
               if(values.teamName ===""){
   error.teamName = "Team Name is Required"
 }
 return error
}