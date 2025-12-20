package com.example.SPMS.controller;

import com.example.SPMS.model.Message;
import com.example.SPMS.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/chat")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping
    public Message send(@RequestBody Message msg) {
        return messageService.sendMessage(msg);
    }

    @GetMapping
    public List<Message> get(
            @RequestParam String parentEmail,
            @RequestParam String teacherEmail) {
        return messageService.getMessages(parentEmail, teacherEmail);
    }
}
