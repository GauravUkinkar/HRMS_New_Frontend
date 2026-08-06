import React from "react";
import "./UploadDoc.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import Input from "../../comp/input/Input";
import { MdOutlineFileUpload } from "react-icons/md";
import FileUpload from "../../comp/FileUpload/FileUpload";
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
  
              <FileUpload
                label="Aadhar Card"
                required
                onChange={(e) => console.log(e.target.files[0])}
              />
              <FileUpload
                label="Pan Card"
                required
                onChange={(e) => console.log(e.target.files[0])}
              />
            </div>
            <div className="form-row">
              <FileUpload
                label="10th Certificate"
                required
                onChange={(e) => console.log(e.target.files[0])}
              />
              <FileUpload
                label="12th Certificate"
                required
                onChange={(e) => console.log(e.target.files[0])}
              />
            </div>
            <div className="form-row">
              <FileUpload
                label="Degree Certificate"
                required
                onChange={(e) => console.log(e.target.files[0])}
              />
              <FileUpload
                label="Diploma Certificate"
                onChange={(e) => console.log(e.target.files[0])}
              />
            </div>
            <div className="form-row">
              <FileUpload
                label="Post-Graduation Certificate"
                onChange={(e) => console.log(e.target.files[0])}
              />
              <FileUpload
                label="Releiving Certificate"
                required
                onChange={(e) => console.log(e.target.files[0])}
              />
            </div>
            <div className="form-row">
              <FileUpload
                label="Experience Letter"
                onChange={(e) => console.log(e.target.files[0])}
              />
              <FileUpload
                label="Bank Statement"
                onChange={(e) => console.log(e.target.files[0])}
              />
            </div>
            <div className="form-row">
              <FileUpload
                label="Salary-Slip1"
                onChange={(e) => console.log(e.target.files[0])}
              />
              <FileUpload
                label="Salary-Slip2"
                onChange={(e) => console.log(e.target.files[0])}
              />
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
