package com.zidio.service;

import com.zidio.dto.ApplicationRequest;
import com.zidio.entity.Application;
import com.zidio.entity.ApplicationStatus;
import com.zidio.entity.Job;
import com.zidio.entity.Student;
import com.zidio.repository.ApplicationRepository;
import com.zidio.repository.JobRepository;
import com.zidio.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final StudentRepository studentRepository;

    public ApplicationService(ApplicationRepository applicationRepository, 
                            JobRepository jobRepository, 
                            StudentRepository studentRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.studentRepository = studentRepository;
    }

    public Application applyForJob(ApplicationRequest request) {
        Student student = studentRepository.findById(request.getStudent())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        Job job = jobRepository.findById(request.getJob())
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        Application application = new Application();
        application.setStudent(student);
        application.setJob(job);
        application.setApplicationDate(java.time.LocalDateTime.now());
        application.setStatus(ApplicationStatus.PENDING);
        application.setCoverLetter(request.getCoverLetter());
        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    public List<Application> getApplicationsByStudent(String studentEmail) {
        return applicationRepository.findByStudentEmail(studentEmail);
    }

    public void updateApplicationStatus(Long applicationId, String status, String recruiterEmail) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        // Verify the application belongs to a job posted by the recruiter
        if (!application.getJob().getRecruiter().getUser().getEmail().equals(recruiterEmail)) {
            throw new RuntimeException("Unauthorized to update this application");
        }
        
        // Convert string status to enum
        ApplicationStatus applicationStatus;
        try {
            applicationStatus = ApplicationStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
        
        application.setStatus(applicationStatus);
        applicationRepository.save(application);
    }
}