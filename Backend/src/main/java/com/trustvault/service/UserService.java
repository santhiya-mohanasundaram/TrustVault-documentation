package com.trustvault.service;

import com.trustvault.dto.PasswordChangeRequest;
import com.trustvault.dto.ProfileUpdateRequest;
import com.trustvault.dto.UserDto;
import com.trustvault.entity.User;
import com.trustvault.exception.BadRequestException;
import com.trustvault.exception.ResourceNotFoundException;
import com.trustvault.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;
    private final ActivityLogService activityLogService;

    public UserService(UserRepository userRepository, AuthService authService,
                       PasswordEncoder passwordEncoder, ActivityLogService activityLogService) {
        this.userRepository = userRepository;
        this.authService = authService;
        this.passwordEncoder = passwordEncoder;
        this.activityLogService = activityLogService;
    }

    @Transactional(readOnly = true)
    public UserDto getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return authService.mapToDto(user);
    }

    @Transactional
    public UserDto updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setFullName(request.getName().trim());
        }
        if (request.getPhone() != null) {
            user.setMobileNumber(request.getPhone().trim());
        }
        if (request.getAvatar() != null && !request.getAvatar().trim().isEmpty()) {
            user.setAvatar(request.getAvatar().trim());
        }
        if (request.getEmailNotifications() != null) {
            user.setEmailNotifications(request.getEmailNotifications());
        }
        if (request.getSmsNotifications() != null) {
            user.setSmsNotifications(request.getSmsNotifications());
        }
        if (request.getPushNotifications() != null) {
            user.setPushNotifications(request.getPushNotifications());
        }
        if (request.getExpiryThreshold() != null) {
            user.setExpiryThreshold(request.getExpiryThreshold());
        }

        User updated = userRepository.save(user);

        activityLogService.logActivity(userId, "Profile Updated", null, null,
                "Account", "Profile information updated for " + updated.getFullName(), "127.0.0.1", "Success");

        return authService.mapToDto(updated);
    }

    @Transactional
    public void changePassword(Long userId, PasswordChangeRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password does not match");
        }

        if (request.getNewPassword().length() < 6) {
            throw new BadRequestException("New password must be at least 6 characters");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        activityLogService.logActivity(userId, "Password Changed", null, null,
                "Security", "Password successfully changed for " + user.getFullName(), "127.0.0.1", "Success");
    }
}
