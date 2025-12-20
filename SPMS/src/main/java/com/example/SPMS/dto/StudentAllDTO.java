package com.example.SPMS.dto;

public class StudentAllDTO {
    private Long id;
    private String name;
    private String rollNo;
    private String semester;
    private String department;
    private String parentEmail;
    private Long advisorId;

    public StudentAllDTO(Long id, String name, String rollNo,
                         String semester, String department,
                         String parentEmail, Long advisorId) {
        this.id = id;
        this.name = name;
        this.rollNo = rollNo;
        this.semester = semester;
        this.department = department;
        this.parentEmail = parentEmail;
        this.advisorId = advisorId;
    }

    // getters & setters
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
    public String getParentEmail() { return parentEmail; }
    public void setParentEmail(String parentEmail) { this.parentEmail = parentEmail; }
    public Long getAdvisorId() { return advisorId; }
    public void setAdvisorId(Long advisorId) { this.advisorId = advisorId; }
}
