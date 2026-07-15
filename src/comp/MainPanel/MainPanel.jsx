import { useState } from "react";
import "./MainPanel.scss";
import Sidebar from "../sidebar/Sidebar";

import SelectInput from "../selectInput/SelectInput";
import { MenuItem } from "@mui/material";
import Input from "../input/Input";

const MainPanel = () => {
  const [active, setActive] = useState(false);
  return (
    <>
      <div class="main_panel parent">
        <div class={active ? "sidebar active" : "sidebar"}>
            <Sidebar  active={active} />
        </div>
        <div class={active ? "main_section active" : "main_section"}>
          <div class="header">
            <div class="hanburger" onClick={()=>setActive(!active)}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="name" style={{width: "500px"}}>
          
            </div>
          </div>
          <div class="botttom_page"></div>
        </div>
      </div>
    </>
  );
};

export default MainPanel;
