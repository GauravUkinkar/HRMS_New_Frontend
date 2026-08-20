import { FormControl, InputLabel, Select } from "@mui/material";
import "./SelectInput.scss";

const SelectInput = ({
  children,
  name,
  value,
  onChange,
  label,
  error,
  required,
}) => {
  return (
    <FormControl
      fullWidth
      className="SelectInput"
      error={error}
      required={required}
    >
      <InputLabel id={`${name}-label`}>
        {label}
      </InputLabel>

      <Select
        labelId={`${name}-label`}
        id={name}
        value={value}
        label={label}
        name={name}
        onChange={onChange}
      >
        {children}
      </Select>
    </FormControl>
  );
};

export default SelectInput;