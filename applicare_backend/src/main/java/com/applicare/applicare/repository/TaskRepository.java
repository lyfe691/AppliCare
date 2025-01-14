// com.applicare.applicare.repository.TaskRepository.java

package com.applicare.applicare.repository;

import com.applicare.applicare.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 
 * @author Yanis Sebastian Zürcher
 * 
 */

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByUserIdOrderByDeadlineAsc(String userId);
    List<Task> findByUserIdAndCompletedOrderByDeadlineAsc(String userId, boolean completed);
    List<Task> findByApplicationIdOrderByDeadlineAsc(String applicationId);
    void deleteByUserId(String userId);
}