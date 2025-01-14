// com.applicare.applicare.service.TaskService.java

package com.applicare.applicare.service;

import com.applicare.applicare.model.Task;
import com.applicare.applicare.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 
 * @author Yanis Sebastian Zürcher
 * 
 */

@Service
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getUserTasks(String userId) {
        return taskRepository.findByUserIdOrderByDeadlineAsc(userId);
    }

    public List<Task> getUserTasksByStatus(String userId, boolean completed) {
        return taskRepository.findByUserIdAndCompletedOrderByDeadlineAsc(userId, completed);
    }

    public List<Task> getApplicationTasks(String applicationId) {
        return taskRepository.findByApplicationIdOrderByDeadlineAsc(applicationId);
    }

    public Task createTask(Task task, String userId) {
        task.setUserId(userId);
        task.onCreate();
        return taskRepository.save(task);
    }

    public Task updateTask(String taskId, Task taskDetails, String userId) {
        Optional<Task> existingTask = taskRepository.findById(taskId);
        
        if (existingTask.isEmpty() || !existingTask.get().getUserId().equals(userId)) {
            throw new RuntimeException("Task not found or unauthorized");
        }

        Task task = existingTask.get();
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setDeadline(taskDetails.getDeadline());
        task.setPriority(taskDetails.getPriority());
        task.setApplicationId(taskDetails.getApplicationId());

        return taskRepository.save(task);
    }

    public void toggleTaskCompletion(String taskId, String userId) {
        Optional<Task> task = taskRepository.findById(taskId);
        
        if (task.isEmpty() || !task.get().getUserId().equals(userId)) {
            throw new RuntimeException("Task not found or unauthorized");
        }

        Task existingTask = task.get();
        existingTask.setCompleted(!existingTask.isCompleted());
        taskRepository.save(existingTask);
    }

    public void deleteTask(String taskId, String userId) {
        Optional<Task> task = taskRepository.findById(taskId);
        
        if (task.isEmpty() || !task.get().getUserId().equals(userId)) {
            throw new RuntimeException("Task not found or unauthorized");
        }

        taskRepository.deleteById(taskId);
    }
} 