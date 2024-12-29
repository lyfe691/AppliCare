package com.applicare.applicare.controller;

import com.applicare.applicare.model.JobApplication;
import com.applicare.applicare.service.JobApplicationService;
import com.applicare.applicare.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    @Autowired
    private JwtUtil jwtUtil;

    private String getUserIdFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return jwtUtil.extractUserId(token);
    }

    @PostMapping
    public ResponseEntity<?> createApplication(
            @RequestBody JobApplication application,
            @RequestHeader("Authorization") String token) {
        try {
            String userId = getUserIdFromToken(token);
            JobApplication created = jobApplicationService.createApplication(application, userId);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateApplication(
            @PathVariable String id,
            @RequestBody JobApplication application,
            @RequestHeader("Authorization") String token) {
        try {
            String userId = getUserIdFromToken(token);
            JobApplication updated = jobApplicationService.updateApplication(id, application, userId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplication(
            @PathVariable String id,
            @RequestHeader("Authorization") String token) {
        try {
            String userId = getUserIdFromToken(token);
            jobApplicationService.deleteApplication(id, userId);
            return ResponseEntity.ok("Application deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplication(
            @PathVariable String id,
            @RequestHeader("Authorization") String token) {
        try {
            String userId = getUserIdFromToken(token);
            JobApplication application = jobApplicationService.getApplication(id, userId);
            return ResponseEntity.ok(application);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllApplications(
            @RequestHeader("Authorization") String token) {
        try {
            String userId = getUserIdFromToken(token);
            List<JobApplication> applications = jobApplicationService.getAllApplications(userId);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getApplicationsByStatus(
            @PathVariable String status,
            @RequestHeader("Authorization") String token) {
        try {
            String userId = getUserIdFromToken(token);
            List<JobApplication> applications = jobApplicationService.getApplicationsByStatus(userId, status);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @RequestParam String status,
            @RequestHeader("Authorization") String token) {
        try {
            String userId = getUserIdFromToken(token);
            JobApplication updated = jobApplicationService.updateStatus(id, status, userId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 