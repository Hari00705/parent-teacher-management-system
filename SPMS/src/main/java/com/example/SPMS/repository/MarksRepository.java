package com.example.SPMS.repository;

import com.example.SPMS.model.Marks;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MarksRepository extends JpaRepository<Marks,Long> {
    Optional<Marks> findByRollNoAndSubjectName(String rollNo, String subjectName);
    List<Marks> findByRollNoAndSemester(String rollNo, String semester);
    List<Marks> findBySemesterAndSubjectName(String semester, String subjectName);


    Optional<Marks> findByRollNoAndSubjectCode(String rollNo, String subjectCode);

    List<Marks> findBySemester(String semester);

    List<Marks> findBySemesterAndSemesterGradeNotNull(String semester);

    List<Marks> findByRollNo(String rollNo);

    List<Marks> findBySemesterAndInternal1NotNull(String semester);

    List<Marks> findBySemesterAndInternal2NotNull(String semester);
}
