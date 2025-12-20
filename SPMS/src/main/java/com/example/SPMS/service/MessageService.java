package com.example.SPMS.service;

import com.example.SPMS.model.Message;
import com.example.SPMS.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepo;

    @Autowired
    private EmailService emailService;

    public Message sendMessage(Message msg) {
        msg.setTimestamp(LocalDateTime.now());
        Message saved = messageRepo.save(msg);

        // ----- SEND EMAIL -----
        try {
            if (saved.getParentEmail() != null && !saved.getParentEmail().isEmpty()) {

                String from = (saved.getTeacherEmail() != null && !saved.getTeacherEmail().isEmpty())
                        ? saved.getTeacherEmail()
                        : "no-reply@college.com";

                String body =
                        "New chat message in SSPM:\n\n" +
                                saved.getMessage() + "\n\n" +
                                "Teacher: " + (saved.getTeacherEmail() != null ? saved.getTeacherEmail() : "-") + "\n" +
                                "Parent: "  + saved.getParentEmail() + "\n" +
                                "Time: "    + saved.getTimestamp() + "\n";

                // 📧 TO = parent
                emailService.sendEmail(
                        saved.getParentEmail(),           // TO
                        "New message from class advisor", // SUBJECT
                        body,                             // BODY
                        from                              // FROM
                );
            }
        } catch (Exception e) {
            // don't break chat if mail fails
            System.err.println("❌ Failed to send chat email: " + e.getMessage());
        }
        return saved;
    }

    public List<Message> getMessages(String parentEmail, String teacherEmail) {
        return messageRepo.findChat(parentEmail, teacherEmail);
    }
}
