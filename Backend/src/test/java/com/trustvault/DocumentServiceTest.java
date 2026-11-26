package com.trustvault;

import com.trustvault.dto.DocumentDto;
import com.trustvault.dto.DocumentUploadRequest;
import com.trustvault.entity.User;
import com.trustvault.exception.BadRequestException;
import com.trustvault.exception.UnauthorizedException;
import com.trustvault.repository.UserRepository;
import com.trustvault.service.DocumentService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class DocumentServiceTest {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Document Upload - Upload document with AES-256 encrypted number")
    void testUploadDocument() {
        User sathish = userRepository.findByEmailIgnoreCase("sathish@trustvault.io").orElseThrow();

        MockMultipartFile file = new MockMultipartFile(
                "file", "pan_card.pdf", "application/pdf", "%PDF-1.4 Mock Pan Data".getBytes()
        );

        DocumentUploadRequest req = new DocumentUploadRequest();
        req.setDocumentName("Income Tax PAN Card");
        req.setCategory("PAN Card");
        req.setDocumentNumber("ABCDE1234F");
        req.setIssueDate(LocalDate.of(2021, 5, 10));
        req.setExpiryDate(LocalDate.now().plusYears(5));
        req.setDescription("Official Indian Permanent Account Number");

        DocumentDto uploaded = documentService.uploadDocument(sathish.getId(), file, req);

        assertNotNull(uploaded);
        assertNotNull(uploaded.getId());
        assertEquals("Income Tax PAN Card", uploaded.getName());
        assertEquals("PAN Card", uploaded.getCategory());
        assertEquals("ABCDE1234F", uploaded.getDocumentNumber());
        assertEquals("Active", uploaded.getStatus());
    }

    @Test
    @DisplayName("Document Security - User B cannot view User A's private documents")
    void testUserDocumentIsolation() {
        User sathish = userRepository.findByEmailIgnoreCase("sathish@trustvault.io").orElseThrow();
        User santhiya = userRepository.findByEmailIgnoreCase("santhiya@trustvault.io").orElseThrow();

        // Get Sathish's documents
        List<DocumentDto> sathishDocs = documentService.getUserDocuments(sathish.getId(), null, null, null);
        assertFalse(sathishDocs.isEmpty(), "Sathish should have documents");
        Long sathishDocId = sathishDocs.get(0).getId();

        // Santhiya attempts to access Sathish's document
        assertThrows(UnauthorizedException.class, () -> {
            documentService.getDocumentById(sathishDocId, santhiya.getId());
        });
    }

    @Test
    @DisplayName("File Validation - Reject disallowed file extensions (e.g. .exe)")
    void testDisallowedFileExtension() {
        User sathish = userRepository.findByEmailIgnoreCase("sathish@trustvault.io").orElseThrow();

        MockMultipartFile maliciousFile = new MockMultipartFile(
                "file", "virus.exe", "application/x-msdownload", "MALICIOUS".getBytes()
        );

        DocumentUploadRequest req = new DocumentUploadRequest();
        req.setDocumentName("Suspicious File");

        assertThrows(BadRequestException.class, () -> {
            documentService.uploadDocument(sathish.getId(), maliciousFile, req);
        });
    }
}
