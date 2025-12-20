import React, { useState } from "react";
import axios from "axios";

export default function ParentMail() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "null");

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      alert("Please enter subject and message");
      return;
    }

    if (!loggedUser || !loggedUser.email || !loggedUser.teacherEmail) {
      alert("Login info missing. Cannot send mail.");
      return;
    }

    const payload = {
      parentEmail: loggedUser.email,
      teacherEmail: loggedUser.teacherEmail,
      subject,
      body,
    };

    try {
      setSending(true);
      const res = await axios.post(
        "http://localhost:8080/api/parent/mail",
        payload
      );
      alert(res.data || "Mail sent successfully");
      setSubject("");
      setBody("");
    } catch (err) {
      console.error("Error sending mail", err);
      alert("Failed to send mail");
    } finally {
      setSending(false);
    }
  };

  if (!loggedUser) {
    return <p className="text-danger">Please log in as parent.</p>;
  }

  return (
    <div>
      <h4>✉️ Mail to Class Advisor</h4>

      <p className="text-muted">
        From: {loggedUser.email} <br />
        To: {loggedUser.teacherEmail || "(advisor email missing)"}
      </p>

      <input
        className="form-control my-2"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <textarea
        className="form-control mb-2"
        placeholder="Message"
        rows={5}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      ></textarea>

      <button
        className="btn btn-primary"
        onClick={handleSend}
        disabled={sending}
      >
        {sending ? "Sending..." : "Send Mail"}
      </button>
    </div>
  );
}
