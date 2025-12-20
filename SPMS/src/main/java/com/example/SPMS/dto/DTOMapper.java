package com.example.SPMS.dto;

import com.example.SPMS.model.Student;
import com.example.SPMS.model.Teacher;

import java.util.stream.Collectors;

public class DTOMapper {

    public static StudentDTO toStudentDTO(Student s) {
        return new StudentDTO(
                s.getId(),
                s.getName(),
                s.getRollNo(),
                s.getSemester(),
                s.getDepartment(),
                s.getAdvisor() != null ? s.getAdvisor().getId() : null,
                s.getAdvisor() != null ? s.getAdvisor().getName() : null,
                s.getParent() != null ? s.getParent().getEmail() : null
        );
    }

    public static TeacherDTO toTeacherDTO(Teacher t) {
        return new TeacherDTO(
                t.getId(),
                t.getName(),
                t.getEmail(),
                t.getDepartment(),
                t.getAdvisedStudents() == null ? null :
                        t.getAdvisedStudents().stream().map(DTOMapper::toStudentDTO).collect(Collectors.toList())
        );
    }
}
