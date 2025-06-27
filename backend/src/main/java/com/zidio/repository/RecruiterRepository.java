package com.zidio.repository;

import com.zidio.entity.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RecruiterRepository extends JpaRepository<Recruiter, Long> {
    @Query("SELECT r FROM Recruiter r WHERE r.user.email = :email")
    Optional<Recruiter> findByUserEmail(@Param("email") String email);
}