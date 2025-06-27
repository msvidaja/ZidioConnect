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
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173")
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

    @PutMapping("/{jobId}")
    public ResponseEntity<JobRequest> updateJob(@PathVariable Long jobId, @RequestBody JobRequest request, @RequestHeader("Authorization") String token) {
        String recruiterEmail = jwtService.extractEmail(token.substring(7));
        return ResponseEntity.ok(jobService.updateJob(jobId, request, recruiterEmail));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Map<String, String>> deleteJob(@PathVariable Long jobId, @RequestHeader("Authorization") String token) {
        String recruiterEmail = jwtService.extractEmail(token.substring(7));
        jobService.deleteJob(jobId, recruiterEmail);
        return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
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

    @PutMapping("/applications/{applicationId}/status")
    public ResponseEntity<Map<String, String>> updateApplicationStatus(
            @PathVariable Long applicationId, 
            @RequestBody Map<String, String> statusUpdate,
            @RequestHeader("Authorization") String token) {
        String recruiterEmail = jwtService.extractEmail(token.substring(7));
        String status = statusUpdate.get("status");
        applicationService.updateApplicationStatus(applicationId, status, recruiterEmail);
        return ResponseEntity.ok(Map.of("message", "Application status updated successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<List<JobRequest>> searchJobs(@RequestParam String query) {
        return ResponseEntity.ok(jobService.searchJobs(query));
    }
}