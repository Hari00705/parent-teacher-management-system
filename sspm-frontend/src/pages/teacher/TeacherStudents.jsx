// src/pages/teacher/TeacherStudents.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherStudents() {
  const loggedInTeacher = JSON.parse(localStorage.getItem("loggedInTeacher"));
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    rollNo: "",
    semester: "",
    parentEmail: "",
  });

  useEffect(() => {
    if (!loggedInTeacher) {
      window.location.href = "/";
      return;
    }
    loadAllStudents();
  }, []);

  const loadAllStudents = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/teacher/${loggedInTeacher.userId}/students/all`
      );
      setStudents(res.data);
    } catch (err) {
      console.error("Error loading students", err);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addStudent = async () => {
    if (!form.name || !form.rollNo || !form.semester) {
      alert("Fill required fields");
      return;
    }

    try {
      const payload = {
        name: form.name,
        rollNo: form.rollNo,
        semester: form.semester,
        parent: { email: form.parentEmail || null },
      };

      await axios.post(
        `http://localhost:8080/api/teacher/${loggedInTeacher.userId}/student`,
        payload
      );

      setForm({ name: "", rollNo: "", semester: "", parentEmail: "" });
      loadAllStudents();
      window.dispatchEvent(new Event("students-updated"));
    } catch (err) {
      console.error("Failed to add student", err);
      alert("Failed to add student");
    }
  };

  // ============================
  // DELETE STUDENT (with cascade)
  // ============================
  const deleteStudent = async (studentId) => {
    if (!window.confirm("Are you sure? This will delete the student AND parent!"))
      return;

    try {
      await axios.delete(
        `http://localhost:8080/api/teacher/${loggedInTeacher.userId}/student/${studentId}`
      );

      alert("Student & Parent Deleted Successfully!");
      loadAllStudents();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete student");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Add Student (Class Advisor)</h3>

      <div className="card p-3 mb-4">
        <div className="row g-2">
          <div className="col-md-3">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Student Name"
            />
          </div>

          <div className="col-md-2">
            <input
              name="rollNo"
              value={form.rollNo}
              onChange={handleChange}
              className="form-control"
              placeholder="Roll No"
            />
          </div>

          <div className="col-md-2">
            <input
              name="semester"
              value={form.semester}
              onChange={handleChange}
              className="form-control"
              placeholder="Semester"
            />
          </div>

          <div className="col-md-3">
            <input
              name="parentEmail"
              value={form.parentEmail}
              onChange={handleChange}
              className="form-control"
              placeholder="Parent Email"
            />
          </div>

          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={addStudent}>
              Add Student
            </button>
          </div>
        </div>
      </div>

      <h4>Assigned Students</h4>
      {students.length === 0 ? (
        <p className="text-danger">No students found</p>
      ) : (
        <table className="table table-bordered shadow">
          <thead className="table-dark">
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Semester</th>
              <th>Department</th>
              <th>Parent Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((stu) => (
              <tr key={stu.id}>
                <td>{stu.rollNo}</td>
                <td>{stu.name}</td>
                <td>{stu.semester}</td>
                <td>{stu.department}</td>
                <td>{stu.parentEmail || "—"}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteStudent(stu.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
