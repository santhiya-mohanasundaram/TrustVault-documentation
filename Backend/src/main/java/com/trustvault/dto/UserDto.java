package com.trustvault.dto;

public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private String status;
    private String avatar;
    private String registrationDate;
    private long documentsCount;
    private String storageUsed;
    private Boolean emailNotifications;
    private Boolean smsNotifications;
    private Boolean pushNotifications;
    private Integer expiryThreshold;

    public UserDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(String registrationDate) { this.registrationDate = registrationDate; }

    public long getDocumentsCount() { return documentsCount; }
    public void setDocumentsCount(long documentsCount) { this.documentsCount = documentsCount; }

    public String getStorageUsed() { return storageUsed; }
    public void setStorageUsed(String storageUsed) { this.storageUsed = storageUsed; }

    public Boolean getEmailNotifications() { return emailNotifications; }
    public void setEmailNotifications(Boolean emailNotifications) { this.emailNotifications = emailNotifications; }

    public Boolean getSmsNotifications() { return smsNotifications; }
    public void setSmsNotifications(Boolean smsNotifications) { this.smsNotifications = smsNotifications; }

    public Boolean getPushNotifications() { return pushNotifications; }
    public void setPushNotifications(Boolean pushNotifications) { this.pushNotifications = pushNotifications; }

    public Integer getExpiryThreshold() { return expiryThreshold; }
    public void setExpiryThreshold(Integer expiryThreshold) { this.expiryThreshold = expiryThreshold; }
}
