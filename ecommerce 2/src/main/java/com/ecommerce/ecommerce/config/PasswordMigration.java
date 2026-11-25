package com.ecommerce.ecommerce.config;

import com.ecommerce.ecommerce.Entity.User;
import com.ecommerce.ecommerce.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * One-time upgrade for databases created before password hashing: any password that is still plain
 * text is replaced by its BCrypt hash on startup. Users keep logging in with the same password.
 * Hashes are recognised by their "$2" prefix, so this does nothing once everything is hashed.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PasswordMigration implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        List<User> legacy = userRepository.findAll().stream()
                .filter(u -> u.getPassword() != null && !u.getPassword().startsWith("$2"))
                .toList();
        for (User user : legacy) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        if (!legacy.isEmpty()) {
            userRepository.saveAll(legacy);
            log.info("PasswordMigration: hashed {} plain-text password(s)", legacy.size());
        }
    }
}
