package com.trustvault.repository;

import com.trustvault.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    long countByUserIdAndReadStatusFalse(Long userId);
    void deleteByUserId(Long userId);

    boolean existsByUserIdAndDocumentIdAndNotificationTypeAndScheduledDate(
        Long userId, Long documentId, String notificationType, LocalDate scheduledDate
    );
}
