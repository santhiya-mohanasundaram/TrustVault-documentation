package com.trustvault.service;

import com.trustvault.dto.AuthRequest;
import com.trustvault.dto.AuthResponse;
import com.trustvault.dto.RegisterRequest;
import com.trustvault.dto.UserDto;
import com.trustvault.entity.AccountStatus;
import com.trustvault.entity.Role;
import com.trustvault.entity.User;
import com.trustvault.exception.BadRequestException;
import com.trustvault.exception.UnauthorizedException;
import com.trustvault.repository.DocumentRepository;
import com.trustvault.repository.UserRepository;
import com.trustvault.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public AuthService(UserRepository userRepository,
                       DocumentRepository documentRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       ActivityLogService activityLogService,
                       NotificationService notificationService) {
        this.userRepository = userRepository;
        this.documentRepository = documentRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.activityLogService = activityLogService;
        this.notificationService = notificationService;
    }

    @Transactional
    public UserDto register(RegisterRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(cleanEmail)) {
            throw new BadRequestException("An account with email '" + cleanEmail + "' is already registered. Please login.");
        }

        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters long.");
        }

        if (request.getConfirmPassword() != null && !request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and confirm password do not match.");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(cleanEmail);
        user.setMobileNumber(request.getMobileNumber() != null ? request.getMobileNumber().trim() : null);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER); // Public registration strictly assigns USER role
        user.setAccountStatus(AccountStatus.ACTIVE);
        user.setAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80");

        User savedUser = userRepository.save(user);

        // Record Activity
        activityLogService.logActivity(savedUser.getId(), "User Registration", null, null,
                "Account", "New user " + savedUser.getFullName() + " registered", "127.0.0.1", "Success");

        // Welcome Notification
        notificationService.createNotification(
                savedUser.getId(),
                null,
                "INFO",
                "Welcome to TrustVault, " + savedUser.getFullName() + "!",
                "Your personal document vault is ready. Start by uploading and organizing your vital certificates."
        );

        return mapToDto(savedUser);
    }

    @Transactional
    public AuthResponse login(AuthRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmailIgnoreCase(cleanEmail)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (user.getAccountStatus() == AccountStatus.SUSPENDED) {
            throw new UnauthorizedException("Your account is currently suspended. Please contact administrator.");
        }

        // Validate Role separation
        if ("Admin".equalsIgnoreCase(request.getRole()) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Access denied: You do not have administrator privileges.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(cleanEmail, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        activityLogService.logActivity(user.getId(), "User Login", null, null,
                "Authentication", "User " + user.getFullName() + " signed in successfully", "127.0.0.1", "Success");

        return new AuthResponse(jwt, mapToDto(user));
    }

    public UserDto mapToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getMobileNumber());
        dto.setRole(user.getRole() == Role.ADMIN ? "Admin" : "User");
        dto.setStatus(user.getAccountStatus() == AccountStatus.ACTIVE ? "Active" : "Suspended");
        dto.setAvatar(user.getAvatar());
        dto.setRegistrationDate(user.getCreatedAt() != null ? user.getCreatedAt().format(DATE_FORMATTER) : "2026-01-01");
        dto.setDocumentsCount(documentRepository.countByUserId(user.getId()));
        dto.setStorageUsed("2.4 MB");
        dto.setEmailNotifications(user.getEmailNotifications());
        dto.setSmsNotifications(user.getSmsNotifications());
        dto.setPushNotifications(user.getPushNotifications());
        dto.setExpiryThreshold(user.getExpiryThreshold());
        return dto;
    }
}
