package com.example.SPMS.repository;

import com.example.SPMS.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject,Long> {
    List<Subject> findBySemester(String semester);
    List<Subject> findByTeacherId(Long teacherId);

    List<Subject> findBySubjectNameContainingOrSubjectCodeContaining(String keyword, String keyword1);
}
