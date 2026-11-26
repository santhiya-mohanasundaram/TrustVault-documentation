package com.trustvault.service;

import com.trustvault.dto.DashboardStatsDto;
import com.trustvault.dto.DocumentDto;
import com.trustvault.dto.DocumentUploadRequest;
import com.trustvault.entity.Category;
import com.trustvault.entity.Document;
import com.trustvault.entity.User;
import com.trustvault.exception.BadRequestException;
import com.trustvault.exception.ResourceNotFoundException;
import com.trustvault.exception.UnauthorizedException;
import com.trustvault.repository.DocumentRepository;
import com.trustvault.repository.UserRepository;
import com.trustvault.util.EncryptionUtil;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final CategoryService categoryService;
    private final FileStorageService fileStorageService;
    private final EncryptionUtil encryptionUtil;
    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DISPLAY_FORMATTER = DateTimeFormatter.ofPattern("d MMM yyyy, hh:mm a");

    public DocumentService(DocumentRepository documentRepository,
                           UserRepository userRepository,
                           CategoryService categoryService,
                           FileStorageService fileStorageService,
                           EncryptionUtil encryptionUtil,
                           ActivityLogService activityLogService,
                           NotificationService notificationService) {
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.categoryService = categoryService;
        this.fileStorageService = fileStorageService;
        this.encryptionUtil = encryptionUtil;
        this.activityLogService = activityLogService;
        this.notificationService = notificationService;
    }

    @Transactional
    public DocumentDto uploadDocument(Long userId, MultipartFile file, DocumentUploadRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please select a document file to upload");
        }

        // Determine Category
        Category category;
        if (request.getCategoryId() != null) {
            category = categoryService.getCategoryEntity(request.getCategoryId());
        } else if (request.getCategory() != null && !request.getCategory().trim().isEmpty()) {
            category = categoryService.getCategoryEntityByName(request.getCategory().trim());
        } else {
            category = categoryService.getCategoryEntityByName("Other Documents");
        }

        // Store file securely
        String storedFileName = fileStorageService.storeFile(file, userId);
        String originalFilename = file.getOriginalFilename();

        // Encrypt sensitive document number if provided
        String encryptedNumber = null;
        if (request.getDocumentNumber() != null && !request.getDocumentNumber().trim().isEmpty()) {
            encryptedNumber = encryptionUtil.encrypt(request.getDocumentNumber().trim());
        }

        // Compute initial status based on expiry
        LocalDate expiry = request.getExpiryDate();
        String status = computeDocumentStatus(expiry);

        Document doc = new Document();
        doc.setUser(user);
        doc.setCategory(category);
        doc.setDocumentName(request.getDocumentName() != null && !request.getDocumentName().trim().isEmpty() ?
                request.getDocumentName().trim() : originalFilename);
        doc.setDocumentNumberEncrypted(encryptedNumber);
        doc.setFileName(originalFilename);
        doc.setFileType(file.getContentType() != null ? file.getContentType() : "application/octet-stream");
        doc.setFileSize(file.getSize());
        doc.setStoragePath(storedFileName);
        doc.setIssueDate(request.getIssueDate());
        doc.setExpiryDate(expiry);
        doc.setDescription(request.getDescription());
        doc.setStatus(status);

        Document saved = documentRepository.save(doc);

        // Record Activity
        activityLogService.logActivity(userId, "Document Uploaded", saved.getId(), saved.getDocumentName(),
                category.getCategoryName(), "Document " + saved.getDocumentName() + " uploaded to vault", "127.0.0.1", "Success");

        // User Notification
        notificationService.createNotification(userId, saved.getId(), "SUCCESS", "New Document Uploaded",
                saved.getDocumentName() + " has been added securely to your vault under " + category.getCategoryName() + ".");

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<DocumentDto> getUserDocuments(Long userId, String category, String status, String search) {
        List<Document> docs = documentRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return docs.stream()
                .filter(d -> {
                    if (category != null && !category.equalsIgnoreCase("All")) {
                        if (!d.getCategory().getCategoryName().equalsIgnoreCase(category)) {
                            return false;
                        }
                    }
                    if (status != null && !status.equalsIgnoreCase("All")) {
                        if (!d.getStatus().equalsIgnoreCase(status)) {
                            return false;
                        }
                    }
                    if (search != null && !search.trim().isEmpty()) {
                        String s = search.toLowerCase();
                        boolean matchName = d.getDocumentName().toLowerCase().contains(s);
                        boolean matchDesc = d.getDescription() != null && d.getDescription().toLowerCase().contains(s);
                        boolean matchCat = d.getCategory().getCategoryName().toLowerCase().contains(s);
                        if (!matchName && !matchDesc && !matchCat) {
                            return false;
                        }
                    }
                    return true;
                })
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DocumentDto getDocumentById(Long id, Long userId) {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));

        if (!doc.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Access denied: You do not have permission to view this document");
        }

        activityLogService.logActivity(userId, "Document Viewed", doc.getId(), doc.getDocumentName(),
                doc.getCategory().getCategoryName(), "Document " + doc.getDocumentName() + " viewed", "127.0.0.1", "Success");

        return mapToDto(doc);
    }

    @Transactional
    public DocumentDto updateDocument(Long id, Long userId, DocumentUploadRequest request) {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));

        if (!doc.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Access denied: You do not have permission to modify this document");
        }

        if (request.getDocumentName() != null && !request.getDocumentName().trim().isEmpty()) {
            doc.setDocumentName(request.getDocumentName().trim());
        }

        if (request.getCategoryId() != null) {
            Category category = categoryService.getCategoryEntity(request.getCategoryId());
            doc.setCategory(category);
        } else if (request.getCategory() != null && !request.getCategory().trim().isEmpty()) {
            Category category = categoryService.getCategoryEntityByName(request.getCategory().trim());
            doc.setCategory(category);
        }

        if (request.getDocumentNumber() != null) {
            doc.setDocumentNumberEncrypted(encryptionUtil.encrypt(request.getDocumentNumber().trim()));
        }

        if (request.getIssueDate() != null) {
            doc.setIssueDate(request.getIssueDate());
        }

        if (request.getExpiryDate() != null) {
            doc.setExpiryDate(request.getExpiryDate());
            doc.setStatus(computeDocumentStatus(request.getExpiryDate()));
        }

        if (request.getDescription() != null) {
            doc.setDescription(request.getDescription());
        }

        Document updated = documentRepository.save(doc);

        activityLogService.logActivity(userId, "Document Updated", updated.getId(), updated.getDocumentName(),
                updated.getCategory().getCategoryName(), "Document " + updated.getDocumentName() + " details updated", "127.0.0.1", "Success");

        return mapToDto(updated);
    }

    @Transactional
    public void deleteDocument(Long id, Long userId) {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));

        if (!doc.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Access denied: You do not have permission to delete this document");
        }

        fileStorageService.deleteFile(doc.getStoragePath());
        documentRepository.delete(doc);

        activityLogService.logActivity(userId, "Document Deleted", id, doc.getDocumentName(),
                doc.getCategory().getCategoryName(), "Document " + doc.getDocumentName() + " removed from vault", "127.0.0.1", "Warning");
    }

    @Transactional
    public Resource getDocumentResourceForDownload(Long id, Long userId) {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));

        if (!doc.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Access denied: You cannot download documents of other users");
        }

        activityLogService.logActivity(userId, "Document Downloaded", doc.getId(), doc.getDocumentName(),
                doc.getCategory().getCategoryName(), "Document " + doc.getDocumentName() + " downloaded securely", "127.0.0.1", "Success");

        return fileStorageService.loadFileAsResource(doc.getStoragePath());
    }

    @Transactional(readOnly = true)
    public Document getDocumentEntity(Long id, Long userId) {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));

        if (!doc.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Access denied");
        }
        return doc;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getUserDashboardStats(Long userId) {
        List<Document> userDocs = documentRepository.findByUserIdOrderByCreatedAtDesc(userId);

        long total = userDocs.size();
        long active = userDocs.stream().filter(d -> "Active".equalsIgnoreCase(d.getStatus())).count();
        long expiringSoon = userDocs.stream().filter(d -> "Expiring Soon".equalsIgnoreCase(d.getStatus())).count();
        long expired = userDocs.stream().filter(d -> "Expired".equalsIgnoreCase(d.getStatus())).count();

        long totalBytes = userDocs.stream().mapToLong(Document::getFileSize).sum();

        // Recent documents (up to 5)
        List<DocumentDto> recentDocs = userDocs.stream()
                .limit(5)
                .map(this::mapToDto)
                .collect(Collectors.toList());

        // Upcoming expiry documents
        List<DocumentDto> upcomingExpiry = userDocs.stream()
                .filter(d -> d.getExpiryDate() != null && !"Expired".equalsIgnoreCase(d.getStatus()))
                .sorted(Comparator.comparing(Document::getExpiryDate))
                .limit(5)
                .map(this::mapToDto)
                .collect(Collectors.toList());

        // Category distribution
        Map<String, Long> catDist = userDocs.stream()
                .collect(Collectors.groupingBy(d -> d.getCategory().getCategoryName(), Collectors.counting()));

        DashboardStatsDto stats = new DashboardStatsDto();
        stats.setTotalDocuments(total);
        stats.setActiveDocuments(active);
        stats.setExpiringSoon(expiringSoon);
        stats.setExpiredDocuments(expired);
        stats.setStorageUsed(fileStorageService.formatFileSize(totalBytes));
        stats.setRecentDocuments(recentDocs);
        stats.setUpcomingExpiryDocuments(upcomingExpiry);
        stats.setCategoryDistribution(catDist);
        stats.setRecentActivities(activityLogService.getUserActivities(userId).stream().limit(5).collect(Collectors.toList()));

        return stats;
    }

    public String computeDocumentStatus(LocalDate expiryDate) {
        if (expiryDate == null) return "Active";
        LocalDate today = LocalDate.now();
        if (expiryDate.isBefore(today)) {
            return "Expired";
        }
        if (expiryDate.isBefore(today.plusDays(31))) {
            return "Expiring Soon";
        }
        return "Active";
    }

    public DocumentDto mapToDto(Document doc) {
        DocumentDto dto = new DocumentDto();
        dto.setId(doc.getId());
        dto.setUserId(doc.getUser().getId());
        dto.setName(doc.getDocumentName());
        dto.setCategory(doc.getCategory().getCategoryName());
        dto.setCategoryId(doc.getCategory().getId());
        dto.setFileName(doc.getFileName());
        dto.setFileType(doc.getFileType());
        dto.setSize(fileStorageService.formatFileSize(doc.getFileSize()));
        dto.setFileSizeBytes(doc.getFileSize());
        dto.setIssueDate(doc.getIssueDate());
        dto.setExpiryDate(doc.getExpiryDate());
        dto.setDescription(doc.getDescription());
        dto.setStatus(doc.getStatus());
        dto.setUploadDate(doc.getCreatedAt() != null ? doc.getCreatedAt().format(DATE_FORMATTER) : LocalDate.now().toString());
        dto.setLastModified(doc.getUpdatedAt() != null ? doc.getUpdatedAt().format(DISPLAY_FORMATTER) : "Just now");

        // Decrypt document number for owner
        if (doc.getDocumentNumberEncrypted() != null) {
            dto.setDocumentNumber(encryptionUtil.decrypt(doc.getDocumentNumberEncrypted()));
        }
        return dto;
    }
}
