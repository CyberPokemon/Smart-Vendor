package com.hackops.backend.dto.vendor;

public class IngredientListDTO {

    private String ingredientName;
    private double amount;
    private String unitType;

    public IngredientListDTO(String ingredientName, double amount, String unitType) {
        this.ingredientName = ingredientName;
        this.amount = amount;
        this.unitType = unitType;
    }

    public IngredientListDTO() {
    }

    public String getIngredientName() {
        return ingredientName;
    }

    public void setIngredientName(String ingredientName) {
        this.ingredientName = ingredientName;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getUnitType() {
        return unitType;
    }

    public void setUnitType(String unitType) {
        this.unitType = unitType;
    }
}
