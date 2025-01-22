// com/applicare/applicare/service/MailService.java

package com.applicare.applicare.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * 
 * @author Yanis Sebastian Zürcher
 * 
 */

 // TODO: use the more advanced mail thing instad of SimpleMailMessage
@Service
public class MailService {

    private final JavaMailSender mailSender;

    // declared in application properties
    @Value("${app.reset-password-url}")
    private String resetPasswordUrl;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendResetLink(String toEmail, String token) {
        String link = resetPasswordUrl + "?token=" + token;
    
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("AppliCare - Password Reset");
        message.setText("Click the link below to reset your password:\n" + link);
    
        mailSender.send(message);
    }   
     
}
