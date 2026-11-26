package com.trustvault.repository;

import com.trustvault.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Document> findByIdAndUserId(Long id, Long userId);
    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, String status);

    @Query("SELECT d FROM Document d WHERE d.expiryDate IS NOT NULL AND d.status != 'Expired'")
    List<Document> findUnexpiredWithExpiryDate();

    @Query("SELECT d FROM Document d WHERE d.user.id = :userId AND d.expiryDate IS NOT NULL ORDER BY d.expiryDate ASC")
    List<Document> findExpiringSoonByUser(@Param("userId") Long userId);

    @Query("SELECT d FROM Document d WHERE d.user.id = :userId AND " +
           "(LOWER(d.documentName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.category.categoryName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Document> searchUserDocuments(@Param("userId") Long userId, @Param("keyword") String keyword);

    long countByStatus(String status);
}
