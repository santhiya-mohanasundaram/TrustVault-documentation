package com.trustvault.controller;

import com.trustvault.dto.AdminStatsDto;
import com.trustvault.dto.ApiResponse;
import com.trustvault.dto.UserDto;
import com.trustvault.security.SecurityUtils;
import com.trustvault.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getAdminStats() {
        AdminStatsDto stats = adminService.getAdminStatistics();
        return ResponseEntity.ok(ApiResponse.ok("Admin statistics retrieved", stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.ok("Users retrieved", users));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserDto>> updateUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        Long adminId = SecurityUtils.getCurrentUserId();
        String status = body.get("status");
        UserDto updated = adminService.updateUserStatus(id, status, adminId);
        return ResponseEntity.ok(ApiResponse.ok("User status updated to " + status, updated));
    }
}
