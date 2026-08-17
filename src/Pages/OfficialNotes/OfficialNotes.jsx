import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ImCross } from "react-icons/im";

import "./OfficialNotes.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";

const OfficialNotes = () => {
  const [sendTo, setSendTo] = useState("all");

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
  const notes = [
    {
      id: 1,
      date: "2026-08-13",

      displayDate: "13 Aug 2026, 10:30 AM",
      sendTo: "all",
      title: "Annual Day Celebration",
      description:
        "We are excited to announce that our Annual Day Celebration will be held on 20th August 2026. All employees are requested to mark their presence and join the celebration.",
    },

    {
      id: 2,
      date: "2026-08-08",
      displayDate: "08 Aug 2026, 09:15 AM",
      sendTo: "all",
      title: "New Leave Policy Update",
      description:
        "Please be informed that a new leave policy has been updated and is effective from 15th August 2026. Kindly review the policy details in the HR portal.",
    },

    {
      id: 3,
      date: "2026-08-05",
      displayDate: "05 Aug 2026, 11:00 AM",
      sendTo: "employee-2",
      title: "Warning Regarding Attendance",
      description:
        "Please ensure that you maintain regular attendance and follow the company's attendance policy.",
    },
  ];
  const [showAddNote, setShowAddNote] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);

  const [noteDate, setNoteDate] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const handleAddNote = () => {
    setIsEditing(false);
    setEditingNoteId(null);

    setNoteDate("");
    setSendTo("all");
    setNoteContent("");

    setShowAddNote(true);
  };
  const handleCloseNote = () => {
    setShowAddNote(false);

    setIsEditing(false);
    setEditingNoteId(null);

    setNoteDate("");
    setSendTo("all");
    setNoteContent("");
  };

  const handleEdit = (note) => {
    setIsEditing(true);
    setEditingNoteId(note.id);

    setNoteDate(note.date);
    setSendTo(note.sendTo);
    setNoteContent(`
    <h3>${note.title}</h3>
    <p>${note.description}</p>
  `);

    setShowAddNote(true);
  };

  const handleDelete = (note) => {
    console.log("Delete note:", note);
  };
  const handleSubmitNote = () => {
    const noteData = {
      id: editingNoteId,
      date: noteDate,
      sendTo: sendTo,
      note: noteContent,
    };

    if (isEditing) {
      console.log("Note updated:", noteData);
    } else {
      console.log("New note submitted:", noteData);
    }

    handleCloseNote();
  };

  return (
    <MainPanel>
      <div className="official-notes-page">
        {/* =========================
            HEADER
        ========================= */}

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

        {/* =========================
            ADD NOTE POPUP
        ========================= */}

        {showAddNote && (
          <div className="note-modal-overlay">
            <div className="note-modal">
              {/* =========================
                  POPUP HEADER
              ========================= */}

              <div className="note-modal-header">
                <h2>
                  {isEditing ? "Edit Official Note" : "Add Official Note"}
                </h2>

                {/* Close button INSIDE modal */}
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

              {/* =========================
                  POPUP BODY
              ========================= */}

              <div className="note-modal-body">
                {/* Date */}

                <div className="note-form-group">
                  <label htmlFor="note-date">Date</label>

                  <input
                    id="note-date"
                    type="date"
                    value={noteDate}
                    onChange={(e) => setNoteDate(e.target.value)}
                  />
                </div>
                <div className="note-form-group">
                  <label htmlFor="sendTo">Send To</label>

                  <select
                    id="sendTo"
                    value={sendTo}
                    onChange={(e) => setSendTo(e.target.value)}
                  >
                    <option value="all">All Employees</option>

                    {employees.map((employee) => (
                      <option
                        key={employee.id}
                        value={`employee-${employee.id}`}
                      >
                        {employee.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specific Employee */}

                {/* =========================
                    CKEDITOR NOTE
                ========================= */}

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

              {/* =========================
                  POPUP FOOTER
              ========================= */}

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

        {/* =========================
            NOTES TABLE
        ========================= */}

        <div className="notes-table-wrapper">
          <table className="notes-table">
            <thead>
              <tr>
                <th className="sr-column">Sr. No.</th>

                <th className="date-column">Date &amp; Time</th>

                <th className="note-column">Note</th>

                <th className="action-column">Action</th>
              </tr>
            </thead>

            <tbody>
              {notes.map((note) => (
                <tr key={note.id}>
                  {/* Sr No */}

                  <td className="sr-column">
                    <span className="sr-number">{note.id}</span>
                  </td>

                  {/* Date */}

                  <td className="date-column">
                    <span className="note-date">{note.date}</span>
                  </td>

                  {/* Note */}

                  <td className="note-column">
                    <div className="note-content">
                      <h3>{note.title}</h3>

                      <p>{note.description}</p>
                    </div>
                  </td>

                  {/* Actions */}

                  <td className="action-column">
                    <div className="note-actions">
                      <button
                        type="button"
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(note)}
                        title="Edit Note"
                      >
                        <MdEdit className="icon" />
                      </button>

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
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}

        <div className="notes-footer">
          Showing 1 to {notes.length} of {notes.length} notes
        </div>
      </div>
    </MainPanel>
  );
};

export default OfficialNotes;
