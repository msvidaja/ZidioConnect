package com.zidio.repository;

import com.zidio.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    @Query("SELECT j FROM Job j WHERE j.recruiter.user.email = :recruiterEmail")
    List<Job> findByRecruiterEmail(@Param("recruiterEmail") String recruiterEmail);
    
    @Query("SELECT j FROM Job j WHERE LOWER(j.title) LIKE LOWER(:query) OR LOWER(j.description) LIKE LOWER(:query) OR LOWER(j.location) LIKE LOWER(:query)")
    List<Job> searchJobs(@Param("query") String query);
}