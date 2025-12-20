package com.example.SPMS.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name="attendance",
        uniqueConstraints = @UniqueConstraint(columnNames = {"roll_no","date"})
)
public class Attendance {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private boolean present;

    @Column(name="student_name")
    private String studentName;

    @Column(name="roll_no")
    private String rollNo;

    @ManyToOne @JoinColumn(name="student_id")
    private Student student;

    @ManyToOne @JoinColumn(name="teacher_id")
    private Teacher teacher;

    private boolean mailSent;
    private LocalDateTime mailSentAt;

    @Column(name="mail_status")
    private String mailStatus;

    // Getters / Setters
    public Long getId(){ return id; }
    public void setId(Long id){ this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public boolean isPresent() { return present; }
    public void setPresent(boolean present) { this.present = present; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRollNo() { return rollNo; }
    public void setRollNo(String rollNo) { this.rollNo = rollNo; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Teacher getTeacher() { return teacher; }
    public void setTeacher(Teacher teacher) { this.teacher = teacher; }

    public boolean isMailSent() { return mailSent; }
    public void setMailSent(boolean mailSent) { this.mailSent = mailSent; }

    public LocalDateTime getMailSentAt() { return mailSentAt; }
    public void setMailSentAt(LocalDateTime mailSentAt) { this.mailSentAt = mailSentAt; }

    public String getMailStatus() { return mailStatus; }
    public void setMailStatus(String mailStatus) { this.mailStatus = mailStatus; }
}
