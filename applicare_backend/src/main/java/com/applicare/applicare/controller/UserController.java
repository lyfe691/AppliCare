package com.applicare.applicare.controller;

import com.applicare.applicare.model.User;
import com.applicare.applicare.service.UserService;
import com.applicare.applicare.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private String extractUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUserId(token);
        }
        throw new RuntimeException("Invalid or missing token");
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            HttpServletRequest request,
            @RequestParam String username,
            @RequestParam String email
    ) {
        try {
            String userId = extractUserId(request);
            User updatedUser = userService.updateProfile(userId, username, email);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(
            HttpServletRequest request,
            @RequestParam String currentPassword,
            @RequestParam String newPassword
    ) {
        try {
            String userId = extractUserId(request);
            userService.updatePassword(userId, currentPassword, newPassword);
            return ResponseEntity.ok("Password updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/account")
    public ResponseEntity<?> deleteAccount(HttpServletRequest request) {
        try {
            String userId = extractUserId(request);
            userService.deleteAccount(userId);
            return ResponseEntity.ok("Account deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 