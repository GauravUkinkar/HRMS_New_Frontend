import { TextField } from "@mui/material";
import "./Input.scss";

const Input = ({ label,type,onChange,value,error,required }) => {
  return (
    <>
      <TextField 
      id="outlined-basic" 
      error={error}
      required={required}
      label={label} 
      onChange={onChange}
      value={value}
      type={type ? type : "text"}
      variant="outlined" />
    </>
  );
};

export default Input;
