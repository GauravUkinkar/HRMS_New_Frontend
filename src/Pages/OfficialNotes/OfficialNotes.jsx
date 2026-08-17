import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ImCross } from "react-icons/im";

import "./OfficialNotes.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";

const OfficialNotes = () => {
  // =========================================
  // STATES
  // =========================================

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] =
    useState(false);

  const [showAddNote, setShowAddNote] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);

  const [noteDate, setNoteDate] = useState("");
  const [noteContent, setNoteContent] = useState("");

  // =========================================
  // EMPLOYEES
  // =========================================

  const employees = [
    {
      id: 1,
      name: "Aditya More",
    },
    {
      id: 2,
      name: "Rahul Patil",
    },
    {
      id: 3,
      name: "Sachin Jadhav",
    },
    {
      id: 4,
      name: "Revti More",
    },
    {
      id: 5,
      name: "Shweta Shinde",
    },
  ];

  // =========================================
  // GET ALL OFFICIAL NOTES
  // =========================================

  const getOfficialNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://userservicetest.pandozasolutions.com/AuthController/GetAllOfficialNotes",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();

      console.log("Official Notes API Response:", result);

      if (result.status === "OK") {
        /*
          API should ideally return:

          data: [
            {
              notesId: 1,
              description: "...",
              createdAt: "..."
            }
          ]
        */

        if (Array.isArray(result.data)) {
          setNotes(result.data);
        } else if (result.data) {
          setNotes([result.data]);
        } else {
          setNotes([]);
        }
      } else {
        setNotes([]);
        setError(
          result.responseMessage || "Unable to fetch official notes"
        );
      }
    } catch (error) {
      console.error("Get Official Notes Error:", error);
      setError("Failed to load official notes.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOAD NOTES WHEN PAGE OPENS
  // =========================================

  useEffect(() => {
    getOfficialNotes();
  }, []);

  // =========================================
  // CHECK SAME-DAY EDIT
  // =========================================

  const isEditAllowed = (note) => {
    if (!note?.createdAt) {
      return false;
    }

    const createdDate = new Date(note.createdAt);
    const today = new Date();

    return (
      createdDate.getFullYear() === today.getFullYear() &&
      createdDate.getMonth() === today.getMonth() &&
      createdDate.getDate() === today.getDate()
    );
  };

  // =========================================
  // ADD NOTE
  // =========================================

  const handleAddNote = () => {
    setIsEditing(false);
    setEditingNoteId(null);

    setNoteDate("");
    setNoteContent("");

    setSelectedEmployees([]);
    setIsEmployeeDropdownOpen(false);

    setShowAddNote(true);
  };

  // =========================================
  // CLOSE POPUP
  // =========================================

  const handleCloseNote = () => {
    setShowAddNote(false);

    setIsEditing(false);
    setEditingNoteId(null);

    setNoteDate("");
    setNoteContent("");

    setSelectedEmployees([]);
    setIsEmployeeDropdownOpen(false);
  };

  // =========================================
  // EDIT NOTE
  // =========================================

  const handleEdit = (note) => {
    if (!isEditAllowed(note)) {
      alert(
        "This note can only be edited on the day it was created."
      );
      return;
    }

    setIsEditing(true);
    setEditingNoteId(note.notesId);

    // Convert createdAt to YYYY-MM-DD
    const createdDate = new Date(note.createdAt);

    const year = createdDate.getFullYear();
    const month = String(
      createdDate.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      createdDate.getDate()
    ).padStart(2, "0");

    setNoteDate(`${year}-${month}-${day}`);

    // Existing API description
    setNoteContent(`
      <p>${note.description || ""}</p>
    `);

    setShowAddNote(true);
  };

  // =========================================
  // DELETE NOTE
  // =========================================

  const handleDelete = (note) => {
    console.log("Delete note:", note);
  };

  // =========================================
  // SUBMIT / UPDATE NOTE
  // =========================================

  const handleSubmitNote = () => {
    const noteData = {
      notesId: editingNoteId,
      date: noteDate,
      employeeIds: selectedEmployees,
      description: noteContent,
    };

    if (isEditing) {
      console.log("Note updated:", noteData);
    } else {
      console.log("New note submitted:", noteData);
    }

    handleCloseNote();
  };

  // =========================================
  // FORMAT DATE
  // =========================================

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

  // =========================================
  // JSX
  // =========================================

  return (
    <MainPanel>
      <div className="official-notes-page">

        {/* =================================
            HEADER
        ================================= */}

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

        {/* =================================
            ADD / EDIT NOTE POPUP
        ================================= */}

        {showAddNote && (
          <div className="note-modal-overlay">
            <div className="note-modal">

              {/* POPUP HEADER */}

              <div className="note-modal-header">
                <h2>
                  {isEditing
                    ? "Edit Official Note"
                    : "Add Official Note"}
                </h2>

                <button
                  type="button"
                  className="close-btn"
                  onClick={handleCloseNote}
                  aria-label="Close"
                  title="Close"
                >
                  <ImCross />
                </button>
              </div>

              {/* POPUP BODY */}

              <div className="note-modal-body">

                {/* DATE */}

                <div className="note-form-group">
                  <label htmlFor="note-date">
                    Date
                  </label>

                  <input
                    id="note-date"
                    type="date"
                    value={noteDate}
                    onChange={(e) =>
                      setNoteDate(e.target.value)
                    }
                  />
                </div>

                {/* SEND TO */}

                <div className="note-form-group">
                  <label>Send To</label>

                  <div className="employee-dropdown">

                    {/* DROPDOWN HEADER */}

                    <div
                      className="employee-dropdown-header"
                      onClick={() =>
                        setIsEmployeeDropdownOpen(
                          !isEmployeeDropdownOpen
                        )
                      }
                    >
                      <span>
                        {selectedEmployees.length === 0
                          ? "All Employees"
                          : `${selectedEmployees.length} Employees Selected`}
                      </span>

                      <span className="dropdown-arrow">
                        ⌄
                      </span>
                    </div>

                    {/* EMPLOYEE LIST */}

                    {isEmployeeDropdownOpen && (
                      <div className="employee-dropdown-menu">

                        {/* ALL EMPLOYEES */}

                        <label className="employee-option">
                          <input
                            type="checkbox"
                            checked={
                              selectedEmployees.length ===
                              employees.length
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedEmployees(
                                  employees.map(
                                    (employee) =>
                                      employee.id
                                  )
                                );
                              } else {
                                setSelectedEmployees([]);
                              }
                            }}
                          />

                          <span>
                            All Employees
                          </span>
                        </label>

                        {/* INDIVIDUAL EMPLOYEES */}

                        {employees.map((employee) => (
                          <label
                            key={employee.id}
                            className="employee-option"
                          >
                            <input
                              type="checkbox"
                              checked={selectedEmployees.includes(
                                employee.id
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedEmployees(
                                    (prev) => [
                                      ...prev,
                                      employee.id,
                                    ]
                                  );
                                } else {
                                  setSelectedEmployees(
                                    (prev) =>
                                      prev.filter(
                                        (id) =>
                                          id !==
                                          employee.id
                                      )
                                  );
                                }
                              }}
                            />

                            <span>
                              {employee.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* CKEDITOR */}

                <div className="note-form-group">
                  <label>Note</label>

                  <div className="ckeditor-wrapper">
                    <CKEditor
                      editor={ClassicEditor}
                      data={noteContent}
                      onChange={(event, editor) => {
                        const data =
                          editor.getData();

                        setNoteContent(data);
                      }}
                      config={{
                        placeholder:
                          "Enter official note...",

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

              {/* POPUP FOOTER */}

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
                  {isEditing
                    ? "Update Note"
                    : "Submit Note"}
                </button>

              </div>
            </div>
          </div>
        )}

        {/* =================================
            NOTES TABLE
        ================================= */}

        <div className="notes-table-wrapper">

          <table className="notes-table">

            <thead>
              <tr>
                <th className="sr-column">
                  Sr. No.
                </th>

                <th className="date-column">
                  Date &amp; Time
                </th>

                <th className="note-column">
                  Note
                </th>

                <th className="action-column">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {/* LOADING */}

              {loading && (
                <tr>
                  <td
                    colSpan="4"
                    className="table-message"
                  >
                    Loading official notes...
                  </td>
                </tr>
              )}

              {/* ERROR */}

              {!loading && error && (
                <tr>
                  <td
                    colSpan="4"
                    className="table-message error"
                  >
                    {error}
                  </td>
                </tr>
              )}

              {/* EMPTY */}

              {!loading &&
                !error &&
                notes.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="table-message"
                    >
                      No official notes found.
                    </td>
                  </tr>
                )}

              {/* NOTES */}

              {!loading &&
                !error &&
                notes.map((note, index) => (
                  <tr key={note.notesId}>

                    {/* SR NO */}

                    <td className="sr-column">
                      <span className="sr-number">
                        {index + 1}
                      </span>
                    </td>

                    {/* DATE */}

                    <td className="date-column">
                      <span className="note-date">
                        {formatDate(
                          note.createdAt
                        )}
                      </span>
                    </td>

                    {/* NOTE */}

                    <td className="note-column">
                      <div className="note-content">
                        <p>
                          {note.description}
                        </p>
                      </div>
                    </td>

                    {/* ACTION */}

                    <td className="action-column">
                      <div className="note-actions">

                        {/* EDIT */}

                        <button
                          type="button"
                          className={`action-btn edit-btn ${
                            !isEditAllowed(note)
                              ? "disabled"
                              : ""
                          }`}
                          onClick={() =>
                            handleEdit(note)
                          }
                          disabled={
                            !isEditAllowed(note)
                          }
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
                          onClick={() =>
                            handleDelete(note)
                          }
                          title="Delete Note"
                        >
                          <MdDelete className="icon" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

            </tbody>
          </table>
        </div>

        {/* =================================
            FOOTER
        ================================= */}

        <div className="notes-footer">
          Showing 1 to {notes.length} of{" "}
          {notes.length} notes
        </div>

      </div>
    </MainPanel>
  );
};

export default OfficialNotes;