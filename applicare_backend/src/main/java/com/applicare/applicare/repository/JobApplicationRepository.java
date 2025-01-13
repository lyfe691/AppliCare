// com.applicare.applicare.repository.JobApplicationRepository.java

package com.applicare.applicare.repository;

import com.applicare.applicare.model.JobApplication;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface JobApplicationRepository extends MongoRepository<JobApplication, String> {
    List<JobApplication> findByUserId(String userId);
    List<JobApplication> findByUserIdAndStatus(String userId, String status);
    void deleteByUserId(String userId);
} 