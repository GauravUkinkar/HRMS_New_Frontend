
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
  const pdfRef = useRef();

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const BASE_URL =
    import.meta.env.VITE_APPROVAL_BACKEND_URL;

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
  // ADD APPROVAL
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

      console.log(
        "Approval Payload:",
        payload
      );

      const response = await axios.post(
        `${BASE_URL}employee/AddApproval`,
        payload,
        {
            withCredentials:true,
        }
      );

      console.log(
        "Add Approval Response:",
        response.data
      );

      if (response.status === 200) {
        toast.success(
          "Approval added successfully!"
        );

        setValues({
          date: new Date()
            .toISOString()
            .split("T")[0],
          subject: "",
          content: "",
          uid: user?.uid || "",
          price: "",
          name: user?.employeeName || "",
          startDate: "",
          endDate: "",
          recuring: "",
        });

        navigate("/viewApprovals");
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
  }, [user]);

  return (
    <MainPanel
          breadcrumbs={[
        { label: "Dashboard", link: "/dashboard" },
        { label: "Approval Letter" },
      ]}
      title={
        String(user?.role || user?.crmRole || "")
          .trim()
          .toUpperCase() === "EMPLOYEE"
          ? "Employee Dashboard"
          : "Approval Letter"
      }
    >
          <button
            type="button"
            className="back-btn"
            onClick={() =>
              navigate("/")
            }
          >
            ← Back
          </button>
      <div className="approvalletter-parent parent">
        <div className="approvalletter-cont cont">
          <div className="letter-box">

            {/* ================= FORM ================= */}

            <div className="left-form card">
              <form onSubmit={handleSubmit}>

                <Input
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={
                    values.startDate || ""
                  }
                  onChange={handleChange}
                />

                <Input
                  label="End Date"
                  type="date"
                  name="endDate"
                  value={
                    values.endDate || ""
                  }
                  onChange={handleChange}
                />

                <Input
                  name="subject"
                  value={
                    values.subject || ""
                  }
                  onChange={handleChange}
                  label="Subject"
                  placeholder="Subject"
                />

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

                <div
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

                <button
                  type="submit"
                  className="btn"
                >
                  Submit
                </button>
              </form>
            </div>

            {/* ================= PREVIEW ================= */}

            <div
              className="right-letter card"
              ref={pdfRef}
            >
              <div className="date">
                {values.date}
              </div>

              <p className="main-info">
                To, <br />
                Prajakta Marwaha <br />
                Director <br />
                Pandoza Solutions Pvt Ltd <br />
                2014 - 2016, 10 Biz Park,
                Viman Nagar, <br />
                Pune, Maharashtra 411014
              </p>

              <p className="subject">
                Subject:{" "}
                {values.subject}
              </p>

              <p>
                <strong>
                  Start Date:
                </strong>{" "}
                {values.startDate}
              </p>

              <p>
                <strong>
                  End Date:
                </strong>{" "}
                {values.endDate}
              </p>

              <p>
                <strong>
                  Recurring:
                </strong>{" "}
                {values.recuring}
              </p>

              <p>
                <strong>
                  Price:
                </strong>{" "}
                {values.price
                  ? `₹${Number(
                      values.price
                    ).toLocaleString(
                      "en-IN"
                    )}`
                  : ""}
              </p>

              <div
                className="sic-editor-data"
                dangerouslySetInnerHTML={{
                  __html:
                    values.content || "",
                }}
              />

              <div className="user">
                Your Sincerely{" "}
                <span>
                  {values.name}
                </span>
              </div>

              <div className="bottomsection">
                <div className="approvar">
                  To Be Approved By{" "}
                  <span>
                    Prajakta Marwaha
                  </span>
                </div>

                <div className="finance">
                  To Be Approved By{" "}
                  <span>
                    Finance Department
                  </span>
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

