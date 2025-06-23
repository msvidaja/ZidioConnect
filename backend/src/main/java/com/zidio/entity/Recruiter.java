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

    private String companyName;
    private String recruiterName;
    private String recruiterEmail;
    private String designation;

    @OneToMany(mappedBy = "recruiter", cascade = CascadeType.ALL)
    private List<Job> postedJobs = new ArrayList<>();
}