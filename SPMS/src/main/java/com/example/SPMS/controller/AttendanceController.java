package com.example.SPMS.controller;

import com.example.SPMS.model.Attendance;
import com.example.SPMS.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/{teacherId}")
    public Attendance mark(@PathVariable Long teacherId, @RequestBody Attendance att) {
        return attendanceService.markAttendance(att, teacherId);
    }

    @GetMapping("/student/{rollNo}")
    public List<Attendance> getByStudent(@PathVariable String rollNo) {
        return attendanceService.getByStudent(rollNo);
    }

    @GetMapping("/date/{date}")
    public List<Attendance> getByDate(@PathVariable String date) {
        return attendanceService.getByDate(LocalDate.parse(date));
    }

    @GetMapping("/search/{key}")
    public List<Attendance> search(@PathVariable String key) {
        return attendanceService.searchStudentAttendance(key);
    }
}
