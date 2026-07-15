import { FormControl, InputLabel, Select } from "@mui/material";
import "./SelectInput.scss";


const SelectInput = ({ children, value, onChange,label,error,required }) => {
  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={label}
          onChange={onChange}
          error={error}
          required={required}
        >
          {children}
        </Select>
      </FormControl>
    </>
  );
};

export default SelectInput;
