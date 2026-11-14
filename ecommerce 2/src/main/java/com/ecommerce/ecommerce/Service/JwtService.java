package com.ecommerce.ecommerce.Service;

public interface JwtService {

    String generateToken(String email);
    String extractUsername(String token);
    boolean validateToken(String token,String email);
}


