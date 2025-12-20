package com.example.SPMS.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public String sendEmail(String toEmail, String subject, String body, String teacherEmail) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(teacherEmail); // ✅ mail sent by respective teacher
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body);

            mailSender.send(message);
            return "SENT ✅";
        } catch (MessagingException e) {
            return "FAILED ❌";
        }
    }
}
