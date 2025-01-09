package com.applicare.applicare.service;

import com.applicare.applicare.model.User;
import com.applicare.applicare.repository.UserRepository;
import com.applicare.applicare.repository.JobApplicationRepository;
import com.applicare.applicare.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthService authService;

    public User updateProfile(String userId, String username, String email) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // only val if the values are different
        if (!user.getUsername().equals(username)) {
            authService.validateUsername(username);
            if (userRepository.findByUsername(username).isPresent()) {
                throw new RuntimeException("Username already in use");
            }
            user.setUsername(username);
        }

        if (!user.getEmail().equals(email)) {
            authService.validateEmail(email);
            if (userRepository.findByEmail(email).isPresent()) {
                throw new RuntimeException("Email already in use");
            }
            user.setEmail(email);
        }

        return userRepository.save(user);
    }

    public void updatePassword(String userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // validate and set new password
        authService.validatePassword(newPassword);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // WHEN DELETING THE ACCOUNT, DELETE ALL ASSOCIATED DATA. NEEDS TO BE UPDATED WHEN CREATING NEW FEATURES.
    @Transactional
    public void deleteAccount(String userId) {
        // verify if the user exists
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // delete all tasks for the user
        taskRepository.deleteByUserId(userId);  
        // delete all job applications for the user 
        jobApplicationRepository.deleteByUserId(userId);
        // delete the user at last
        userRepository.delete(user);
    }
} 