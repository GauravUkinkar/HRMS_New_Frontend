
import React, { useContext, useMemo, useState } from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import { UserContext } from "../../../Context";

import {
  Avatar,
  Button,
  Drawer,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";

import {
  FiUsers,
  FiUser,
  FiUserPlus,
  FiSearch,
  FiPlus,
  FiMoreVertical,
  FiArrowRight,
  FiX,
  FiMail,
  FiBriefcase,
} from "react-icons/fi";

import "./Teams.scss";


const teamsData = [
  {
    id: 1,
    name: "Website Team",
    leader: "shelkesunil072@gmail.com",
    members: 7,
    color: "blue",
    membersList: [
      {
        name: "Sunil Shelke",
        employeeId: "PSPL1001",
        role: "Team Leader",
        email: "shelkesunil072@gmail.com",
      },
      {
        name: "Amit Patil",
        employeeId: "PSPL1002",
        role: "Developer",
        email: "amit@diwise.in",
      },
      {
        name: "Rahul More",
        employeeId: "PSPL1003",
        role: "Developer",
        email: "rahul@diwise.in",
      },
      {
        name: "Sneha Joshi",
        employeeId: "PSPL1004",
        role: "Designer",
        email: "sneha@diwise.in",
      },
      {
        name: "Akshay Shah",
        employeeId: "PSPL1005",
        role: "Developer",
        email: "akshay@diwise.in",
      },
      {
        name: "Pooja Patil",
        employeeId: "PSPL1006",
        role: "Tester",
        email: "pooja@diwise.in",
      },
      {
        name: "Rohit More",
        employeeId: "PSPL1007",
        role: "Developer",
        email: "rohit@diwise.in",
      },
    ],
  },
  {
    id: 2,
    name: "Political Team",
    leader: "kartik@diwise",
    members: 0,
    color: "pink",
    membersList: [],
  },
  {
    id: 3,
    name: "Non Political",
    leader: "Deeksha@diwise",
    members: 0,
    color: "green",
    membersList: [],
  },
  {
    id: 4,
    name: "Office Operations",
    leader: "Gaurav@diwise",
    members: 3,
    color: "purple",
    membersList: [
      {
        name: "Gaurav Sharma",
        employeeId: "PSPL1010",
        role: "Team Leader",
        email: "gaurav@diwise.in",
      },
      {
        name: "Neha Patil",
        employeeId: "PSPL1011",
        role: "HR Executive",
        email: "neha@diwise.in",
      },
      {
        name: "Kunal More",
        employeeId: "PSPL1012",
        role: "Operations",
        email: "kunal@diwise.in",
      },
    ],
  },
  {
    id: 5,
    name: "Sales Team Dubai",
    leader: "chitralekha@diwise",
    members: 1,
    color: "orange",
    membersList: [
      {
        name: "Chitralekha",
        employeeId: "PSPL1020",
        role: "Team Leader",
        email: "chitralekha@diwise.in",
      },
    ],
  },
];

const colorClasses = {
  blue: {
    icon: "team-blue",
  },
  pink: {
    icon: "team-pink",
  },
  green: {
    icon: "team-green",
  },
  purple: {
    icon: "team-purple",
  },
  orange: {
    icon: "team-orange",
  },
};

const Teams = () => {
  const { user } = useContext(UserContext);

  const [teams, setTeams] = useState(teamsData);
  const [search, setSearch] = useState("");
  const [memberFilter, setMemberFilter] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const totalTeams = teams.length;

  const totalMembers = teams.reduce(
    (total, team) => total + team.members,
    0
  );

  const teamLeaders = teams.length;

  const activeTeams = teams.filter((team) => team.members > 0).length;

  const openTeam = (team) => {
    setSelectedTeam(team);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);

    setTimeout(() => {
      setSelectedTeam(null);
    }, 250);
  };

  const addMember = () => {
    console.log(`Add member to ${selectedTeam?.name}`);
  };

  return (
    <MainPanel
      breadcrumbs={[
        { label: "Dashboard", link: "/dashboard" },
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
      <div className="team-management-page">

        {/* HEADER */}
        <div className="team-page-header">
          <div>
            <div className="page-title-row">
              <div className="page-title-icon">
                <FiUsers />
              </div>

              <div>
                <h1>Team Management</h1>
                <p>Manage teams, team leaders and members</p>
              </div>
            </div>
          </div>

          <Button
            className="create-team-btn"
            startIcon={<FiPlus />}
            onClick={() => console.log("Create Team")}
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
              <h2>{totalTeams}</h2>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon green">
              <FiUser />
            </div>

            <div>
              <span>Total Members</span>
              <h2>{totalMembers}</h2>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon purple">
              <FiUserPlus />
            </div>

            <div>
              <span>Team Leaders</span>
              <h2>{teamLeaders}</h2>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon orange">
              <FiBriefcase />
            </div>

            <div>
              <span>Active Teams</span>
              <h2>{activeTeams}</h2>
            </div>
          </div>

        </div>

        {/* SEARCH / FILTER */}
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

          <Select
            value={memberFilter}
            onChange={(e) => setMemberFilter(e.target.value)}
            className="team-filter"
            displayEmpty
          >
            <MenuItem value="all">All Teams</MenuItem>
            <MenuItem value="hasMembers">
              Teams With Members
            </MenuItem>
            <MenuItem value="empty">
              No Members
            </MenuItem>
          </Select>

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

          {filteredTeams.map((team) => (

            <div className="team-card" key={team.id}>

              <div className={`team-card-top ${team.color}`} />

              <div className="team-card-content">

                {/* CARD HEADER */}
                <div className="team-card-header">

                  <div className="team-name-wrapper">

                    <div
                      className={`team-icon ${
                        colorClasses[team.color].icon
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

                  <IconButton className="more-btn">
                    <FiMoreVertical />
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

                {/* MEMBERS */}
                {team.members > 0 ? (

                  <div className="team-member-preview">

                    <div className="avatar-stack">

                      {team.membersList
                        .slice(0, 4)
                        .map((member, index) => (

                          <Avatar
                            key={member.employeeId}
                            className={`avatar-${index}`}
                          >
                            {member.name.charAt(0)}
                          </Avatar>

                        ))}

                      {team.members > 4 && (
                        <div className="more-members">
                          +{team.members - 4}
                        </div>
                      )}

                    </div>

                    <span className="member-count">
                      {team.members}{" "}
                      {team.members === 1
                        ? "Member"
                        : "Members"}
                    </span>

                  </div>

                ) : (

                  <div className="empty-members">

                    <div className="empty-members-icon">
                      <FiUserPlus />
                    </div>

                    <div>
                      <strong>No members assigned</strong>
                      <span>Add employees to this team</span>
                    </div>

                  </div>

                )}

                {/* FOOTER */}
                <div className="team-card-footer">

                  {team.members === 0 ? (

                    <button
                      className="add-member-link"
                      onClick={() => openTeam(team)}
                    >
                      <FiPlus />
                      Add Member
                    </button>

                  ) : (

                    <span className="member-label">
                      {team.members} Members
                    </span>

                  )}

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

          ))}

        </div>

        {/* EMPTY SEARCH STATE */}
        {filteredTeams.length === 0 && (

          <div className="no-teams">

            <FiSearch />

            <h3>No teams found</h3>

            <p>
              Try changing your search or filter to find a team.
            </p>

          </div>

        )}

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
                      colorClasses[selectedTeam.color].icon
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
                    {selectedTeam.leader
                      .charAt(0)
                      .toUpperCase()}
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
                    {selectedTeam.members}{" "}
                    {selectedTeam.members === 1
                      ? "employee"
                      : "employees"}
                  </span>
                </div>

                <Button
                  className="drawer-add-btn"
                  startIcon={<FiPlus />}
                  onClick={addMember}
                >
                  Add Member
                </Button>

              </div>

              {/* MEMBERS */}
              {selectedTeam.membersList.length > 0 ? (

                <div className="members-list">

                  {selectedTeam.membersList.map((member) => (

                    <div
                      className="member-row"
                      key={member.employeeId}
                    >

                      <Avatar>
                        {member.name.charAt(0)}
                      </Avatar>

                      <div className="member-details">

                        <strong>{member.name}</strong>

                        <span>{member.employeeId}</span>

                      </div>

                      <div className="member-role">
                        <span>{member.role}</span>
                      </div>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="drawer-empty">

                  <div>
                    <FiUserPlus />
                  </div>

                  <h3>No members assigned</h3>

                  <p>
                    This team currently doesn't have any members.
                  </p>

                  <Button
                    className="drawer-empty-btn"
                    startIcon={<FiPlus />}
                    onClick={addMember}
                  >
                    Add First Member
                  </Button>

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
