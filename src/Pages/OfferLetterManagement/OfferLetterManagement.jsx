import React from "react";
import "./OfferLetterManagement.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import { FaPlus } from "react-icons/fa6";
import Table_Comp from "../../comp/table/Table";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OfferLetterManagement = () => {
    const navigate = useNavigate();
  const columns = [
    {
      key: "sr",
      dataIndex: "sr",
      title: "sr",
    },
    {
      key: "employeeName",
      dataIndex: "employeeName",
      title: "Employee Name",
      search: true,
    },
    {
      key: "Employee Id",
      dataIndex: "Employee Id",
      title: "Employee Id",
      search: true,
    },
    {
      key: "Action",
      dataIndex: "Action",
      title: "Action",
      fixed: "right",
      render: () => (
        <div>
          <span>
            <RiDeleteBin6Line />
          </span>
          <span>
            <CiEdit />
          </span>
          <span><FaEye /></span>
        </div>
      ),
    },
  ];
  return (
    <>
      <MainPanel>
        <div class="offerlettermanagement-cont cont">
          <h1>Offer Letter management</h1>
          <button className="btn" onClick={() => navigate("/offerLetter")}>
            <FaPlus />
            Add Offer-Letter
          </button>
        </div>
        <Table_Comp columns={columns} />
      </MainPanel>
    </>
  );
};

export default OfferLetterManagement;
