import React from "react";
import "./Generatesalary.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import { FaRegListAlt } from "react-icons/fa";
import Input from "../../comp/input/Input";
import SelectInput from "../../comp/selectInput/SelectInput";
import { MenuItem } from "@mui/material";

const Generatesalary = () => {
    
    const getAllEmployee = () =>{
        try {
            
        } catch(err){
            console.log (err)
        }
    }
  return (
    <>
      <MainPanel>
        <div className="generate-salary">
          <div className="one-sec">
           <div className="sect">
             <FaRegListAlt className="icon" />
            <p>Generate Salary Slip</p>
           </div>
          </div>
          <div className="sections">
            <div className="top">
              <div className="no1">1</div>
              <div className="text">                                                       
                <p>Employee Information</p>
              </div>
            </div>
           
              <div className="form-row">
                <SelectInput label="Select Employee">
                  <MenuItem value="">Choose Employee</MenuItem>
                </SelectInput>
                <Input label="Employee Id" />
              </div>
          
          </div>
          <div className="sections">
            <div className="top">
              <div className="no1">2</div>
              <div className="text">
                <p>Pay Period</p>
              </div>
            </div>
           
              <div className="form-row">
                <Input type="date" label="Pay Date" />
                <SelectInput label="Month">
                  <MenuItem value="">Select Month</MenuItem>
                </SelectInput>
                <SelectInput label="Year">
                  <MenuItem value="">Select Year</MenuItem>
                </SelectInput>
              </div>
           
          </div>
          <div className="sections">
            <div className="top">
              <div className="no1">3</div>
              <div className="text">
                <p>Salary & Day</p>
              </div>
            </div>
           
              <div className="form-row">
                <Input name="Salary" required label="Gross Salary" />
                <Input name="Salary" required label="Present Days" />
                <Input name="Salary" required label="Total Working Days" />
                <Input name="Salary" required label="Advance Salary" />
              </div>
              
      
          </div>
          <div className="sections">
            <div className="top">
              <div className="no1">4</div>
              <div className="text">
                <p>Deduction (optional)</p>
              </div>
            </div>
            
              <div className="form-row">
                <Input label="Other Deduction" />
                <Input  label="Professional Tax" />
                 <Input  label="Insurance Premium" />
                  <Input  label="PT Refund (if applicable)" />
              </div>
            
            
        
          </div>
          <button type="submit" className="btn salarybtn ">
              Generate Salary Slip
            </button>
        </div>
      </MainPanel>
    </>
  );
};

export default Generatesalary;
