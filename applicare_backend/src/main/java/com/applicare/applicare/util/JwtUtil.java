// com/applicare/applicare/util/JwtUtil.java

package com.applicare.applicare.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.SignatureAlgorithm;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET = "supersecretkey"; // todo: openssl rand -base64 64 or 128 

    private final long EXPIRATION_MS = 3600000; // 1 hour

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}
