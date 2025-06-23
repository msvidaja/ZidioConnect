package com.zidio.controller;

import com.zidio.dto.ApplicationRequest;
import com.zidio.dto.JobRequest;
import com.zidio.entity.Application;
import com.zidio.service.ApplicationService;
import com.zidio.service.JobService;
import com.zidio.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final ApplicationService applicationService;
    private final JwtService jwtService;

    public JobController(JobService jobService, ApplicationService applicationService, JwtService jwtService) {
        this.jobService = jobService;
        this.applicationService = applicationService;
        this.jwtService = jwtService;
    }

    @PostMapping("/post")
    public ResponseEntity<JobRequest> postJob(@RequestBody JobRequest request, @RequestHeader("Authorization") String token) {
        String recruiterEmail = jwtService.extractEmail(token.substring(7));
        return ResponseEntity.ok(jobService.postJob(request, recruiterEmail));
    }

    @GetMapping("/recruiter")
    public ResponseEntity<List<JobRequest>> getJobsByRecruiter(@RequestHeader("Authorization") String token) {
        String recruiterEmail = jwtService.extractEmail(token.substring(7));
        return ResponseEntity.ok(jobService.getJobsByRecruiter(recruiterEmail));
    }

    @GetMapping("/all")
    public ResponseEntity<List<JobRequest>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @PostMapping("/apply")
    public ResponseEntity<String> applyForJob(@RequestBody ApplicationRequest request) {
        applicationService.applyForJob(request);
        return ResponseEntity.ok("Application submitted successfully");
    }

    @GetMapping("/applications/{jobId}")
    public ResponseEntity<List<Application>> getApplicationsByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJob(jobId));
    }

    @GetMapping("/applications/student")
    public ResponseEntity<List<Application>> getApplicationsByStudent(@RequestHeader("Authorization") String token) {
        String studentEmail = jwtService.extractEmail(token.substring(7));
        return ResponseEntity.ok(applicationService.getApplicationsByStudent(studentEmail));
    }
}