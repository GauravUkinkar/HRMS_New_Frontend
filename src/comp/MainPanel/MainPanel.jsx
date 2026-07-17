import { useState } from "react";
import "./MainPanel.scss";
import Sidebar from "../sidebar/Sidebar";
import Table_Comp from "../table/Table";

const MainPanel = () => {
 


  const [active, setActive] = useState(false);
  return (
    <>
      <div class="main_panel parent">
        <div class={active ? "sidebar active" : "sidebar"}>
          <Sidebar active={active} />
        </div>
        <div class={active ? "main_section active" : "main_section"}>
          <div class="header">
            <div class="hanburger" onClick={() => setActive(!active)}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="name" style={{ width: "500px",marginTop:"500px" }}>
             
            </div>
          </div>
          <div class="botttom_page"></div>
        </div>
      </div>
    </>
  );
};

export default MainPanel;
