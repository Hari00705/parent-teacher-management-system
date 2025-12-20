package com.example.SPMS.service;

import com.example.SPMS.model.Parent;
import com.example.SPMS.model.Student;
import com.example.SPMS.model.Teacher;
import com.example.SPMS.repository.ParentRepository;
import com.example.SPMS.repository.StudentRepository;
import com.example.SPMS.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private TeacherRepository teacherRepo;

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private ParentRepository parentRepo;

    // ✅ Add or update Teacher
    public Teacher saveTeacher(Teacher t) {
        return teacherRepo.save(t);
    }

    public List<Teacher> getAllTeachers() {
        return teacherRepo.findAll();
    }

    public void deleteTeacher(Long teacherId) {
        teacherRepo.deleteById(teacherId);
    }

    // ✅ Add Student + Create parent login + Assign advisor
    public Student saveStudent(Student s) {

        Parent parent = new Parent();
        parent.setEmail(s.getParent().getEmail());
        parent.setPassword("esec@123");

        parentRepo.save(parent);
        s.setParent(parent);

        return studentRepo.save(s);
    }

    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }

    public void deleteStudent(Long studentId) {
        studentRepo.deleteById(studentId);
    }
}
