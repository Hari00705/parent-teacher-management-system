package com.example.SPMS.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name="students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String rollNo;
    private String semester;
    private String department;

    @ManyToOne
    @JoinColumn(name="advisor_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Teacher advisor;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "parent_id")
    private Parent parent;

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

    public Teacher getAdvisor() { return advisor; }
    public void setAdvisor(Teacher advisor) { this.advisor = advisor; }

    public Parent getParent() { return parent; }
    public void setParent(Parent parent) { this.parent = parent; }
}
