// src/pages/teacher/TeacherAttendance.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherAttendance() {
  const loggedInTeacher = JSON.parse(localStorage.getItem("loggedInTeacher"));
  const [unmarked, setUnmarked] = useState([]);
  const [todayMarked, setTodayMarked] = useState([]);

  useEffect(() => {
    if (!loggedInTeacher) {
      window.location.href = "/";
      return;
    }
    loadLists();

    // listen to new students added (so new student appears in unmarked)
    const onStudentsUpdated = () => loadLists();
    window.addEventListener("students-updated", onStudentsUpdated);
    return () => window.removeEventListener("students-updated", onStudentsUpdated);
  }, []);

  const loadLists = async () => {
    try {
      // top: unmarked for today
      const resUn = await axios.get(
        `http://localhost:8080/api/teacher/${loggedInTeacher.userId}/students`
      );
      setUnmarked(resUn.data || []);

      // bottom: today's attendance
      const resToday = await axios.get(
        `http://localhost:8080/api/teacher/${loggedInTeacher.userId}/attendance/today`
      );
      setTodayMarked(resToday.data || []);
    } catch (err) {
      console.error("Error loading lists", err);
    }
  };

  const markAttendance = async (stu, isPresent) => {
    try {
      const payload = {
        rollNo: stu.rollNo,
        studentName: stu.name,
        present: isPresent
      };

      await axios.post(
        `http://localhost:8080/api/teacher/${loggedInTeacher.userId}/attendance`,
        payload
      );

      // move student client-side from unmarked -> todayMarked
      setUnmarked(prev => prev.filter(s => s.rollNo !== stu.rollNo));
      setTodayMarked(prev => [
        ...prev,
        { rollNo: stu.rollNo, studentName: stu.name, present: isPresent, mailSent: true }
      ]);
    } catch (err) {
      console.error("Failed to mark attendance", err);
      alert("Failed to mark attendance");
      // reload lists to make sure UI syncs with backend
      loadLists();
    }
  };

  return (
    <div className="container mt-4">
      <h3>Teacher Dashboard — Attendance</h3>

      <h4 className="mt-3">Mark Attendance</h4>
      {unmarked.length === 0 ? (
        <p className="text-success">All students for today are already marked.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr><th>Roll No</th><th>Name</th><th>Action</th></tr>
          </thead>
          <tbody>
            {unmarked.map(stu => (
              <tr key={stu.id}>
                <td>{stu.rollNo}</td>
                <td>{stu.name}</td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={() => markAttendance(stu, true)}>Present</button>
                  <button className="btn btn-danger btn-sm" onClick={() => markAttendance(stu, false)}>Absent</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h4 className="mt-4">Today Attendance Log</h4>
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr><th>Student</th><th>Status</th><th>Mail</th></tr>
        </thead>
        <tbody>
          {todayMarked.length === 0 ? (
            <tr><td colSpan="3" className="text-center">No attendance marked yet</td></tr>
          ) : (
            todayMarked.map((a, i) => (
              <tr key={i}>
                <td>{a.rollNo} — {a.studentName}</td>
                <td>{a.present ? "✅ Present" : "❌ Absent"}</td>
                <td>{a.mailSent ? "📧 Sent" : "⚠ Not Sent"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
