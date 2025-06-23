package com.zidio.service;

import com.zidio.dto.ApplicationRequest;
import com.zidio.entity.Application;
import com.zidio.entity.ApplicationStatus;
import com.zidio.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public Application applyForJob(ApplicationRequest request) {
        Application application = new Application();
        application.setStudent(request.getStudent());
        application.setJob(request.getJob());
        application.setApplicationDate(java.time.LocalDateTime.now());
        application.setStatus(ApplicationStatus.PENDING);
        application.setCoverLetter(request.getCoverLetter());
        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    public List<Application> getApplicationsByStudent(String studentEmail) {
        return applicationRepository.findByStudent_Email(studentEmail);
    }
}