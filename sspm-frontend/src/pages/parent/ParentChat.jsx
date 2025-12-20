import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function ParentChat() {
  const logged = JSON.parse(localStorage.getItem("loggedUser") || "null");
  const chatRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");

  const parentEmail = logged?.email;
  const teacherEmail = logged?.teacherEmail;

  useEffect(() => {
    if (!parentEmail || !teacherEmail) return;

    loadMessages();
    const timer = setInterval(loadMessages, 2000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentEmail, teacherEmail]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = async () => {
    if (!parentEmail || !teacherEmail) return;

    try {
      const res = await axios.get(
        `http://localhost:8080/api/chat?parentEmail=${encodeURIComponent(
          parentEmail
        )}&teacherEmail=${encodeURIComponent(teacherEmail)}`
      );
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const send = async () => {
    if (!msg.trim() || !parentEmail || !teacherEmail) return;

    const payload = {
      parentEmail,
      teacherEmail,
      message: msg,        // 👈 matches Message.message
    };

    try {
      await axios.post("http://localhost:8080/api/chat", payload);
      setMsg("");
      loadMessages();
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  if (!logged) {
    return <p className="text-danger">Please log in as parent to use chat.</p>;
  }

  if (!parentEmail || !teacherEmail) {
    return (
      <p className="text-danger">
        Chat cannot work — parentEmail or teacherEmail missing in
        <code> loggedUser </code>.
      </p>
    );
  }

  return (
    <div>
      <h4>💬 Chat with Class Advisor</h4>
      <p className="text-muted">Teacher: {teacherEmail}</p>

      <div
        ref={chatRef}
        className="border rounded p-3 mb-3"
        style={{ height: "350px", overflowY: "scroll", background: "#f4f4f4" }}
      >
        {messages.length === 0 ? (
          <p className="text-muted">No messages yet.</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`d-flex mb-2 ${
                m.parentEmail === parentEmail
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              <div
                className={`p-2 rounded text-white ${
                  m.parentEmail === parentEmail ? "bg-primary" : "bg-secondary"
                }`}
              >
                {m.message}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="input-group">
        <input
          className="form-control"
          placeholder="Type your message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="btn btn-success" onClick={send}>
          Send
        </button>
      </div>
    </div>
  );
}
