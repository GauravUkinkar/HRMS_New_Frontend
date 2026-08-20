import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import App from "./App";
import ContextProvider from "../Context";


createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ContextProvider>
        <App />
      </ContextProvider>
    </LocalizationProvider>
  </BrowserRouter>
);