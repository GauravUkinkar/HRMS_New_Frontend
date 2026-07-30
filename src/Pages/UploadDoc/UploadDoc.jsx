import React from "react";
import "./UploadDoc.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import Input from "../../comp/input/Input";


import { Link } from "react-router-dom";

const UploadDoc = () => {
  return (
    <>
      <MainPanel>
        <div className="upload-parent">
          <h1>Upload Documents</h1>
          <div className="inputs">
            <div className="form-row">
              <Input label="UID" required={true} />
            </div>
            <div className="form-row">
              <Input label="Aadhar Card" type="file" required={true} />
              <Input label="Pan Card" type="file" required={true} />
            </div>
            <div className="form-row">
              <Input label="10th Certificate" type="file" required={true} />
              <Input label="12th Certificate" type="file" required={true} />
            </div>
            <div className="form-row">
              <Input label="Degree Certificate" type="file" required={true} />
              <Input label="Diploma Certificate" type="file" required={true} />
            </div>
            <div className="form-row">
              <Input label="Post-Graduation Certificate" type="file" />
              <Input label="Releiving Certificate" type="file" required={true} />
            </div>
            <div className="form-row">
              <Input label="Experience Letter" type="file"  />
              <Input label="Bank Statement" type="file"  />
            </div>
            <div className="form-row">
              <Input label="Salary-Slip1" type="file"  />
              <Input label="Salary-Slip2" type="file"  />
            </div>
          </div>
                    <Link className="btn" >
            Submit
          </Link>
        </div>
      </MainPanel>
    </>
  );
};

export default UploadDoc;
