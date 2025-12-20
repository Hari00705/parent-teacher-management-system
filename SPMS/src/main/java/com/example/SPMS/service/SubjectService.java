package com.example.SPMS.service;

import com.example.SPMS.model.Subject;
import com.example.SPMS.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepo;

    public Subject addSubject(Subject subject) {
        return (Subject) subjectRepo.save(subject);
    }

    public List<Subject> getAllSubjects() {
        return subjectRepo.findAll();
    }

    public List<Subject> getBySemester(String semester) {
        return subjectRepo.findBySemester(semester);
    }

    public List<Subject> searchByNameOrCode(String keyword) {
        return subjectRepo.findBySubjectNameContainingOrSubjectCodeContaining(keyword, keyword);
    }

    public void deleteSubject(Long id) {
        subjectRepo.deleteById(id);
    }
}
