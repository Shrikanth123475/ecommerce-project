package com.ecommerce.ecommerce.config;

import com.ecommerce.ecommerce.Entity.Cart;
import com.ecommerce.ecommerce.Entity.User;
import com.ecommerce.ecommerce.Repository.CartRepository;
import com.ecommerce.ecommerce.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Creates (or promotes) the merchant account named in application.properties:
 *   merchant.email=...   merchant.password=...
 * Nobody can become a merchant by registering through the API, so the role can only be given here.
 * If the properties are not set, nothing happens.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class MerchantSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${merchant.email:}")
    private String email;

    @Value("${merchant.password:}")
    private String password;

    @Override
    public void run(String... args) {
        if (email.isBlank()) {
            return;
        }
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            if (password.isBlank()) {
                log.warn("MerchantSeeder: merchant.email is set but merchant.password is empty - skipped");
                return;
            }
            user = new User();
            user.setName("Merchant");
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole("MERCHANT");
            user = userRepository.save(user);
            Cart cart = new Cart();
            cart.setUser(user);
            cartRepository.save(cart);
            log.info("MerchantSeeder: created merchant account {}", email);
        } else if (!"MERCHANT".equals(user.getRole())) {
            user.setRole("MERCHANT");
            userRepository.save(user);
            log.info("MerchantSeeder: {} is now a merchant", email);
        }
    }
}
