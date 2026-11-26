package com.trustvault.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    public EmailService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public boolean sendExpiryReminder(String recipientEmail, String recipientName, String documentName, String expiryDate, long daysLeft) {
        String subject = "[TrustVault] Action Required: Document Expiry Reminder - " + documentName;
        String body = String.format(
                "Hello %s,\n\n" +
                "This is an automated security reminder from TrustVault.\n\n" +
                "Your document '%s' is scheduled to expire in %d days (Date: %s).\n\n" +
                "Please review or renew your document to ensure your records remain up-to-date and compliant.\n\n" +
                "Access your vault securely at: http://localhost:5173/user/documents\n\n" +
                "Best regards,\nTrustVault Security Team",
                recipientName, documentName, daysLeft, expiryDate
        );

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(recipientEmail);
                message.setSubject(subject);
                message.setText(body);
                message.setFrom("notifications@trustvault.io");
                mailSender.send(message);
                logger.info("Sent expiry reminder email to {}", recipientEmail);
                return true;
            } catch (Exception ex) {
                logger.warn("Could not dispatch email via SMTP (using simulated delivery): {}", ex.getMessage());
            }
        } else {
            logger.info("[Simulated Email Delivery] To: {} | Subject: {}", recipientEmail, subject);
        }
        return true;
    }
}
