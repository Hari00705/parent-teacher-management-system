// src/App.js
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const SAMPLE_DEPARTMENTS = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Mathematics",
  "AIDS",
  "AIML",
  "Data Science",
  "CyberSecurity",
  "Information Technology"
];

const API_BASE = "http://localhost:8080/api/admin"; 

export default function App() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("teachers");
  const [teacherSearch, setTeacherSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  const [tForm, setTForm] = useState({
    id: "",
    name: "",
    email: "",
    department: "",
    password: "", 
  });

  const [sForm, setSForm] = useState({
    id: "",
    name: "",
    rollNo: "",
    semester: "1",
    department: "",
    advisorId: "",
    parentEmail: "",
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    navigate("/"); 
  };

 
  const loadTeachers = () => {
    fetch(`${API_BASE}/teachers`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load teachers");
        return res.json();
      })
      .then((data) => {
        setTeachers(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        alert("Error loading teachers from server");
      });
  };

  const loadStudents = () => {
    fetch(`${API_BASE}/students`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load students");
        return res.json();
      })
      .then((data) => {
        setStudents(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        alert("Error loading students from server");
      });
  };

  useEffect(() => {
    loadTeachers();
    loadStudents();
  }, []);

  function validateTeacher(payload) {
    if (!payload.name.trim()) return "Teacher name required";
    if (!payload.email.trim()) return "Email required";
    if (!payload.department) return "Department required";
    if (!payload.password?.trim()) return "Password required";

    const existing = teachers.find(
      (t) =>
        t.email.toLowerCase() === payload.email.toLowerCase() &&
        String(t.id) !== String(payload.id || "")
    );
    if (existing) return "Teacher with same email already exists.";

    return null;
  }

  function validateStudent(payload) {
    if (!payload.name.trim()) return "Student name required";
    if (!payload.rollNo.trim()) return "Roll No required";
    if (!payload.department) return "Department required";
    if (!payload.advisorId) return "Advisor required";

    const existing = students.find(
      (s) =>
        s.rollNo.toLowerCase() === payload.rollNo.toLowerCase() &&
        String(s.id) !== String(payload.id || "")
    );
    if (existing) return "Student with same roll number already exists.";

    return null;
  }

  function addOrUpdateTeacher(e) {
    e.preventDefault();
    const err = validateTeacher(tForm);
    if (err) {
      alert(err);
      return;
    }

    const payload = {
      id: tForm.id || null,
      name: tForm.name,
      email: tForm.email,
      department: tForm.department,
      password: tForm.password,
    };

    fetch(`${API_BASE}/teacher`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save teacher");
      })
      .then(() => {
        loadTeachers(); // refresh list from backend
        setTForm({ id: "", name: "", email: "", department: "", password: "" });
      })
      .catch((err) => {
        console.error(err);
        alert("Error saving teacher");
      });
  }

  function editTeacher(id) {
    const t = teachers.find((x) => String(x.id) === String(id));
    if (!t) return;
    setTForm({
      id: t.id,
      name: t.name || "",
      email: t.email || "",
      department: t.department || "",
      password: "", // we don't know password from backend; admin must re-enter
    });
    setActiveTab("teachers");
  }

  function deleteTeacher(id) {
    const assigned = students.filter(
      (s) => String(s.advisorId) === String(id)
    );
    if (assigned.length > 0) {
      alert("Cannot delete teacher — students are assigned to this teacher.");
      return;
    }

    if (!window.confirm("Delete Teacher?")) return;

    fetch(`${API_BASE}/teacher/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete teacher");
      })
      .then(() => {
        loadTeachers();
      })
      .catch((err) => {
        console.error(err);
        alert("Error deleting teacher");
      });
  }

  // ----------------- CRUD : STUDENT (BACKEND) -----------------
  function addOrUpdateStudent(e) {
    e.preventDefault();
    const err = validateStudent(sForm);
    if (err) {
      alert(err);
      return;
    }

    // ✅ send advisor as nested object (matches Student.advisor in backend)
    const payload = {
      id: sForm.id || null,
      name: sForm.name,
      rollNo: sForm.rollNo,
      semester: String(sForm.semester),      // Student.semester is String
      department: sForm.department,
      advisor: sForm.advisorId
        ? { id: Number(sForm.advisorId) }
        : null,
      parent: {
        email: sForm.parentEmail,
      },
    };

    fetch(`${API_BASE}/student`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save student");
      })
      .then(() => {
        loadStudents(); // refresh list from backend
        setSForm({
          id: "",
          name: "",
          rollNo: "",
          semester: "1",
          department: "",
          advisorId: "",
          parentEmail: "",
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Error saving student");
      });
  }

  function editStudent(id) {
    const s = students.find((x) => String(x.id) === String(id));
    if (!s) return;

    setSForm({
      id: s.id,
      name: s.name || "",
      rollNo: s.rollNo || "",
      semester: String(s.semester || "1"),
      department: s.department || "",
      advisorId: s.advisorId || "",
      parentEmail: s.parentEmail || "",
    });
    setActiveTab("students");
  }

  function deleteStudent(id) {
    if (!window.confirm("Delete student?")) return;

    fetch(`${API_BASE}/student/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete student");
      })
      .then(() => {
        loadStudents();
      })
      .catch((err) => {
        console.error(err);
        alert("Error deleting student");
      });
  }

  // ----------------- FILTER -----------------
  const displayedTeachers = teachers.filter((t) =>
    `${t.name} ${t.email} ${t.department}`
      .toLowerCase()
      .includes(teacherSearch.toLowerCase())
  );

  const displayedStudents = students.filter((s) =>
    `${s.name} ${s.rollNo} ${s.department}`
      .toLowerCase()
      .includes(studentSearch.toLowerCase())
  );

  const getAdvisorName = (id) => {
    if (!id && id !== 0) return "(not assigned)";
    const advisor = teachers.find(
      (t) => String(t.id) === String(id)
    );
    return advisor?.name || "(not assigned)";
  };

  // ----------------- UI (UNCHANGED) -----------------
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Admin Panel — SSPM System</h3>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="btn-group mb-4">
        <button
          className={`btn ${
            activeTab === "teachers" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setActiveTab("teachers")}
        >
          Teachers
        </button>
        <button
          className={`btn ${
            activeTab === "students" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setActiveTab("students")}
        >
          Students
        </button>
      </div>

      <div className="row g-4">
        {/* LEFT SIDE FORM */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              {activeTab === "teachers" ? (
                <>
                  <h5>Add / Edit Teacher</h5>
                  <form onSubmit={addOrUpdateTeacher}>
                    <input
                      className="form-control mb-2"
                      placeholder="Teacher Name"
                      value={tForm.name}
                      onChange={(e) =>
                        setTForm({ ...tForm, name: e.target.value })
                      }
                    />
                    <input
                      className="form-control mb-2"
                      placeholder="Email"
                      value={tForm.email}
                      onChange={(e) =>
                        setTForm({ ...tForm, email: e.target.value })
                      }
                    />

                    <input
                      type="password"
                      className="form-control mb-2"
                      placeholder="Teacher login password"
                      value={tForm.password}
                      onChange={(e) =>
                        setTForm({ ...tForm, password: e.target.value })
                      }
                    />

                    <select
                      className="form-select mb-3"
                      value={tForm.department}
                      onChange={(e) =>
                        setTForm({ ...tForm, department: e.target.value })
                      }
                    >
                      <option value="">Select Department</option>
                      {SAMPLE_DEPARTMENTS.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>

                    <button className="btn btn-success w-100 mb-2">
                      {tForm.id ? "Update Teacher" : "Add Teacher"}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h5>Add / Edit Student</h5>
                  <form onSubmit={addOrUpdateStudent}>
                    <input
                      className="form-control mb-2"
                      placeholder="Student Name"
                      value={sForm.name}
                      onChange={(e) =>
                        setSForm({ ...sForm, name: e.target.value })
                      }
                    />

                    <input
                      className="form-control mb-2"
                      placeholder="Roll No"
                      value={sForm.rollNo}
                      onChange={(e) =>
                        setSForm({ ...sForm, rollNo: e.target.value })
                      }
                    />

                    <select
                      className="form-select mb-2"
                      value={sForm.semester}
                      onChange={(e) =>
                        setSForm({ ...sForm, semester: e.target.value })
                      }
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>
                          Semester {n}
                        </option>
                      ))}
                    </select>

                    <select
                      className="form-select mb-2"
                      value={sForm.department}
                      onChange={(e) =>
                        setSForm({ ...sForm, department: e.target.value })
                      }
                    >
                      <option value="">Select Department</option>
                      {SAMPLE_DEPARTMENTS.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>

                    <select
                      className="form-select mb-2"
                      value={sForm.advisorId}
                      onChange={(e) =>
                        setSForm({
                          ...sForm,
                          advisorId: e.target.value
                            ? Number(e.target.value)
                            : "",
                        })
                      }
                    >
                      <option value="">Select Advisor</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.department})
                        </option>
                      ))}
                    </select>

                    <input
                      className="form-control mb-2"
                      placeholder="Parent Email"
                      value={sForm.parentEmail}
                      onChange={(e) =>
                        setSForm({ ...sForm, parentEmail: e.target.value })
                      }
                    />

                    <button className="btn btn-success w-100">
                      {sForm.id ? "Update Student" : "Add Student"}
                    </button>
                  </form>
                  <p className="text-muted small mt-2">
                    Default parent password = <b>esec@123</b>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE TABLE */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              {activeTab === "teachers" ? (
                <>
                  <h5>Teachers List</h5>

                  <input
                    className="form-control mb-2"
                    placeholder="Search Teacher"
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                  />

                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Dept</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedTeachers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center">
                            No teachers found
                          </td>
                        </tr>
                      ) : (
                        displayedTeachers.map((t, idx) => (
                          <tr key={t.id}>
                            <td>{idx + 1}</td>
                            <td>{t.name}</td>
                            <td>{t.email}</td>
                            <td>{t.department}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-warning me-2"
                                onClick={() => editTeacher(t.id)}
                              >
                                Edit
                              </button>

                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => deleteTeacher(t.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </>
              ) : (
                <>
                  <h5>Students List</h5>

                  <input
                    className="form-control mb-2"
                    placeholder="Search Student"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                  />

                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>S.No</th>
                        <th>Roll No</th>
                        <th>Name</th>
                        <th>Dept</th>
                        <th>Sem</th>
                        <th>Advisor</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedStudents.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center">
                            No students found
                          </td>
                        </tr>
                      ) : (
                        displayedStudents.map((s, idx) => (
                          <tr key={s.id}>
                            <td>{idx + 1}</td>
                            <td>{s.rollNo}</td>
                            <td>{s.name}</td>
                            <td>{s.department}</td>
                            <td>{s.semester}</td>
                            <td>{getAdvisorName(s.advisorId)}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-warning me-2"
                                onClick={() => editStudent(s.id)}
                              >
                                Edit
                              </button>

                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => deleteStudent(s.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
