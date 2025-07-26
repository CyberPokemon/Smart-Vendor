package com.hackops.backend.dto.vendor;

public class IngredientUsageResponseDTO {
    private String ingredientName;
    private double quantityBought;
    private double quantityUsed;
    private String date;

    public IngredientUsageResponseDTO(String ingredientName, double quantityBought, double quantityUsed, String date) {
        this.ingredientName = ingredientName;
        this.quantityBought = quantityBought;
        this.quantityUsed = quantityUsed;
        this.date = date;
    }

    public IngredientUsageResponseDTO() {
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

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
