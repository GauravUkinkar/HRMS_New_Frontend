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
  text_color,
  name
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input">
      <TextField
        id="outlined-basic"
        error={error}
        name={name}
        required={required}
        label={error ? error : label}
        onChange={onChange}
        value={value}
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        variant="outlined"
       sx={{
  "& .MuiInputLabel-root": {
    color: lb_color || "black",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: fc_color || "var(--accent)",
  },

  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: bd_color || "black",
    },
    "&:hover fieldset": {
      borderColor: fc_color || "var(--accent)",
    },
    "&.Mui-focused fieldset": {
      borderColor: fc_color || "var(--accent)",
      borderWidth: 2,
    },
  },

  "& input": {
    color: text_color || "#000",
  },

  "& input:-webkit-autofill": {
    WebkitTextFillColor: `white`,
    WebkitBoxShadow: "0 0 0px 1000px #0000 inset !important",
    boxShadow: "0 0 0px 1000px #0000 inset !important",
    transition: "background-color 50000s ease-in-out 0s",
  },

  "& input:-webkit-autofill:hover": {
    WebkitTextFillColor: ` #ffff`,
    WebkitBoxShadow: "0 0 0px 1000px transparent inset !important",
  },

  "& input:-webkit-autofill:focus": {
    WebkitTextFillColor: ` "#fffff`,
    WebkitBoxShadow: "0 0 0px 1000px transparent inset !important",
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
