package com.zidio.service;

import com.zidio.dto.StudentRequest;
import com.zidio.entity.Student;
import com.zidio.repository.StudentRepository;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student createOrUpdate(StudentRequest request) {
        Student student = studentRepository.findByEmail(request.getEmail())
                .orElse(new Student());
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setUniversity(request.getUniversity());
        student.setMajor(request.getMajor());
        student.setGpa(request.getGpa());
        student.setResumeUrl(request.getResumeUrl());
        return studentRepository.save(student);
    }

    public Student getProfile(String email) {
        return studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }
}