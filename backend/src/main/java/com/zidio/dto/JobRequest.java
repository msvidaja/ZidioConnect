package com.zidio.dto;

import java.time.LocalDateTime;

public record JobRequest(
        String title,
        String description,
        String jobType,
        String location,
        LocalDateTime datePosted
) {}