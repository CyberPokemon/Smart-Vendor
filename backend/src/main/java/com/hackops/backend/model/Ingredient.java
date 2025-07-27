package com.hackops.backend.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Ingredient {

    private String name;
    private double amount;
    private String unitType;

    // Constructors
    public Ingredient() {}

    public Ingredient(String name, double amount, String unitType) {
        this.name = name;
        this.amount = amount;
        this.unitType = unitType;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getUnitType() { return unitType; }
    public void setUnitType(String unitType) { this.unitType = unitType; }
}

