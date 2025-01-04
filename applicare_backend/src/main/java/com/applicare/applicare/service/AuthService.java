// com/applicare/applicare/service/AuthService.java

package com.applicare.applicare.service;

import com.applicare.applicare.model.User;
import com.applicare.applicare.repository.UserRepository;
import com.applicare.applicare.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MailService mailService;

    // LOGIN
    public Map<String, String> login(String usernameOrEmail, String rawPassword) {
        // find user by username or email
        Optional<User> opt = userRepository.findByUsername(usernameOrEmail);
        if (opt.isEmpty()) {
            opt = userRepository.findByEmail(usernameOrEmail);
        }
        if (opt.isEmpty()) {
            throw new RuntimeException("Invalid username/email or password");
        }

        User user = opt.get();

        // validate pwd
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Invalid username/email or password");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getId());

        Map<String, String> response = new HashMap<>();
        response.put("token", token); 
        response.put("username", user.getUsername()); 
        response.put("email", user.getEmail()); 

        return response; 
    }

    // REGISTER
    public String register(String username, String email, String rawPassword) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already in use");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        String hashed = passwordEncoder.encode(rawPassword);
        User newUser = new User(username, email, hashed);

        try {
            userRepository.save(newUser);
        } catch (DuplicateKeyException ex) {
            throw new RuntimeException(
                "Username or Email is already in use. Please choose a different one."
            );
        }

        return "User registered successfully";
    }

    // FORGOT PASSWORD
    public String forgotPassword(String email) {
        Optional<User> opt = userRepository.findByEmail(email);
        if (opt.isEmpty()) {
            throw new RuntimeException("No user found with that email");
        }

        User user = opt.get();
        String token = UUID.randomUUID().toString();
        user.setPasswordResetToken(token);
        userRepository.save(user);

        // send reset email
        mailService.sendResetLink(email, token);

        return "A reset link has been emailed to " + email;
    }

    // RESET PASSWORD
    public String resetPassword(String token, String rawPassword) {
        Optional<User> opt = userRepository.findByPasswordResetToken(token);
        if (opt.isEmpty()) {
            throw new RuntimeException("Invalid or expired reset token");
        }

        User user = opt.get();
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setPasswordResetToken(null);
        userRepository.save(user);

        return "Password reset successfully";
    }
}
