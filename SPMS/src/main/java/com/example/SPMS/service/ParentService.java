package com.example.SPMS.service;

import com.example.SPMS.model.*;
import com.example.SPMS.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ParentService {

    @Autowired private AttendanceRepository attendanceRepo;
    @Autowired private MarksRepository marksRepo;
    @Autowired private MessageRepository messageRepo;

    public List<Attendance> getMyChildAttendance(String rollNo) {
        return attendanceRepo.findByRollNo(rollNo);
    }

    public List<Marks> getMyChildMarks(String rollNo) {
        return marksRepo.findByRollNo(rollNo);
    }

    public List<Message> getMyMessages(String parentEmail) {
        return messageRepo.findByParentEmail(parentEmail);
    }
}
