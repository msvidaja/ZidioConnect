package com.zidio.repository;

import com.zidio.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJobId(Long jobId);
    
    @Query("SELECT a FROM Application a WHERE a.student.user.email = :studentEmail")
    List<Application> findByStudentEmail(@Param("studentEmail") String studentEmail);
}