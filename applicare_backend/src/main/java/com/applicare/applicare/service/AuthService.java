// com/applicare/applicare/service/AuthService.java

package com.applicare.applicare.service;

import com.applicare.applicare.model.User;
import com.applicare.applicare.repository.UserRepository;
import com.applicare.applicare.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private MailService mailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // LOGIN
    public String login(String username, String rawPassword) {
        Optional<User> opt = userRepository.findByUsername(username);
        if (opt.isEmpty()) {
            throw new RuntimeException("Invalid username or password");
        }

        User user = opt.get();
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        return jwtUtil.generateToken(username, user.getId());
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
