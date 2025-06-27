package com.zidio.service;

import com.zidio.dto.JobRequest;
import com.zidio.entity.Job;
import com.zidio.entity.Recruiter;
import com.zidio.repository.JobRepository;
import com.zidio.repository.RecruiterRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final RecruiterRepository recruiterRepository;

    public JobService(JobRepository jobRepository, RecruiterRepository recruiterRepository) {
        this.jobRepository = jobRepository;
        this.recruiterRepository = recruiterRepository;
    }

    public JobRequest postJob(JobRequest request, String recruiterEmail) {
        Recruiter recruiter = recruiterRepository.findByUserEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        
        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setJobType(request.getJobType());
        job.setLocation(request.getLocation());
        job.setDatePosted(LocalDate.now());
        job.setRecruiter(recruiter);
        
        Job saved = jobRepository.save(job);
        return convertToDto(saved);
    }

    public List<JobRequest> getJobsByRecruiter(String recruiterEmail) {
        return jobRepository.findByRecruiterEmail(recruiterEmail).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<JobRequest> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public JobRequest updateJob(Long jobId, JobRequest request, String recruiterEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        // Verify the job belongs to the recruiter
        if (!job.getRecruiter().getUser().getEmail().equals(recruiterEmail)) {
            throw new RuntimeException("Unauthorized to update this job");
        }
        
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setJobType(request.getJobType());
        job.setLocation(request.getLocation());
        
        Job saved = jobRepository.save(job);
        return convertToDto(saved);
    }

    public void deleteJob(Long jobId, String recruiterEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        // Verify the job belongs to the recruiter
        if (!job.getRecruiter().getUser().getEmail().equals(recruiterEmail)) {
            throw new RuntimeException("Unauthorized to delete this job");
        }
        
        jobRepository.delete(job);
    }

    public List<JobRequest> searchJobs(String query) {
        String searchQuery = "%" + query.toLowerCase() + "%";
        return jobRepository.searchJobs(searchQuery).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private JobRequest convertToDto(Job job) {
        JobRequest dto = new JobRequest();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setJobType(job.getJobType());
        dto.setLocation(job.getLocation());
        dto.setDatePosted(job.getDatePosted());
        return dto;
    }
}