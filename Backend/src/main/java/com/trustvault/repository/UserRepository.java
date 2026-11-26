package com.trustvault.repository;

import com.trustvault.entity.AccountStatus;
import com.trustvault.entity.Role;
import com.trustvault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);
    Boolean existsByEmailIgnoreCase(String email);
    List<User> findByRole(Role role);
    long countByAccountStatus(AccountStatus status);
    long countByRole(Role role);
}
