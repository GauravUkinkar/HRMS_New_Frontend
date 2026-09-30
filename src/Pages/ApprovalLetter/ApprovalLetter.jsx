import MainPanel from "../../comp/MainPanel/MainPanel";
import "./ApprovalLetter.scss";
import { useContext, useEffect, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { UserContext } from "../../../Context";
import axios from "axios";
import UseForm from "../../UseForm";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SelectInput from "../../comp/selectInput/SelectInput";
import { MenuItem } from "@mui/material";
import Input from "../../comp/input/Input";

const ApprovalLetter = () => {
  const pdfRef = useRef(null);

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const BASE_URL =
    import.meta.env.VITE_APPROVAL_BACKEND_URL;

  // =====================================================
  // FORM OBJECT
  // =====================================================

  const formObj = {
    date: new Date().toISOString().split("T")[0],
    subject: "",
    content: "",
    uid: user?.uid || "",
    price: "",
    name: user?.employeeName || "",
    startDate: "",
    endDate: "",
    recuring: "",
  };

  // =====================================================
  // ADD APPROVAL API
  // =====================================================

  const addApprovalApi = async () => {
    try {
      const payload = {
        date: values.date,
        subject: values.subject,
        content: values.content,
        uid: Number(values.uid),
        price: values.price,
        name: values.name,
        startDate: values.startDate,
        endDate: values.endDate,
        recuring: values.recuring,
      };

      console.log("Approval Payload:", payload);

      const response = await axios.post(
        `${BASE_URL}employee/AddApproval`,
        payload,
        {
          withCredentials: true,
        }
      );

      console.log(
        "Add Approval Response:",
        response.data
      );

      if (
        response.status === 200 ||
        response.status === 201
      ) {
        toast.success(
          "Approval added successfully!"
        );

        window.location.replace("/viewApprovals");
      }
    } catch (error) {
      console.log(
        "Add Approval Error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to add approval"
      );
    }
  };

  // =====================================================
  // FORM HOOK
  // =====================================================

  const {
    handleChange,
    handleSubmit,
    values,
    setValues,
  } = UseForm(
    formObj,
    addApprovalApi
  );

  // =====================================================
  // SET USER DATA
  // =====================================================

  useEffect(() => {
    if (user) {
      setValues((prev) => ({
        ...prev,

        date:
          prev.date ||
          new Date()
            .toISOString()
            .split("T")[0],

        uid: user.uid || "",

        name:
          user.employeeName || "",
      }));
    }
  }, [user, setValues]);

  // =====================================================
  // COMPONENT
  // =====================================================

  return (
    <MainPanel
      breadcrumbs={[
        {
          label: "Dashboard",
          link: "/dashboard",
        },
        {
          label: "Approval Letter",
        },
      ]}
      title={
        String(
          user?.role ||
          user?.crmRole ||
          ""
        )
          .trim()
          .toUpperCase() === "ADMIN"
          ? "Admin Dashboard"
          : "Approval Letter"
      }
    >
      {/* ================================================= */}
      {/* BACK BUTTON */}
      {/* ================================================= */}

      <button
        type="button"
        className="back-btn"
        onClick={() => navigate("/viewApprovals")}
      >
        ← Back
      </button>

      {/* ================================================= */}
      {/* MAIN APPROVAL LETTER */}
      {/* ================================================= */}

      <div className="approvalletter-parent parent">
        <div className="approvalletter-cont">

          {/* ============================================= */}
          {/* HEADER */}
          {/* ============================================= */}

          <h2>
            Generate Approval Letter
          </h2>

          <div className="letter-box">

            {/* =========================================== */}
            {/* LEFT FORM */}
            {/* =========================================== */}

            <div className="left-form card">

              <form onSubmit={handleSubmit}>

                {/* ======================================= */}
                {/* START DATE */}
                {/* ======================================= */}

                <Input
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={
                    values.startDate || ""
                  }
                  onChange={handleChange}
                />

                {/* ======================================= */}
                {/* END DATE */}
                {/* ======================================= */}

                <Input
                  label="End Date"
                  type="date"
                  name="endDate"
                  value={
                    values.endDate || ""
                  }
                  onChange={handleChange}
                />

                {/* ======================================= */}
                {/* SUBJECT */}
                {/* ======================================= */}

                <Input
                  name="subject"
                  value={
                    values.subject || ""
                  }
                  onChange={handleChange}
                  label="Subject"
                  placeholder="Subject"
                />

                {/* ======================================= */}
                {/* RECURRING */}
                {/* ======================================= */}

                <SelectInput
                  name="recuring"
                  value={
                    values.recuring || ""
                  }
                  onChange={handleChange}
                  label="Recurring"
                >
                  <MenuItem value="MONTHLY">
                    Monthly
                  </MenuItem>

                  <MenuItem value="QUARTERLY">
                    Quarterly
                  </MenuItem>

                  <MenuItem value="YEARLY">
                    Yearly
                  </MenuItem>

                  <MenuItem value="NO_RECURING">
                    No Recurring
                  </MenuItem>
                </SelectInput>

                {/* ======================================= */}
                {/* PRICE */}
                {/* ======================================= */}

                <Input
                  type="text"
                  name="price"
                  value={
                    values.price || ""
                  }
                  onChange={handleChange}
                  label="Price"
                  placeholder="Price"
                />

                {/* ======================================= */}
                {/* CKEDITOR */}
                {/* ======================================= */}

                <div
                  className="approval-editor"
                  style={{
                    minHeight: "300px",
                  }}
                >
                  <CKEditor
                    editor={ClassicEditor}
                    data={
                      values.content || ""
                    }
                    onChange={(
                      event,
                      editor
                    ) => {
                      const content =
                        editor.getData();

                      setValues((prev) => ({
                        ...prev,
                        content,
                      }));
                    }}
                    onReady={(editor) => {
                      editor.editing.view.change(
                        (writer) => {
                          writer.setStyle(
                            "min-height",
                            "200px",
                            editor.editing.view.document.getRoot()
                          );
                        }
                      );
                    }}
                  />
                </div>

                {/* ======================================= */}
                {/* SUBMIT */}
                {/* ======================================= */}

                <button
                  type="submit"
                  className="btn"
                >
                  Submit
                </button>

              </form>
            </div>

            {/* =========================================== */}
            {/* RIGHT LETTER PREVIEW */}
            {/* =========================================== */}

            <div
              className="right-letter card"
              ref={pdfRef}
            >

              {/* ========================================= */}
              {/* DATE */}
              {/* ========================================= */}

              <div className="date">
                {values.date}
              </div>

              {/* ========================================= */}
              {/* RECEIVER INFORMATION */}
              {/* ========================================= */}

              <p className="main-info">
                To,
                <br />

                Prajakta Marwaha
                <br />

                Director
                <br />

                Pandoza Solutions Pvt Ltd
                <br />

                2014 - 2016, 10 Biz Park,
                Viman Nagar,
                <br />

                Pune, Maharashtra 411014
              </p>

              {/* ========================================= */}
              {/* SUBJECT */}
              {/* ========================================= */}

              <p className="subject">
                Subject:{" "}
                {values.subject}
              </p>

              {/* ========================================= */}
              {/* LETTER CONTENT */}
              {/* ========================================= */}

              <div
                className="sic-editor-data"
                dangerouslySetInnerHTML={{
                  __html:
                    values.content || "",
                }}
              />

              {/* ========================================= */}
              {/* FIXED BOTTOM AREA */}
              {/* ========================================= */}

              <div className="letter-bottom">

                {/* ======================================= */}
                {/* SIGNATURE */}
                {/* ======================================= */}

                <div className="user">

                  <div>
                    Your Sincerely
                  </div>

                  <span>
                    {values.name}
                  </span>

                </div>

                {/* ======================================= */}
                {/* APPROVAL SECTION */}
                {/* ======================================= */}

                <div className="bottomsection">

                  {/* ===================================== */}
                  {/* APPROVER */}
                  {/* ===================================== */}

                  <div className="approvar">

                    <div>
                      To Be Approved By
                    </div>

                    <span>
                      Prajakta Marwaha
                    </span>

                  </div>

                  {/* ===================================== */}
                  {/* FINANCE */}
                  {/* ===================================== */}

                  <div className="finance">

                    <div>
                      To Be Approved By
                    </div>

                    <span>
                      Finance Department
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    </MainPanel>
  );
};

export default ApprovalLetter;