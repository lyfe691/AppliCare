package com.applicare.applicare.controller;

import com.applicare.applicare.model.User;
import com.applicare.applicare.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); // for password encoding eg. hashing. https://www.baeldung.com/spring-security-registration-password-encoding-bcrypt

    // register endpoint | signup in the fronend.
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists.");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists.");
        }

        // hash the password before saving (really really important.)
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Registration successful! You can now log in.");
    }

    // login endpoint
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user, HttpSession session) {
        User existingUser = userRepository.findByUsername(user.getUsername()).orElse(null);

        if (existingUser != null && passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            session.setAttribute("username", user.getUsername());
            return ResponseEntity.ok("Login successful!");
        }

        return ResponseEntity.badRequest().body("Invalid credentials. Please check your username and password.");
    }

    // status endpoint to check authentication
    @GetMapping("/status")
    public ResponseEntity<String> status(HttpSession session) {
        String username = (String) session.getAttribute("username");
        if (username != null) {
            return ResponseEntity.ok("Logged in as " + username);
        }
        return ResponseEntity.status(401).body("Not authenticated");
    }
}
