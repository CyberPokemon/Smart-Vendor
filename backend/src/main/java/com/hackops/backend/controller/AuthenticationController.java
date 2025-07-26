package com.hackops.backend.controller;

import com.hackops.backend.dto.AuthenticationResponseDTO;
import com.hackops.backend.dto.LoginRequestDTO;
import com.hackops.backend.dto.RegisterRequestDTO;
import com.hackops.backend.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/signup")
    public ResponseEntity<AuthenticationResponseDTO> register(@RequestBody RegisterRequestDTO request)
    {
        AuthenticationResponseDTO registerRespone = authenticationService.register(request);
        if(registerRespone.getMessage().equals("Registration successful"))
        {
            return ResponseEntity.ok(registerRespone);
        }
        else
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(registerRespone);
        }
    }
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDTO> login(@RequestBody LoginRequestDTO request)
    {
        AuthenticationResponseDTO registerRespone = authenticationService.login(request);
        if(registerRespone.getMessage().equals("Login successful"))
        {
            return ResponseEntity.ok(registerRespone);
        }
        else
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(registerRespone);
        }
    }

}
