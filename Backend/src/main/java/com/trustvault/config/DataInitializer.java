package com.trustvault.config;

import com.trustvault.entity.AccountStatus;
import com.trustvault.entity.Category;
import com.trustvault.entity.Document;
import com.trustvault.entity.Role;
import com.trustvault.entity.User;
import com.trustvault.repository.CategoryRepository;
import com.trustvault.repository.DocumentRepository;
import com.trustvault.repository.UserRepository;
import com.trustvault.service.FileStorageService;
import com.trustvault.util.EncryptionUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final DocumentRepository documentRepository;
    private final PasswordEncoder passwordEncoder;
    private final EncryptionUtil encryptionUtil;

    public DataInitializer(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           DocumentRepository documentRepository,
                           PasswordEncoder passwordEncoder,
                           EncryptionUtil encryptionUtil) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.documentRepository = documentRepository;
        this.passwordEncoder = passwordEncoder;
        this.encryptionUtil = encryptionUtil;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Initialize Root Administrator
        if (!userRepository.existsByEmailIgnoreCase("admin@trustvault.io")) {
            User admin = new User();
            admin.setFullName("Administrator");
            admin.setEmail("admin@trustvault.io");
            admin.setMobileNumber("+91 90000 00001");
            admin.setPassword(passwordEncoder.encode("admin1234"));
            admin.setRole(Role.ADMIN);
            admin.setAccountStatus(AccountStatus.ACTIVE);
            admin.setAvatar("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80");
            userRepository.save(admin);
            logger.info("Initialized default administrator account (admin@trustvault.io).");
        }

        // 2. Ensure Sample Users exist with distinct accounts (Sathishkumar, Santhiya, Arun)
        initUserIfNotExists("Sathishkumar", "sathish@trustvault.io", "+91 98765 43210", "Password@123",
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80");

        initUserIfNotExists("Santhiya", "santhiya@trustvault.io", "+91 98765 43211", "Password@123",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80");

        initUserIfNotExists("Arun", "arun@trustvault.io", "+91 98765 43212", "Password@123",
                "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80");

        // 3. Ensure test documents for Sathishkumar
        seedSampleDocumentsIfEmpty();
    }

    private User initUserIfNotExists(String name, String email, String phone, String rawPassword, String avatar) {
        Optional<User> existing = userRepository.findByEmailIgnoreCase(email);
        if (existing.isPresent()) {
            return existing.get();
        }
        User user = new User();
        user.setFullName(name);
        user.setEmail(email);
        user.setMobileNumber(phone);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(Role.USER);
        user.setAccountStatus(AccountStatus.ACTIVE);
        user.setAvatar(avatar);
        User saved = userRepository.save(user);
        logger.info("Initialized test user account: {} ({})", name, email);
        return saved;
    }

    private void seedSampleDocumentsIfEmpty() {
        if (documentRepository.count() > 0) return;

        User sathish = userRepository.findByEmailIgnoreCase("sathish@trustvault.io").orElse(null);
        if (sathish == null) return;

        Category aadhaar = categoryRepository.findByCategoryNameIgnoreCase("Aadhaar Card").orElse(null);
        Category passport = categoryRepository.findByCategoryNameIgnoreCase("Passport").orElse(null);
        Category driving = categoryRepository.findByCategoryNameIgnoreCase("Driving Licence").orElse(null);

        Path uploadsDir = Paths.get("./uploads/documents").toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadsDir);

            if (aadhaar != null) {
                String fileName = "sample_aadhaar.pdf";
                Path filePath = uploadsDir.resolve(sathish.getId() + "_seed_" + fileName);
                if (!Files.exists(filePath)) {
                    Files.writeString(filePath, "%PDF-1.4 TrustVault Mock Seed Document: Aadhaar Card for Sathishkumar");
                }
                Document doc = new Document();
                doc.setUser(sathish);
                doc.setCategory(aadhaar);
                doc.setDocumentName("Government Aadhaar Card");
                doc.setDocumentNumberEncrypted(encryptionUtil.encrypt("XXXX-XXXX-4589"));
                doc.setFileName(fileName);
                doc.setFileType("application/pdf");
                doc.setFileSize(142000L);
                doc.setStoragePath(filePath.getFileName().toString());
                doc.setIssueDate(LocalDate.of(2020, 1, 15));
                doc.setExpiryDate(LocalDate.of(2030, 1, 15));
                doc.setDescription("Primary government citizen identity verification document");
                doc.setStatus("Active");
                documentRepository.save(doc);
            }

            if (passport != null) {
                String fileName = "sample_passport.pdf";
                Path filePath = uploadsDir.resolve(sathish.getId() + "_seed_" + fileName);
                if (!Files.exists(filePath)) {
                    Files.writeString(filePath, "%PDF-1.4 TrustVault Mock Seed Document: Indian Passport for Sathishkumar");
                }
                Document doc = new Document();
                doc.setUser(sathish);
                doc.setCategory(passport);
                doc.setDocumentName("International Passport");
                doc.setDocumentNumberEncrypted(encryptionUtil.encrypt("Z8945123"));
                doc.setFileName(fileName);
                doc.setFileType("application/pdf");
                doc.setFileSize(284000L);
                doc.setStoragePath(filePath.getFileName().toString());
                doc.setIssueDate(LocalDate.of(2017, 6, 20));
                // Set expiry date to 15 days from now to test Expiring Soon reminder!
                doc.setExpiryDate(LocalDate.now().plusDays(15));
                doc.setDescription("Republic of India 36-page regular travel passport");
                doc.setStatus("Expiring Soon");
                documentRepository.save(doc);
            }

            if (driving != null) {
                String fileName = "sample_license.jpg";
                Path filePath = uploadsDir.resolve(sathish.getId() + "_seed_" + fileName);
                if (!Files.exists(filePath)) {
                    Files.writeString(filePath, "Mock Image Byte Data for Driving License");
                }
                Document doc = new Document();
                doc.setUser(sathish);
                doc.setCategory(driving);
                doc.setDocumentName("Four Wheeler Driving Licence");
                doc.setDocumentNumberEncrypted(encryptionUtil.encrypt("DL-0420110023456"));
                doc.setFileName(fileName);
                doc.setFileType("image/jpeg");
                doc.setFileSize(98000L);
                doc.setStoragePath(filePath.getFileName().toString());
                doc.setIssueDate(LocalDate.of(2015, 3, 10));
                // Set expiry date to past to test Expired document!
                doc.setExpiryDate(LocalDate.now().minusDays(5));
                doc.setDescription("Smart card motor vehicle driving license");
                doc.setStatus("Expired");
                documentRepository.save(doc);
            }

            logger.info("Sample documents seeded successfully with Active, Expiring Soon, and Expired states.");
        } catch (Exception ex) {
            logger.warn("Could not write seed document files: {}", ex.getMessage());
        }
    }
}
