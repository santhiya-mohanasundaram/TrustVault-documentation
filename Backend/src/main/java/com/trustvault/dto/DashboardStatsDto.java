package com.trustvault.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private long totalDocuments;
    private long activeDocuments;
    private long expiringSoon;
    private long expiredDocuments;
    private String storageUsed;
    private List<DocumentDto> recentDocuments;
    private List<DocumentDto> upcomingExpiryDocuments;
    private List<ActivityLogDto> recentActivities;
    private Map<String, Long> categoryDistribution;

    public DashboardStatsDto() {}

    public long getTotalDocuments() { return totalDocuments; }
    public void setTotalDocuments(long totalDocuments) { this.totalDocuments = totalDocuments; }

    public long getActiveDocuments() { return activeDocuments; }
    public void setActiveDocuments(long activeDocuments) { this.activeDocuments = activeDocuments; }

    public long getExpiringSoon() { return expiringSoon; }
    public void setExpiringSoon(long expiringSoon) { this.expiringSoon = expiringSoon; }

    public long getExpiredDocuments() { return expiredDocuments; }
    public void setExpiredDocuments(long expiredDocuments) { this.expiredDocuments = expiredDocuments; }

    public String getStorageUsed() { return storageUsed; }
    public void setStorageUsed(String storageUsed) { this.storageUsed = storageUsed; }

    public List<DocumentDto> getRecentDocuments() { return recentDocuments; }
    public void setRecentDocuments(List<DocumentDto> recentDocuments) { this.recentDocuments = recentDocuments; }

    public List<DocumentDto> getUpcomingExpiryDocuments() { return upcomingExpiryDocuments; }
    public void setUpcomingExpiryDocuments(List<DocumentDto> upcomingExpiryDocuments) { this.upcomingExpiryDocuments = upcomingExpiryDocuments; }

    public List<ActivityLogDto> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<ActivityLogDto> recentActivities) { this.recentActivities = recentActivities; }

    public Map<String, Long> getCategoryDistribution() { return categoryDistribution; }
    public void setCategoryDistribution(Map<String, Long> categoryDistribution) { this.categoryDistribution = categoryDistribution; }
}
