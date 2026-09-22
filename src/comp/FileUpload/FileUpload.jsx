import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const FileUpload = ({
  label = "Upload File",
  onChange,
  multiple = false,
  accept,
  required = false,
  file,
}) => {
  return (
    <Button
      component="label"
      variant="outlined"
      fullWidth
      startIcon={<CloudUploadIcon />}
      sx={{
        justifyContent: "flex-start",
        color: "black",
        borderColor: file ? "#22c55e" : "black",
        height: "56px",
        textTransform: "none",
        backgroundColor: file ? "#f0fdf4" : "transparent",
        "&:hover": {
          borderColor: "var(--accent)",
          backgroundColor: file ? "#f0fdf4" : "transparent",
        },
      }}
    >
      {label}

      {required && (
        <span style={{ color: "red", marginLeft: "4px" }}> *</span>
      )}

      {file && (
        <CheckCircleIcon
          sx={{
            color: "#22c55e",
            fontSize: "20px",
            marginLeft: "8px",
          }}
        />
      )}

      <VisuallyHiddenInput
        type="file"
        onChange={onChange}
        multiple={multiple}
        accept={accept}
        required={required}
      />
    </Button>
  );
};

export default FileUpload;