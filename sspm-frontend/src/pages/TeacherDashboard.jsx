import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./teacher/TeacherStyles.css";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const teacher = JSON.parse(localStorage.getItem("loggedInTeacher"));

  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!teacher) {
      navigate("/");
      return;
    }

    const updateUnread = () => {
      const chats = JSON.parse(localStorage.getItem("sspm_chats_v2")) || [];
      const unseen = chats.filter(
        (m) => m.teacherId === teacher.id && m.sender === "parent" && !m.read
      ).length;
      setUnread(unseen);
    };

    updateUnread();
    const interval = setInterval(updateUnread, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInTeacher");
    navigate("/");
  };

  return (
    <div className="teacher-wrapper">

      <header className="teacher-header shadow">
        <div>
          <h2 className="title">Teacher Dashboard</h2>
          <span className="subtitle">Department: <b>{teacher.department}</b></span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <nav className="teacher-navbar">
        <NavLink to="attendance" className="nav-link">Attendance</NavLink>
        <NavLink to="students" className="nav-link">Students</NavLink>
        <NavLink to="subjects" className="nav-link">Subjects</NavLink>
        <NavLink to="marks" className="nav-link">Marks Entry</NavLink>

        {/* ✅ Added unread badge without UI change */}
        <NavLink to="chat" className="nav-link">
          Parent Chat {unread > 0 && <span className="badge bg-danger ms-2">{unread}</span>}
        </NavLink>
      </nav>

      <section className="teacher-content">
        <Outlet />
      </section>
    </div>
  );
};

export default TeacherDashboard;
