import React from "react";
import "./Viewdoc.scss";
import { GrDocumentPdf } from "react-icons/gr";
import { IoMdDownload } from "react-icons/io";
import { IoCloudUploadOutline } from "react-icons/io5";
import MainPanel from "../../comp/MainPanel/MainPanel";
const Viewdoc = () => {
  return (
    <>
<MainPanel>

          <div className="view-doc">
        <h2>View Documents</h2>
        <div className="document-list">
          <div className="document-card">
            <GrDocumentPdf className="pdf-icon" />
            <p>Adhar Card</p>
            <button>
              <IoMdDownload /> Download
            </button>
          </div>
          <div className="document-card">
            <GrDocumentPdf className="pdf-icon" />
            <p>Pan Card</p>
            <button>
              <IoMdDownload /> Download
            </button>
          </div>
          <div className="document-card">
            <GrDocumentPdf className="pdf-icon" />
            <p>Experience Letter</p>
            <button>
              <IoMdDownload /> Download
            </button>
          </div>
          <div className="document-card">
            <GrDocumentPdf className="pdf-icon" />
            <p>Salary Slip 1</p>
            <button>
              <IoMdDownload /> Download
            </button>
          </div>
          <div className="document-card">
            <GrDocumentPdf className="pdf-icon" />
            <p>Salary slip 2</p>
            <button>
              <IoMdDownload /> Download
            </button>
          </div>
          <div className="document-card">
            <GrDocumentPdf className="pdf-icon" />
            <p>Salary Slip 3</p>
            <button>
              <IoMdDownload /> Download
            </button>
          </div>
          
        </div>
        
        <button className="upload-btn">
          <IoCloudUploadOutline /> Upload More Documents
        </button>
     
      </div>
</MainPanel>
    </>
  );
};

export default Viewdoc;
