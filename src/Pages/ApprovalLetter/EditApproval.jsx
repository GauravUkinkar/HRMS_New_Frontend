import { useContext, useEffect, useState } from "react";
import "./ApprovalLetter.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import axios from "axios";
import { UserContext } from "../../../Context";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SelectInput from "../../comp/selectInput/SelectInput";
import { MenuItem } from "@mui/material";
import Input from "../../comp/input/Input";

const BASE_URL =
  import.meta.env.VITE_APPROVAL_BACKEND_URL;

const EditApproval = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  const [values, setValues] = useState({
    date: "",
    subject: "",
    content: "",
    uid: "",
    price: "",
    name: "",
    startDate: "",
    endDate: "",
    recuring: "",
  });

  const [loading, setLoading] = useState(false);

  // =====================================================
  // GET APPROVAL
  // =====================================================

  useEffect(() => {
    const getApproval = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${BASE_URL}authController/GetApproval?aId=${id}`,
          {
            withCredentials: true,
          }
        );

        console.log(
          "Approval Data:",
          response.data
        );

        const data =
          response?.data?.data ||
          response?.data ||
          {};

        setValues({
          date: data?.date
            ? data.date.split("T")[0]
            : "",

          subject:
            data?.subject || "",

          content:
            data?.content || "",

          uid:
            data?.uid ||
            user?.uid ||
            "",

          price:
            data?.price ?? "",

          name:
            data?.name ||
            user?.employeeName ||
            "",

          startDate: data?.startDate
            ? data.startDate.split("T")[0]
            : "",

          endDate: data?.endDate
            ? data.endDate.split("T")[0]
            : "",

          recuring:
            data?.recuring || "",
        });
      } catch (error) {
        console.log(
          "Get Approval Error:",
          error.response?.data || error
        );

        toast.error(
          error.response?.data?.message ||
          "Failed to load approval letter"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getApproval();
    }
  }, [
    id,
    user?.uid,
    user?.employeeName,
  ]);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // UPDATE APPROVAL
  // =====================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        aid: Number(id),

        date: values.date,

        subject: values.subject,

        content: values.content,

        uid: Number(
          values.uid || user?.uid
        ),

        price: values.price,

        name: values.name,

        startDate: values.startDate,

        endDate: values.endDate,

        recuring: values.recuring,
      };

      console.log(
        "Update Approval Payload:",
        payload
      );

      const response = await axios.post(
        `${BASE_URL}employee/UpdateApprovalByEmployee`,
        payload,
        {
          withCredentials: true,
        }
      );

      console.log(
        "Update Approval Response:",
        response.data
      );

      if (
        response.status === 200 ||
        response.status === 201
      ) {
        toast.success(
          "Approval letter updated successfully"
        );

        navigate("/viewApprovals");
      }
    } catch (error) {
      console.log(
        "Update Approval Error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to update approval letter"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
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
        {
          label: "Edit Approval Letter",
        },
      ]}
      title={
        String(
          user?.role ||
          user?.crmRole ||
          ""
        )
          .trim()
          .toUpperCase() === "EMPLOYEE"
          ? "Employee Approval"
          : "Approval Letter"
      }
    >
      {/* ================================================= */}
      {/* BACK BUTTON */}
      {/* ================================================= */}

      <button
        type="button"
        className="back-btn"
        onClick={() =>
          navigate("/viewApprovals")
        }
      >
        ← Back
      </button>

      {/* ================================================= */}
      {/* MAIN CONTAINER */}
      {/* ================================================= */}

      <div className="approvalletter-parent parent">

        <div className="approvalletter-cont">

          {/* ============================================= */}
          {/* HEADER */}
          {/* ============================================= */}

          <h2>
            Edit Approval Letter
          </h2>

          <div className="letter-box">

            {/* =========================================== */}
            {/* LEFT FORM */}
            {/* =========================================== */}

            <div className="left-form card">

              <form onSubmit={handleUpdate}>

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

                      setValues(
                        (prev) => ({
                          ...prev,
                          content,
                        })
                      );
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
                {/* UPDATE BUTTON */}
                {/* ======================================= */}

                <button
                  type="submit"
                  className="btn"
                  disabled={loading}
                >
                  {loading
                    ? "Updating..."
                    : "Update Approval"}
                </button>

              </form>
            </div>

            {/* =========================================== */}
            {/* RIGHT PREVIEW */}
            {/* =========================================== */}

            <div className="right-letter card">

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
              {/* BOTTOM LETTER AREA */}
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
                {/* APPROVAL ROW */}
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

export default EditApproval;