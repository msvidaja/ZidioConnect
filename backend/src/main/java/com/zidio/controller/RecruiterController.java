package com.zidio.controller;

import com.zidio.dto.RecruiterRequest;
import com.zidio.service.RecruiterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiters")
public class RecruiterController {

    private final RecruiterService recruiterService;

    public RecruiterController(RecruiterService recruiterService) {
        this.recruiterService = recruiterService;
    }

    @PostMapping("/profile")
    public ResponseEntity<RecruiterRequest> register(@RequestBody RecruiterRequest request) {
        return ResponseEntity.ok(recruiterService.saveRecruiter(request));
    }

    @GetMapping("/all")
    public ResponseEntity<List<RecruiterRequest>> getAll() {
        return ResponseEntity.ok(recruiterService.getAllRecruiters());
    }

    @GetMapping("/{recruiterEmail}")
    public ResponseEntity<RecruiterRequest> getByRecruiterEmail(@PathVariable String recruiterEmail) {
        return ResponseEntity.ok(recruiterService.getByRecruiterEmail(recruiterEmail));
    }
}