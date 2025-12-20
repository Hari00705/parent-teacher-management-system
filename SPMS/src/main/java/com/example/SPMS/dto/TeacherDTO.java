package com.example.SPMS.dto;

import java.util.List;

public class TeacherDTO {
    private Long id;
    private String name;
    private String email;
    private String department;
    private List<StudentDTO> advisedStudents;

    public TeacherDTO() {}

    public TeacherDTO(Long id, String name, String email, String department, List<StudentDTO> advisedStudents) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
        this.advisedStudents = advisedStudents;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public List<StudentDTO> getAdvisedStudents() { return advisedStudents; }
    public void setAdvisedStudents(List<StudentDTO> advisedStudents) { this.advisedStudents = advisedStudents; }
}
