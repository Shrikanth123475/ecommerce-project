package com.ecommerce.ecommerce.ServiceImpl;

import com.ecommerce.ecommerce.Service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtServiceImpl implements JwtService {



    private final SecretKey key ;

    public JwtServiceImpl(@Value("${jwt.secret}") String secretKey){
        this.key=Keys.hmacShaKeyFor(secretKey.getBytes());
    }


    @Override
    public String generateToken(String email) {

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 1000 * 60 * 60 * 24
                        )
                ) // 24 hours
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public String extractUsername(String token) {

        return extractAllClaims(token)
                .getSubject();
    }

    @Override
    public boolean validateToken(
            String token,
            String email) {

        String username =
                extractUsername(token);

        return username.equals(email)
                && !isTokenExpired(token);
    }

    private boolean isTokenExpired(
            String token) {

        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }

    private Claims extractAllClaims(
            String token) {

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}