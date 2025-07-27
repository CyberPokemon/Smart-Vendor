package com.hackops.backend.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "ingredient_usage_log")
public class IngredientUsageLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Column(nullable = false)
    private String ingredientName;

    private double quantityBought;

    private double quantityUsed;

    private double price;

    @Column(nullable = false)
    private LocalDate date;

    private String messageFromVendor;

    public IngredientUsageLog(Long id, Users user, String ingredientName, double quantityBought, double quantityUsed, double price, LocalDate date) {
        this.id = id;
        this.user = user;
        this.ingredientName = ingredientName;
        this.quantityBought = quantityBought;
        this.quantityUsed = quantityUsed;
        this.price = price;
        this.date = date;
    }

    public IngredientUsageLog(Users user, String ingredientName, double quantityBought, double quantityUsed, double price, LocalDate date) {
        this.user = user;
        this.ingredientName = ingredientName;
        this.quantityBought = quantityBought;
        this.quantityUsed = quantityUsed;
        this.price = price;
        this.date = date;
    }

    public IngredientUsageLog() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public String getIngredientName() {
        return ingredientName;
    }

    public void setIngredientName(String ingredientName) {
        this.ingredientName = ingredientName;
    }

    public double getQuantityBought() {
        return quantityBought;
    }

    public void setQuantityBought(double quantityBought) {
        this.quantityBought = quantityBought;
    }

    public double getQuantityUsed() {
        return quantityUsed;
    }

    public void setQuantityUsed(double quantityUsed) {
        this.quantityUsed = quantityUsed;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getMessageFromVendor() {
        return messageFromVendor;
    }

    public void setMessageFromVendor(String messageFromVendor) {
        this.messageFromVendor = messageFromVendor;
    }
}
