package com.zidio.service;

import com.zidio.dto.RecruiterRequest;
import com.zidio.entity.Recruiter;
import com.zidio.repository.RecruiterRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecruiterService {

    private final RecruiterRepository recruiterRepository;

    public RecruiterService(RecruiterRepository recruiterRepository) {
        this.recruiterRepository = recruiterRepository;
    }

    public RecruiterRequest saveRecruiter(RecruiterRequest request) {
        Recruiter recruiter = new Recruiter();
        recruiter.setCompanyName(request.companyName());
        recruiter.setRecruiterName(request.recruiterName());
        recruiter.setRecruiterEmail(request.recruiterEmail());
        recruiter.setDesignation(request.designation());
        Recruiter saved = recruiterRepository.save(recruiter);
        return new RecruiterRequest(saved.getCompanyName(), saved.getRecruiterName(), saved.getRecruiterEmail(), saved.getDesignation());
    }

    public List<RecruiterRequest> getAllRecruiters() {
        return recruiterRepository.findAll().stream()
                .map(r -> new RecruiterRequest(r.getCompanyName(), r.getRecruiterName(), r.getRecruiterEmail(), r.getDesignation()))
                .toList();
    }

    public RecruiterRequest getByRecruiterEmail(String recruiterEmail) {
        Recruiter recruiter = recruiterRepository.findByRecruiterEmail(recruiterEmail);
        if (recruiter == null) throw new RuntimeException("Recruiter not found");
        return new RecruiterRequest(recruiter.getCompanyName(), recruiter.getRecruiterName(), recruiter.getRecruiterEmail(), recruiter.getDesignation());
    }
}