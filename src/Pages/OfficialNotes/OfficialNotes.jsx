import React, { useEffect, useState } from "react";
import axios from "axios";

import { FaPlus } from "react-icons/fa";
import {
  MdEdit,
  MdDelete,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { ImCross } from "react-icons/im";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import "./OfficialNotes.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";

// ============================================================
// API CONFIGURATION
// ============================================================

const BASE_URL = import.meta.env.VITE_USER_BACKEND_URL;

// ============================================================
// OFFICIAL NOTES COMPONENT
// ============================================================

const OfficialNotes = () => {
  // ==========================================================
  // NOTES STATE
  // ==========================================================

  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState("");

  // ==========================================================
  // EMPLOYEE STATE
  // ==========================================================

  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [employeeError, setEmployeeError] = useState("");
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);

  // ==========================================================
  // NOTE MODAL STATE
  // ==========================================================

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);

  const [noteDate, setNoteDate] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteCreatedAt, setNoteCreatedAt] = useState("");

  // ==========================================================
  // NOTE VIEW STATE
  // ==========================================================

  const [expandedNoteId, setExpandedNoteId] = useState(null);

  // ==========================================================
  // HELPER FUNCTION - REMOVE HTML
  // ==========================================================

  const stripHtml = (html) => {
    if (!html) {
      return "";
    }

    const element = document.createElement("div");

    element.innerHTML = html;

    return element.textContent || element.innerText || "";
  };

  // ==========================================================
  // HELPER FUNCTION - SHORT NOTE
  // ==========================================================

  const getShortNote = (html, wordLimit = 5) => {
    const text = stripHtml(html).trim();

    if (!text) {
      return "";
    }

    const words = text.split(/\s+/);

    if (words.length <= wordLimit) {
      return text;
    }

    return `${words.slice(0, wordLimit).join(" ")}...`;
  };

  // ==========================================================
  // GET ALL OFFICIAL NOTES
  // ==========================================================

  const getOfficialNotes = async () => {
    try {
      setNotesLoading(true);
      setNotesError("");

      const res = await axios.get(
        `${BASE_URL}AuthController/GetAllOfficialNotes`,
        {
          withCredentials: true,
        },
      );

      console.log("GET ALL OFFICIAL NOTES RESPONSE:", res.data);

      const notes = res.data.map((item, index) => ({
        key: index + 1,
        notesId: item?.data?.notesId,
        discription: item?.data?.discription,
        createdAt: item?.data?.createdAt,
      }));

      console.log("FORMATTED OFFICIAL NOTES:", notes);

      setNotes(notes);
    } catch (error) {
      console.error("Get All Official Notes API Error:", error);

      setNotes([]);

      if (error.response?.status === 401) {
        setNotesError("Authentication required.");
      } else if (error.response?.status === 403) {
        setNotesError("You are not authorized to view official notes.");
      } else {
        setNotesError("Failed to load official notes.");
      }
    } finally {
      setNotesLoading(false);
    }
  };

  // ==========================================================
  // GET ALL EMPLOYEES
  // ==========================================================

  const getAllEmployees = async () => {
    try {
      setEmployeeLoading(true);
      setEmployeeError("");

      const res = await axios.get(`${BASE_URL}Admin/GetAllEmployee`, {
        withCredentials: true,
      });

      console.log("GET ALL EMPLOYEES RESPONSE:", res.data);

      const employees = res.data.map((item, index) => ({
        key: index + 1,
        employeeId: item?.data?.employeeId,
        employeeName: item?.data?.employeeName,
        department: item?.data?.department,
        designation: item?.data?.designation,
        email: item?.data?.email,
        contactNumber: item?.data?.contactNumber,
      }));

      console.log("FORMATTED EMPLOYEES:", employees);

      setEmployees(employees);

      if (employees.length === 0) {
        setEmployeeError("No employees found.");
      }
    } catch (error) {
      console.error("Get All Employees API Error:", error);

      setEmployees([]);

      if (error.response?.status === 401) {
        setEmployeeError("Authentication required.");
      } else if (error.response?.status === 403) {
        setEmployeeError("You are not authorized to view employees.");
      } else {
        setEmployeeError("Failed to load employees.");
      }
    } finally {
      setEmployeeLoading(false);
    }
  };

  // ==========================================================
  // LOAD INITIAL DATA
  // ==========================================================

  useEffect(() => {
    getAllEmployees();
    getOfficialNotes();
  }, []);

  // ==========================================================
  // OPEN ADD NOTE MODAL
  // ==========================================================

  const handleAddNote = () => {
    setIsEditing(false);
    setEditingNoteId(null);

    setNoteDate("");
    setNoteContent("");
    setNoteCreatedAt("");

    setSelectedEmployees([]);
    setIsEmployeeDropdownOpen(false);

    setShowNoteModal(true);
  };

  // ==========================================================
  // CLOSE NOTE MODAL
  // ==========================================================

  const handleCloseNote = () => {
    setShowNoteModal(false);

    setIsEditing(false);
    setEditingNoteId(null);

    setNoteDate("");
    setNoteContent("");
    setNoteCreatedAt("");

    setSelectedEmployees([]);
    setIsEmployeeDropdownOpen(false);
  };

  // ==========================================================
  // EMPLOYEE DROPDOWN
  // ==========================================================

  const handleEmployeeDropdown = () => {
    setIsEmployeeDropdownOpen((previous) => !previous);
  };

  // ==========================================================
  // SELECT / DESELECT ALL EMPLOYEES
  // ==========================================================

  const handleSelectAllEmployees = (checked) => {
    if (checked) {
      const allEmployeeIds = employees.map((employee) => employee.employeeId);

      setSelectedEmployees(allEmployeeIds);
    } else {
      setSelectedEmployees([]);
    }
  };

  // ==========================================================
  // SELECT / DESELECT ONE EMPLOYEE
  // ==========================================================

  const handleEmployeeSelection = (employeeId, checked) => {
    if (checked) {
      setSelectedEmployees((previous) => {
        if (previous.includes(employeeId)) {
          return previous;
        }

        return [...previous, employeeId];
      });
    } else {
      setSelectedEmployees((previous) =>
        previous.filter((id) => id !== employeeId),
      );
    }
  };

  // ==========================================================
  // VIEW / HIDE FULL NOTE
  // ==========================================================

  const handleToggleNote = (noteId) => {
    setExpandedNoteId((previousId) => (previousId === noteId ? null : noteId));
  };

  // ==========================================================
  // CHECK WHETHER NOTE CAN BE EDITED
  // ==========================================================

  const isEditAllowed = (note) => {
    if (!note?.createdAt) {
      return false;
    }

    const createdDate = new Date(note.createdAt);
    const today = new Date();

    const createdIndiaDate = createdDate.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    const todayIndiaDate = today.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    return createdIndiaDate === todayIndiaDate;
  };

  // ==========================================================
  // GET NOTE BY ID AND OPEN EDIT MODAL
  // ==========================================================

  const handleEdit = async (note) => {
    if (!isEditAllowed(note)) {
      alert("This note can only be edited on the day it was created.");

      return;
    }

    try {
      const res = await axios.get(
        `${BASE_URL}AuthController/getOfficialNotesByNotesId?noteId=${note.notesId}`,
        {
          withCredentials: true,
        },
      );

      console.log("GET NOTE BY ID RESPONSE:", res.data);

      const selectedNote = res.data?.data;

      if (!selectedNote) {
        alert("Note not found.");
        return;
      }

      setIsEditing(true);

      setEditingNoteId(selectedNote.notesId);

      setNoteCreatedAt(selectedNote.createdAt);

      setNoteContent(selectedNote.discription || "");

      const indiaDate = new Date(selectedNote.createdAt).toLocaleDateString(
        "en-CA",
        {
          timeZone: "Asia/Kolkata",
        },
      );

      setNoteDate(indiaDate);

      setSelectedEmployees([]);
      setIsEmployeeDropdownOpen(false);

      setShowNoteModal(true);
    } catch (error) {
      console.error("Get Official Note By ID API Error:", error);

      if (error.response?.status === 401) {
        alert("Authentication required.");
      } else if (error.response?.status === 403) {
        alert("You are not authorized to view this note.");
      } else if (error.response?.status === 404) {
        alert("Note not found.");
      } else {
        alert("Failed to load note.");
      }
    }
  };

  // ==========================================================
  // DELETE OFFICIAL NOTE
  // ==========================================================

  const handleDelete = async (note) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this official note?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const res = await axios.delete(
        `${BASE_URL}Admin/deleteOfficialNotes?OfficialNotesId=${note.notesId}`,
        {
          withCredentials: true,
        },
      );

      console.log("DELETE OFFICIAL NOTE RESPONSE:", res.data);

      alert("Official note deleted successfully.");

      if (expandedNoteId === note.notesId) {
        setExpandedNoteId(null);
      }

      await getOfficialNotes();
    } catch (error) {
      console.error("Delete Official Note API Error:", error);

      if (error.response?.status === 401) {
        alert("Authentication required.");
      } else if (error.response?.status === 403) {
        alert("You are not authorized to delete this note.");
      } else if (error.response?.status === 404) {
        alert("Note not found.");
      } else {
        alert("Failed to delete official note.");
      }
    }
  };

  // ==========================================================
  // ADD / UPDATE OFFICIAL NOTE
  // ==========================================================

  const handleSubmitNote = async () => {
    try {
      // --------------------------------------------------------
      // VALIDATION
      // --------------------------------------------------------

      if (!noteContent || noteContent.trim() === "") {
        alert("Please enter a note.");
        return;
      }

      if (!noteDate) {
        alert("Please select a date.");
        return;
      }

      // --------------------------------------------------------
      // ADD NEW NOTE
      // --------------------------------------------------------

      if (!isEditing) {
        const selectedDate = new Date(
          `${noteDate}T${new Date().toTimeString().slice(0, 8)}`,
        );

        const noteData = {
          notesId: 0,
          discription: noteContent,
          createdAt: selectedDate.toISOString(),

          // Add this when backend supports employee selection:
          // employeeIds: selectedEmployees,
        };

        console.log("ADD OFFICIAL NOTE REQUEST:", noteData);

        const res = await axios.post(
          `${BASE_URL}Admin/addOfficialNotes`,
          noteData,
          {
            withCredentials: true,
          },
        );

        console.log("ADD OFFICIAL NOTE RESPONSE:", res.data);

        alert("Official note added successfully.");

        handleCloseNote();

        await getOfficialNotes();

        return;
      }

      // --------------------------------------------------------
      // VALIDATE UPDATE DATA
      // --------------------------------------------------------

      if (!editingNoteId) {
        alert("Note ID is missing.");
        return;
      }

      if (!noteCreatedAt) {
        alert("Created date is missing.");
        return;
      }

      // --------------------------------------------------------
      // UPDATE EXISTING NOTE
      // --------------------------------------------------------

      const updateData = {
        notesId: editingNoteId,
        discription: noteContent,
        createdAt: noteCreatedAt,
      };

      console.log("UPDATE OFFICIAL NOTE REQUEST:", updateData);

      const res = await axios.put(
        `${BASE_URL}Admin/updateOfficialNotes`,
        updateData,
        {
          withCredentials: true,
        },
      );

      console.log("UPDATE OFFICIAL NOTE RESPONSE:", res.data);

      alert("Official note updated successfully.");

      handleCloseNote();

      await getOfficialNotes();
    } catch (error) {
      console.error("Official Note API Error:", error);

      if (error.response?.status === 401) {
        alert("Authentication required.");
      } else if (error.response?.status === 403) {
        alert("You are not authorized to perform this action.");
      } else if (error.response?.status === 404) {
        alert("Note not found.");
      } else {
        alert(
          error.response?.data ||
            error.message ||
            "Failed to save official note.",
        );
      }
    }
  };

  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (createdAt) => {
    if (!createdAt) {
      return "-";
    }

    return new Date(createdAt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================================
  // JSX
  // ==========================================================

  return (
    <MainPanel>
      <div className="official-notes-page">
        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <div className="official-notes-header">
          <div className="header-content">
            <h1>Official Notes</h1>
          </div>

          <button
            type="button"
            className="add-note-btn"
            onClick={handleAddNote}
          >
            <FaPlus />
            <span>Add Note</span>
          </button>
        </div>

        {/* ==================================================
            ADD / EDIT NOTE MODAL
        ================================================== */}

        {showNoteModal && (
          <div className="note-modal-overlay">
            <div className="note-modal">
              {/* MODAL HEADER */}

              <div className="note-modal-header">
                <h2>
                  {isEditing ? "Edit Official Note" : "Add Official Note"}
                </h2>

                <button
                  type="button"
                  className="close-btn"
                  onClick={handleCloseNote}
                  title="Close"
                >
                  <ImCross />
                </button>
              </div>

              {/* MODAL BODY */}

              <div className="note-modal-body">
                {/* DATE */}

                <div className="note-form-group">
                  <label htmlFor="note-date">Date</label>

                  <input
                    id="note-date"
                    type="date"
                    value={noteDate}
                    onChange={(event) => setNoteDate(event.target.value)}
                  />
                </div>

                {/* SEND TO */}

                <div className="note-form-group">
                  <label>Send To</label>

                  <div className="employee-dropdown">
                    {/* DROPDOWN HEADER */}

                    <div
                      className="employee-dropdown-header"
                      onClick={handleEmployeeDropdown}
                    >
                      <span>
                        {selectedEmployees.length === 0
                          ? "All Employees"
                          : selectedEmployees.length === 1
                            ? "1 Employee Selected"
                            : `${selectedEmployees.length} Employees Selected`}
                      </span>

                      <span className="dropdown-arrow">
                        {isEmployeeDropdownOpen ? "⌃" : "⌄"}
                      </span>
                    </div>

                    {/* DROPDOWN OPTIONS */}

                    {isEmployeeDropdownOpen && (
                      <div className="employee-dropdown-menu">
                        {/* LOADING */}

                        {employeeLoading && (
                          <div className="employee-loading">
                            Loading employees...
                          </div>
                        )}

                        {/* ERROR */}

                        {!employeeLoading && employeeError && (
                          <div className="employee-error">{employeeError}</div>
                        )}

                        {/* EMPLOYEE LIST */}

                        {!employeeLoading &&
                          !employeeError &&
                          employees.length > 0 && (
                            <>
                              {/* ALL EMPLOYEES */}

                              <label className="employee-option">
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedEmployees.length ===
                                    employees.length
                                  }
                                  onChange={(event) =>
                                    handleSelectAllEmployees(
                                      event.target.checked,
                                    )
                                  }
                                />

                                <span>All Employees</span>
                              </label>

                              {/* INDIVIDUAL EMPLOYEES */}

                              {employees.map((employee) => (
                                <label
                                  key={employee.employeeId}
                                  className="employee-option"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedEmployees.includes(
                                      employee.employeeId,
                                    )}
                                    onChange={(event) =>
                                      handleEmployeeSelection(
                                        employee.employeeId,
                                        event.target.checked,
                                      )
                                    }
                                  />

                                  <span>{employee.employeeName}</span>
                                </label>
                              ))}
                            </>
                          )}
                      </div>
                    )}
                  </div>
                </div>

                {/* NOTE */}

                <div className="note-form-group">
                  <label>Note</label>

                  <div className="ckeditor-wrapper">
                    <CKEditor
                      editor={ClassicEditor}
                      data={noteContent}
                      onChange={(event, editor) => {
                        setNoteContent(editor.getData());
                      }}
                      config={{
                        placeholder: "Enter official note...",

                        toolbar: [
                          "heading",
                          "|",
                          "bold",
                          "italic",
                          "underline",
                          "|",
                          "bulletedList",
                          "numberedList",
                          "|",
                          "link",
                          "blockQuote",
                          "|",
                          "undo",
                          "redo",
                        ],
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* MODAL FOOTER */}

              <div className="note-modal-footer">
                <button
                  type="button"
                  className="cancel-note-btn"
                  onClick={handleCloseNote}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="submit-note-btn"
                  onClick={handleSubmitNote}
                >
                  {isEditing ? "Update Note" : "Submit Note"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            NOTES TABLE
        ================================================== */}

        <div className="notes-table-wrapper">
          <table className="notes-table">
            <thead>
              <tr>
                <th className="sr-column">Sr. No.</th>

                <th className="date-column">Date &amp; Time Posted On</th>

                <th className="note-column">Note Details</th>

                <th className="action-column">Action</th>
              </tr>
            </thead>

            <tbody>
              {/* LOADING */}

              {notesLoading && (
                <tr>
                  <td colSpan="4" className="table-message">
                    Loading official notes...
                  </td>
                </tr>
              )}

              {/* ERROR */}

              {!notesLoading && notesError && (
                <tr>
                  <td colSpan="4" className="table-message error">
                    {notesError}
                  </td>
                </tr>
              )}

              {/* EMPTY */}

              {!notesLoading && !notesError && notes.length === 0 && (
                <tr>
                  <td colSpan="4" className="table-message">
                    No official notes found.
                  </td>
                </tr>
              )}

              {/* NOTE LIST */}

              {!notesLoading &&
                !notesError &&
                notes.map((note, index) => {
                  const isExpanded = expandedNoteId === note.notesId;

                  return (
                    <tr
                      key={note.notesId}
                      className={isExpanded ? "note-row-expanded" : ""}
                    >
                      {/* SR. NO. */}

                      <td className="sr-column">
                        <span className="sr-number">{index + 1}</span>
                      </td>

                      {/* DATE */}

                      <td className="date-column">
                        <span className="note-date">
                          {formatDate(note.createdAt)}
                        </span>
                      </td>

                      {/* NOTE */}

                      <td className="note-column">
                        {isExpanded ? (
                          <div className="note-content-expanded">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: note.discription || "",
                              }}
                            />
                          </div>
                        ) : (
                          <div className="note-content">
                            {getShortNote(note.discription, 5)}
                          </div>
                        )}
                      </td>

                      {/* ACTIONS */}

                      <td className="action-column">
                        <div className="note-actions">
                          {/* VIEW */}

                          <button
                            type="button"
                            className={`action-btn view-btn ${
                              isExpanded ? "active" : ""
                            }`}
                            onClick={() => handleToggleNote(note.notesId)}
                            title={
                              isExpanded ? "Close Full Note" : "View Full Note"
                            }
                          >
                            {isExpanded ? (
                              <MdVisibilityOff className="icon" />
                            ) : (
                              <MdVisibility className="icon" />
                            )}
                          </button>

                          {/* EDIT */}

                          <button
                            type="button"
                            className={`action-btn edit-btn ${
                              !isEditAllowed(note) ? "disabled" : ""
                            }`}
                            onClick={() => handleEdit(note)}
                            disabled={!isEditAllowed(note)}
                            title={
                              isEditAllowed(note)
                                ? "Edit Note"
                                : "Editing is allowed only on the day the note was created"
                            }
                          >
                            <MdEdit className="icon" />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(note)}
                            title="Delete Note"
                          >
                            <MdDelete className="icon" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* ==================================================
            TABLE FOOTER
        ================================================== */}

        <div className="notes-footer">
          Showing 1 to {notes.length} of {notes.length} notes
        </div>
      </div>
    </MainPanel>
  );
};

export default OfficialNotes;
