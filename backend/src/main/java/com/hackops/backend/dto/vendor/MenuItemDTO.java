package com.hackops.backend.dto.vendor;

import java.util.List;

public class MenuItemDTO {
    private String foodName;
    private String foodType;
    private List<IngredientListDTO> ingredientNames;
    private double price;

    public MenuItemDTO(String foodName, String foodType, List<IngredientListDTO> ingredientNames, double price) {
        this.foodName = foodName;
        this.foodType = foodType;
        this.ingredientNames = ingredientNames;
        this.price = price;
    }

    public MenuItemDTO() {
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public String getFoodType() {
        return foodType;
    }

    public void setFoodType(String foodType) {
        this.foodType = foodType;
    }

    public List<IngredientListDTO> getIngredientNames() {
        return ingredientNames;
    }

    public void setIngredientNames(List<IngredientListDTO> ingredientNames) {
        this.ingredientNames = ingredientNames;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
