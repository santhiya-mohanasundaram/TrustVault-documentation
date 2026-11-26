package com.trustvault.dto;

public class ActivityLogDto {
    private Long id;
    private Long userId;
    private String user;
    private String type;
    private String documentName;
    private String category;
    private String description;
    private String status;
    private String ip;
    private String timestamp;

    public ActivityLogDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDocumentName() { return documentName; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getIp() { return ip; }
    public void setIp(String ip) { this.ip = ip; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
