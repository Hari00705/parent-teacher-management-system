// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("admin");
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!input || !password) {
      alert("⚠ Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email: input,
        password: password,
      });

      const data = res.data;

      if (data.message === "Login Successful") {
        // ---------- ADMIN ----------
        if (data.role === "ADMIN") {
          const adminUser = {
            role: "admin",
            email: data.email || input,
          };
          localStorage.setItem("loggedUser", JSON.stringify(adminUser));
          navigate("/admin");
        }

        // ---------- TEACHER ----------
        else if (data.role === "TEACHER") {
          const teacherUser = {
            role: "teacher",
            id: data.id,               // make sure backend sends id
            email: data.email || input,
            name: data.name,
            department: data.department,
          };
          localStorage.setItem("loggedUser", JSON.stringify(teacherUser));
          // optional: keep full response too
          localStorage.setItem("loggedInTeacher", JSON.stringify(data));
          navigate("/teacher");
        }

        // ---------- PARENT ----------
        else if (data.role === "PARENT") {
          const parentUser = {
            role: "parent",
            email: data.email || input,
            rollNo: data.rollNo,          // MUST come from backend
            teacherEmail: data.teacherEmail, // advisor's email
            childName: data.childName,    // optional, nice to show
          };

          if (!parentUser.rollNo || !parentUser.teacherEmail) {
            console.warn("Backend did not return rollNo/teacherEmail for parent.");
          }

          localStorage.setItem("loggedUser", JSON.stringify(parentUser));
          // optional: full raw response
          localStorage.setItem("loggedInParent", JSON.stringify(data));

          navigate("/parent");
        }

        else {
          alert("❌ Invalid role returned from server");
        }
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("❌ Invalid credentials or server error");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Login</h3>

        {/* Role Selection (only affects labels) */}
        <label className="form-label">Select Role</label>
        <select
          className="form-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="parent">Parent</option>
        </select>

        <label className="form-label mt-3">
          {role === "admin"
            ? "Email"
            : role === "teacher"
            ? "Email"
            : "Parent Email"}
        </label>
        <input
          type="email"
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your email"
        />

        <label className="form-label mt-3">Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />

        <button className="btn btn-primary w-100 mt-4" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
