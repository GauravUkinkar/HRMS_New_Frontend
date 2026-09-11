import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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

  const [currentPage, setCurrentPage] = useState(1);

  const NOTES_PER_PAGE = 7;

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

  // Stores complete notification returned by
  // GET /Notification/getNotificationById
  const [editingNotification, setEditingNotification] = useState(null);

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteCreatedAt, setNoteCreatedAt] = useState("");

  // ==========================================================
// NOTE VIEW STATE
// ==========================================================

const [expandedNoteId, setExpandedNoteId] = useState(null);

// ==========================================================
// NOTE DETAILS POPUP STATE
// ==========================================================

const [showNoteDetailsModal, setShowNoteDetailsModal] = useState(false);
const [selectedNote, setSelectedNote] = useState(null);

  // ==========================================================
  // REMOVE HTML
  // ==========================================================

  const stripHtml = (html) => {
    if (!html) return "";

    const element = document.createElement("div");
    element.innerHTML = html;

    return element.textContent || element.innerText || "";
  };

  // ==========================================================
  // SHORT NOTE
  // ==========================================================

  const getShortNote = (html, wordLimit = 5) => {
    const text = stripHtml(html).trim();

    if (!text) return "";

    const words = text.split(/\s+/);

    if (words.length <= wordLimit) {
      return text;
    }

    return `${words.slice(0, wordLimit).join(" ")}...`;
  };

  // ==========================================================
  // GET ALL OFFICIAL NOTES
  // GET /Notification/getAdminNotifications
  // ==========================================================

  const getOfficialNotes = async () => {
    try {
      setNotesLoading(true);
      setNotesError("");

      const res = await axios.get(
        `${BASE_URL}Notification/getAdminNotifications`,
        {
          withCredentials: true,
        },
      );

      console.log("GET ADMIN NOTIFICATIONS RESPONSE:", res.data);

      // --------------------------------------------------------
      // ONLY OFFICIAL NOTES
      // --------------------------------------------------------

      const officialNotifications = Array.isArray(res.data)
        ? res.data.filter(
            (item) => item?.type?.toLowerCase() === "official_note",
          )
        : [];

      // --------------------------------------------------------
      // GROUP NOTIFICATIONS
      //
      // One official note may create multiple notification
      // records - one record for every recipient.
      // --------------------------------------------------------

      const groupedNotifications = {};

      officialNotifications.forEach((item) => {
        let normalizedCreatedAt = "";

        if (item?.createdAt) {
          const date = new Date(item.createdAt);

          if (!isNaN(date.getTime())) {
            normalizedCreatedAt = date.toISOString().slice(0, 16);
          }
        }

        const groupKey = [
          item?.title || "",
          item?.message || "",
          normalizedCreatedAt,
          item?.type || "",
        ].join("___");

        // ------------------------------------------------------
        // CREATE GROUP
        // ------------------------------------------------------

        if (!groupedNotifications[groupKey]) {
          groupedNotifications[groupKey] = {
            key: Object.keys(groupedNotifications).length + 1,

            // First notification ID
            notesId: item?.id,

            // All notification IDs in this group
            notificationIds: [],

            title: item?.title || "",
            discription: item?.message || "",
            createdAt: item?.createdAt || "",
            type: item?.type || "",

            referenceId: item?.referenceId ?? 0,

            // All recipients
            recipientUids: [],

            // Complete notification objects
            notifications: [],
          };
        }

        // ------------------------------------------------------
        // STORE NOTIFICATION ID
        // ------------------------------------------------------

        if (item?.id !== null && item?.id !== undefined) {
          groupedNotifications[groupKey].notificationIds.push(item.id);
        }

        // ------------------------------------------------------
        // STORE RECIPIENT UID
        // ------------------------------------------------------

        if (item?.recipientUid !== null && item?.recipientUid !== undefined) {
          groupedNotifications[groupKey].recipientUids.push(item.recipientUid);
        }

        // ------------------------------------------------------
        // STORE COMPLETE NOTIFICATION
        // ------------------------------------------------------

        groupedNotifications[groupKey].notifications.push(item);
      });

      // --------------------------------------------------------
      // CONVERT OBJECT TO ARRAY
      // --------------------------------------------------------

    const formattedNotes = Object.values(groupedNotifications).map(
  (note, index) => ({
    ...note,

    key: index + 1,

    recipientUids: [...new Set(note.recipientUids)],
    notificationIds: [...new Set(note.notificationIds)],
  }),
);

// --------------------------------------------------------
// SORT NOTES: NEWEST NOTE FIRST
// --------------------------------------------------------

formattedNotes.sort((a, b) => {
  const dateA = new Date(a.createdAt).getTime();
  const dateB = new Date(b.createdAt).getTime();

  return dateB - dateA;
});

console.log("GROUPED OFFICIAL NOTES - NEWEST FIRST:", formattedNotes);

setNotes(formattedNotes);
      setCurrentPage(1);
    } catch (error) {
      console.error("Get Admin Notifications API Error:", error);

      setNotes([]);

      if (error.response?.status === 401) {
        setNotesError("Authentication required.");
      } else if (error.response?.status === 403) {
        setNotesError("You are not authorized to view notifications.");
      } else if (error.response?.status === 404) {
        setNotesError("Notifications not found.");
      } else {
        setNotesError("Failed to load official notes.");
      }
    } finally {
      setNotesLoading(false);
    }
  };

  // ==========================================================
  // GET ALL EMPLOYEES
  // GET /Admin/GetAllEmployee
  // ==========================================================

  const getAllEmployees = async () => {
    try {
      setEmployeeLoading(true);
      setEmployeeError("");

      const res = await axios.get(`${BASE_URL}Admin/GetAllEmployee`, {
        withCredentials: true,
      });

      console.log("GET ALL EMPLOYEES RESPONSE:", res.data);

      const formattedEmployees = Array.isArray(res.data)
        ? res.data
            .map((item, index) => ({
              key: index + 1,

              // IMPORTANT:
              // Your employee API returns UID inside data.uid
              employeeId: item?.data?.uid,

              employeeName: item?.data?.employeeName,

              department: item?.data?.department,

              designation: item?.data?.designation,

              email: item?.data?.email,

              contactNumber: item?.data?.contactNumber,
            }))
            .filter(
              (employee) =>
                employee.employeeId !== null &&
                employee.employeeId !== undefined,
            )
        : [];

      setEmployees(formattedEmployees);

      if (formattedEmployees.length === 0) {
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
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    getAllEmployees();
    getOfficialNotes();
  }, []);

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const totalPages = Math.ceil(notes.length / NOTES_PER_PAGE);

  const startIndex = (currentPage - 1) * NOTES_PER_PAGE;

  const endIndex = startIndex + NOTES_PER_PAGE;

  const currentNotes = notes.slice(startIndex, endIndex);

  // ==========================================================
  // GET SENT TO TEXT
  // ==========================================================

  const getSentToText = (recipientUids) => {
    if (!recipientUids || recipientUids.length === 0) {
      return "-";
    }

    const allEmployeeIds = employees
      .map((employee) => employee.employeeId)
      .filter((id) => id !== null && id !== undefined);

    const uniqueRecipientIds = [...new Set(recipientUids)];

    // --------------------------------------------------------
    // ALL EMPLOYEES
    // --------------------------------------------------------

    if (
      allEmployeeIds.length > 0 &&
      uniqueRecipientIds.length === allEmployeeIds.length &&
      allEmployeeIds.every((id) =>
        uniqueRecipientIds.some(
          (recipientId) => String(recipientId) === String(id),
        ),
      )
    ) {
      return "All Employees";
    }

    // --------------------------------------------------------
    // SPECIFIC EMPLOYEES
    // --------------------------------------------------------

    const employeeNames = uniqueRecipientIds
      .map((recipientId) => {
        const employee = employees.find(
          (item) => String(item.employeeId) === String(recipientId),
        );

        return employee?.employeeName;
      })
      .filter(Boolean);

    if (employeeNames.length === 0) {
      return `${uniqueRecipientIds.length} Employees`;
    }

    return employeeNames.join(", ");
  };

  // ==========================================================
  // OPEN ADD NOTE MODAL
  // ==========================================================

  const handleAddNote = () => {
    setIsEditing(false);
    setEditingNoteId(null);
    setEditingNotification(null);

    setNoteTitle("");
    setNoteContent("");
    setNoteCreatedAt("");

    setSelectedEmployees([]);

    setIsEmployeeDropdownOpen(false);

    setShowNoteModal(true);
  };

  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const handleCloseNote = () => {
    setShowNoteModal(false);

    setIsEditing(false);
    setEditingNoteId(null);
    setEditingNotification(null);

    setNoteTitle("");
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
  // SELECT / DESELECT ALL
  // ==========================================================

  const handleSelectAllEmployees = (checked) => {
    if (checked) {
      const allEmployeeIds = employees
        .map((employee) => employee.employeeId)
        .filter((id) => id !== null && id !== undefined);

      setSelectedEmployees(allEmployeeIds);
    } else {
      setSelectedEmployees([]);
    }
  };

  // ==========================================================
  // SELECT / DESELECT EMPLOYEE
  // ==========================================================

  const handleEmployeeSelection = (employeeId, checked) => {
    if (checked) {
      setSelectedEmployees((previous) => {
        const alreadySelected = previous.some(
          (id) => String(id) === String(employeeId),
        );

        if (alreadySelected) {
          return previous;
        }

        return [...previous, employeeId];
      });
    } else {
      setSelectedEmployees((previous) =>
        previous.filter((id) => String(id) !== String(employeeId)),
      );
    }
  };

 const handleToggleNote = (note) => {
  setSelectedNote(note);
  setShowNoteDetailsModal(true);
  setExpandedNoteId(null);
};

const handleCloseNoteDetails = () => {
  setShowNoteDetailsModal(false);
  setSelectedNote(null);
};
  // ==========================================================
  // CHECK EDIT ALLOWED
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
  // GET NOTIFICATION BY ID + EDIT
  //
  // GET /Notification/getNotificationById?id={id}
  // ==========================================================

  const handleEdit = async (note) => {
  if (!isEditAllowed(note)) {
    toast.warning(
      "This note can only be edited on the day it was created.",
    );
    return;
  }

  try {
    // ------------------------------------------------------
    // GET ORIGINAL NOTIFICATION
    // ------------------------------------------------------

    const res = await axios.get(
      `${BASE_URL}Notification/getNotificationById?id=${note.notesId}`,
      {
        withCredentials: true,
      },
    );

    console.log("GET NOTIFICATION BY ID RESPONSE:", res.data);

    const selectedNotification = res.data?.data;

    if (!selectedNotification) {
      toast.error("Notification not found.");
      return;
    }

    // ------------------------------------------------------
    // SET EDIT MODE
    // ------------------------------------------------------

    setIsEditing(true);

    setEditingNoteId(selectedNotification.id);

    setEditingNotification(selectedNotification);

    setNoteTitle(selectedNotification.title || "");

    setNoteContent(selectedNotification.message || "");

    setNoteCreatedAt(selectedNotification.createdAt || "");

    // ------------------------------------------------------
    // IMPORTANT:
    // USE GROUPED NOTE RECIPIENTS
    //
    // note.recipientUids contains ALL employees who received
    // this official note.
    //
    // Do NOT use only selectedNotification.recipientUid.
    // ------------------------------------------------------

    let existingRecipients = [];

    if (
      Array.isArray(note.recipientUids) &&
      note.recipientUids.length > 0
    ) {
      existingRecipients = [...new Set(note.recipientUids)];
    } else if (
      Array.isArray(selectedNotification.recipientUids) &&
      selectedNotification.recipientUids.length > 0
    ) {
      existingRecipients = [
        ...new Set(selectedNotification.recipientUids),
      ];
    } else if (
      selectedNotification.recipientUid !== null &&
      selectedNotification.recipientUid !== undefined
    ) {
      existingRecipients = [selectedNotification.recipientUid];
    }

    console.log(
      "ALL EXISTING RECIPIENTS FOR EDIT:",
      existingRecipients,
    );

    // ------------------------------------------------------
    // SET ALL RECIPIENTS IN EDIT DROPDOWN
    // ------------------------------------------------------

    setSelectedEmployees(existingRecipients);

    setIsEmployeeDropdownOpen(false);

    setShowNoteModal(true);
  } catch (error) {
    console.error("Get Notification By ID API Error:", error);

    if (error.response?.status === 401) {
      toast.error("Authentication required.");
    } else if (error.response?.status === 403) {
      toast.error(
        "You are not authorized to view this notification.",
      );
    } else if (error.response?.status === 404) {
      toast.error("Notification not found.");
    } else {
      toast.error("Failed to load notification.");
    }
  }
};

  // ==========================================================
  // DELETE NOTE
  //
  // DELETE /Notification/deleteNotification/{id}
  // ==========================================================

  const handleDelete = async (note) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this official note?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `${BASE_URL}Notification/deleteNotification/${note.notesId}`,
        {
          withCredentials: true,
        },
      );

      // ------------------------------------------------------
      // REMOVE FROM UI
      // ------------------------------------------------------

      setNotes((previousNotes) =>
        previousNotes.filter(
          (item) => String(item.notesId) !== String(note.notesId),
        ),
      );

      // ------------------------------------------------------
      // CLOSE EXPANDED NOTE
      // ------------------------------------------------------

      if (String(expandedNoteId) === String(note.notesId)) {
        setExpandedNoteId(null);
      }

      // ------------------------------------------------------
      // PAGINATION
      // ------------------------------------------------------

      setCurrentPage((previousPage) => {
        const remainingNotes = Math.max(0, notes.length - 1);

        const newTotalPages = Math.max(
          1,
          Math.ceil(remainingNotes / NOTES_PER_PAGE),
        );

        return Math.min(previousPage, newTotalPages);
      });

      toast.success("Official note deleted successfully.");
    } catch (error) {
      console.error("Delete Notification API Error:", error);

      if (error.response?.status === 401) {
        toast.warning("Authentication required.");
      } else if (error.response?.status === 403) {
        toast.warning("You are not authorized to delete this notification.");
      } else if (error.response?.status === 404) {
        toast.warning("Notification not found.");
      } else {
        toast.error(
          error.response?.data?.message ||
            error.response?.data ||
            error.message ||
            "Failed to delete official note.",
        );
      }
    }
  };

  // ==========================================================
  // ADD / UPDATE NOTE
  // ==========================================================

  const handleSubmitNote = async () => {
    try {
      // ========================================================
      // VALIDATION
      // ========================================================

      if (!noteTitle || noteTitle.trim() === "") {
        toast.warning("Please enter a title.");
        return;
      }

      if (!noteContent || noteContent.trim() === "") {
        toast.warning("Please enter a note.");
        return;
      }

      // ========================================================
      // ADD NEW NOTE
      //
      // POST /Notification/Admin/create
      // ========================================================

      if (!isEditing) {
        let recipientUids = [];

        // ------------------------------------------------------
        // IF EMPLOYEES ARE SELECTED
        // ------------------------------------------------------

        if (selectedEmployees.length > 0) {
          recipientUids = [...new Set(selectedEmployees)];
        } else {
          // ----------------------------------------------------
          // NO SELECTION = ALL EMPLOYEES
          // ----------------------------------------------------

          recipientUids = [
            ...new Set(
              employees
                .map((employee) => employee.employeeId)
                .filter((id) => id !== null && id !== undefined),
            ),
          ];
        }

        if (recipientUids.length === 0) {
          toast.error("No employees available.");
          return;
        }

        // ------------------------------------------------------
        // CREATE REQUEST
        // ------------------------------------------------------

        const notificationData = {
          recipientUids: recipientUids,

          title: noteTitle.trim(),

          message: noteContent,

          type: "Official_Note",

          referenceId: 0,
        };

        console.log("CREATE OFFICIAL NOTE REQUEST:", notificationData);

        const res = await axios.post(
          `${BASE_URL}Notification/Admin/create`,
          notificationData,
          {
            withCredentials: true,
          },
        );

        console.log("CREATE OFFICIAL NOTE RESPONSE:", res.data);

        toast.success("Official note sent successfully.");

        handleCloseNote();

        await getOfficialNotes();

        return;
      }

     // ========================================================
// UPDATE EXISTING NOTE
// ========================================================

if (editingNoteId === null || editingNoteId === undefined) {
  toast.error("Notification ID is missing.");
  return;
}

if (!noteCreatedAt) {
  toast.error("Created date is missing.");
  return;
}

// --------------------------------------------------------
// FIND GROUPED NOTE
// --------------------------------------------------------

const currentNote = notes.find(
  (item) =>
    String(item.notesId) === String(editingNoteId) ||
    item.notificationIds?.some(
      (id) => String(id) === String(editingNoteId),
    ),
);

if (!currentNote) {
  toast.error("Current notification data was not found.");
  return;
}

// --------------------------------------------------------
// GET ALL EXISTING NOTIFICATION RECORDS
// --------------------------------------------------------

let existingNotifications = [];

if (Array.isArray(currentNote.notifications)) {
  existingNotifications = currentNote.notifications.filter(
    (notification) =>
      notification?.id !== null &&
      notification?.id !== undefined,
  );
}

// --------------------------------------------------------
// SAFETY CHECK
// --------------------------------------------------------

if (existingNotifications.length === 0) {
  toast.error("Existing notification records were not found.");
  return;
}

console.log(
  "EXISTING NOTIFICATION RECORDS:",
  existingNotifications,
);

// --------------------------------------------------------
// GET SELECTED RECIPIENTS
//
// EMPTY = ALL EMPLOYEES
// --------------------------------------------------------

let newRecipientUids = [];

if (selectedEmployees.length > 0) {
  newRecipientUids = [...new Set(selectedEmployees)];
} else {
  newRecipientUids = [
    ...new Set(
      employees
        .map((employee) => employee.employeeId)
        .filter(
          (id) =>
            id !== null &&
            id !== undefined,
        ),
    ),
  ];
}

if (newRecipientUids.length === 0) {
  toast.error("No employees selected.");
  return;
}

console.log(
  "NEW RECIPIENT UIDS:",
  newRecipientUids,
);

// --------------------------------------------------------
// EXISTING RECIPIENTS
// --------------------------------------------------------

const oldRecipientUids = [
  ...new Set(
    existingNotifications
      .map((notification) => notification.recipientUid)
      .filter(
        (id) =>
          id !== null &&
          id !== undefined,
      ),
  ),
];

console.log(
  "OLD RECIPIENT UIDS:",
  oldRecipientUids,
);

// --------------------------------------------------------
// FIND:
// 1. RECIPIENTS TO KEEP
// 2. RECIPIENTS TO ADD
// 3. RECIPIENTS TO REMOVE
// --------------------------------------------------------

const recipientsToKeep = newRecipientUids.filter(
  (newId) =>
    oldRecipientUids.some(
      (oldId) =>
        String(oldId) === String(newId),
    ),
);

const recipientsToAdd = newRecipientUids.filter(
  (newId) =>
    !oldRecipientUids.some(
      (oldId) =>
        String(oldId) === String(newId),
    ),
);

const recipientsToRemove = oldRecipientUids.filter(
  (oldId) =>
    !newRecipientUids.some(
      (newId) =>
        String(newId) === String(oldId),
    ),
);

console.log("RECIPIENTS TO KEEP:", recipientsToKeep);

console.log("RECIPIENTS TO ADD:", recipientsToAdd);

console.log(
  "RECIPIENTS TO REMOVE:",
  recipientsToRemove,
);

// ========================================================
// 1. UPDATE EXISTING NOTIFICATIONS
// ========================================================
//
// Only update records whose recipients are still selected.
// This changes title + message.
//
// ========================================================

const updateRequests = existingNotifications
  .filter((notification) =>
    recipientsToKeep.some(
      (recipientId) =>
        String(recipientId) ===
        String(notification.recipientUid),
    ),
  )
  .map((notification) => {
    const updateData = {
      id: notification.id,

      recipientUid: notification.recipientUid,

      title: noteTitle.trim(),

      message: noteContent,

      type:
        notification.type ||
        editingNotification?.type ||
        currentNote.type ||
        "Official_Note",
    };

    console.log(
      `UPDATE NOTIFICATION - ID ${notification.id}:`,
      updateData,
    );

    return axios.put(
     `${BASE_URL}Notification/updateNotification`,
      updateData,
      {
        withCredentials: true,
      },
    );
  });

// ========================================================
// 2. CREATE NOTIFICATIONS FOR NEW RECIPIENTS
// ========================================================

let createRequest = null;

if (recipientsToAdd.length > 0) {
  const createData = {
    recipientUids: recipientsToAdd,

    title: noteTitle.trim(),

    message: noteContent,

    type:
      editingNotification?.type ||
      currentNote.type ||
      "Official_Note",

    referenceId:
      editingNotification?.referenceId ??
      currentNote.referenceId ??
      0,
  };

  console.log(
    "CREATE NOTIFICATIONS FOR NEW RECIPIENTS:",
    createData,
  );

  createRequest = axios.post(
    `${BASE_URL}Notification/Admin/create`,
    createData,
    {
      withCredentials: true,
    },
  );
}

// ========================================================
// 3. DELETE NOTIFICATIONS FOR REMOVED RECIPIENTS
// ========================================================

const deleteRequests = existingNotifications
  .filter((notification) =>
    recipientsToRemove.some(
      (recipientId) =>
        String(recipientId) ===
        String(notification.recipientUid),
    ),
  )
  .map((notification) => {
    console.log(
      `DELETE NOTIFICATION - ID ${notification.id}`,
    );

    return axios.delete(
      `${BASE_URL}Notification/deleteNotification/${notification.id}`,
      {
        withCredentials: true,
      },
    );
  });

// ========================================================
// EXECUTE ALL REQUESTS
// ========================================================

const allRequests = [
  ...updateRequests,
  ...deleteRequests,
];

if (createRequest) {
  allRequests.push(createRequest);
}

await Promise.all(allRequests);

console.log(
  "ALL UPDATE / CREATE / DELETE OPERATIONS COMPLETED",
);

// ========================================================
// SUCCESS
// ========================================================

toast.success("Official note updated successfully.");

handleCloseNote();

await getOfficialNotes();
    } catch (error) {
      console.error("Official Note API Error:", error);

      // --------------------------------------------------------
      // API ERROR HANDLING
      // --------------------------------------------------------

      if (error.response?.status === 400) {
        toast.error(
          error.response?.data?.message ||
            error.response?.data ||
            "Invalid request.",
        );
      } else if (error.response?.status === 401) {
        toast.error("Authentication required.");
      } else if (error.response?.status === 403) {
        toast.error(
          isEditing
            ? "You are not authorized to update this notification."
            : "You are not authorized to create this notification.",
        );
      } else if (error.response?.status === 404) {
        toast.error("Notification not found.");
      } else {
        toast.error(
          error.response?.data?.message ||
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

    const date = new Date(createdAt);

    if (isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================================
  // CHECK ALL EMPLOYEES
  // ==========================================================

  const areAllEmployeesSelected =
    employees.length > 0 &&
    selectedEmployees.length === employees.length &&
    employees.every((employee) =>
      selectedEmployees.some(
        (selectedId) => String(selectedId) === String(employee.employeeId),
      ),
    );

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
          <div
            className="note-modal-overlay"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                handleCloseNote();
              }
            }}
          >
            <div className="note-modal">
              {/* ==================================================
                  MODAL HEADER
              ================================================== */}

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

              {/* ==================================================
                  MODAL BODY
              ================================================== */}

              <div className="note-modal-body">
                {/* ==================================================
                    SEND TO
                ================================================== */}

                <div className="note-form-group">
                  <label>Send To</label>

                  <div className="employee-dropdown">
                    {/* DROPDOWN HEADER */}

                    <button
                      type="button"
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
                    </button>

                    {/* DROPDOWN MENU */}

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

                        {/* EMPLOYEES */}

                        {!employeeLoading &&
                          !employeeError &&
                          employees.length > 0 && (
                            <>
                              {/* ALL EMPLOYEES */}

                              <label className="employee-option">
                                <input
                                  type="checkbox"
                                  checked={areAllEmployeesSelected}
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
                                    checked={selectedEmployees.some(
                                      (selectedId) =>
                                        String(selectedId) ===
                                        String(employee.employeeId),
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

                        {/* NO EMPLOYEES */}

                        {!employeeLoading &&
                          !employeeError &&
                          employees.length === 0 && (
                            <div className="employee-error">
                              No employees found.
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>

                {/* ==================================================
                    TITLE
                ================================================== */}

                <div className="note-form-group">
                  <label htmlFor="note-title">Title</label>

                  <input
                    id="note-title"
                    type="text"
                    className="note-title-input"
                    placeholder="Enter notification title..."
                    value={noteTitle}
                    onChange={(event) => setNoteTitle(event.target.value)}
                  />
                </div>

                {/* ==================================================
                    MESSAGE
                ================================================== */}

                <div className="note-form-group">
                  <label>Message</label>

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

              {/* ==================================================
                  MODAL FOOTER
              ================================================== */}

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

                <th className="note-column">Note Title</th>

                <th className="sent-to-column">Sent To</th>

                <th className="action-column">Action</th>
              </tr>
            </thead>

            <tbody>
              {/* ==================================================
                  LOADING
              ================================================== */}

              {notesLoading && (
                <tr>
                  <td colSpan="5" className="table-message">
                    Loading official notes...
                  </td>
                </tr>
              )}

              {/* ==================================================
                  ERROR
              ================================================== */}

              {!notesLoading && notesError && (
                <tr>
                  <td colSpan="5" className="table-message error">
                    {notesError}
                  </td>
                </tr>
              )}

              {/* ==================================================
                  EMPTY
              ================================================== */}

              {!notesLoading && !notesError && notes.length === 0 && (
                <tr>
                  <td colSpan="5" className="table-message">
                    No official notes found.
                  </td>
                </tr>
              )}

              {/* ==================================================
                  NOTES
              ================================================== */}

              {!notesLoading &&
                !notesError &&
                currentNotes.map((note, index) => {
                  const isExpanded =
                    String(expandedNoteId) === String(note.notesId);

                  return (
                    <tr
                      key={note.notesId}
                      className={isExpanded ? "note-row-expanded" : ""}
                    >
                      {/* ==================================================
                            SERIAL
                        ================================================== */}

                      <td className="sr-column">
                        <span className="sr-number">
                          {startIndex + index + 1}
                        </span>
                      </td>

                      {/* ==================================================
                            DATE
                        ================================================== */}

                      <td className="date-column">
                        <span className="note-date">
                          {formatDate(note.createdAt)}
                        </span>
                      </td>

                      {/* ==================================================
                            NOTE TITLE / CONTENT
                        ================================================== */}

                      <td className="note-column">
                        {isExpanded ? (
                          <div className="note-content-expanded">
                            <div className="note-title-expanded">
                              {note.title || "-"}
                            </div>

                            <div
                              dangerouslySetInnerHTML={{
                                __html: note.discription || "",
                              }}
                            />
                          </div>
                        ) : (
                          <div className="note-content">
                            {note.title || "-"}
                          </div>
                        )}
                      </td>

                      {/* ==================================================
                            SENT TO
                        ================================================== */}

                      <td className="sent-to-column">
                        <span className="sent-to-text">
                          {getSentToText(note.recipientUids)}
                        </span>
                      </td>

                      {/* ==================================================
                            ACTIONS
                        ================================================== */}

                      <td className="action-column">
                        <div className="note-actions">
                          {/* VIEW */}

                          <button
                            type="button"
                            className={`action-btn view-btn ${
                              isExpanded ? "active" : ""
                            }`}
                            onClick={() => handleToggleNote(note)}
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
            FOOTER
        ================================================== */}

        <div className="notes-footer">
          <div className="notes-count">
            {notes.length === 0
              ? "Showing 0 to 0 of 0 notes"
              : `Showing ${startIndex + 1} to ${Math.min(
                  endIndex,
                  notes.length,
                )} of ${notes.length} notes`}
          </div>

          {/* ==================================================
              PAGINATION
          ================================================== */}

          {totalPages > 1 && (
            <div className="pagination">
              {/* PREVIOUS */}

              <button
                type="button"
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((previousPage) => previousPage - 1)
                }
              >
                Previous
              </button>

              {/* PAGE NUMBERS */}

              <div className="pagination-pages">
                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`pagination-number ${
                      currentPage === page ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* NEXT */}

              <button
                type="button"
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((previousPage) => previousPage + 1)
                }
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>


      {/* ==================================================
    NOTE DETAILS POPUP
================================================== */}

{showNoteDetailsModal && selectedNote && (
  <div
    className="note-details-modal-overlay"
    onClick={handleCloseNoteDetails}
  >
    <div
      className="note-details-modal"
      onClick={(event) => event.stopPropagation()}
    >
      {/* ==================================================
          POPUP HEADER
      ================================================== */}

      <div className="note-details-modal-header">
        <h2>Note Details</h2>

        <button
          type="button"
          className="note-details-close-icon"
          onClick={handleCloseNoteDetails}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* ==================================================
          POPUP BODY
      ================================================== */}

      <div className="note-details-modal-body">

        {/* POSTED ON */}

        <div className="note-details-field posted-field">
          <div className="note-details-label">
            Posted on
          </div>

          <div className="note-details-value">
            {formatDate(selectedNote.createdAt)}
          </div>
        </div>

        {/* TITLE */}

        <div className="note-details-field">
          <div className="note-details-label">
            TITLE
          </div>

          <div className="note-details-title-value">
            {selectedNote.title || "-"}
          </div>
        </div>

        {/* MESSAGE */}

        <div className="note-details-field">
          <div className="note-details-label">
            MESSAGE
          </div>

          <div
            className="note-details-message"
            dangerouslySetInnerHTML={{
              __html: selectedNote.discription || "",
            }}
          />
        </div>

        {/* SEND TO */}

        <div className="note-details-field">
          <div className="note-details-label">
            SEND TO
          </div>

          <div className="note-details-recipients">
            {(() => {
              const recipientIds = selectedNote.recipientUids || [];

              if (recipientIds.length === 0) {
                return (
                  <span className="note-recipient-chip">
                    No recipients
                  </span>
                );
              }

              const recipientNames = recipientIds.map(
                (recipientId) => {
                  const employee = employees.find(
                    (item) =>
                      String(item.employeeId) ===
                      String(recipientId),
                  );

                  return (
                    employee?.employeeName ||
                    `Employee ${recipientId}`
                  );
                },
              );

              const visibleRecipients =
                recipientNames.slice(0, 3);

              const remainingCount =
                recipientNames.length - visibleRecipients.length;

              return (
                <>
                  {visibleRecipients.map(
                    (name, index) => (
                      <span
                        key={`${name}-${index}`}
                        className="note-recipient-chip"
                      >
                        {name}
                      </span>
                    ),
                  )}

                  {remainingCount > 0 && (
                    <span className="note-recipient-more">
                      +{remainingCount}
                    </span>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ==================================================
          POPUP FOOTER
      ================================================== */}

      <div className="note-details-modal-footer">
        <button
          type="button"
          className="note-details-close-btn"
          onClick={handleCloseNoteDetails}
        >
          [ Close ]
        </button>
      </div>
    </div>
  </div>
)}
    </MainPanel>
  );
};

export default OfficialNotes;
