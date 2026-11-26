
import React, { useContext, useMemo, useState, useEffect } from "react";
import axios from "axios";
import MainPanel from "../../comp/MainPanel/MainPanel";
import { UserContext } from "../../../Context";
import { MdDelete } from "react-icons/md";

import {
  Avatar,
  Button,
  Drawer,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import {
  FiUsers,
  FiUser,
  FiSearch,
  FiArrowRight,
  FiX,
  FiMail,
  FiBriefcase,
} from "react-icons/fi";

import "./Teams.scss";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const colorClasses = {
  blue: { icon: "team-blue" },
  pink: { icon: "team-pink" },
  green: { icon: "team-green" },
  purple: { icon: "team-purple" },
  orange: { icon: "team-orange" },
};

const Teams = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // STATES
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(true);

  const [teamMembers, setTeamMembers] = useState([]);

  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [creatingTeam, setCreatingTeam] = useState(false);

  const [teamForm, setTeamForm] = useState({
    id: 0,
    name: "",
    memberCount: 0,
    manegerName: "",
  });

  const [membersLoading, setMembersLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [memberFilter, setMemberFilter] = useState("all");

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [deletingTeamId, setDeletingTeamId] = useState(null);
  const [deletingMemberId, setDeletingMemberId] = useState(null);

  // TEAM FORM CHANGE
const handleTeamFormChange = (e) => {
  const { name, value } = e.target;

  setTeamForm((prev) => ({
    ...prev,
    [name]: name === "memberCount" ? Number(value) : value,
  }));
};

  // FETCH MEMBERS BY TEAM NAME
  const fetchMembersByTeamName = async (
    teamName,
    employeeList = teamMembers
  ) => {
    try {
      const response = await axios.get(
        "https://internaltomcat.diwise.in/Pandoza_Admin/Admin/Team/getTeamMemberByTeamName",
        {
          params: {
            TeamName: teamName,
          },
        }
      );

      const members = Array.isArray(response.data)
        ? response.data
            .filter((item) => item.data)
            .map((item) => {
              const member = item.data;

              const employeeDetails = employeeList.find(
                (emp) => emp.employeeId === member.employeeId
              );

              return {
                employeeId: member.employeeId,
                name:
                  member.employeeName ||
                  employeeDetails?.employeeName ||
                  member.employeeId,
                role:
                  employeeDetails?.designation ||
                  member.designation ||
                  "Team Member",
              };
            })
        : [];

      return members;
    } catch (error) {
      console.error(
        `Error fetching members for ${teamName}:`,
        error
      );

      return [];
    }
  };

  // FETCH ALL TEAMS AND THEIR MEMBERS
  const fetchTeams = async (employeeList = teamMembers) => {
    try {
      setTeamsLoading(true);

      const response = await axios.get(
        "https://internaltomcat.diwise.in/Pandoza_Admin/Admin/Team/getAllTeams"
      );

      const teamColors = [
        "blue",
        "pink",
        "green",
        "purple",
        "orange",
      ];

      const teamsData = Array.isArray(response.data)
        ? response.data
            .filter((item) => item.data)
            .map((item, index) => {
              const team = item.data;

              return {
                id: team.id,
                name: team.name,
                leader: team.manegerName || "N/A",
                members: 0,
                idealCount: team.idealCount || 0,
                color: teamColors[index % teamColors.length],
                membersList: [],
              };
            })
        : [];

      // FETCH MEMBERS FOR EVERY TEAM
      const teamsWithMembers = await Promise.all(
        teamsData.map(async (team) => {
          const members = await fetchMembersByTeamName(
            team.name,
            employeeList
          );

          return {
            ...team,
            members: members.length,
            membersList: members,
          };
        })
      );

      setTeams(teamsWithMembers);
    } catch (error) {
      console.error("Error fetching teams:", error);
      setTeams([]);

      toast.error("Unable to fetch teams.");
    } finally {
      setTeamsLoading(false);
    }
  };

  // FETCH EMPLOYEES FIRST, THEN TEAMS
  useEffect(() => {
    const initializeTeams = async () => {
      let employees = [];

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_USER_BACKEND_URL}/AuthController/GetAllEmployee`
        );

        employees = Array.isArray(response.data)
          ? response.data
              .map((item) => item.data)
              .filter(Boolean)
          : [];

        setTeamMembers(employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setTeamMembers([]);
      }

      await fetchTeams(employees);
    };

    initializeTeams();
  }, []);

  // CREATE TEAM API
const handleCreateTeam = async (e) => {
  e.preventDefault();

  if (!teamForm.name.trim() || !teamForm.manegerName.trim()) {
    toast.error("Please enter team and team leader name.");
    return;
  }

  try {
    setCreatingTeam(true);

    const payload = {
      id: 0,
      name: teamForm.name.trim(),
      memberCount: Number(teamForm.memberCount),
      manegerName: teamForm.manegerName.trim(),
    };

    const response = await axios.post(
      "https://internaltomcat.diwise.in/Pandoza_Admin/Admin/Team/addTeam",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    toast.success("Team created successfully!");

    setCreateTeamOpen(false);

    setTeamForm({
      id: 0,
      name: "",
      memberCount: 0,
      manegerName: "",
    });

    // Refresh teams without refreshing the page
    await fetchTeams(teamMembers);

  } catch (error) {
    console.error("Error creating team:", error);

    toast.error(
      error.response?.data?.responseMessage ||
      error.response?.data?.message ||
      "Unable to create team. Please try again."
    );
  } finally {
    setCreatingTeam(false);
  }
};

  // DELETE TEAM API
  const handleDeleteTeam = async (team) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${team.name}"?`
    );

    if (!confirmDelete) return;

    try {
      setDeletingTeamId(team.id);

      await axios.delete(
        "https://internaltomcat.diwise.in/Pandoza_Admin/Admin/Team/dleteTeam",
        {
          params: {
            TeamId: team.id,
          },
        }
      );

      toast.success("Team deleted successfully!");

      if (selectedTeam?.id === team.id) {
        closeDrawer();
      }

      await fetchTeams();
    } catch (error) {
      console.error("Error deleting team:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to delete team. Please try again."
      );
    } finally {
      setDeletingTeamId(null);
    }
  };

  // FILTER TEAMS
  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        team.name.toLowerCase().includes(searchValue) ||
        team.leader.toLowerCase().includes(searchValue);

      const matchesMemberFilter =
        memberFilter === "all" ||
        (memberFilter === "hasMembers" && team.members > 0) ||
        (memberFilter === "empty" && team.members === 0);

      return matchesSearch && matchesMemberFilter;
    });
  }, [teams, search, memberFilter]);

  // SUMMARY COUNTS
  const totalTeams = teams.length;

  const totalMembers = teams.reduce(
    (total, team) => total + team.members,
    0
  );

  const teamLeaders = teams.length;

  // OPEN TEAM DRAWER AND FETCH MEMBERS
  const openTeam = async (team) => {
    setSelectedTeam({
      ...team,
      membersList: [],
    });

    setDrawerOpen(true);
    setMembersLoading(true);

    try {
      const members = await fetchMembersByTeamName(team.name);

      const updatedTeam = {
        ...team,
        members: members.length,
        membersList: members,
      };

      setSelectedTeam(updatedTeam);

      setTeams((prevTeams) =>
        prevTeams.map((item) =>
          item.id === team.id ? updatedTeam : item
        )
      );
    } catch (error) {
      console.error("Error fetching team members:", error);

      setSelectedTeam({
        ...team,
        membersList: [],
        members: 0,
      });
    } finally {
      setMembersLoading(false);
    }
  };

  // CLOSE DRAWER
  const closeDrawer = () => {
    setDrawerOpen(false);

    setTimeout(() => {
      setSelectedTeam(null);
    }, 250);
  };

  // DELETE TEAM MEMBER API
  const handleDeleteMember = async (employeeId) => {
    if (!selectedTeam || deletingMemberId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to remove this member?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingMemberId(employeeId);

      await axios.delete(
        "https://internaltomcat.diwise.in/Pandoza_Admin/Admin/Team/deleteTeamMember",
        {
          params: {
            EmployeeId: employeeId,
            TeamId: selectedTeam.id,
          },
        }
      );

      // FETCH UPDATED TEAM MEMBERS
      const updatedMembers = await fetchMembersByTeamName(
        selectedTeam.name
      );

      const updatedTeam = {
        ...selectedTeam,
        members: updatedMembers.length,
        membersList: updatedMembers,
      };

      // UPDATE DRAWER
      setSelectedTeam(updatedTeam);

      // UPDATE TEAM CARD
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.id === updatedTeam.id
            ? updatedTeam
            : team
        )
      );

      toast.success("Team member removed successfully!");
    } catch (error) {
      console.error("Error deleting team member:", error);

      toast.error(
        error.response?.data?.responseMessage ||
          error.response?.data?.message ||
          "Unable to remove team member."
      );
    } finally {
      setDeletingMemberId(null);
    }
  };

  return (
    <MainPanel
      breadcrumbs={[
        { label: "Dashboard", link: "/" },
        { label: "Team Management" },
      ]}
      title={
        String(user?.role || user?.crmRole || "")
          .trim()
          .toUpperCase() === "ADMIN"
          ? "Admin Dashboard"
          : "Team Management"
      }
    >
      <button
        type="button"
        className="back-btn"
        onClick={() => navigate("/")}
      >
        ← Back
      </button>

      <div className="team-management-page">

        {/* HEADER */}
        <div className="team-page-header">
          <div className="page-title-row">
            <div className="page-title-icon">
              <FiUsers />
            </div>

            <div>
              <h1>Team Management</h1>
              <p>Manage teams, team leaders and members</p>
            </div>
          </div>

          <Button
            className="create-team-btn"
            onClick={() => setCreateTeamOpen(true)}
          >
            Create Team
          </Button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="team-summary-grid">

          <div className="summary-card">
            <div className="summary-icon blue">
              <FiUsers />
            </div>

            <div>
              <span>Total Teams</span>
              <h2>{teamsLoading ? "..." : totalTeams}</h2>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon green">
              <FiUser />
            </div>

            <div>
              <span>Total Members</span>
              <h2>{teamsLoading ? "..." : totalMembers}</h2>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon purple">
              <FiUser />
            </div>

            <div>
              <span>Team Leaders</span>
              <h2>{teamsLoading ? "..." : teamLeaders}</h2>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon orange">
              <FiBriefcase />
            </div>

            <div>
              <span>Managers</span>
              <h2>2</h2>
            </div>
          </div>

        </div>

        {/* SEARCH */}
        <div className="team-toolbar">
          <div className="team-search">
            <FiSearch />

            <input
              type="text"
              placeholder="Search teams or team leaders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* SECTION HEADING */}
        <div className="team-section-heading">
          <div>
            <h2>All Teams</h2>

            <span>
              {filteredTeams.length}{" "}
              {filteredTeams.length === 1 ? "team" : "teams"} found
            </span>
          </div>
        </div>

        {/* TEAM GRID */}
        <div className="team-grid">

          {teamsLoading ? (
            <div className="team-loading">
              <div className="team-spinner" />
              <p>Loading teams...</p>
            </div>
          ) : filteredTeams.length > 0 ? (

            filteredTeams.map((team) => (
              <div className="team-card" key={team.id}>

                <div className={`team-card-top ${team.color}`} />

                <div className="team-card-content">

                  {/* TEAM HEADER */}
                  <div className="team-card-header">

                    <div className="team-name-wrapper">

                      <div
                        className={`team-icon ${
                          colorClasses[team.color]?.icon || "team-blue"
                        }`}
                      >
                        <FiUsers />
                      </div>

                      <div>
                        <h3>{team.name}</h3>

                        <span
                          className={`team-status ${
                            team.members > 0 ? "active" : "empty"
                          }`}
                        >
                          <span className="status-dot" />

                          {team.members > 0
                            ? "Active"
                            : "No members"}
                        </span>
                      </div>

                    </div>

                    <IconButton
                      className="more-btn delete-team-btn"
                      onClick={() => handleDeleteTeam(team)}
                      disabled={deletingTeamId === team.id}
                      title="Delete Team"
                    >
                      <MdDelete />
                    </IconButton>

                  </div>

                  {/* TEAM LEADER */}
                  <div className="team-leader">
                    <span>Team Leader</span>

                    <div className="leader-info">
                      <Avatar>
                        {team.leader.charAt(0).toUpperCase()}
                      </Avatar>

                      <p>{team.leader}</p>
                    </div>
                  </div>

                  <div className="team-divider" />

                  {/* MEMBERS PREVIEW */}
                  {team.membersList.length > 0 ? (

                    <div className="team-member-preview">

                      <div className="avatar-stack">

                        {team.membersList.slice(0, 4).map(
                          (member, index) => (
                            <Avatar
                              key={member.employeeId}
                              className={`avatar-${index}`}
                            >
                              {member.name.charAt(0).toUpperCase()}
                            </Avatar>
                          )
                        )}

                        {team.membersList.length > 4 && (
                          <div className="more-members">
                            +{team.membersList.length - 4}
                          </div>
                        )}

                      </div>

                      <span className="member-count">
                        {team.membersList.length} Members
                      </span>

                    </div>

                  ) : (

                    <div className="empty-members">
                      <div className="empty-members-icon">
                        <FiUsers />
                      </div>

                      <div>
                        <strong>No members assigned</strong>
                        <span>View team to check members</span>
                      </div>
                    </div>

                  )}

                  {/* FOOTER */}
                  <div className="team-card-footer">

                    <button
                      className="view-team-btn"
                      onClick={() => openTeam(team)}
                    >
                      View Team
                      <FiArrowRight />
                    </button>

                  </div>

                </div>
              </div>
            ))

          ) : (

            <div className="no-teams">
              <FiSearch />
              <h3>No teams found</h3>
              <p>
                Try changing your search or filter to find a team.
              </p>
            </div>

          )}

        </div>

        {/* CREATE TEAM DIALOG */}
        <Dialog
          open={createTeamOpen}
          onClose={() =>
            !creatingTeam && setCreateTeamOpen(false)
          }
          fullWidth
          maxWidth="sm"
          className="create-team-dialog"
        >

          <form onSubmit={handleCreateTeam}>

            <DialogTitle className="create-team-title">

              <div>
                <h2>Create New Team</h2>
                <p>Add a new team to your organization</p>
              </div>

              <IconButton
                onClick={() => setCreateTeamOpen(false)}
                disabled={creatingTeam}
              >
                <FiX />
              </IconButton>

            </DialogTitle>

            <DialogContent>

              <div className="create-team-form">

                <TextField
                  fullWidth
                  label="Team Name"
                  name="name"
                  value={teamForm.name}
                  onChange={handleTeamFormChange}
                  placeholder="Enter team name"
                  required
                />

                <TextField
                  fullWidth
                  label="Team Leader Name"
                  name="manegerName"
                  value={teamForm.manegerName}
                  onChange={handleTeamFormChange}
                  placeholder="Enter manager name"
                  required
                />

              </div>

            </DialogContent>

            <DialogActions className="create-team-actions">

              <Button
                onClick={() => setCreateTeamOpen(false)}
                disabled={creatingTeam}
                className="cancel-team-btn"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={creatingTeam}
                className="submit-team-btn"
              >
                {creatingTeam ? "Creating..." : "Create Team"}
              </Button>

            </DialogActions>

          </form>

        </Dialog>

        {/* TEAM DRAWER */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={closeDrawer}
          className="team-drawer"
        >

          {selectedTeam && (

            <div className="drawer-content">

              {/* DRAWER HEADER */}
              <div className="drawer-header">

                <div className="drawer-title">

                  <div
                    className={`drawer-team-icon ${
                      colorClasses[selectedTeam.color]?.icon || "team-blue"
                    }`}
                  >
                    <FiUsers />
                  </div>

                  <div>
                    <h2>{selectedTeam.name}</h2>

                    <span>
                      {selectedTeam.members}{" "}
                      {selectedTeam.members === 1
                        ? "Member"
                        : "Members"}
                    </span>
                  </div>

                </div>

                <IconButton onClick={closeDrawer}>
                  <FiX />
                </IconButton>

              </div>

              {/* TEAM LEADER */}
              <div className="drawer-leader-card">

                <span>TEAM LEADER</span>

                <div className="drawer-leader">

                  <Avatar>
                    {selectedTeam.leader.charAt(0).toUpperCase()}
                  </Avatar>

                  <div>
                    <strong>{selectedTeam.leader}</strong>

                    <p>
                      <FiMail />
                      Team Leader
                    </p>
                  </div>

                </div>

              </div>

              {/* MEMBERS HEADER */}
              <div className="drawer-members-header">

                <div>
                  <h3>Team Members</h3>

                  <span>
                    {membersLoading
                      ? "Loading employees..."
                      : `${selectedTeam.membersList.length} employees`}
                  </span>
                </div>

              </div>

              {/* MEMBERS LIST */}
              {membersLoading ? (

                <div className="team-members-loader">
                  <div className="team-spinner" />
                  <p>Loading team members...</p>
                </div>

              ) : selectedTeam.membersList.length > 0 ? (

                <div className="members-list">

                  {selectedTeam.membersList.map((member) => (

                    <div
                      className="member-row"
                      key={member.employeeId}
                    >

                      <Avatar>
                        {member.name.charAt(0).toUpperCase()}
                      </Avatar>

                      <div className="member-details">
                        <strong>{member.name}</strong>
                        <span>{member.employeeId}</span>
                      </div>

                      <div className="member-role">
                        <span>{member.role}</span>
                      </div>

                      {/* DELETE MEMBER */}
                      <button
                        className="delete-member-btn"
                        onClick={() =>
                          handleDeleteMember(member.employeeId)
                        }
                        title="Delete Member"
                        disabled={
                          deletingMemberId === member.employeeId ||
                          deletingMemberId !== null
                        }
                      >
                        {deletingMemberId === member.employeeId ? (
                          "..."
                        ) : (
                          <MdDelete />
                        )}
                      </button>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="drawer-empty">

                  <div>
                    <FiUsers />
                  </div>

                  <h3>No members assigned</h3>

                  <p>
                    This team currently doesn't have any members.
                  </p>

                </div>

              )}

            </div>

          )}

        </Drawer>

      </div>

    </MainPanel>
  );
};

export default Teams;

