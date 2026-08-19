import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  MdEdit,
  MdDelete,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ImCross } from "react-icons/im";

import "./OfficialNotes.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";

const OfficialNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);

  const [showAddNote, setShowAddNote] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);

  const [noteDate, setNoteDate] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteCreatedAt, setNoteCreatedAt] = useState("");

  const getShortNote = (html, wordLimit = 5) => {
    const plainText = stripHtml(html).trim();

    if (!plainText) {
      return "";
    }

    const words = plainText.split(/\s+/);

    if (words.length <= wordLimit) {
      return plainText;
    }

    return `${words.slice(0, wordLimit).join(" ")}...`;
  };

  // =========================================
  // EXPANDED NOTE ID
  // =========================================
  const [expandedNoteId, setExpandedNoteId] = useState(null);

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
        },
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();

      console.log("1. Raw API Response:", result);
      console.log("2. Is Array:", Array.isArray(result));

      // Make sure response is always treated as an array
      const apiResponses = Array.isArray(result) ? result : [result];

      console.log("3. API Responses:", apiResponses);

      // Extract the data object from every response
      const formattedNotes = apiResponses
        .map((item) => item?.data)
        .filter((item) => item);

      console.log("4. Formatted Notes:", formattedNotes);
      console.log("5. Number of Notes:", formattedNotes.length);

      setNotes(formattedNotes);

      console.log("FINAL notes state data:", formattedNotes);
    } catch (error) {
      console.error("Get Official Notes Error:", error);

      setNotes([]);
      setError("Failed to load official notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOfficialNotes();
  }, []);

  // =========================================
  // TOGGLE FULL NOTE
  // =========================================
  const handleToggleNote = (noteId) => {
    setExpandedNoteId((previousId) => (previousId === noteId ? null : noteId));
  };

  // =========================================
  // REMOVE HTML FOR COLLAPSED NOTE
  // =========================================
  const stripHtml = (html) => {
    if (!html) {
      return "";
    }

    const temporaryElement = document.createElement("div");
    temporaryElement.innerHTML = html;

    return temporaryElement.textContent || temporaryElement.innerText || "";
  };

  // =========================================
  // CHECK SAME-DAY EDIT
  // =========================================
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

  // =========================================
  // ADD NOTE
  // =========================================
  const handleAddNote = () => {
    setIsEditing(false);
    setEditingNoteId(null);

    setNoteDate("");
    setNoteContent("");
    setNoteCreatedAt("");

    setSelectedEmployees([]);
    setIsEmployeeDropdownOpen(false);

    setShowAddNote(true);
  };

  // =========================================
  // CLOSE ADD / EDIT POPUP
  // =========================================
  const handleCloseNote = () => {
    setShowAddNote(false);

    setIsEditing(false);
    setEditingNoteId(null);

    setNoteDate("");
    setNoteContent("");
    setNoteCreatedAt("");

    setSelectedEmployees([]);
    setIsEmployeeDropdownOpen(false);
  };

  // =========================================
  // EDIT NOTE
  // =========================================
  const handleEdit = async (note) => {
    if (!isEditAllowed(note)) {
      alert("This note can only be edited on the day it was created.");
      return;
    }

    try {
      const response = await fetch(
        `https://userservicetest.pandozasolutions.com/AuthController/getOfficialNotesByNotesId?noteId=${note.notesId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();

      console.log("Single Note API Response:", result);

      const selectedNote = result?.data;

      if (!selectedNote) {
        alert("Note not found.");
        return;
      }

      // EDIT MODE
      setIsEditing(true);
      setEditingNoteId(selectedNote.notesId);
      setNoteCreatedAt(selectedNote.createdAt);

      setNoteContent(selectedNote.discription || "");

      // DATE
      const indiaDate = new Date(selectedNote.createdAt).toLocaleDateString(
        "en-CA",
        {
          timeZone: "Asia/Kolkata",
        },
      );

      setNoteDate(indiaDate);

      // OPEN POPUP
      setShowAddNote(true);
    } catch (error) {
      console.error("Get Single Official Note Error:", error);
      alert("Failed to load note.");
    }
  };

  // =========================================
  // DELETE NOTE
  // =========================================
  const handleDelete = async (note) => {
    const confirmDelete = window.confirm(
      "Are you sure want to delete this official note?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `https://userservicetest.pandozasolutions.com/Admin/deleteOfficialNotes?OfficialNotesId=${note.notesId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Delete API Error: ${response.status}`);
      }

      const result = await response.json();

      console.log("Delete Note Response:", result);

      alert("Official note deleted successfully.");

      // If deleted note was expanded, close it
      if (expandedNoteId === note.notesId) {
        setExpandedNoteId(null);
      }

      // Refresh notes table
      getOfficialNotes();
    } catch (error) {
      console.error("Delete Official Note Error:", error);
      alert("Failed to delete official note.");
    }
  };

  // =========================================
  // SUBMIT / ADD / UPDATE NOTE
  // =========================================
  const handleSubmitNote = async () => {
    try {
      // =========================================
      // VALIDATION
      // =========================================

      if (!noteContent || noteContent.trim() === "") {
        alert("Please enter a note.");
        return;
      }

      if (!noteDate) {
        alert("Please select a date.");
        return;
      }

      // =========================================
      // ADD NOTE
      // =========================================

      if (!isEditing) {
        const selectedDate = new Date(
          `${noteDate}T${new Date().toTimeString().slice(0, 8)}`,
        );

        const noteData = {
          notesId: 0,
          discription: noteContent,
          createdAt: selectedDate.toISOString(),
        };

        console.log("ADD NOTE REQUEST:", noteData);

        const response = await fetch(
          "https://userservicetest.pandozasolutions.com/Admin/addOfficialNotes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(noteData),
          },
        );

        console.log("ADD STATUS:", response.status);
        console.log("ADD OK:", response.ok);

        // Read response safely
        const responseText = await response.text();

        console.log("ADD RAW RESPONSE:", responseText);

        if (!response.ok) {
          throw new Error(
            responseText || `Add Note API Error: ${response.status}`,
          );
        }

        // Parse only if response contains JSON
        let result = null;

        if (responseText.trim() !== "") {
          try {
            result = JSON.parse(responseText);
          } catch (error) {
            console.warn("Add API returned non-JSON:", responseText);
          }
        }

        console.log("ADD PARSED RESPONSE:", result);

        alert("Official note added successfully.");

        handleCloseNote();

        await getOfficialNotes();

        return;
      }

      // =========================================
      // UPDATE NOTE
      // =========================================

      if (!editingNoteId) {
        alert("Note ID is missing.");
        return;
      }

      if (!noteCreatedAt) {
        alert("Created date is missing.");
        return;
      }

      const updateData = {
        notesId: editingNoteId,
        discription: noteContent,
        createdAt: noteCreatedAt,
      };

      console.log("UPDATE NOTE REQUEST:", updateData);

      const response = await fetch(
        "https://userservicetest.pandozasolutions.com/Admin/updateOfficialNotes",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        },
      );

      console.log("UPDATE STATUS:", response.status);
      console.log("UPDATE OK:", response.ok);

      const responseText = await response.text();

      console.log("UPDATE RAW RESPONSE:", responseText);

      if (!response.ok) {
        throw new Error(
          responseText || `Update Note API Error: ${response.status}`,
        );
      }

      let result = null;

      if (responseText.trim() !== "") {
        try {
          result = JSON.parse(responseText);
        } catch (error) {
          console.warn("Update API returned non-JSON:", responseText);
        }
      }

      console.log("UPDATE PARSED RESPONSE:", result);

      alert("Official note updated successfully.");

      handleCloseNote();

      await getOfficialNotes();
    } catch (error) {
      console.error("Official Note Error:", error);

      alert(error.message || "Failed to save official note.");
    }
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
                  {isEditing ? "Edit Official Note" : "Add Official Note"}
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
                  <label htmlFor="note-date">Date</label>

                  <input
                    id="note-date"
                    type="date"
                    value={noteDate}
                    onChange={(e) => setNoteDate(e.target.value)}
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
                        setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen)
                      }
                    >
                      <span>
                        {selectedEmployees.length === 0
                          ? "All Employees"
                          : `${selectedEmployees.length} Employees Selected`}
                      </span>

                      <span className="dropdown-arrow">⌄</span>
                    </div>

                    {/* EMPLOYEE LIST */}

                    {isEmployeeDropdownOpen && (
                      <div className="employee-dropdown-menu">
                        {/* ALL EMPLOYEES */}

                        <label className="employee-option">
                          <input
                            type="checkbox"
                            checked={
                              employees.length > 0 &&
                              selectedEmployees.length === employees.length
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedEmployees(
                                  employees.map((employee) => employee.id),
                                );
                              } else {
                                setSelectedEmployees([]);
                              }
                            }}
                          />

                          <span>All Employees</span>
                        </label>

                        {/* INDIVIDUAL EMPLOYEES */}

                        {employees.map((employee) => (
                          <label key={employee.id} className="employee-option">
                            <input
                              type="checkbox"
                              checked={selectedEmployees.includes(employee.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedEmployees((previous) => [
                                    ...previous,
                                    employee.id,
                                  ]);
                                } else {
                                  setSelectedEmployees((previous) =>
                                    previous.filter((id) => id !== employee.id),
                                  );
                                }
                              }}
                            />

                            <span>{employee.name}</span>
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
                        const data = editor.getData();

                        setNoteContent(data);
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
                  {isEditing ? "Update Note" : "Submit Note"}
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
                <th className="sr-column">Sr. No.</th>

                <th className="date-column">Date &amp; Time Posted On</th>

                <th className="note-column">Note Details</th>

                <th className="action-column">Action</th>
              </tr>
            </thead>

            <tbody>
              {/* LOADING */}

              {loading && (
                <tr>
                  <td colSpan="4" className="table-message">
                    Loading official notes...
                  </td>
                </tr>
              )}

              {/* ERROR */}

              {!loading && error && (
                <tr>
                  <td colSpan="4" className="table-message error">
                    {error}
                  </td>
                </tr>
              )}

              {/* EMPTY */}

              {!loading && !error && notes.length === 0 && (
                <tr>
                  <td colSpan="4" className="table-message">
                    No official notes found.
                  </td>
                </tr>
              )}

              {/* NOTES */}

              {!loading &&
                !error &&
                notes.map((note, index) => {
                  const isExpanded = expandedNoteId === note.notesId;

                  const plainTextNote = stripHtml(note.discription);

                  return (
                    <tr
                      key={note.notesId}
                      className={isExpanded ? "note-row-expanded" : ""}
                    >
                      {/* SR NO */}

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
    // =========================================
    // FULL NOTE AFTER CLICKING EYE
    // =========================================
    <div className="note-content-expanded">

      <div
        dangerouslySetInnerHTML={{
          __html: note.discription || "",
        }}
      />

    </div>

  ) : (
    // =========================================
    // FIRST 5 WORDS BY DEFAULT
    // =========================================
    <div className="note-content">

      {getShortNote(note.discription, 5)}

    </div>
  )}

</td>

                      {/* ACTION */}

                      <td className="action-column">
                        <div className="note-actions">
                          {/* =================================
                              VIEW / CLOSE NOTE
                          ================================= */}

                          <button
                            type="button"
                            className={`action-btn view-btn ${
                              isExpanded ? "active" : ""
                            }`}
                            onClick={() => handleToggleNote(note.notesId)}
                            title={
                              isExpanded ? "Close Full Note" : "View Full Note"
                            }
                            aria-label={
                              isExpanded ? "Close Full Note" : "View Full Note"
                            }
                          >
                            {isExpanded ? (
                              <MdVisibilityOff className="icon" />
                            ) : (
                              <MdVisibility className="icon" />
                            )}
                          </button>

                          {/* =================================
                              EDIT
                          ================================= */}

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

                          {/* =================================
                              DELETE
                          ================================= */}

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

        {/* =================================
            FOOTER
        ================================= */}

        <div className="notes-footer">
          Showing 1 to {notes.length} of {notes.length} notes
        </div>
      </div>
    </MainPanel>
  );
};

export default OfficialNotes;
