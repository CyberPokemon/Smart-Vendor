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

    @ElementCollection
    @CollectionTable(name = "menu_ingredients", joinColumns = @JoinColumn(name = "menu_item_id"))
    @Column(name = "ingredient_name")
    private List<String> ingredientNames = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    public MenuItem(Long id, String foodName, List<String> ingredientNames, Users user) {
        this.id = id;
        this.foodName = foodName;
        this.ingredientNames = ingredientNames;
        this.user = user;
    }

    public MenuItem(Users user, List<String> ingredientNames, String foodName) {
        this.user = user;
        this.ingredientNames = ingredientNames;
        this.foodName = foodName;
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

    public List<String> getIngredientNames() {
        return ingredientNames;
    }

    public void setIngredientNames(List<String> ingredientNames) {
        this.ingredientNames = ingredientNames;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }
}
