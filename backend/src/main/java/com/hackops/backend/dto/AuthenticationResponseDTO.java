package com.hackops.backend.dto;

public class AuthenticationResponseDTO {

    private String JwtToken;
    private String username;
    private String name;
    private String role;
    private String message;


    public AuthenticationResponseDTO(String jwtToken, String username, String name, String role, String message) {
        JwtToken = jwtToken;
        this.username = username;
        this.name = name;
        this.role = role;
        this.message = message;
    }

    public AuthenticationResponseDTO(String message) {
        this.message = message;
    }


    public AuthenticationResponseDTO() {
    }

    public String getJwtToken() {
        return JwtToken;
    }

    public void setJwtToken(String jwtToken) {
        JwtToken = jwtToken;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

