package com.example.SPMS.service;

import com.example.SPMS.model.*;
import com.example.SPMS.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudentService {

    @Autowired private StudentRepository studentRepo;
    @Autowired private AttendanceRepository attendanceRepo;
    @Autowired private MarksRepository marksRepo;
    @Autowired private SubjectRepository subjectRepo;

    public Student addStudent(Student s) {
        return studentRepo.save(s);
    }

    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }

    public Student getByRollNo(String rollNo) {
        return studentRepo.findByRollNo(rollNo);
    }

    public List<Student> getStudentsByDepartment(String dept) {
        return studentRepo.findByDepartment(dept);
    }

    public List<Student> getStudentsByAdvisor(Long teacherId) {
        return studentRepo.findByAdvisorId(teacherId);
    }

    public List<Attendance> getAttendance(String rollNo) {
        return attendanceRepo.findByRollNo(rollNo);
    }

    public List<Marks> getMarks(String rollNo, String semester) {
        return marksRepo.findByRollNoAndSemester(rollNo, semester);
    }

    public List<Subject> getSubjects(String semester) {
        return subjectRepo.findBySemester(semester);
    }
}
