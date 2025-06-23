package com.zidio.dto;

public record RecruiterRequest(
        String companyName,
        String recruiterName,
        String recruiterEmail,
        String designation
) {}