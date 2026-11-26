package com.trustvault.controller;

import com.trustvault.dto.ApiResponse;
import com.trustvault.dto.DocumentDto;
import com.trustvault.dto.DocumentUploadRequest;
import com.trustvault.entity.Document;
import com.trustvault.security.SecurityUtils;
import com.trustvault.service.DocumentService;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<DocumentDto>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "documentName", required = false) String documentName,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "documentNumber", required = false) String documentNumber,
            @RequestParam(value = "issueDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate issueDate,
            @RequestParam(value = "expiryDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expiryDate,
            @RequestParam(value = "description", required = false) String description) {

        Long userId = SecurityUtils.getCurrentUserId();

        DocumentUploadRequest request = new DocumentUploadRequest();
        request.setDocumentName(documentName);
        request.setCategory(category);
        request.setCategoryId(categoryId);
        request.setDocumentNumber(documentNumber);
        request.setIssueDate(issueDate);
        request.setExpiryDate(expiryDate);
        request.setDescription(description);

        DocumentDto saved = documentService.uploadDocument(userId, file, request);
        return ResponseEntity.ok(ApiResponse.ok("Document uploaded and encrypted securely!", saved));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DocumentDto>>> getUserDocuments(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "search", required = false) String search) {

        Long userId = SecurityUtils.getCurrentUserId();
        List<DocumentDto> docs = documentService.getUserDocuments(userId, category, status, search);
        return ResponseEntity.ok(ApiResponse.ok("Documents retrieved", docs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DocumentDto>> getDocumentById(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        DocumentDto doc = documentService.getDocumentById(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("Document retrieved", doc));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DocumentDto>> updateDocument(
            @PathVariable Long id,
            @RequestBody DocumentUploadRequest request) {

        Long userId = SecurityUtils.getCurrentUserId();
        DocumentDto updated = documentService.updateDocument(id, userId, request);
        return ResponseEntity.ok(ApiResponse.ok("Document updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        documentService.deleteDocument(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("Document removed from vault"));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        Document doc = documentService.getDocumentEntity(id, userId);
        Resource resource = documentService.getDocumentResourceForDownload(id, userId);

        String contentType = doc.getFileType() != null ? doc.getFileType() : "application/octet-stream";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getFileName() + "\"")
                .body(resource);
    }

    @GetMapping("/{id}/preview")
    public ResponseEntity<Resource> previewDocument(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        Document doc = documentService.getDocumentEntity(id, userId);
        Resource resource = documentService.getDocumentResourceForDownload(id, userId);

        String contentType = doc.getFileType() != null ? doc.getFileType() : "application/pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + doc.getFileName() + "\"")
                .body(resource);
    }
}
