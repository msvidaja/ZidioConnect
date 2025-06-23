package com.zidio.dto;

import com.zidio.entity.Job;
import com.zidio.entity.Student;

public record ApplicationRequest(
        Student student,
        Job job,
        String coverLetter
) {}