package com.example.SPMS.repository;

import com.example.SPMS.model.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.SPMS.model.Student;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Student findByRollNo(String rollNo);
    List<Student> findByNameContainingIgnoreCase(String name);
    List<Student> findByDepartment(String department);
    List<Student> findByAdvisorId(Long teacherId);

}

