// src/pages/teacher/TeacherSubjects.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherSubjects() {
  const [loggedInTeacher, setLoggedInTeacher] = useState(null);
  const [subjectsList, setSubjectsList] = useState([]);

  const [subject, setSubject] = useState({
    semester: "",
    subjectCode: "",
    subjectName: "",
    teacherName: "",   // <<< ADDED
  });

  const [search, setSearch] = useState("");

  // --------------------------------------------------
  // Load teacher info + subjects
  // --------------------------------------------------
  useEffect(() => {
    const teacher = JSON.parse(localStorage.getItem("loggedInTeacher"));
    setLoggedInTeacher(teacher);

    if (!teacher) {
      window.location.href = "/";
      return;
    }

    loadSubjects(teacher.userId);
  }, []);

  // --------------------------------------------------
  // Load subjects from backend
  // --------------------------------------------------
  const loadSubjects = async (teacherId) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/teacher/${teacherId}/subjects`
      );
      setSubjectsList(res.data);
    } catch (error) {
      console.error("❌ Error loading subjects", error);
    }
  };

  // --------------------------------------------------
  // Add subject to backend
  // --------------------------------------------------
  const saveSubject = async () => {
    if (
      !subject.semester ||
      !subject.subjectCode ||
      !subject.subjectName ||
      !subject.teacherName
    ) {
      alert("⚠ All fields are required!");
      return;
    }

    try {
      const data = {
        subjectCode: subject.subjectCode,
        subjectName: subject.subjectName,
        semester: subject.semester,
        teacherName: subject.teacherName,
      };

      await axios.post(
        `http://localhost:8080/api/teacher/${loggedInTeacher.userId}/subject`,
        data
      );

      alert("✅ Subject added successfully!");

      // Clear form
      setSubject({
        semester: "",
        subjectCode: "",
        subjectName: "",
        teacherName: "",
      });

      loadSubjects(loggedInTeacher.userId);
    } catch (error) {
      console.error("❌ Error adding subject:", error);
      alert("Failed to add subject");
    }
  };

  // --------------------------------------------------
  // Search filter
  // --------------------------------------------------
  const filteredSubjects = subjectsList.filter(
    (sub) =>
      sub.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
      sub.subjectName.toLowerCase().includes(search.toLowerCase()) ||
      sub.teacherName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h3>Teacher Dashboard — Subject Management</h3>

      <div className="card p-4 shadow mb-4">
        <h4>Add Subject</h4>

        <div className="row">
          <div className="col-md-3">
            <label className="form-label">Semester</label>
            <select
              className="form-select"
              value={subject.semester}
              onChange={(e) =>
                setSubject({ ...subject, semester: e.target.value })
              }
            >
              <option value="">Select</option>
              {Array.from({ length: 8 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Subject Code</label>
            <input
              type="text"
              className="form-control"
              placeholder="EX: CS8351"
              value={subject.subjectCode}
              onChange={(e) =>
                setSubject({ ...subject, subjectCode: e.target.value })
              }
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Subject Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="EX: Data Structures"
              value={subject.subjectName}
              onChange={(e) =>
                setSubject({ ...subject, subjectName: e.target.value })
              }
            />
          </div>

          {/* NEW FIELD */}
          <div className="col-md-3">
            <label className="form-label">Teacher Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="EX: John David"
              value={subject.teacherName}
              onChange={(e) =>
                setSubject({ ...subject, teacherName: e.target.value })
              }
            />
          </div>
        </div>

        <button className="btn btn-primary mt-3" onClick={saveSubject}>
          ➕ Add Subject
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="🔍 Search subject..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Subjects Table */}
      <table className="table table-bordered table-striped shadow">
        <thead className="table-dark">
          <tr>
            <th>Semester</th>
            <th>Code</th>
            <th>Subject Name</th>
            <th>Teacher Name</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubjects.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-danger">
                No subjects added yet
              </td>
            </tr>
          ) : (
            filteredSubjects.map((sub) => (
              <tr key={sub.id}>
                <td>{sub.semester}</td>
                <td>{sub.subjectCode}</td>
                <td>{sub.subjectName}</td>
                <td>{sub.teacherName}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
