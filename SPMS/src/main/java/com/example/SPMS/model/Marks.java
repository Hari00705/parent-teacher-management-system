package com.example.SPMS.model;

import jakarta.persistence.*;

@Entity
@Table(
        name = "marks",
        uniqueConstraints = @UniqueConstraint(columnNames = {"roll_no", "semester", "subject_name"})
)
public class Marks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "roll_no", nullable = false)
    private String rollNo;

    @Column(name = "semester")
    private String semester;

    @Column(name = "student_name")
    private String studentName;

    @Column(name = "subject_name", nullable = false)
    private String subjectName;

    @Column(name = "subject_code")
    private String subjectCode;

    @Column(name = "internal1")
    private Integer internal1;

    @Column(name = "internal2")
    private Integer internal2;

    @Column(name = "semester_grade")
    private String semesterGrade;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    // mail status column to track notification result
    @Column(name = "mail_status")
    private String mailStatus;

    // ---------------------------
    // Getters and Setters
    // ---------------------------

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRollNo() { return rollNo; }
    public void setRollNo(String rollNo) { this.rollNo = rollNo; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public Integer getInternal1() { return internal1; }
    public void setInternal1(Integer internal1) { this.internal1 = internal1; }

    public Integer getInternal2() { return internal2; }
    public void setInternal2(Integer internal2) { this.internal2 = internal2; }

    public String getSemesterGrade() { return semesterGrade; }
    public void setSemesterGrade(String semesterGrade) { this.semesterGrade = semesterGrade; }

    public Teacher getTeacher() { return teacher; }
    public void setTeacher(Teacher teacher) { this.teacher = teacher; }

    public String getMailStatus() { return mailStatus; }
    public void setMailStatus(String mailStatus) { this.mailStatus = mailStatus; }
}
