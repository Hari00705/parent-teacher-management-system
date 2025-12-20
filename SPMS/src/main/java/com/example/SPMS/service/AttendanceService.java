package com.example.SPMS.service;

import com.example.SPMS.model.Attendance;
import com.example.SPMS.model.Student;
import com.example.SPMS.model.Teacher;
import com.example.SPMS.repository.AttendanceRepository;
import com.example.SPMS.repository.StudentRepository;
import com.example.SPMS.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AttendanceService {

    @Autowired private AttendanceRepository attendanceRepo;
    @Autowired private StudentRepository studentRepo;
    @Autowired private TeacherRepository teacherRepo;

    public Attendance markAttendance(Attendance att, Long teacherId) {

        if (att.getDate() == null)
            att.setDate(LocalDate.now());

        // ✅ Get teacher
        Teacher teacher = teacherRepo.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // ✅ Get student by roll no
        Student student = studentRepo.findByRollNo(att.getRollNo());
        if (student == null) {
            throw new RuntimeException("Student not found with rollNo: " + att.getRollNo());
        }

        // ✅ Attach teacher & student
        att.setTeacher(teacher);
        att.setStudent(student);
        att.setStudentName(student.getName());

        // ✅ Mail status default values (Mail sending is handled in TeacherService)
        att.setMailSent(false);
        att.setMailSentAt(LocalDateTime.now());

        return attendanceRepo.save(att);
    }

    public List<Attendance> getByStudent(String rollNo) {
        return attendanceRepo.findByRollNo(rollNo);
    }

    public List<Attendance> getByDate(LocalDate date) {
        return attendanceRepo.findByDate(date);
    }

    public List<Attendance> searchStudentAttendance(String keyword) {
        return attendanceRepo.searchByNameOrRoll(keyword);
    }
}
