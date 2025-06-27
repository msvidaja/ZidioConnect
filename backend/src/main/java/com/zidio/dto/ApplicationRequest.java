package com.zidio.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationRequest {
    private Long student; // or StudentRequest student if you want nested
    private Long job;     // or JobRequest job if you want nested
    private String coverLetter;
}