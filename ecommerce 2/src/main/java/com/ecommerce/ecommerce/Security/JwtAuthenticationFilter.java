package com.ecommerce.ecommerce.Security;

import com.ecommerce.ecommerce.Repository.UserRepository;
import com.ecommerce.ecommerce.Service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader =
                request.getHeader("Authorization");

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        String token =
                authHeader.substring(7);

        String email;
        try {
            email = jwtService.extractUsername(token);
        } catch (RuntimeException e) {
            // Expired, malformed or tampered token: treat the request as not logged in instead of
            // failing with a 500. Public URLs still work, protected ones answer 403.
            filterChain.doFilter(request, response);
            return;
        }

        if (email != null &&
                SecurityContextHolder
                        .getContext()
                        .getAuthentication() == null) {

            // The account must still exist; its role decides what it may do (merchant vs customer).
            var account = userRepository.findByEmail(email).orElse(null);

            if (account != null && jwtService.validateToken(token, email)) {

                var authorities = java.util.List.of(
                        new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                "MERCHANT".equals(account.getRole()) ? "ROLE_MERCHANT" : "ROLE_CUSTOMER"));

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                new User(
                                        email,
                                        "",
                                        authorities
                                ),
                                null,
                                authorities
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder.getContext()
                        .setAuthentication(authToken);
            }


        }

        filterChain.doFilter(request, response);


    }
}
