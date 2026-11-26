package com.trustvault;

import com.trustvault.dto.AuthRequest;
import com.trustvault.dto.AuthResponse;
import com.trustvault.dto.RegisterRequest;
import com.trustvault.dto.UserDto;
import com.trustvault.entity.AccountStatus;
import com.trustvault.entity.Role;
import com.trustvault.entity.User;
import com.trustvault.exception.BadRequestException;
import com.trustvault.exception.UnauthorizedException;
import com.trustvault.repository.UserRepository;
import com.trustvault.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final String testEmail = "testuser_" + System.currentTimeMillis() + "@trustvault.io";

    @Test
    @DisplayName("Registration - Should register new user with hashed password and USER role")
    void testRegisterNewUser() {
        RegisterRequest req = new RegisterRequest();
        req.setFullName("Test User");
        req.setEmail(testEmail);
        req.setMobileNumber("+91 99999 11111");
        req.setPassword("Password@123");
        req.setConfirmPassword("Password@123");

        UserDto registered = authService.register(req);

        assertNotNull(registered);
        assertEquals("Test User", registered.getName());
        assertEquals(testEmail.toLowerCase(), registered.getEmail());
        assertEquals("User", registered.getRole());

        // Verify password hashing in DB
        User dbUser = userRepository.findByEmailIgnoreCase(testEmail).orElse(null);
        assertNotNull(dbUser);
        assertNotEquals("Password@123", dbUser.getPassword());
        assertTrue(passwordEncoder.matches("Password@123", dbUser.getPassword()));
        assertEquals(Role.USER, dbUser.getRole());
    }

    @Test
    @DisplayName("Registration - Duplicate email should throw BadRequestException")
    void testDuplicateRegistration() {
        RegisterRequest req = new RegisterRequest();
        req.setFullName("Duplicate User");
        req.setEmail("sathish@trustvault.io");
        req.setPassword("Password@123");

        assertThrows(BadRequestException.class, () -> authService.register(req));
    }

    @Test
    @DisplayName("Login - Valid credentials should return JWT and user details")
    void testLoginSuccess() {
        AuthRequest req = new AuthRequest();
        req.setEmail("sathish@trustvault.io");
        req.setPassword("Password@123");
        req.setRole("User");

        AuthResponse res = authService.login(req);

        assertNotNull(res);
        assertNotNull(res.getToken());
        assertNotNull(res.getUser());
        assertEquals("Sathishkumar", res.getUser().getName());
        assertEquals("sathish@trustvault.io", res.getUser().getEmail());
    }

    @Test
    @DisplayName("Login - Invalid password should throw UnauthorizedException")
    void testLoginInvalidPassword() {
        AuthRequest req = new AuthRequest();
        req.setEmail("sathish@trustvault.io");
        req.setPassword("WrongPassword!");
        req.setRole("User");

        assertThrows(Exception.class, () -> authService.login(req));
    }

    @Test
    @DisplayName("Admin Login - Root Administrator should authenticate successfully")
    void testAdminLogin() {
        AuthRequest req = new AuthRequest();
        req.setEmail("admin@trustvault.io");
        req.setPassword("admin1234");
        req.setRole("Admin");

        AuthResponse res = authService.login(req);

        assertNotNull(res);
        assertNotNull(res.getToken());
        assertEquals("Admin", res.getUser().getRole());
    }
}
