import { TextField } from "@mui/material";
import "./Input.scss";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useState } from "react";

const Input = ({
  label,
  type = "text",
  onChange,
  value,
  error,
  required,
  bd_color,
  lb_color,
  fc_color,
  text_color
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input">
      <TextField
        id="outlined-basic"
        error={error}
        required={required}
        label={label}
        onChange={onChange}
        value={value}
        type={
          type === "password"
            ? showPassword
              ? "text"
              : "password"
            : type
        }
        variant="outlined"
       sx={{
  // Label
  "& .MuiInputLabel-root": {
    color: lb_color || "black",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: fc_color || "var(--accent)",
  },

  // Input text
  "& .MuiInputBase-input": {
    color: text_color || "black",
  },

  // Border
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: bd_color || "black",
    },
    "&:hover fieldset": {
      borderColor: fc_color || "var(--accent)",
    },
    "&.Mui-focused fieldset": {
      borderColor: fc_color || "var(--accent)",
      borderWidth: "2px",
    },
  },
}}
      />

      {type === "password" && (
        <span
          className="password"
          style={{ color: bd_color || "black" }}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
        </span>
      )}
    </div>
  );
};

export default Input;