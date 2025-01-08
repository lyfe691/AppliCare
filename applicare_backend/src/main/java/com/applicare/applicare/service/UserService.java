package com.applicare.applicare.service;

import com.applicare.applicare.model.User;
import com.applicare.applicare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

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

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Validate and set new password
        authService.validatePassword(newPassword);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void deleteAccount(String userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        userRepository.delete(user);
    }
} 