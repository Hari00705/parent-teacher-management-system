import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function ParentDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("loggedUser");
    navigate("/");
  };

  return (
    <div className="container-fluid p-0">
      {/* Top Navbar */}
      <nav className="navbar navbar-dark bg-dark px-3">
        <h4 className="text-white m-0">Parent Panel</h4>
        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      </nav>

      <div className="row g-0">
        {/* Sidebar */}
        <div className="col-2 bg-dark vh-100 p-3">
          <div className="nav flex-column">
            <Link to="attendance" className="btn btn-outline-light mb-3">
              Attendance
            </Link>

            <Link to="marks" className="btn btn-outline-light mb-3">
              Marks
            </Link>

            <Link to="chat" className="btn btn-outline-light mb-3">
              Chat
            </Link>

            <Link to="mail" className="btn btn-outline-light mb-3">
              Send Mail
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-10 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
