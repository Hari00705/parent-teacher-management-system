import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Admin from "./pages/Admin";

// Teacher pages
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherAttendance from "./pages/teacher/TeacherAttendance";
import TeacherSubjects from "./pages/teacher/TeacherSubjects";
import TeacherMarks from "./pages/teacher/TeacherMarks";
import TeacherChat from "./pages/teacher/TeacherChat";
import TeacherStudents from "./pages/teacher/TeacherStudents";

// Parent pages
import ParentDashboard from "./pages/parent/ParentDashboard";
import ParentAttendance from "./pages/parent/ParentAttendance";
import ParentMarks from "./pages/parent/ParentMarks";
import ParentChat from "./pages/parent/ParentChat";
import ParentMail from "./pages/parent/ParentMail";

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<Admin />} />

      {/* ✅ TEACHER ROUTES */}
      <Route path="/teacher" element={<TeacherDashboard />}>
        <Route index element={<TeacherAttendance />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="subjects" element={<TeacherSubjects />} />
        <Route path="marks" element={<TeacherMarks />} />
        <Route path="chat" element={<TeacherChat />} />
        <Route path="students" element={<TeacherStudents />} />
      </Route>

      {/* ✅ PARENT ROUTES */}
      <Route path="/parent" element={<ParentDashboard />}>
        <Route index element={<ParentAttendance />} />
        <Route path="attendance" element={<ParentAttendance />} />
        <Route path="marks" element={<ParentMarks />} />
        <Route path="chat" element={<ParentChat />} />
        <Route path="mail" element={<ParentMail />} />
      </Route>

    </Routes>
  );
}
