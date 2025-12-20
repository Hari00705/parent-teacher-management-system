package com.example.SPMS.service;

import com.example.SPMS.dto.StudentGetDTO;
import com.example.SPMS.dto.StudentAllDTO;
import com.example.SPMS.dto.SubjectDTO;
import com.example.SPMS.model.*;
import com.example.SPMS.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TeacherService {

    @Autowired private TeacherRepository teacherRepo;
    @Autowired private StudentRepository studentRepo;
    @Autowired private SubjectRepository subjectRepo;

    @Autowired private ParentRepository parentRepo;

    @Autowired private MarksRepository marksRepo;
    @Autowired private AttendanceRepository attendanceRepo;
    @Autowired private EmailService emailService;

    // ----------------------------------------------------------
    // ADD STUDENT UNDER TEACHER + CREATE PARENT AUTOMATICALLY
    // ----------------------------------------------------------
    public Student addStudentByTeacher(Student student, Long teacherId) {

        Teacher teacher = teacherRepo.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // -------- GET PARENT EMAIL --------
        String parentEmail = student.getParent() != null
                ? student.getParent().getEmail()
                : null;

        if (parentEmail == null || parentEmail.isEmpty()) {
            throw new RuntimeException("Parent email is required");
        }

        // -------- CHECK IF PARENT ALREADY EXISTS --------
        Parent parent = parentRepo.findByEmail(parentEmail).orElse(null);

        // -------- CREATE NEW PARENT IF NOT EXISTS --------
        if (parent == null) {
            parent = new Parent();
            parent.setEmail(parentEmail);
            parent.setPassword("esec@123");   // DEFAULT PASSWORD
            parent = parentRepo.save(parent);
        }

        // -------- LINK STUDENT WITH TEACHER & PARENT --------
        student.setAdvisor(teacher);
        student.setDepartment(teacher.getDepartment());
        student.setParent(parent);

        return studentRepo.save(student);
    }



    // ----------------------------------------------------------
    // ALL STUDENTS — student add page
    // ----------------------------------------------------------
    public List<StudentAllDTO> getAllStudentsForTeacher(Long teacherId) {

        return studentRepo.findByAdvisorId(teacherId)
                .stream()
                .map(s -> new StudentAllDTO(
                        s.getId(),
                        s.getName(),
                        s.getRollNo(),
                        s.getSemester(),
                        s.getDepartment(),
                        s.getParent() != null ? s.getParent().getEmail() : null,
                        teacherId
                ))
                .collect(Collectors.toList());
    }

    // ----------------------------------------------------------
    // UNMARKED STUDENTS (Attendance top list)
    // ----------------------------------------------------------
    public List<StudentGetDTO> getUnmarkedStudentsForToday(Long teacherId) {

        LocalDate today = LocalDate.now();

        List<String> markedRolls =
                attendanceRepo.findByTeacherIdAndDate(teacherId, today)
                        .stream()
                        .map(Attendance::getRollNo)
                        .collect(Collectors.toList());

        return studentRepo.findByAdvisorId(teacherId)
                .stream()
                .filter(s -> !markedRolls.contains(s.getRollNo()))  // exclude marked
                .map(s -> new StudentGetDTO(
                        s.getId(),
                        s.getName(),
                        s.getRollNo(),
                        s.getSemester(),
                        s.getDepartment(),
                        s.getParent() != null ? s.getParent().getEmail() : null,
                        teacherId
                ))
                .collect(Collectors.toList());
    }
    public String deleteStudent(Long teacherId, Long studentId) {

        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (!student.getAdvisor().getId().equals(teacherId)) {
            throw new RuntimeException("You cannot delete this student");
        }

        // THIS WILL ALSO DELETE THE PARENT automatically
        studentRepo.delete(student);

        return "Student & Parent deleted successfully!";
    }


    // ----------------------------------------------------------
    // SUBJECTS
    // ----------------------------------------------------------
    public Subject addSubject(Subject subject, Long teacherId) {

        // Get the teacher who is logged in (advisor)
        Teacher t = teacherRepo.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // Link teacher entity (for relationship)
        subject.setTeacher(t);

        // ⚠️ DO NOT OVERRIDE teacherName
        // KEEP the name entered from frontend AS IT IS

        return subjectRepo.save(subject);
    }

    public Teacher getTeacher(Long teacherId) {
        return teacherRepo.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
    }

    public List<SubjectDTO> getSubjectsByTeacher(Long teacherId) {

        List<Subject> subjects = subjectRepo.findByTeacherId(teacherId);

        return subjects.stream()
                .map(s -> new SubjectDTO(
                        s.getId(),
                        s.getSubjectCode(),
                        s.getSubjectName(),
                        s.getSemester(),
                        s.getTeacherName()   // return manual entered name
                ))
                .collect(Collectors.toList());
    }

    // ----------------------------------------------------------
    // MARKS
    // ----------------------------------------------------------
    public Marks updateMarks(Marks marks, Long teacherId) {

        Teacher teacher = teacherRepo.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Marks existing = marksRepo.findByRollNoAndSubjectCode(
                marks.getRollNo(),
                marks.getSubjectCode()
        ).orElse(new Marks());

        existing.setRollNo(marks.getRollNo());
        existing.setStudentName(marks.getStudentName());
        existing.setSubjectCode(marks.getSubjectCode());
        existing.setSubjectName(marks.getSubjectName());
        existing.setSemester(marks.getSemester());
        existing.setTeacher(teacher);

        if (marks.getInternal1() != null) existing.setInternal1(marks.getInternal1());
        if (marks.getInternal2() != null) existing.setInternal2(marks.getInternal2());
        if (marks.getSemesterGrade() != null) existing.setSemesterGrade(marks.getSemesterGrade());

        return marksRepo.save(existing);
    }


    // ----------------------------------------------------------
    // ATTENDANCE
    // ----------------------------------------------------------
    public Attendance markAttendance(Attendance att, Long teacherId) {

        Teacher teacher = teacherRepo.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        if (att.getDate() == null)
            att.setDate(LocalDate.now());

        // ----- prevent duplicate attendance -----
        Optional<Attendance> exists =
                attendanceRepo.findByRollNoAndDate(att.getRollNo(), att.getDate());

        if (exists.isPresent())
            throw new RuntimeException("Attendance already marked today");

        Student student = studentRepo.findByRollNo(att.getRollNo());
        if (student == null)
            throw new RuntimeException("Student not found");

        att.setTeacher(teacher);

        // send email
        if (student.getParent() != null) {
            String status = att.isPresent() ? "Present" : "Absent";

            String body =
                    "Dear Parent,\n\nYour child " + student.getName() +
                            " (" + student.getRollNo() + ") is marked " +
                            status + " on " + att.getDate() +
                            ".\n\nRegards,\n" + teacher.getName();

            try {
                emailService.sendEmail(student.getParent().getEmail(),
                        "Attendance Update",
                        body,
                        teacher.getEmail());

                att.setMailSent(true);
                att.setMailSentAt(LocalDateTime.now());
            } catch (Exception e) {
                att.setMailSent(false);
            }
        }

        return attendanceRepo.save(att);
    }
    public String notifyParentsMarks(Long teacherId, String examType, String semester) {

        Teacher teacher = teacherRepo.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        List<Student> students = studentRepo.findByAdvisorId(teacherId);

        for (Student stu : students) {

            List<Marks> allMarks = marksRepo.findByRollNoAndSemester(stu.getRollNo(), semester);

            StringBuilder body = new StringBuilder();
            body.append("Name: ").append(stu.getName()).append("\n");
            body.append("Roll No: ").append(stu.getRollNo()).append("\n\n");

            if (examType.equals("Internal 1")) {
                body.append("Internal 1 Marks:\n");
                for (Marks m : allMarks) {
                    if (m.getInternal1() != null) {
                        body.append(m.getSubjectName()).append(" → ").append(m.getInternal1()).append("\n");
                    }
                }
            }

            if (examType.equals("Internal 2")) {
                body.append("Internal 2 Marks:\n");
                for (Marks m : allMarks) {
                    if (m.getInternal2() != null) {
                        body.append(m.getSubjectName()).append(" → ").append(m.getInternal2()).append("\n");
                    }
                }
            }

            if (examType.equals("Semester")) {
                body.append("Semester Grades:\n");
                for (Marks m : allMarks) {
                    if (m.getSemesterGrade() != null) {
                        body.append(m.getSubjectName()).append(" → ").append(m.getSemesterGrade()).append("\n");
                    }
                }
            }

            body.append("\nRegards,\n").append(teacher.getName());

            emailService.sendEmail(
                    stu.getParent().getEmail(),
                    examType + " Marks Updated",
                    body.toString(),
                    teacher.getEmail()
            );
        }

        return "📨 Parent notifications sent!";
    }


    public List<Attendance> getTodayAttendance(Long teacherId) {
        return attendanceRepo.findByTeacherIdAndDate(teacherId, LocalDate.now());
    }
}
