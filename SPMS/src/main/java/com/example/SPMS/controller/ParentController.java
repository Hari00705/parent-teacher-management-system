package com.example.SPMS.controller;

import com.example.SPMS.dto.ParentMailDTO;
import com.example.SPMS.model.Attendance;
import com.example.SPMS.model.Marks;
import com.example.SPMS.model.Message;
import com.example.SPMS.model.Teacher;
import com.example.SPMS.repository.TeacherRepository;
import com.example.SPMS.service.EmailService;
import com.example.SPMS.service.ParentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/parent")
public class ParentController {

    @Autowired
    private ParentService parentService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private TeacherRepository teacherRepo;

    // ✅ Attendance
    @GetMapping("/attendance/{rollNo}")
    public List<Attendance> viewAttendance(@PathVariable String rollNo) {
        return parentService.getMyChildAttendance(rollNo);
    }

    // ✅ Marks
    @GetMapping("/marks/{rollNo}")
    public List<Marks> viewMarks(@PathVariable String rollNo) {
        return parentService.getMyChildMarks(rollNo);
    }

    // ✅ Chats
    @GetMapping("/messages/{email}")
    public List<Message> viewMessages(@PathVariable String email) {
        return parentService.getMyMessages(email);
    }
    // ✅ Parent sends mail to class advisor
    @PostMapping("/mail")
    public String sendMailToAdvisor(@RequestBody ParentMailDTO dto) {

        if (dto.getParentEmail() == null || dto.getTeacherEmail() == null) {
            throw new RuntimeException("Parent/Teacher email is required");
        }

        Teacher teacher = teacherRepo.findByEmail(dto.getTeacherEmail())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        String finalBody =
                dto.getBody() +
                        "\n\n-------------------------\n" +
                        "From Parent: " + dto.getParentEmail();

        // If your EmailService returns a status String:
        String status = emailService.sendEmail(
                teacher.getEmail(),        // TO
                dto.getSubject(),          // SUBJECT
                finalBody,                 // BODY
                dto.getParentEmail()       // FROM
        );

        return status != null ? status : "Mail sent";
    }
}
