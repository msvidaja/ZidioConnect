package com.zidio.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "recruiters")
public class Recruiter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String companyName;
    private String designation;

    @OneToMany(mappedBy = "recruiter", cascade = CascadeType.ALL)
    private List<Job> postedJobs = new ArrayList<>();

    // Helper methods to access user data
    public String getRecruiterName() {
        return user != null ? user.getName() : null;
    }

    public String getRecruiterEmail() {
        return user != null ? user.getEmail() : null;
    }
}