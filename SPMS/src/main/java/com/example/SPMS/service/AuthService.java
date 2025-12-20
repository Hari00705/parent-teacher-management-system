package com.example.SPMS.service;

import com.example.SPMS.dto.LoginRequest;
import com.example.SPMS.dto.LoginResponse;
import com.example.SPMS.model.Parent;
import com.example.SPMS.model.Teacher;
import com.example.SPMS.repository.ParentRepository;
import com.example.SPMS.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
public class AuthService {

    @Autowired private TeacherRepository teacherRepo;
    @Autowired private ParentRepository parentRepo;

    public LoginResponse login(LoginRequest req) {

        // ---------------- ADMIN LOGIN ----------------
        if (req.getEmail().equals("admin@gmail.com") && req.getPassword().equals("admin123")) {
            return new LoginResponse("Login Successful", "ADMIN", 0L);
        }

        // ---------------- TEACHER LOGIN ----------------
        Teacher teacher = teacherRepo.findByEmailAndPassword(req.getEmail(), req.getPassword());
        if (teacher != null) {
            return new LoginResponse("Login Successful", "TEACHER", teacher.getId());
        }

        // ---------------- PARENT LOGIN ----------------
        Parent parent = parentRepo.findByEmailAndPassword(req.getEmail(), req.getPassword())
                .orElse(null);

        if (parent != null) {

            if (parent.getStudent() == null) {
                return new LoginResponse(
                        "Login Successful",
                        "PARENT",
                        parent.getId(),
                        parent.getEmail(),
                        null,
                        null
                );
            }

            String rollNo = parent.getStudent().getRollNo();
            String teacherEmail = parent.getStudent().getAdvisor().getEmail();

            return new LoginResponse(
                    "Login Successful",
                    "PARENT",
                    parent.getId(),
                    parent.getEmail(),
                    rollNo,
                    teacherEmail
            );
        }

        // ---------------- INVALID LOGIN ----------------
        return new LoginResponse("Invalid Credentials", null, null);
    }
}
