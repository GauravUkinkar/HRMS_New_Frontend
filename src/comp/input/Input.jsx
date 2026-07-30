import { TextField } from "@mui/material";
import "./Input.scss";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useState } from "react";
import { InputAdornment } from "@mui/material";


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
  name,
  mq_label,
  icon,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input">
      {mq_label && <div className="mq_label">{mq_label}</div>}
      {icon && <span className="left-icon">{icon}</span>}
      <TextField
        id="outlined-basic"
        error={error}
        name={name}
        required={required}
        label={error ? error : label}
        onBlur={onblur}
        onChange={onChange}
        value={value}
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        variant="outlined"
        sx={{
          "& input": {
            color: text_color || "#000",
            paddingLeft: icon ? "52px" : mq_label ? "10%" : "10px",
          },
          "& .MuiInputLabel-root": {
            color: lb_color || "black",
            left: icon ? "28px" : mq_label ? "10%" : "10px",
          },

          "& .MuiInputLabel-root.Mui-focused": {
            color: fc_color || "var(--accent)",
            left: icon ? "28px" : mq_label ? "10%" : "10px",
          },

          "& .MuiOutlinedInput-notchedOutline legend": {
            marginLeft: mq_label ? "10%" : "10px",
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
              borderWidth: 1,
            },
          },

          "& .MuiInputAdornment-root": {
            color: fc_color || "var(--accent)",
            fontSize: "22px",
            marginLeft: "8px",
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
