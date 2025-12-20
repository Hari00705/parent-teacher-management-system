package com.example.SPMS.dto;

public class StudentDTO {
    private Long id;
    private String name;
    private String rollNo;
    private String semester;
    private String department;
    private Long advisorId;
    private String advisorName;
    private String parentEmail;

    public StudentDTO() {}

    public StudentDTO(Long id, String name, String rollNo, String semester, String department,
                      Long advisorId, String advisorName, String parentEmail) {
        this.id = id;
        this.name = name;
        this.rollNo = rollNo;
        this.semester = semester;
        this.department = department;
        this.advisorId = advisorId;
        this.advisorName = advisorName;
        this.parentEmail = parentEmail;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRollNo() { return rollNo; }
    public void setRollNo(String rollNo) { this.rollNo = rollNo; }
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public Long getAdvisorId() { return advisorId; }
    public void setAdvisorId(Long advisorId) { this.advisorId = advisorId; }
    public String getAdvisorName() { return advisorName; }
    public void setAdvisorName(String advisorName) { this.advisorName = advisorName; }
    public String getParentEmail() { return parentEmail; }
    public void setParentEmail(String parentEmail) { this.parentEmail = parentEmail; }
}
