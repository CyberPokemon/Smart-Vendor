package com.hackops.backend.dto.vendor;

import java.util.List;

public class MenuItemDTO {
    private String foodName;
    private List<String> ingredientNames;

    public MenuItemDTO(String foodName, List<String> ingredientNames) {
        this.foodName = foodName;
        this.ingredientNames = ingredientNames;
    }

    public MenuItemDTO() {
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public List<String> getIngredientNames() {
        return ingredientNames;
    }

    public void setIngredientNames(List<String> ingredientNames) {
        this.ingredientNames = ingredientNames;
    }
}
