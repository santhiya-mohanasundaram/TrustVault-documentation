package com.trustvault.service;

import com.trustvault.dto.NotificationDto;
import com.trustvault.entity.Document;
import com.trustvault.entity.Notification;
import com.trustvault.entity.User;
import com.trustvault.exception.ResourceNotFoundException;
import com.trustvault.repository.DocumentRepository;
import com.trustvault.repository.NotificationRepository;
import com.trustvault.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("d MMM yyyy, hh:mm a");

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository,
                               DocumentRepository documentRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.documentRepository = documentRepository;
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public NotificationDto createNotification(Long userId, Long docId, String type, String title, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Document doc = docId != null ? documentRepository.findById(docId).orElse(null) : null;

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setDocument(doc);
        notification.setNotificationType(type);
        notification.setMessage(title != null ? title + ": " + message : message);
        notification.setScheduledDate(java.time.LocalDate.now());
        notification.setReadStatus(false);
        notification.setDeliveryStatus("DELIVERED");

        Notification saved = notificationRepository.save(notification);
        return mapToDto(saved);
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + notificationId));

        if (!notification.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Notification not found for user");
        }

        notification.setReadStatus(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        for (Notification n : list) {
            n.setReadStatus(true);
        }
        notificationRepository.saveAll(list);
    }

    @Transactional
    public void deleteNotification(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + notificationId));

        if (!notification.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Notification not found for user");
        }

        notificationRepository.delete(notification);
    }

    @Transactional
    public void clearAllNotifications(Long userId) {
        notificationRepository.deleteByUserId(userId);
    }

    private NotificationDto mapToDto(Notification n) {
        NotificationDto dto = new NotificationDto();
        dto.setId(n.getId());
        dto.setUserId(n.getUser().getId());
        dto.setDocId(n.getDocument() != null ? n.getDocument().getId() : null);

        // Parse title and description from message if structured
        String msg = n.getMessage() != null ? n.getMessage() : "";
        if (msg.contains(": ")) {
            String[] parts = msg.split(": ", 2);
            dto.setTitle(parts[0]);
            dto.setDescription(parts[1]);
        } else {
            dto.setTitle(n.getNotificationType());
            dto.setDescription(msg);
        }

        dto.setType(mapNotificationType(n.getNotificationType()));
        dto.setRead(Boolean.TRUE.equals(n.getReadStatus()));
        dto.setDate(n.getCreatedAt() != null ? n.getCreatedAt().format(FORMATTER) : "Just now");
        return dto;
    }

    private String mapNotificationType(String type) {
        if (type == null) return "info";
        switch (type.toUpperCase()) {
            case "EXPIRY_WARNING":
            case "WARNING":
                return "warning";
            case "EXPIRY_EXPIRED":
            case "DANGER":
                return "danger";
            case "DOCUMENT_UPLOAD":
            case "SUCCESS":
                return "success";
            default:
                return "info";
        }
    }
}
