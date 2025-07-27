package com.hackops.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vendordetails")
public class VendorDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    private String typesOfFood;
//    private String vegNonVeg;

//    public VendorDetails(Long id, Users user, String typesOfFood, String vegNonVeg) {
//        this.id = id;
//        this.user = user;
//        this.typesOfFood = typesOfFood;
//        this.vegNonVeg = vegNonVeg;
//    }
//
//    public VendorDetails(Users user, String typesOfFood, String vegNonVeg) {
//        this.user = user;
//        this.typesOfFood = typesOfFood;
//        this.vegNonVeg = vegNonVeg;
//    }


    public VendorDetails() {
    }

    public VendorDetails(Long id, Users user, String typesOfFood) {
        this.id = id;
        this.user = user;
        this.typesOfFood = typesOfFood;
    }

    public VendorDetails(Users user, String typesOfFood) {
        this.user = user;
        this.typesOfFood = typesOfFood;
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

    public String getTypesOfFood() {
        return typesOfFood;
    }

    public void setTypesOfFood(String typesOfFood) {
        this.typesOfFood = typesOfFood;
    }
}

//    public String getVegNonVeg() {
//        return vegNonVeg;
//    }
//
//    public void setVegNonVeg(String vegNonVeg) {
//        this.vegNonVeg = vegNonVeg;
//    }
//}
