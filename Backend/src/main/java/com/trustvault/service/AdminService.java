package com.trustvault.service;

import com.trustvault.dto.AdminStatsDto;
import com.trustvault.dto.UserDto;
import com.trustvault.entity.AccountStatus;
import com.trustvault.entity.Role;
import com.trustvault.entity.User;
import com.trustvault.exception.ResourceNotFoundException;
import com.trustvault.repository.DocumentRepository;
import com.trustvault.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final AuthService authService;
    private final ActivityLogService activityLogService;
    private final FileStorageService fileStorageService;

    public AdminService(UserRepository userRepository,
                        DocumentRepository documentRepository,
                        AuthService authService,
                        ActivityLogService activityLogService,
                        FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.documentRepository = documentRepository;
        this.authService = authService;
        this.activityLogService = activityLogService;
        this.fileStorageService = fileStorageService;
    }

    @Transactional(readOnly = true)
    public AdminStatsDto getAdminStatistics() {
        long totalUsers = userRepository.countByRole(Role.USER);
        long activeUsers = userRepository.countByAccountStatus(AccountStatus.ACTIVE);
        long suspendedUsers = userRepository.countByAccountStatus(AccountStatus.SUSPENDED);

        long totalDocs = documentRepository.count();
        long activeDocs = documentRepository.countByStatus("Active");
        long expiringSoonDocs = documentRepository.countByStatus("Expiring Soon");
        long expiredDocs = documentRepository.countByStatus("Expired");

        long totalStorageBytes = documentRepository.findAll().stream()
                .mapToLong(d -> d.getFileSize() != null ? d.getFileSize() : 0L)
                .sum();

        List<UserDto> users = userRepository.findByRole(Role.USER).stream()
                .map(authService::mapToDto)
                .collect(Collectors.toList());

        Map<String, Long> catStats = documentRepository.findAll().stream()
                .collect(Collectors.groupingBy(d -> d.getCategory().getCategoryName(), Collectors.counting()));

        AdminStatsDto stats = new AdminStatsDto();
        stats.setTotalRegisteredUsers(totalUsers);
        stats.setTotalActiveUsers(activeUsers);
        stats.setTotalSuspendedUsers(suspendedUsers);
        stats.setTotalDocuments(totalDocs);
        stats.setActiveDocuments(activeDocs);
        stats.setExpiringSoonDocuments(expiringSoonDocs);
        stats.setExpiredDocuments(expiredDocs);
        stats.setTotalStorageUsed(fileStorageService.formatFileSize(totalStorageBytes));
        stats.setUsers(users);
        stats.setSystemAuditLogs(activityLogService.getSystemAuditLogs());
        stats.setDocumentCategoryStats(catStats);

        return stats;
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findByRole(Role.USER).stream()
                .map(authService::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto updateUserStatus(Long userId, String statusStr, Long adminId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        AccountStatus newStatus = AccountStatus.valueOf(statusStr.toUpperCase());
        user.setAccountStatus(newStatus);
        User saved = userRepository.save(user);

        activityLogService.logActivity(adminId, "Account Status Change", null, null,
                "Governance", "Status updated to " + newStatus.name() + " for User " + user.getEmail(), "127.0.0.1",
                newStatus == AccountStatus.ACTIVE ? "Success" : "Warning");

        return authService.mapToDto(saved);
    }
}
