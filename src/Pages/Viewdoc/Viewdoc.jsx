import React, { useState } from "react";
import "./Viewdoc.scss";
import { GrDocumentPdf } from "react-icons/gr";
import { IoMdDownload } from "react-icons/io";
import { IoCloudUploadOutline } from "react-icons/io5";
import { MdOutlinePreview } from "react-icons/md";
import MainPanel from "../../comp/MainPanel/MainPanel";
const Viewdoc = () => {
  const [documents, setDocuments] = useState([]);
  const {}

  return (
    <>
<MainPanel>

          <div className="view-doc">
        <h2>View Documents</h2>
        <div className="document-list">
          <div className="document-card">
            <GrDocumentPdf className="pdf-icon" />
            <p>Adhar Card</p>
            <div className="btn-parent">
                <button>
            <MdOutlinePreview />Preview
            </button>
            
            <button>
              <IoMdDownload /> Download
            </button>
            </div>
          </div>
          <div className="document-card">
            <GrDocumentPdf className="pdf-icon" />
            <p>Pan Card</p>
             <div className="btn-parent">
                <button>
            <MdOutlinePreview />Preview
            </button>
            <button>
              <IoMdDownload /> Download
            </button>
             </div>
          </div>
          <div className="document-card">
            <GrDocumentPdf className="pdf-icon" />
            <p>Experience Letter</p>
             <div className="btn-parent"><button>
            <MdOutlinePreview />Preview
            </button>
            <button>
              <IoMdDownload /> Download
            </button></div>
          </div>
          <div className="document-card">
            <GrDocumentPdf className="pdf-icon" />
            <p>Salary Slip 1</p>
             <div className="btn-parent">
                <button>
            <MdOutlinePreview />Preview
            </button>
            <button>
              <IoMdDownload /> Download
            </button>
             </div>
          </div>
          <div className="document-card">
            <GrDocumentPdf className="pdf-icon" />
            <p>Salary slip 2</p>
            <div className="btn-parent">
                <button>
            <MdOutlinePreview />Preview
            </button>
            
            <button>
              <IoMdDownload /> Download
            </button>
            </div>
          </div>
          <div className="document-card">
            <GrDocumentPdf className="pdf-icon" />
            <p>Salary Slip 3</p>
            <div className="btn-parent">
                <button>
            <MdOutlinePreview />Preview
            </button>
            <button>
              <IoMdDownload /> Download
            </button>
            </div>
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
