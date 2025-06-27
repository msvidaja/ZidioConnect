package com.zidio.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentRequest {
    private String name;
    private String email;
    private String course;
    private String university;
    private String major;
    private Double gpa;
    private String resumeUrl;
}