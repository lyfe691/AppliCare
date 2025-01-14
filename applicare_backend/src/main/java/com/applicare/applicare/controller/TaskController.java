// com.applicare.applicare.controller.TaskController.java

package com.applicare.applicare.controller;

import com.applicare.applicare.model.Task;
import com.applicare.applicare.service.TaskService;
import com.applicare.applicare.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 
 * @author Yanis Sebastian Zürcher
 * 
 */

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private JwtUtil jwtUtil;

    private String getUserIdFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return jwtUtil.extractUserId(token);
    }

    @GetMapping
    public ResponseEntity<?> getUserTasks(@RequestHeader("Authorization") String token) {
        try {
            String userId = getUserIdFromToken(token);
            List<Task> tasks = taskService.getUserTasks(userId);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> getUserTasksByStatus(
            @RequestHeader("Authorization") String token,
            @RequestParam boolean completed) {
        try {
            String userId = getUserIdFromToken(token);
            List<Task> tasks = taskService.getUserTasksByStatus(userId, completed);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<?> getApplicationTasks(
            @PathVariable String applicationId,
            @RequestHeader("Authorization") String token) {
        try {
            String userId = getUserIdFromToken(token);
            List<Task> tasks = taskService.getApplicationTasks(applicationId);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createTask(
            @RequestBody Task task,
            @RequestHeader("Authorization") String token) {
        try {
            String userId = getUserIdFromToken(token);
            Task created = taskService.createTask(task, userId);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<?> updateTask(
            @PathVariable String taskId,
            @RequestBody Task task,
            @RequestHeader("Authorization") String token) {
        try {
            String userId = getUserIdFromToken(token);
            Task updated = taskService.updateTask(taskId, task, userId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{taskId}/toggle")
    public ResponseEntity<?> toggleTaskCompletion(
            @PathVariable String taskId,
            @RequestHeader("Authorization") String token) {
        try {
            String userId = getUserIdFromToken(token);
            taskService.toggleTaskCompletion(taskId, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(
            @PathVariable String taskId,
            @RequestHeader("Authorization") String token) {
        try {
            String userId = getUserIdFromToken(token);
            taskService.deleteTask(taskId, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 