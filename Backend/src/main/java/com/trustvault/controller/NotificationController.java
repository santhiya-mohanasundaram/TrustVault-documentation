package com.trustvault.controller;

import com.trustvault.dto.ApiResponse;
import com.trustvault.dto.NotificationDto;
import com.trustvault.security.SecurityUtils;
import com.trustvault.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getUserNotifications() {
        Long userId = SecurityUtils.getCurrentUserId();
        List<NotificationDto> list = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(ApiResponse.ok("Notifications retrieved", list));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        notificationService.markAsRead(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("Notification marked as read"));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        Long userId = SecurityUtils.getCurrentUserId();
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.ok("All notifications marked as read"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        notificationService.deleteNotification(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("Notification deleted"));
    }

    @DeleteMapping("/clear-all")
    public ResponseEntity<ApiResponse<Void>> clearAllNotifications() {
        Long userId = SecurityUtils.getCurrentUserId();
        notificationService.clearAllNotifications(userId);
        return ResponseEntity.ok(ApiResponse.ok("All notifications cleared"));
    }
}
