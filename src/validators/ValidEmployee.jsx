export const ValidateEmployee = (values)=>{
 let error = {};

 if(values.employeeId === ""){
    error.employeeId = "Employee Id Required"
 }
 return error
}