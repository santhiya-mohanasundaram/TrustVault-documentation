package com.trustvault.controller;

import com.trustvault.dto.ApiResponse;
import com.trustvault.service.ExpiryReminderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/scheduler")
public class SchedulerController {

    private final ExpiryReminderService expiryReminderService;

    public SchedulerController(ExpiryReminderService expiryReminderService) {
        this.expiryReminderService = expiryReminderService;
    }

    @PostMapping("/check-expiry")
    public ResponseEntity<ApiResponse<Map<String, Object>>> triggerExpiryAudit() {
        int count = expiryReminderService.checkDocumentExpiries();
        return ResponseEntity.ok(ApiResponse.ok(
                "Document expiry audit completed successfully",
                Map.of("processedReminders", count, "status", "SUCCESS")
        ));
    }
}
