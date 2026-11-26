# TrustVault – Smart Personal Document Manager (Backend)

Enterprise Java Spring Boot REST API for TrustVault personal document management, automated expiry notifications, AES-256 encrypted storage, and administrative governance.

---

## Technology Stack

- **Language:** Java 21+ (Compatible with Java 26)
- **Framework:** Spring Boot 3.3.5
- **Security:** Spring Security 6, JJWT (JSON Web Token), BCrypt Password Encryption
- **Data & ORM:** Spring Data JPA, Hibernate, MySQL Connector J
- **Migrations:** Flyway Database Migrations
- **Scheduler:** Spring Task Scheduling (`@Scheduled`, `@EnableScheduling`)
- **Email:** Spring Boot Starter Mail (JavaMailSender)
- **Validation:** Spring Boot Starter Validation
- **Documentation:** SpringDoc OpenAPI 3.0 / Swagger UI
- **Testing:** JUnit 5, Mockito, Spring Boot Test

---

## Project Structure

```
src/
├── main/
│   ├── java/com/trustvault/
│   │   ├── config/          # Security, CORS, OpenAPI, Data Initializer
│   │   ├── controller/      # REST API Controllers
│   │   ├── dto/             # Request & Response DTOs
│   │   ├── entity/          # JPA Database Entities
│   │   ├── exception/       # Global Exception Handling
│   │   ├── repository/      # Spring Data JPA Repositories
│   │   ├── scheduler/       # Automated Document Expiry Scheduler
│   │   ├── security/        # JWT Authentication Filter & Token Provider
│   │   ├── service/         # Business Logic & Storage Services
│   │   └── util/            # AES-256 GCM Encryption Utilities
│   └── resources/
│       ├── application.properties
│       └── db/migration/V1__init_schema.sql
└── test/
    └── java/com/trustvault/  # Automated unit and integration test suites
```

---

## Setup & Running

1. **Prerequisites:**
   - JDK 21 or higher
   - Apache Maven 3.9+
   - MySQL Server 8.0+

2. **Configure Database & Secrets:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your MySQL credentials and JWT secret.

3. **Build & Run:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. **API Documentation:**
   Open [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) in your browser.
