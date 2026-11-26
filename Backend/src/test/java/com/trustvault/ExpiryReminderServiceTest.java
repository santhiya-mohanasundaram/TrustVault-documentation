package com.trustvault;

import com.trustvault.entity.Category;
import com.trustvault.entity.Document;
import com.trustvault.entity.User;
import com.trustvault.repository.CategoryRepository;
import com.trustvault.repository.DocumentRepository;
import com.trustvault.repository.NotificationRepository;
import com.trustvault.repository.UserRepository;
import com.trustvault.service.ExpiryReminderService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class ExpiryReminderServiceTest {

    @Autowired
    private ExpiryReminderService expiryReminderService;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Test
    @DisplayName("Expiry Scheduler - Detects 15-day upcoming expiry and updates status")
    void testExpiryScanWorkflow() {
        User arun = userRepository.findByEmailIgnoreCase("arun@trustvault.io").orElseThrow();
        Category insurance = categoryRepository.findByCategoryNameIgnoreCase("Insurance Documents").orElseThrow();

        // Create document expiring in 15 days
        Document doc = new Document();
        doc.setUser(arun);
        doc.setCategory(insurance);
        doc.setDocumentName("Comprehensive Auto Insurance");
        doc.setFileName("auto_insurance.pdf");
        doc.setFileType("application/pdf");
        doc.setFileSize(54000L);
        doc.setStoragePath("mock_insurance.pdf");
        doc.setIssueDate(LocalDate.now().minusYears(1));
        doc.setExpiryDate(LocalDate.now().plusDays(15));
        doc.setStatus("Active");
        Document saved = documentRepository.save(doc);

        // Run automated expiry audit
        int reminders = expiryReminderService.checkDocumentExpiries();
        assertTrue(reminders >= 1, "Should have processed at least 1 expiry reminder");

        // Verify document status updated to Expiring Soon
        Document reloaded = documentRepository.findById(saved.getId()).orElseThrow();
        assertEquals("Expiring Soon", reloaded.getStatus());

        // Verify notification was created for Arun
        assertTrue(notificationRepository.countByUserIdAndReadStatusFalse(arun.getId()) > 0);
    }
}
