import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "./Input.scss";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useState } from "react";
import dayjs from "dayjs";

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
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const types = ["date", "file", "year"];

  return (
    <div className="input">
      {mq_label && <div className="mq_label">{mq_label}</div>}

      {icon && <span className="left-icon">{icon}</span>}

      {types.includes(type) && (
        <label className="date-label">
          {required ? `${label} *` : label}
        </label>
      )}

{type === "year" ? (
  <div className="year-picker">
    <DatePicker
      views={["year"]}
      value={value ? dayjs(value, "YYYY") : null}
      onChange={(newValue) => {
        onChange({
          target: {
            name,
            value: newValue ? newValue.format("YYYY") : "",
          },
        });
      }}
      disabled={disabled}
      slotProps={{
        textField: {
          label: required ? `${label} *` : label,
          error: !!error,
          fullWidth: true,
          InputLabelProps: {
            shrink: true,
          },
        },
      }}
    />
  </div>
) : (
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
          disabled={disabled}
          type={
            type === "password"
              ? showPassword
                ? "text"
                : "password"
              : type
          }
          variant="outlined"
          InputLabelProps={
            types.includes(type)
              ? { shrink: true }
              : {}
          }
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
              color: lb_color || "rgba(0,0,0,0.6)",
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
                borderColor: fc_color || "#00615a",
                borderWidth: "2px",
              },
            },
          }}
        />
      )}

      {type === "password" && !disabled && (
        <span
          className="password"
          style={{
            color: bd_color || "black",
          }}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
        </span>
      )}
    </div>
  );
};

export default Input;