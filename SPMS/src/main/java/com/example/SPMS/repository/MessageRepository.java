package com.example.SPMS.repository;

import com.example.SPMS.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    // All messages where this teacher OR this parent is involved (latest first)
    List<Message> findByTeacherEmailOrParentEmailOrderByTimestampDesc(
            String teacherEmail,
            String parentEmail
    );

    // All messages of a parent (any teacher)
    List<Message> findByParentEmail(String parentEmail);

    // ✅ Chat between ONE specific parent & ONE specific teacher (oldest first)
    @Query("SELECT m FROM Message m " +
            "WHERE m.parentEmail = :parentEmail AND m.teacherEmail = :teacherEmail " +
            "ORDER BY m.timestamp ASC")
    List<Message> findChat(
            @Param("parentEmail") String parentEmail,
            @Param("teacherEmail") String teacherEmail
    );
}
