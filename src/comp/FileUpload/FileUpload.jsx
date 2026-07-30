import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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
        borderColor: "black",
        height: "56px",
        textTransform: "none",

        "&:hover": {
          borderColor: "var(--accent)",
        },
      }}
    >
      
        {label}
  {required && <span style={{ color: "red", marginLeft: "4px" }}> *</span>}

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