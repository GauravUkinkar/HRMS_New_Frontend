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
  name,
  mq_label,
  icon,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const types = ["date", "file"];

  return (
    <div className="input">
      {mq_label && <div className="mq_label">{mq_label} </div>}
      {icon && <span className="left-icon">{icon}</span>}
      {types.includes(type) && (
        <label className="date-label">{required ? `${label} *` : label}</label>
      )}

      <TextField
        error={!!error}
        name={name}
        label={
          types.includes(type)
            ? undefined
            : required
              ? `${error || label} *`
              : error || label
        }
        onChange={onChange}
        value={value}
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        variant="outlined"
        // Required for date field
        InputLabelProps={types.includes(type) ? { shrink: true } : {}}
        sx={{
          "& input": {
            color: text_color || "#000",
            paddingLeft: types.includes(type)
              ? "14px"
              : icon
                ? "52px"
                : mq_label
                  ? "10%"
                  : "10px",
          },

          "& .MuiInputLabel-root": {
            color: lb_color || "black",
            // padding:"0px 20px",
            marginLeft: types.includes(type)
              ? 0
              : icon
                ? "28px"
                : mq_label
                  ? "10%"
                  : "10px",
          },

          "& .MuiInputLabel-root.Mui-focused": {
            color: fc_color || "var(--accent)",

            left: types.includes(type)
              ? 0
              : icon
                ? "28px"
                : mq_label
                  ? "10px"
                  : "10px",
          },

          "& .MuiOutlinedInput-notchedOutline legend": {
            marginLeft: types.includes(type) ? 0 : mq_label ? "10%" : "10px",
          },

          "& .MuiInputLabel-root": {
            color: lb_color || "rgba(0,0,0,0.6)",
            marginLeft: types.includes(type)
              ? 0
              : icon
                ? "28px"
                : mq_label
                  ? "10%"
                  : "10px",
          },

          "& .MuiInputLabel-root.Mui-focused": {
            color: fc_color || "rgba(0,0,0,0.6)",
          },

          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: bd_color || "rgba(0,0,0,0.23)",
            },
            "&:hover fieldset": {
              borderColor: bd_color || "rgba(0,0,0,0.4)",
            },
            "&.Mui-focused fieldset": {
              borderColor: fc_color || "#1976d2",
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
