import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PageNotFound.scss";

import MainPanel from "../../comp/MainPanel/MainPanel";

import {
  FaArrowLeft,
  FaHouse,
  FaMagnifyingGlass,
} from "react-icons/fa6";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <MainPanel
      title="Page Not Found"
      breadcrumbs={[
        {
          label: "Dashboard",
          link: "/",
        },
        {
          label: "404",
        },
      ]}
    >
      <div className="page-not-found">

        <div className="not-found-card">

          {/* ================= LEFT SECTION ================= */}

          <div className="not-found-left">

            <div className="error-shape">

              <span className="four">4</span>

              <div className="zero">
                <div className="zero-inner">
                  0
                </div>
              </div>

              <span className="four">4</span>

            </div>

            <div className="small-dots dot-one"></div>
            <div className="small-dots dot-two"></div>
            <div className="small-dots dot-three"></div>

          </div>

          {/* ================= RIGHT SECTION ================= */}

          <div className="not-found-content">

            <span className="error-label">
              OOPS!
            </span>

            <h1>
              Page Not Found
            </h1>

            <p>
              Sorry, the page you are looking for
              doesn't exist or has been moved.
            </p>

            <p className="sub-text">
              Please check the URL or return to your
              dashboard to continue using the HRMS.
            </p>

            {/* ================= BUTTONS ================= */}

            <div className="not-found-buttons">

              <Link
                to="/"
                className="dashboard-button"
              >
                <FaHouse />
                Back to Dashboard
              </Link>

              <button
                type="button"
                className="back-button"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft />
                Go Back
              </button>

            </div>

            {/* ================= SEARCH HELP ================= */}

            <div className="help-box">

              <div className="help-icon">
                <FaMagnifyingGlass />
              </div>

              <div className="help-content">

                <h3>
                  Looking for something?
                </h3>

                <p>
                  Use the sidebar navigation to find
                  the page you need.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </MainPanel>
  );
};

export default PageNotFound;