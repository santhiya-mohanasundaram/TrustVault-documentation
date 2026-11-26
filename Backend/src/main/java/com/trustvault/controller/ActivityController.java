package com.trustvault.controller;

import com.trustvault.dto.ActivityLogDto;
import com.trustvault.dto.ApiResponse;
import com.trustvault.security.SecurityUtils;
import com.trustvault.service.ActivityLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityLogService activityLogService;

    public ActivityController(ActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ActivityLogDto>>> getUserActivities() {
        Long userId = SecurityUtils.getCurrentUserId();
        List<ActivityLogDto> activities = activityLogService.getUserActivities(userId);
        return ResponseEntity.ok(ApiResponse.ok("Activities retrieved", activities));
    }

    @GetMapping("/system")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ActivityLogDto>>> getSystemLogs() {
        List<ActivityLogDto> logs = activityLogService.getSystemAuditLogs();
        return ResponseEntity.ok(ApiResponse.ok("System audit logs retrieved", logs));
    }
}
