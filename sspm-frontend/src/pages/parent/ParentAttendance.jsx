import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ParentAttendance() {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "null");
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loggedUser || !loggedUser.rollNo) {
      console.error("Parent not logged in or rollNo missing!");
      setLoading(false);
      return;
    }
    loadAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAttendance = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/parent/attendance/${loggedUser.rollNo}`
      );
      setAttendance(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading attendance", err);
    } finally {
      setLoading(false);
    }
  };

  if (!loggedUser || !loggedUser.rollNo) {
    return (
      <p className="text-danger">
        Cannot load attendance — login info is missing (roll number not set).
      </p>
    );
  }

  return (
    <div>
      <h4>📅 My Attendance</h4>
      <p className="text-muted">Roll No: {loggedUser.rollNo}</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {attendance.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center text-danger">
                  No attendance records found
                </td>
              </tr>
            ) : (
              attendance.map((a) => (
                <tr key={a.id}>
                  <td>{a.date}</td>
                  <td className={a.present ? "text-success" : "text-danger"}>
                    {a.present ? "Present" : "Absent"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
