import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import "./OfficialNotes.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";

const OfficialNotes = () => {
  const notes = [
    {
      id: 1,
      date: "13 Aug 2026, 10:30 AM",
      title: "Annual Day Celebration",
      description:
        "We are excited to announce that our Annual Day Celebration will be held on 20th August 2026. All employees are requested to mark their presence and join the celebration.",
    },
    {
      id: 2,
      date: "08 Aug 2026, 09:15 AM",
      title: "New Leave Policy Update",
      description:
        "Please be informed that a new leave policy has been updated and is effective from 15th August 2026. Kindly review the policy details in the HR portal.",
    },
    {
      id: 3,
      date: "05 Aug 2026, 11:00 AM",
      title: "Independence Day Holiday",
      description:
        "All employees are informed that our office will remain closed on 15th August 2026 in observance of Independence Day.",
    },
    {
      id: 4,
      date: "03 Aug 2026, 02:45 PM",
      title: "Mandatory Compliance Training",
      description:
        "All employees must complete the mandatory compliance training by 25th August 2026.",
    },
    {
      id: 5,
      date: "02 Aug 2026, 04:00 PM",
      title: "IT System Maintenance",
      description:
        "Our IT systems will undergo maintenance on 10th August 2026 from 10:00 PM to 2:00 AM.",
    },
  ];

  const handleAddNote = () => {
    console.log("Add Note clicked");
  };

  const handleEdit = (note) => {
    console.log("Edit note:", note);
  };

  const handleDelete = (note) => {
    console.log("Delete note:", note);
  };

  return (
      <MainPanel>
    <div className="official-notes-page">
      {/* Header */}
      <div className="official-notes-header">
        <div className="header-content">
          <h1>Official Notes</h1>
          <p>Create and manage official notes sent by admin to all employees.</p>
        </div>

        <button className="add-note-btn" onClick={handleAddNote}>
          <Plus size={18} strokeWidth={2} />
          <span>Add Note</span>
        </button>
      </div>

      {/* Notes Table */}
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
                      <Pencil size={17} strokeWidth={2} />
                    </button>

                    <button
                      type="button"
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(note)}
                      title="Delete Note"
                    >
                      <Trash2 size={17} strokeWidth={2} />
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