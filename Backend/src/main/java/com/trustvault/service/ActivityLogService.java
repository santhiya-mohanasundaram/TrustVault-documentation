package com.trustvault.service;

import com.trustvault.dto.ActivityLogDto;
import com.trustvault.entity.ActivityLog;
import com.trustvault.entity.User;
import com.trustvault.repository.ActivityLogRepository;
import com.trustvault.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("d MMM yyyy, hh:mm a");

    public ActivityLogService(ActivityLogRepository activityLogRepository, UserRepository userRepository) {
        this.activityLogRepository = activityLogRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void logActivity(Long userId, String activityType, Long documentId, String documentName,
                            String categoryName, String description, String ipAddress, String status) {
        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;
        ActivityLog log = new ActivityLog(user, activityType, documentId, documentName, categoryName, description, ipAddress, status);
        activityLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<ActivityLogDto> getUserActivities(Long userId) {
        return activityLogRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ActivityLogDto> getSystemAuditLogs() {
        return activityLogRepository.findTop50ByOrderByCreatedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ActivityLogDto mapToDto(ActivityLog log) {
        ActivityLogDto dto = new ActivityLogDto();
        dto.setId(log.getId());
        dto.setUserId(log.getUser() != null ? log.getUser().getId() : null);
        dto.setUser(log.getUser() != null ? log.getUser().getFullName() : "System");
        dto.setType(log.getActivityType());
        dto.setDocumentName(log.getDocumentName());
        dto.setCategory(log.getCategoryName());
        dto.setDescription(log.getDescription());
        dto.setStatus(log.getStatus());
        dto.setIp(log.getIpAddress() != null ? log.getIpAddress() : "127.0.0.1");
        dto.setTimestamp(log.getCreatedAt() != null ? log.getCreatedAt().format(FORMATTER) : "Just now");
        return dto;
    }
}
