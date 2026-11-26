package com.trustvault.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private Document document;

    @Column(name = "notification_type", nullable = false, length = 50)
    private String notificationType; // "EXPIRY_WARNING", "DOCUMENT_UPLOAD", "SECURITY_ALERT", "SYSTEM"

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "scheduled_date")
    private LocalDate scheduledDate;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "read_status")
    private Boolean readStatus = false;

    @Column(name = "delivery_status", length = 20)
    private String deliveryStatus = "DELIVERED"; // "DELIVERED", "PENDING", "FAILED"

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.readStatus == null) this.readStatus = false;
        if (this.deliveryStatus == null) this.deliveryStatus = "DELIVERED";
        if (this.sentAt == null) this.sentAt = LocalDateTime.now();
    }

    public Notification() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Document getDocument() { return document; }
    public void setDocument(Document document) { this.document = document; }

    public String getNotificationType() { return notificationType; }
    public void setNotificationType(String notificationType) { this.notificationType = notificationType; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }

    public Boolean getReadStatus() { return readStatus; }
    public void setReadStatus(Boolean readStatus) { this.readStatus = readStatus; }

    public String getDeliveryStatus() { return deliveryStatus; }
    public void setDeliveryStatus(String deliveryStatus) { this.deliveryStatus = deliveryStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
