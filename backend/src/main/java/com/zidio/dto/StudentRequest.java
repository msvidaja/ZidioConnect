package com.zidio.dto;

public record StudentRequest(
        String name,
        String email,
        String university,
        String major,
        Double gpa,
        String resumeUrl
) {}