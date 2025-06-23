package com.zidio.service;

import com.zidio.dto.JobRequest;
import com.zidio.entity.Job;
import com.zidio.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public JobRequest postJob(JobRequest request, String recruiterEmail) {
        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setJobType(request.getJobType());
        job.setLocation(request.getLocation());
        job.setDatePosted(request.getDatePosted()); // Use LocalDate
        job.setRecruiterEmail(recruiterEmail);
        Job saved = jobRepository.save(job);
        return new JobRequest(saved.getTitle(), saved.getDescription(), saved.getJobType(), saved.getLocation(), saved.getDatePosted());
    }

    public List<JobRequest> getJobsByRecruiter(String recruiterEmail) {
        return jobRepository.findByRecruiterEmail(recruiterEmail).stream()
                .map(job -> new JobRequest(job.getTitle(), job.getDescription(), job.getJobType(), job.getLocation(), job.getDatePosted()))
                .collect(Collectors.toList());
    }

    public List<JobRequest> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(job -> new JobRequest(job.getTitle(), job.getDescription(), job.getJobType(), job.getLocation(), job.getDatePosted()))
                .collect(Collectors.toList());
    }
}