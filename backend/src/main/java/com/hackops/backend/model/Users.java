package com.hackops.backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userId;

    @Column(nullable = false, length = 255, unique = true)
    private String username;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false, unique = true)
    private String emailAddress;
    @Column(nullable = false)
    private String addresss;
    @Column(nullable = false)
    private String city;
    @Column(nullable = false)
    private String state;
    @Column(nullable = false)
    private int pincode;
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; //admin or participants
    @Column(nullable = false)
    private LocalDateTime createdAt;


    public Users(long userId, String username, String name, String emailAddress, String addresss, String city, String state, int pincode, String password, String role, LocalDateTime createdAt) {
        this.userId = userId;
        this.username = username;
        this.name = name;
        this.emailAddress = emailAddress;
        this.addresss = addresss;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
    }

    public Users(String username, String name, String emailAddress, String addresss, String city, String state, int pincode, String password, String role, LocalDateTime createdAt) {
        this.username = username;
        this.name = name;
        this.emailAddress = emailAddress;
        this.addresss = addresss;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
    }

    public Users() {
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
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

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public String getAddresss() {
        return addresss;
    }

    public void setAddresss(String addresss) {
        this.addresss = addresss;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public int getPincode() {
        return pincode;
    }

    public void setPincode(int pincode) {
        this.pincode = pincode;
    }
}
