// com/applicare/applicare/service/AuthService.java

package com.applicare.applicare.service;

import com.applicare.applicare.model.User;
import com.applicare.applicare.repository.UserRepository;
import com.applicare.applicare.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
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

    public String login(String username, String password) {
        Optional<User> opt = userRepository.findByUsername(username);
        if (opt.isEmpty()) throw new RuntimeException("Invalid username or password");

        User user = opt.get();
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid username or password");
        }
        return jwtUtil.generateToken(username);
    }

    public String register(String username, String email, String password) {
        // check if username/email exist, etc
        User user = new User(username, email, password);
        userRepository.save(user);
        return "User registered successfully";
    }

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

        return "An email with a reset link has been sent to " + email;
    }

    public String resetPassword(String token, String newPassword) {
        Optional<User> opt = userRepository.findByPasswordResetToken(token);
        if (opt.isEmpty()) {
            throw new RuntimeException("Invalid or expired reset token");
        }

        User user = opt.get();
        user.setPassword(newPassword);
        user.setPasswordResetToken(null);
        userRepository.save(user);

        return "Password reset successfully";
    }
}
