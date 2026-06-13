package com.cod8flow.cod8flow.security;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import io.jsonwebtoken.Jwts;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.function.Function;

@Component
public class JwtService {

    @Value("${application.jwt.secret}")
    private String  secretKey;

    @Value("${application.jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${application.jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    //-Generate tokens---

    public String generateAccessToken(String email,String role) { //creates 15 min token containing email + role
        Map<String,Object> claims  = new HashMap<>();
        claims.put("role",role);
        return buildToken(claims,email,accessTokenExpiration);
    }

    public String generateRefreshToken(String email){ //creates  7 day token containing only email
        return buildToken(new HashMap<>(),email,refreshTokenExpiration);
    }

    private String buildToken(Map<String,Object> claims,String subject,long expiration){ //the actual JWT builder -  sets claims,subject ,expiry , sign it
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+ expiration))
                .signWith(getSigningKey())
                .compact();
    }

    // ---Validate tokens-----

    private boolean isTokenValid(String token,String email){ // check if token belongs to this email and it has not expired
        final String tokenEmail = extractEmail(token);
        return tokenEmail.equals(email) && !isTokenExpired(token);
    }


    public boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    //---Extreact data from token ---

    public String extractEmail(String token){
        return extractClaim(token, Claims::getSubject);

    }

    public Date extractExpiration(String token){
        return extractClaim(token,Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String token){
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    private SecretKey getSigningKey(){
        byte[] keyBytes = hexToBytes(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
// converts the hex secret from yml into a cryptographic key
// used to sign tokens on creation and verify on validation
    }

    private byte[] hexToBytes(String hex){
        int len = hex.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4)
                    + Character.digit(hex.charAt(i + 1), 16));
        }
        return data;
    }


}

