package com.hackops.backend.service;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@Service
public class JWTService {

    private String secretkey;

    public JWTService() {
        try{
            KeyGenerator keyGen = KeyGenerator.getInstance("hmacSHA256");
            SecretKey sk = keyGen.generateKey();
            secretkey = Base64.getEncoder().encodeToString(sk.getEncoded());
            System.out.println("secret key = "+secretkey); //Testing implementation
        }
        catch (NoSuchAlgorithmException e)
        {
            System.out.println(e.getMessage());
            throw new RuntimeException(e);
        }
    }


    public SecretKey getSecretkey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretkey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token)
    {
        try{
            String username = Jwts.parser()
                    .verifyWith(getSecretkey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
            System.out.println("Extracted username = "+username);
            return username;
        }
        catch (Exception e)
        {
            System.out.println("JWT Token parsing error: " + e.getMessage());
            return null;
        }
    }

    public String generateToken(String username) {

        Map<String, Objects> claims = new HashMap<>();

        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+(24*3600000)))
                .and()
                .signWith(getSecretkey())
                .compact();
    }
}