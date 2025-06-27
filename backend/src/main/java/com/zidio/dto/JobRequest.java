package com.zidio.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class JobRequest {
    private Long id;
    private String title;
    private String description;
    private String jobType;
    private String location;
    private LocalDate datePosted;
}