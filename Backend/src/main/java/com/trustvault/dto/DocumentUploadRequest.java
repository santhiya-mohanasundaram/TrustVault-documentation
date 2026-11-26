package com.trustvault.dto;

import java.time.LocalDate;

public class DocumentUploadRequest {
    private String documentName;
    private String category;
    private Long categoryId;
    private String documentNumber;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String description;

    public DocumentUploadRequest() {}

    public String getDocumentName() { return documentName; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getDocumentNumber() { return documentNumber; }
    public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }

    public LocalDate getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
