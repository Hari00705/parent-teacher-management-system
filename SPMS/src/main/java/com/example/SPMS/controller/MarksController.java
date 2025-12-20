package com.example.SPMS.controller;

import com.example.SPMS.model.Marks;
import com.example.SPMS.service.MarksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/marks")
public class MarksController {

    @Autowired
    private MarksService marksService;

    @PutMapping("/update/{teacherId}")
    public String updateMarks(@RequestBody Marks marks, @PathVariable Long teacherId) {
        return marksService.updateMarks(marks, teacherId);
    }

    @GetMapping("/internal/{semester}")
    public List<Marks> getInternal(@PathVariable String semester) {
        return marksService.getMarksForInternal(semester);
    }

    @GetMapping("/semester/{semester}")
    public List<Marks> getSemester(@PathVariable String semester) {
        return marksService.getSemesterResult(semester);
    }
}
