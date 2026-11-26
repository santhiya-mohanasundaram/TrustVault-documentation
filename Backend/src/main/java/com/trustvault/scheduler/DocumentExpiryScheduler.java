package com.trustvault.scheduler;

import com.trustvault.service.ExpiryReminderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class DocumentExpiryScheduler {

    private static final Logger logger = LoggerFactory.getLogger(DocumentExpiryScheduler.class);
    private final ExpiryReminderService expiryReminderService;

    public DocumentExpiryScheduler(ExpiryReminderService expiryReminderService) {
        this.expiryReminderService = expiryReminderService;
    }

    /**
     * Daily automatic scan for upcoming and expired personal documents.
     */
    @Scheduled(cron = "${app.scheduler.expiry-cron:0 0 1 * * ?}")
    public void runDailyExpiryAudit() {
        logger.info("Executing scheduled daily document expiry audit...");
        try {
            int count = expiryReminderService.checkDocumentExpiries();
            logger.info("Daily document expiry audit completed successfully. Notifications dispatched: {}", count);
        } catch (Exception ex) {
            logger.error("Error during scheduled document expiry audit", ex);
        }
    }
}
