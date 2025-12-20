package com.example.SPMS.dto;

public class LoginResponse {

    private String message;
    private String role;
    private Long userId;
    private String email;
    private String rollNo;
    private String teacherEmail;

    public LoginResponse(String message, String role, Long userId, String email, String rollNo, String teacherEmail) {
        this.message = message;
        this.role = role;
        this.userId = userId;
        this.email = email;
        this.rollNo = rollNo;
        this.teacherEmail = teacherEmail;
    }

    // Simple constructor for ADMIN / TEACHER
    public LoginResponse(String message, String role, Long userId) {
        this.message = message;
        this.role = role;
        this.userId = userId;
    }

    // ===== Getters & Setters =====
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRollNo() { return rollNo; }
    public void setRollNo(String rollNo) { this.rollNo = rollNo; }

    public String getTeacherEmail() { return teacherEmail; }
    public void setTeacherEmail(String teacherEmail) { this.teacherEmail = teacherEmail; }
}
