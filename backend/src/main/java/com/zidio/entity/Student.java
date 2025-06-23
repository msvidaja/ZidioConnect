package com.zidio.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String course;
    private String university;
    private String major;
    private Double gpa;
    private String resumeUrl;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Application> applications = new ArrayList<>();
}