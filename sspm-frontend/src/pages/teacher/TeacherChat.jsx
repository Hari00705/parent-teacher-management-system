import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function TeacherChat() {
  const loggedInTeacher = JSON.parse(localStorage.getItem("loggedInTeacher") || "null");
  const chatRef = useRef(null);

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgText, setMsgText] = useState("");

  const [teacherProfile, setTeacherProfile] = useState(null);

  const teacherId = loggedInTeacher?.userId || loggedInTeacher?.id;
  const teacherEmail = teacherProfile?.email || "";
  const teacherName = teacherProfile?.name || "";

  // ---------------------------------------------------
  // ON MOUNT: check login, load teacher profile + students
  // ---------------------------------------------------
  useEffect(() => {
    if (!loggedInTeacher || !teacherId) {
      window.location.href = "/";
      return;
    }

    loadTeacherProfile();
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTeacherProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/teacher/profile/${teacherId}`
      );
      setTeacherProfile(res.data);
      console.log("Teacher profile:", res.data);
    } catch (err) {
      console.error("Error loading teacher profile", err);
    }
  };

  const loadStudents = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/teacher/${teacherId}/students/all`
      );
      const list = Array.isArray(res.data) ? res.data : [];
      setStudents(list);

      if (list.length > 0) setSelectedStudent(list[0]);
    } catch (err) {
      console.error("Error loading students", err);
    }
  };

  // ---------------------------------------------------
  // LOAD CHAT MESSAGES FOR SELECTED STUDENT (POLLING)
  // ---------------------------------------------------
  useEffect(() => {
    if (!selectedStudent || !selectedStudent.parentEmail || !teacherEmail) {
      setMessages([]);
      return;
    }

    loadMessages(); // first time
    const timer = setInterval(loadMessages, 2000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudent, teacherEmail]);

  const loadMessages = async () => {
    if (!selectedStudent || !selectedStudent.parentEmail || !teacherEmail) return;

    try {
      const res = await axios.get("http://localhost:8080/api/chat", {
        params: {
          parentEmail: selectedStudent.parentEmail,
          teacherEmail: teacherEmail,
        },
      });

      setMessages(Array.isArray(res.data) ? res.data : []);

      // scroll to bottom
      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }, 100);
    } catch (err) {
      console.error("Error loading messages", err);
    }
  };

  // ---------------------------------------------------
  // SEND MESSAGE
  // ---------------------------------------------------
  const sendMessage = async () => {
    if (!msgText.trim()) return;
    if (!selectedStudent || !selectedStudent.parentEmail) {
      alert("Select a student first");
      return;
    }
    if (!teacherEmail) {
      console.error("Teacher email missing, profile:", teacherProfile);
      alert("Cannot send – teacher email not loaded.");
      return;
    }

    const payload = {
      teacherEmail: teacherEmail,
      parentEmail: selectedStudent.parentEmail,
      message: msgText,
    };

    try {
      await axios.post("http://localhost:8080/api/chat", payload);
      setMsgText("");
      loadMessages();
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  // ---------------------------------------------------
  // UI
  // ---------------------------------------------------
  if (!loggedInTeacher || !teacherId) {
    return <p className="text-danger">Please log in as teacher.</p>;
  }

  return (
    <div className="container mt-4">
      <h3>Teacher Dashboard — Parent Chat</h3>

      <div className="row">
        {/* LEFT STUDENT LIST */}
        <div className="col-md-3">
          <h5>Your Students</h5>
          <div className="list-group">
            {students.length === 0 ? (
              <div className="text-muted p-2">No students assigned.</div>
            ) : (
              students.map((s) => (
                <button
                  key={s.id || s.rollNo}
                  className={
                    "list-group-item list-group-item-action " +
                    (selectedStudent?.rollNo === s.rollNo ? "active" : "")
                  }
                  onClick={() => setSelectedStudent(s)}
                >
                  <b>{s.name}</b>
                  <br />
                  <small>{s.rollNo}</small>
                  <br />
                  <small>{s.parentEmail}</small>
                </button>
              ))
            )}
          </div>
        </div>

        {/* RIGHT CHAT AREA */}
        <div className="col-md-9">
          <div className="mb-2 text-muted">
            {selectedStudent && selectedStudent.parentEmail ? (
              <>
                Chatting with parent of{" "}
                <b>{selectedStudent.name}</b> ({selectedStudent.rollNo})<br />
                Parent: {selectedStudent.parentEmail}
              </>
            ) : (
              <span>Select a student to start chatting with their parent.</span>
            )}
          </div>

          <div
            ref={chatRef}
            className="border rounded p-3 mb-2"
            style={{ height: "350px", overflowY: "scroll", background: "#fafafa" }}
          >
            {messages.length === 0 ? (
              <p className="text-muted">No messages yet.</p>
            ) : (
              messages.map((msg) => {
                const isTeacher = msg.teacherEmail === teacherEmail; // sender = teacher

                return (
                  <div
                    key={msg.id}
                    className={
                      "d-flex mb-3 " +
                      (isTeacher ? "justify-content-end" : "justify-content-start")
                    }
                  >
                    <div
                      style={{
                        maxWidth: "70%",
                        padding: "8px 12px",
                        borderRadius: "16px",
                        fontSize: "0.9rem",
                        wordBreak: "break-word",
                        backgroundColor: isTeacher ? "#25d366" : "#e5e5ea",
                        color: isTeacher ? "#ffffff" : "#000000",
                        borderBottomRightRadius: isTeacher ? "2px" : "16px",
                        borderBottomLeftRadius: isTeacher ? "16px" : "2px",
                      }}
                    >
                      {msg.message}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* INPUT */}
          <div className="input-group">
            <input
              className="form-control"
              placeholder="Type message to parent..."
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={!selectedStudent || !selectedStudent.parentEmail}
            />
            <button
              className="btn btn-success"
              onClick={sendMessage}
              disabled={!selectedStudent || !selectedStudent.parentEmail}
            >
              Send
            </button>
          </div>

          <p className="mt-2 text-muted">
            Sending as: <b>{teacherName || "Unknown"} ({teacherEmail || "no email"})</b>
          </p>
        </div>
      </div>
    </div>
  );
}
