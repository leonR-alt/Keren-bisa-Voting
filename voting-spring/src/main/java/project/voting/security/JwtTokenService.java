package project.voting.security;

import project.voting.entity.Voter;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtTokenService {

    private static final String SECRET_KEY = "G0r88YCtE8TAgt9Tp3kbGAUk2t1XYmL2HNUpD91aebLOxb1ZlrCqpfwc3UXze4VKPqkCtFSC4NfH0DSsqKzqGlxBFdry3jtdDJHL0JmYrzA3Cf1aAwc6r6N4ETXSdyQujPPZeTU7drsh794tpsF6Utukb6pn2brbUxGjt4okinrF3qQhJ8oGb2fPvZY79nCL2nEvVFIyqgVfq1jMLcMtbbSygVtG61oZD4Rj4yFofrbmecjQFQnLXUxePUQDoIik";
    private static final SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    private static final long EXPIRATION_TIME_MS = 3600000; // 1 hour

    public String generateToken(Voter voter) {
        return Jwts.builder()
                .setSubject(voter.getEmail())
                .claim("id", voter.getId())
                .claim("isAdmin", voter.getIsAdmin())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME_MS))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Voter getVoterFromToken(String token) {
        try {
            var claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String email = claims.getSubject();
            boolean isAdmin = claims.get("isAdmin", Boolean.class);
            // ✅ Ambil id dari token
            int id = claims.get("id", Integer.class);

            Voter voter = new Voter();
            voter.setId(id); // ✅ Set id agar bisa dicari di database
            voter.setEmail(email);
            voter.setIsAdmin(isAdmin);
            return voter;
        } catch (Exception e) {
            System.err.println("Invalid token: " + e.getMessage());
            return null;
        }
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            System.err.println("Token validation failed: " + e.getMessage());
            return false;
        }
    }
}