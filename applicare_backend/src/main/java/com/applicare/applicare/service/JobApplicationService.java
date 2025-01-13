// com/applicare/applicare/service/JobApplicationService.java

package com.applicare.applicare.service;

import com.applicare.applicare.model.JobApplication;
import com.applicare.applicare.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobApplicationService {
    
    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    public JobApplication createApplication(JobApplication application, String userId) {
        application.setUserId(userId);
        application.setAppliedDate(LocalDateTime.now());
        application.setLastUpdated(LocalDateTime.now());
        return jobApplicationRepository.save(application);
    }

    public JobApplication updateApplication(String id, JobApplication application, String userId) {
        JobApplication existingApp = jobApplicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found"));
        
        if (!existingApp.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to update this application");
        }

        application.setId(existingApp.getId());
        application.setUserId(userId);
        application.setAppliedDate(existingApp.getAppliedDate());
        application.setLastUpdated(LocalDateTime.now());
        
        return jobApplicationRepository.save(application);
    }

    public void deleteApplication(String id, String userId) {
        JobApplication application = jobApplicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found"));
        
        if (!application.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this application");
        }

        jobApplicationRepository.deleteById(id);
    }

    public JobApplication getApplication(String id, String userId) {
        JobApplication application = jobApplicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found"));
        
        if (!application.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to view this application");
        }

        return application;
    }

    public List<JobApplication> getAllApplications(String userId) {
        return jobApplicationRepository.findByUserId(userId);
    }

    public List<JobApplication> getApplicationsByStatus(String userId, String status) {
        return jobApplicationRepository.findByUserIdAndStatus(userId, status);
    }

    public JobApplication updateStatus(String id, String status, String userId) {
        JobApplication application = jobApplicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found"));
        
        if (!application.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to update this application");
        }

        application.setStatus(status);
        application.setLastUpdated(LocalDateTime.now());
        return jobApplicationRepository.save(application);
    }
} 