package com.trustvault.controller;

import com.trustvault.dto.*;
import com.trustvault.security.SecurityUtils;
import com.trustvault.service.DocumentService;
import com.trustvault.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ProfileController {

    private final UserService userService;
    private final DocumentService documentService;

    public ProfileController(UserService userService, DocumentService documentService) {
        this.userService = userService;
        this.documentService = documentService;
    }

    @GetMapping("/users/profile")
    public ResponseEntity<ApiResponse<UserDto>> getProfile() {
        Long userId = SecurityUtils.getCurrentUserId();
        UserDto profile = userService.getUserProfile(userId);
        return ResponseEntity.ok(ApiResponse.ok("User profile retrieved", profile));
    }

    @PutMapping("/users/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(@RequestBody ProfileUpdateRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        UserDto updated = userService.updateProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }

    @PostMapping("/users/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody PasswordChangeRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        userService.changePassword(userId, request);
        return ResponseEntity.ok(ApiResponse.ok("Password changed successfully"));
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        Long userId = SecurityUtils.getCurrentUserId();
        DashboardStatsDto stats = documentService.getUserDashboardStats(userId);
        return ResponseEntity.ok(ApiResponse.ok("Dashboard statistics retrieved", stats));
    }
}
