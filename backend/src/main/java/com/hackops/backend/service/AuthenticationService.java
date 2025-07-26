package com.hackops.backend.service;

import com.hackops.backend.dto.AuthenticationResponseDTO;
import com.hackops.backend.dto.LoginRequestDTO;
import com.hackops.backend.dto.RegisterRequestDTO;
import com.hackops.backend.model.Users;
import com.hackops.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthenticationService {

    @Autowired
    private UserRepository usersRepository;

    @Autowired
    private JWTService jwtService;

    @Autowired
    AuthenticationManager authenticationManager;

    private BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);

    public AuthenticationResponseDTO register(RegisterRequestDTO request) {

        if(usersRepository.findByUsername(request.getUsername()).isPresent() && usersRepository.findByEmailAddress(request.getEmail()).isPresent())
        {
            return new AuthenticationResponseDTO("",
                    request.getUsername(),
                    request.getName(),
                    request.getRole(),
                    "Same Username and Email already Exist");
        }
        if(usersRepository.findByUsername(request.getUsername()).isPresent())
        {
            return new AuthenticationResponseDTO("",
                    request.getUsername(),
                    request.getName(),
                    request.getRole(),
                    "Same Username already Exist");
        }
        if(usersRepository.findByEmailAddress(request.getEmail()).isPresent())
        {
            return new AuthenticationResponseDTO("",
                    request.getUsername(),
                    request.getName(),
                    request.getRole(),
                    "Same Email ID already Exist");
        }

        Users user = new Users(request.getUsername(), request.getName(), request.getEmail(), request.getAddress(), request.getCity(), request.getState(), request.getPincode(), bCryptPasswordEncoder.encode(request.getPassword()),request.getRole(), LocalDateTime.now());

        usersRepository.save(user);

        String jwttoken = jwtService.generateToken(user.getUsername());

        if(jwttoken.equals("FAIL"))
        {
            return new AuthenticationResponseDTO("",
                    user.getUsername(),
                    user.getEmailAddress(),
                    user.getRole(),
                    "Registraion failed");
        }
        else {
            return new AuthenticationResponseDTO(jwttoken,
                    user.getUsername(),
                    user.getEmailAddress(),
                    user.getRole(),
                    "Registration successful");
        }
    }

    public AuthenticationResponseDTO login(LoginRequestDTO request) {

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        } catch (AuthenticationException e) {
            return new AuthenticationResponseDTO("",
                    request.getUsername(),
                    "",
                    "",
                    "Login failed");
        }
        if(authentication.isAuthenticated())
        {
            Users user = usersRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String jwttoken = jwtService.generateToken(user.getUsername());

            return new AuthenticationResponseDTO(
                    jwttoken,
                    user.getUsername(),
                    user.getEmailAddress(),
                    user.getRole(),
                    "Login successful"
            );

        }
        else
        {
            return new AuthenticationResponseDTO("",
                    request.getUsername(),
                    "",
                    "",
                    "Login failed");
        }
    }
}
