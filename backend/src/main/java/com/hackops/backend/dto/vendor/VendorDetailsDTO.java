package com.hackops.backend.dto.vendor;

public class VendorDetailsDTO {

    private String typesOfFood;
    private String vegNonVeg;

    public VendorDetailsDTO(String typesOfFood, String vegNonVeg) {
        this.typesOfFood = typesOfFood;
        this.vegNonVeg = vegNonVeg;
    }

    public VendorDetailsDTO() {
    }

    public String getTypesOfFood() {
        return typesOfFood;
    }

    public void setTypesOfFood(String typesOfFood) {
        this.typesOfFood = typesOfFood;
    }

    public String getVegNonVeg() {
        return vegNonVeg;
    }

    public void setVegNonVeg(String vegNonVeg) {
        this.vegNonVeg = vegNonVeg;
    }
}
