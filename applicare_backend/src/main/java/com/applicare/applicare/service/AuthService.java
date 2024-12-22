// com/applicare/applicare/service/AuthService.java

package com.applicare.applicare.service;

import com.applicare.applicare.model.User;
import com.applicare.applicare.repository.UserRepository;
import com.applicare.applicare.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
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
        // compare hashed
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        // generate JWT
        return jwtUtil.generateToken(username);
    }
    
    // REGISTER
    public String register(String username, String email, String rawPassword) {
        String hashed = passwordEncoder.encode(rawPassword);

        User newUser = new User(username, email, hashed);
        userRepository.save(newUser);
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
