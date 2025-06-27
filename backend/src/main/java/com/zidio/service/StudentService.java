package com.zidio.service;

import com.zidio.dto.StudentRequest;
import com.zidio.entity.Student;
import com.zidio.entity.User;
import com.zidio.repository.StudentRepository;
import com.zidio.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public StudentService(StudentRepository studentRepository, UserRepository userRepository) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }

    public StudentRequest createOrUpdate(StudentRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Student student = studentRepository.findByUserEmail(request.getEmail())
                .orElse(new Student());
        
        student.setUser(user);
        student.setCourse(request.getCourse());
        student.setUniversity(request.getUniversity());
        student.setMajor(request.getMajor());
        student.setGpa(request.getGpa());
        student.setResumeUrl(request.getResumeUrl());
        
        Student savedStudent = studentRepository.save(student);
        return convertToDto(savedStudent);
    }

    public StudentRequest getProfile(String email) {
        Student student = studentRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return convertToDto(student);
    }

    private StudentRequest convertToDto(Student student) {
        StudentRequest dto = new StudentRequest();
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setCourse(student.getCourse());
        dto.setUniversity(student.getUniversity());
        dto.setMajor(student.getMajor());
        dto.setGpa(student.getGpa());
        dto.setResumeUrl(student.getResumeUrl());
        return dto;
    }
}