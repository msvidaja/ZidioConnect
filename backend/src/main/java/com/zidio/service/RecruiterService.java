package com.zidio.service;

import com.zidio.dto.RecruiterRequest;
import com.zidio.entity.Recruiter;
import com.zidio.entity.User;
import com.zidio.repository.RecruiterRepository;
import com.zidio.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecruiterService {

    private final RecruiterRepository recruiterRepository;
    private final UserRepository userRepository;

    public RecruiterService(RecruiterRepository recruiterRepository, UserRepository userRepository) {
        this.recruiterRepository = recruiterRepository;
        this.userRepository = userRepository;
    }

    public RecruiterRequest saveRecruiter(RecruiterRequest request) {
        User user = userRepository.findByEmail(request.recruiterEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Recruiter recruiter = recruiterRepository.findByUserEmail(request.recruiterEmail())
                .orElse(new Recruiter());
        
        recruiter.setUser(user);
        recruiter.setCompanyName(request.companyName());
        recruiter.setDesignation(request.designation());
        
        Recruiter saved = recruiterRepository.save(recruiter);
        return convertToDto(saved);
    }

    public List<RecruiterRequest> getAllRecruiters() {
        return recruiterRepository.findAll().stream()
                .map(this::convertToDto)
                .toList();
    }

    public RecruiterRequest getByRecruiterEmail(String recruiterEmail) {
        Recruiter recruiter = recruiterRepository.findByUserEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        return convertToDto(recruiter);
    }

    private RecruiterRequest convertToDto(Recruiter recruiter) {
        return new RecruiterRequest(
                recruiter.getCompanyName(),
                recruiter.getRecruiterName(),
                recruiter.getRecruiterEmail(),
                recruiter.getDesignation()
        );
    }
}