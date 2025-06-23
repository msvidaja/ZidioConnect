package com.zidio.controller;

import com.zidio.dto.StudentRequest;
import com.zidio.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/profile")
    public ResponseEntity<String> save(@RequestBody StudentRequest request) {
        studentService.createOrUpdate(request);
        return ResponseEntity.ok("Profile updated successfully");
    }

    @GetMapping("/profile/{email}")
    public ResponseEntity<StudentRequest> get(@PathVariable String email) {
        return ResponseEntity.ok(studentService.getProfile(email));
    }
}