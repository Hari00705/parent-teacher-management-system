package com.example.SPMS.controller;

import com.example.SPMS.dto.DTOMapper;
import com.example.SPMS.dto.StudentDTO;
import com.example.SPMS.dto.TeacherDTO;
import com.example.SPMS.model.Student;
import com.example.SPMS.model.Teacher;
import com.example.SPMS.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // ✅ Add teacher
    @PostMapping("/teacher")
    public Teacher addTeacher(@RequestBody Teacher teacher) {
        return adminService.saveTeacher(teacher); // <-- fixed
    }

    // ✅ Get all teachers
//    @GetMapping("/teachers")
//    public List<Teacher> getTeachers() {
//        return adminService.getAllTeachers(); // <-- fixed
//    }

    // ✅ Delete teacher
    @DeleteMapping("/teacher/{id}")
    public String deleteTeacher(@PathVariable Long id) {
        adminService.deleteTeacher(id);
        return "Teacher removed";
    }

    // ✅ Add student (parent account auto-created inside service)
    @PostMapping("/student")
    public Student addStudent(@RequestBody Student student) {
        return adminService.saveStudent(student); // <-- fixed
    }

    // ✅ Get all students
//    @GetMapping("/students")
//    public List<Student> getStudents() {
//        return adminService.getAllStudents(); // <-- fixed
//    }

    // ✅ Delete student
    @DeleteMapping("/student/{id}")
    public String deleteStudent(@PathVariable Long id) {
        adminService.deleteStudent(id);
        return "Student removed";
    }

    @GetMapping("/teachers")
    public List<TeacherDTO> getTeachers() {
        return adminService.getAllTeachers()
                .stream()
                .map(DTOMapper::toTeacherDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/students")
    public List<StudentDTO> getStudents() {
        return adminService.getAllStudents()
                .stream()
                .map(DTOMapper::toStudentDTO)
                .collect(Collectors.toList());
    }


}
