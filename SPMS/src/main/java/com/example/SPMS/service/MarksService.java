package com.example.SPMS.service;

import com.example.SPMS.model.Marks;
import com.example.SPMS.model.Student;
import com.example.SPMS.model.Teacher;
import com.example.SPMS.repository.MarksRepository;
import com.example.SPMS.repository.StudentRepository;
import com.example.SPMS.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class MarksService {

    @Autowired
    private MarksRepository marksRepo;

    @Autowired
    private TeacherRepository teacherRepo;

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private EmailService emailService;

    public String updateMarks(Marks marks, Long teacherId) {

        Teacher teacher = teacherRepo.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Optional<Marks> existing = marksRepo.findByRollNoAndSubjectCode(
                marks.getRollNo(), marks.getSubjectCode());

        Marks m = existing.orElse(new Marks());
        m.setRollNo(marks.getRollNo());
        m.setStudentName(marks.getStudentName());
        m.setSubjectCode(marks.getSubjectCode());
        m.setSubjectName(marks.getSubjectName());
        m.setSemester(marks.getSemester());
        m.setTeacher(teacher);

        if (marks.getInternal1() != null) m.setInternal1(marks.getInternal1());
        if (marks.getInternal2() != null) m.setInternal2(marks.getInternal2());
        if (marks.getSemesterGrade() != null) m.setSemesterGrade(marks.getSemesterGrade());

        marksRepo.save(m);

        // --------- SEND MAIL TO PARENT ---------
        Student student = studentRepo.findByRollNo(marks.getRollNo());

        if (student != null && student.getParent() != null) {
            String parentMail = student.getParent().getEmail();

            String updatedField =
                    marks.getInternal1() != null ? "Internal 1"
                            : marks.getInternal2() != null ? "Internal 2"
                            : "Semester Exam";

            String body =
                    "Dear Parent,\n\n" +
                            updatedField + " marks updated for your child:\n\n" +
                            "Name: " + student.getName() + "\n" +
                            "Roll No: " + student.getRollNo() + "\n" +
                            "Subject: " + marks.getSubjectName() + "\n" +
                            "Internal 1: " + m.getInternal1() + "\n" +
                            "Internal 2: " + m.getInternal2() + "\n" +
                            "Semester Grade: " + m.getSemesterGrade() + "\n\n" +
                            "Regards,\n" + teacher.getName();

            String mailStatus = emailService.sendEmail(
                    parentMail,
                    updatedField + " Marks Updated",
                    body,
                    teacher.getEmail()
            );

            m.setMailStatus(mailStatus);
            marksRepo.save(m);
        }

        return "✅ Marks updated and parent notified!";
    }

    public List<Marks> getMarksForInternal(String semester) {
        return marksRepo.findBySemester(semester);
    }

    public List<Marks> getSemesterResult(String semester) {
        return marksRepo.findBySemesterAndSemesterGradeNotNull(semester);
    }
}
