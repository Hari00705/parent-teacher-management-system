import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ParentMarks() {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "null");
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loggedUser || !loggedUser.rollNo) {
      console.error("Parent not logged in or rollNo missing!");
      setLoading(false);
      return;
    }
    loadMarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMarks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/parent/marks/${loggedUser.rollNo}`
      );
      setMarks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading marks", err);
    } finally {
      setLoading(false);
    }
  };

  if (!loggedUser || !loggedUser.rollNo) {
    return (
      <p className="text-danger">
        Cannot load marks — login info is missing (roll number not set).
      </p>
    );
  }

  return (
    <div>
      <h4>📊 Marks & Results</h4>
      <p className="text-muted">Roll No: {loggedUser.rollNo}</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>Subject</th>
              <th>Internal 1</th>
              <th>Internal 2</th>
              <th>Semester Grade</th>
            </tr>
          </thead>

          <tbody>
            {marks.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-danger">
                  No marks available
                </td>
              </tr>
            ) : (
              marks.map((m) => (
                <tr key={m.id}>
                  <td>{m.subjectName}</td>
                  <td>{m.internal1 ?? "--"}</td>
                  <td>{m.internal2 ?? "--"}</td>
                  <td>{m.semesterGrade ?? "--"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
