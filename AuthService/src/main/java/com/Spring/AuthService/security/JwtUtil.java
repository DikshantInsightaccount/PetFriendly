    package com.Spring.AuthService.security;



    import com.Spring.AuthService.entity.User;
    import io.jsonwebtoken.Claims;
    import io.jsonwebtoken.Jwts;
    import io.jsonwebtoken.SignatureAlgorithm;
    import io.jsonwebtoken.security.Keys;
    import org.springframework.stereotype.Component;

    import java.security.Key;
    import java.util.Date;

    @Component
    public class JwtUtil {

        private static final String SECRET =
                "my-super-secret-key-my-super-secret-key";
        private static final long EXPIRY =
                1000 * 60 * 60; // 1 hour

        private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

        public String generateToken(User user) {
            return Jwts.builder()
                    .setSubject(user.getUserId().toString())
                    .claim("role", user.getRole().name())
                    .setIssuedAt(new Date())
                    .setExpiration(
                            new Date(System.currentTimeMillis() + EXPIRY)
                    )
                    .signWith(key, SignatureAlgorithm.HS256)
                    .compact();
        }

        public Claims validateToken(String token) {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        }
    }
