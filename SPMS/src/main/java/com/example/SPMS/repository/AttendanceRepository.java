package com.example.SPMS.repository;

import com.example.SPMS.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance,Long> {
    Optional<Attendance> findByRollNoAndDate(String rollNo, LocalDate date);
//    Optional<Attendance> findByRollNoAndDate(String rollNo, LocalDate date);
    List<Attendance> findByRollNo(String rollNo);
    List<Attendance> findByTeacherIdAndDate(Long teacherId, LocalDate date);
    List<Attendance> findByStudentNameContainingIgnoreCase(String name);
    List<Attendance> findByDate(LocalDate date);
//    List<Attendance> findByRollNo(String rollNo);

    @Query("SELECT a FROM Attendance a WHERE a.rollNo LIKE %:key% OR a.studentName LIKE %:key%")
    List<Attendance> searchByNameOrRoll(@Param("key") String key);


//    List<Attendance> searchByNameOrRoll(String keyword);
}
