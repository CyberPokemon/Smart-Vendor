package com.hackops.backend.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "menu_items")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String foodName;

    private String foodType;

    private double price;

    @ElementCollection
    @CollectionTable(name = "menu_ingredients", joinColumns = @JoinColumn(name = "menu_item_id"))
    private List<Ingredient> ingredientNames = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;


    public MenuItem(Long id, String foodName, String foodType, double price, List<Ingredient> ingredientNames, Users user) {
        this.id = id;
        this.foodName = foodName;
        this.foodType = foodType;
        this.price = price;
        this.ingredientNames = ingredientNames;
        this.user = user;
    }

    public MenuItem(String foodName, String foodType, double price, List<Ingredient> ingredientNames, Users user) {
        this.foodName = foodName;
        this.foodType = foodType;
        this.price = price;
        this.ingredientNames = ingredientNames;
        this.user = user;
    }

    public MenuItem() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public List<Ingredient> getIngredientNames() {
        return ingredientNames;
    }

    public void setIngredientNames(List<Ingredient> ingredientNames) {
        this.ingredientNames = ingredientNames;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public String getFoodType() {
        return foodType;
    }

    public void setFoodType(String foodType) {
        this.foodType = foodType;
    }
}
