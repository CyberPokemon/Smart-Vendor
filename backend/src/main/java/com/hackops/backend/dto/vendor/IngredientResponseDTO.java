package com.hackops.backend.dto.vendor;

public class IngredientResponseDTO {

    private String ingredientName;
    private double averageQuantity;

    public IngredientResponseDTO(String ingredientName, double averageQuantity) {
        this.ingredientName = ingredientName;
        this.averageQuantity = averageQuantity;
    }

    public String getIngredientName() {
        return ingredientName;
    }

    public void setIngredientName(String ingredientName) {
        this.ingredientName = ingredientName;
    }

    public double getAverageQuantity() {
        return averageQuantity;
    }

    public void setAverageQuantity(double averageQuantity) {
        this.averageQuantity = averageQuantity;
    }
}
