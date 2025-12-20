// src/pages/teacher/TeacherMarks.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherMarks() {
  const loggedInTeacher = JSON.parse(localStorage.getItem("loggedInTeacher"));

  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [subjectsList, setSubjectsList] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [marks, setMarks] = useState({});

  const [notifyType, setNotifyType] = useState("");

  // ---------------------------------------------------
  // LOAD SUBJECTS + STUDENTS FROM BACKEND
  // ---------------------------------------------------
  useEffect(() => {
    if (!loggedInTeacher) {
      window.location.href = "/";
      return;
    }

    loadSubjects();
    loadStudents();
  }, []);

  // Load subjects
  const loadSubjects = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/teacher/${loggedInTeacher.userId}/subjects`
      );
      setSubjectsList(res.data);
    } catch (err) {
      console.error("Error loading subjects", err);
    }
  };

  // Load students
  const loadStudents = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/teacher/${loggedInTeacher.userId}/students/all`
      );
      setStudentsList(res.data);
    } catch (err) {
      console.error("Error loading students", err);
    }
  };

  // Filter subjects by semester
  const filteredSubjects = subjectsList.filter(s => s.semester == semester);

  // ---------------------------------------------------
  // HANDLE MARK INPUT
  // ---------------------------------------------------
  const handleMarkChange = (rollNo, field, value) => {
    setMarks(prev => ({
      ...prev,
      [rollNo]: { ...prev[rollNo], [field]: value },
    }));
  };

  // ---------------------------------------------------
  // SAVE MARKS TO BACKEND ONLY (NO EMAIL)
  // ---------------------------------------------------
  const saveMarks = async () => {
    if (!semester || !subject) {
      alert("⚠ Choose semester & subject first!");
      return;
    }

    for (const roll in marks) {
      const m = marks[roll];

      const subCode = subject.split(" — ")[0];
      const subName = subject.split(" — ")[1];

      const payload = {
        rollNo: roll,
        studentName: studentsList.find(s => s.rollNo === roll)?.name,
        subjectCode: subCode,
        subjectName: subName,
        semester: semester,
        internal1: m.internal1 || null,
        internal2: m.internal2 || null,
        semesterGrade: m.semester || null
      };

      try {
        await axios.put(
          `http://localhost:8080/api/teacher/${loggedInTeacher.userId}/marks`,
          payload
        );
      } catch (err) {
        console.error("Error saving marks", err);
      }
    }

    alert("✅ Marks saved successfully!");
  };

  // ---------------------------------------------------
  // NOTIFY PARENTS (BACKEND SENDS EMAIL)
  // ---------------------------------------------------
  const notifyParents = async () => {
    if (!notifyType) {
      alert("⚠ Select which exam to notify!");
      return;
    }
    if (!semester) {
      alert("⚠ Select semester!");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/teacher/${loggedInTeacher.userId}/notify-marks`,
        null,
        { params: { examType: notifyType, semester: semester } }
      );

      alert("📨 Parents notified successfully!");
    } catch (err) {
      console.error("Error sending notifications", err);
      alert("❌ Failed to send notifications");
    }
  };

  return (
    <div className="container mt-4">

      <h3 className="mb-4 text-primary fw-bold">📘 Teacher — Marks Entry</h3>

      {/* SELECT EXAM TYPE */}
      <div className="alert alert-info">
        <label className="fw-bold me-2">Select Exam to Notify:</label>
        <select
          className="form-select w-25 d-inline"
          onChange={(e) => setNotifyType(e.target.value)}
          value={notifyType}
        >
          <option value="">-- Select --</option>
          <option value="Internal 1">Internal 1</option>
          <option value="Internal 2">Internal 2</option>
          <option value="Semester">Semester</option>
        </select>
      </div>

      {/* Semester + Subject Dropdown */}
      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label fw-bold">Semester</label>
          <select
            className="form-select"
            value={semester}
            onChange={(e) => {
              setSemester(e.target.value);
              setSubject("");
            }}
          >
            <option value="">Select</option>
            {[1,2,3,4,5,6,7,8].map(n => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Subject</label>
          <select
            className="form-select"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={!semester}
          >
            <option value="">Select Subject</option>

            {filteredSubjects.map(sub => (
              <option key={sub.id}>
                {sub.subjectCode} — {sub.subjectName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {semester && subject && (
        <>
          <div className="card shadow p-3">
            <table className="table table-bordered text-center align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Internal 1</th>
                  <th>Internal 2</th>
                  <th>Semester Grade</th>
                </tr>
              </thead>

              <tbody>
                {studentsList.map(std => (
                  <tr key={std.rollNo}>
                    <td className="fw-bold">{std.rollNo}</td>
                    <td>{std.name}</td>

                    <td>
                      <input
                        type="number"
                        className="form-control text-center"
                        onChange={e =>
                          handleMarkChange(std.rollNo, "internal1", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="form-control text-center"
                        onChange={e =>
                          handleMarkChange(std.rollNo, "internal2", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        className="form-control text-center"
                        placeholder="A / B+ / C"
                        onChange={e =>
                          handleMarkChange(std.rollNo, "semester", e.target.value)
                        }
                      />
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Buttons */}
          <div className="mt-4 d-flex gap-3">
            <button className="btn btn-success px-4" onClick={saveMarks}>
              ✅ Save Marks
            </button>

            <button className="btn btn-warning px-4" onClick={notifyParents}>
              📢 Notify Parents
            </button>
          </div>
        </>
      )}
    </div>
  );
}
