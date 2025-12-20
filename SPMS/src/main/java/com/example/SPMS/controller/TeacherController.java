package com.example.SPMS.controller;

import com.example.SPMS.dto.StudentGetDTO;
import com.example.SPMS.dto.StudentAllDTO;
import com.example.SPMS.dto.SubjectDTO;
import com.example.SPMS.dto.TeacherGetDTO;
import com.example.SPMS.model.*;
import com.example.SPMS.service.TeacherService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/teacher")
public class TeacherController {
    @Autowired
    private TeacherService teacherService;
    // ------------------------ ADD STUDENT ------------------------
    @PostMapping("/{teacherId}/student")
    public Student addStudent(@RequestBody Student student, @PathVariable Long teacherId) {
        return teacherService.addStudentByTeacher(student, teacherId);
    }

    // ---------------------- UNMARKED STUDENTS (Attendance top list) ----------------------
    @GetMapping("/{teacherId}/students")
    public List<StudentGetDTO> getUnmarkedStudents(@PathVariable Long teacherId) {
        return teacherService.getUnmarkedStudentsForToday(teacherId);
    }

    // ---------------------- ALL STUDENTS (Add page) ----------------------
    @GetMapping("/{teacherId}/students/all")
    public List<StudentAllDTO> getAllStudentsForTeacher(@PathVariable Long teacherId) {
        return teacherService.getAllStudentsForTeacher(teacherId);
    }

    // ------------------------ SUBJECTS ------------------------
    @PostMapping("/{teacherId}/subject")
    public Subject addSubject(@RequestBody Subject subject, @PathVariable Long teacherId) {
        return teacherService.addSubject(subject, teacherId);
    }

    @GetMapping("/{teacherId}/subjects")
    public List<SubjectDTO> getSubjects(@PathVariable Long teacherId) {
        return teacherService.getSubjectsByTeacher(teacherId);
    }

    // ------------------------ PROFILE ------------------------
    @GetMapping("/profile/{teacherId}")
    public TeacherGetDTO getTeacherProfile(@PathVariable Long teacherId) {
        Teacher t = teacherService.getTeacher(teacherId);
        return new TeacherGetDTO(t.getId(), t.getName(), t.getEmail(), t.getDepartment());
    }

    // ------------------------ ATTENDANCE ------------------------
    @PostMapping("/{teacherId}/attendance")
    public Attendance markAttendance(@RequestBody Attendance att, @PathVariable Long teacherId) {
        return teacherService.markAttendance(att, teacherId);
    }

    @GetMapping("/{teacherId}/attendance/today")
    public List<Attendance> getTodayAttendance(@PathVariable Long teacherId) {
        return teacherService.getTodayAttendance(teacherId);
    }

    @DeleteMapping("/{teacherId}/student/{studentId}")
    public String deleteStudent(@PathVariable Long teacherId, @PathVariable Long studentId) {
        return teacherService.deleteStudent(teacherId, studentId);
    }
    @PostMapping("/{teacherId}/notify-marks")
    public String notifyMarks(
            @PathVariable Long teacherId,
            @RequestParam String examType,
            @RequestParam String semester
    ) {
        return teacherService.notifyParentsMarks(teacherId, examType, semester);
    }

    // ---------------------- MARKS ----------------------
    @PutMapping("/{teacherId}/marks")
    public Marks updateMarks(@RequestBody Marks marks, @PathVariable Long teacherId) {
        return teacherService.updateMarks(marks, teacherId);
    }
}
