import React, { useEffect, useState } from "react";
import "./OfferLetterManagement.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import { FaPlus } from "react-icons/fa6";
import Table_Comp from "../../comp/table/Table";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OfferLetterManagement = () => {
    const [data, setData] = useState();
    const [loader, setLoader] = useState(false)
    const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;
    const navigate = useNavigate();
    const deleteOfficealLetter =() =>{
        try {
            console.log("deleted")
        } catch (error) {
            console.log(error)
            
        }
    }

    
  const columns = [
    {
      key: "oid",
      dataIndex: "oid",
      title: "sr",
    },
    {
      key: "employeeName",
      dataIndex: "employeeName",
      title: "Employee Name",
      search: true,
    },
    {
      key: "companyName",
      dataIndex: "companyName",
      title: "CompanyName",
      search: true,
    },
    {
      key: "Action",
      dataIndex: "Action",
      title: "Action",
      fixed: "right",
      render: () => (
        <div>
          <span onClick={deleteOfficealLetter}>
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

  const getAllOfficialLetters = async () => {
    try {
        setLoader(true)
        const response = await axios.get(`${BASE_URL}Admin/getAllOfficialLetters`,{
            withCredentials: true,
    });
        setData(response.data);
        const offerLetters =response.data
        .map((item)=> item.data);
        // .filter(Boolean);
        console.log("Table Data:",offerLetters)
        setData(offerLetters);

    } catch (error) {
        console.log("STATUS:",error.response?.status);
        console.log("ERROR:",error.response?.data); 
    }finally {
        setLoader(false)
    }
  }

  useEffect(()=>{
    const fetchOfferLetters = async ()=>{
        await getAllOfficialLetters()
    }
    fetchOfferLetters()
  },[]) 

  return (
    <>
      <MainPanel>
        {loader}
        <div class="offerlettermanagement-cont cont">
          <h1>Offer Letter management</h1>
          <button className="btn" onClick={() => navigate("/offerLetter")}>
            <FaPlus />
            Add Offer-Letter
          </button>
        </div>
        <Table_Comp columns={columns} data={data} />
      </MainPanel>
    </>
  );
};

export default OfferLetterManagement;
