package com.trustvault.dto;

public class NotificationDto {
    private Long id;
    private Long userId;
    private Long docId;
    private String title;
    private String description;
    private String type; // "info", "warning", "success", "danger"
    private boolean isRead;
    private String date;

    public NotificationDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getDocId() { return docId; }
    public void setDocId(Long docId) { this.docId = docId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
