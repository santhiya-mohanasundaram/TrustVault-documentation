package com.trustvault.dto;

import java.util.List;
import java.util.Map;

public class AdminStatsDto {
    private long totalRegisteredUsers;
    private long totalActiveUsers;
    private long totalSuspendedUsers;
    private long totalDocuments;
    private long activeDocuments;
    private long expiringSoonDocuments;
    private long expiredDocuments;
    private String totalStorageUsed;
    private List<UserDto> users;
    private List<ActivityLogDto> systemAuditLogs;
    private Map<String, Long> documentCategoryStats;

    public AdminStatsDto() {}

    public long getTotalRegisteredUsers() { return totalRegisteredUsers; }
    public void setTotalRegisteredUsers(long totalRegisteredUsers) { this.totalRegisteredUsers = totalRegisteredUsers; }

    public long getTotalActiveUsers() { return totalActiveUsers; }
    public void setTotalActiveUsers(long totalActiveUsers) { this.totalActiveUsers = totalActiveUsers; }

    public long getTotalSuspendedUsers() { return totalSuspendedUsers; }
    public void setTotalSuspendedUsers(long totalSuspendedUsers) { this.totalSuspendedUsers = totalSuspendedUsers; }

    public long getTotalDocuments() { return totalDocuments; }
    public void setTotalDocuments(long totalDocuments) { this.totalDocuments = totalDocuments; }

    public long getActiveDocuments() { return activeDocuments; }
    public void setActiveDocuments(long activeDocuments) { this.activeDocuments = activeDocuments; }

    public long getExpiringSoonDocuments() { return expiringSoonDocuments; }
    public void setExpiringSoonDocuments(long expiringSoonDocuments) { this.expiringSoonDocuments = expiringSoonDocuments; }

    public long getExpiredDocuments() { return expiredDocuments; }
    public void setExpiredDocuments(long expiredDocuments) { this.expiredDocuments = expiredDocuments; }

    public String getTotalStorageUsed() { return totalStorageUsed; }
    public void setTotalStorageUsed(String totalStorageUsed) { this.totalStorageUsed = totalStorageUsed; }

    public List<UserDto> getUsers() { return users; }
    public void setUsers(List<UserDto> users) { this.users = users; }

    public List<ActivityLogDto> getSystemAuditLogs() { return systemAuditLogs; }
    public void setSystemAuditLogs(List<ActivityLogDto> systemAuditLogs) { this.systemAuditLogs = systemAuditLogs; }

    public Map<String, Long> getDocumentCategoryStats() { return documentCategoryStats; }
    public void setDocumentCategoryStats(Map<String, Long> documentCategoryStats) { this.documentCategoryStats = documentCategoryStats; }
}
