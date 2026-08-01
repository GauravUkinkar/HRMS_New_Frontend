export const validatePassword  = (values)=>{
let error = {};

if(values.newPassword === ""){
    error.newPassword = "Password is required"
}
if(values.confirmPassword === ""){
    error.confirmPassword = "Confirm Password is required"
}

if(values.newPassword !== values.confirmPassword){
    error.confirmPassword = "Password & Confirm Password not matched"
}
return error;

}
