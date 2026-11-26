package com.trustvault.service;

import com.trustvault.entity.Document;
import com.trustvault.entity.User;
import com.trustvault.repository.DocumentRepository;
import com.trustvault.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ExpiryReminderService {

    private static final Logger logger = LoggerFactory.getLogger(ExpiryReminderService.class);

    private final DocumentRepository documentRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;
    private final ActivityLogService activityLogService;

    public ExpiryReminderService(DocumentRepository documentRepository,
                                 NotificationRepository notificationRepository,
                                 NotificationService notificationService,
                                 EmailService emailService,
                                 ActivityLogService activityLogService) {
        this.documentRepository = documentRepository;
        this.notificationRepository = notificationRepository;
        this.notificationService = notificationService;
        this.emailService = emailService;
        this.activityLogService = activityLogService;
    }

    @Transactional
    public int checkDocumentExpiries() {
        LocalDate today = LocalDate.now();
        List<Document> documents = documentRepository.findUnexpiredWithExpiryDate();
        int remindersSent = 0;

        for (Document doc : documents) {
            LocalDate expiry = doc.getExpiryDate();
            if (expiry == null) continue;

            long daysUntilExpiry = ChronoUnit.DAYS.between(today, expiry);
            User user = doc.getUser();

            if (daysUntilExpiry < 0) {
                // Expired
                doc.setStatus("Expired");
                documentRepository.save(doc);

                boolean alreadyNotified = notificationRepository.existsByUserIdAndDocumentIdAndNotificationTypeAndScheduledDate(
                        user.getId(), doc.getId(), "EXPIRY_EXPIRED", today
                );

                if (!alreadyNotified) {
                    notificationService.createNotification(
                            user.getId(), doc.getId(), "EXPIRY_EXPIRED",
                            "Document Expired: " + doc.getDocumentName(),
                            "Your document '" + doc.getDocumentName() + "' expired on " + expiry + ". Please update or renew your record."
                    );
                    remindersSent++;
                }
            } else if (daysUntilExpiry <= 30) {
                // Expiring Soon (30, 15, 7, 1 day, or 0 on expiry date)
                if (!"Expiring Soon".equalsIgnoreCase(doc.getStatus())) {
                    doc.setStatus("Expiring Soon");
                    documentRepository.save(doc);
                }

                // Reminder threshold check
                if (daysUntilExpiry == 30 || daysUntilExpiry == 15 || daysUntilExpiry == 7 || daysUntilExpiry == 1 || daysUntilExpiry == 0) {
                    String notifType = "EXPIRY_WARNING_" + daysUntilExpiry;
                    boolean alreadyNotified = notificationRepository.existsByUserIdAndDocumentIdAndNotificationTypeAndScheduledDate(
                            user.getId(), doc.getId(), notifType, today
                    );

                    if (!alreadyNotified) {
                        String warningMsg = daysUntilExpiry == 0 ?
                                "Expires Today! Please renew immediately." :
                                "Expires in " + daysUntilExpiry + " days (" + expiry + ").";

                        notificationService.createNotification(
                                user.getId(), doc.getId(), notifType,
                                "Expiry Reminder: " + doc.getDocumentName(),
                                "Your " + doc.getCategory().getCategoryName() + " '" + doc.getDocumentName() + "' " + warningMsg
                        );

                        // Send Email if user has email notifications enabled
                        if (Boolean.TRUE.equals(user.getEmailNotifications())) {
                            emailService.sendExpiryReminder(
                                    user.getEmail(), user.getFullName(), doc.getDocumentName(), expiry.toString(), daysUntilExpiry
                            );
                        }

                        activityLogService.logActivity(user.getId(), "Expiry Reminder", doc.getId(), doc.getDocumentName(),
                                doc.getCategory().getCategoryName(), "Proactive reminder dispatched: " + warningMsg, "127.0.0.1", "Warning");

                        remindersSent++;
                    }
                }
            }
        }

        logger.info("Expiry reminder scan finished. {} reminders processed.", remindersSent);
        return remindersSent;
    }
}
