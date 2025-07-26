package com.hackops.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vendor_ingriedients")
public class VendorIngridientList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Column(nullable = false)
    private String ingredientName;

    private double averageQuantity;


    public VendorIngridientList(Long id, Users user, String ingredientName, double averageQuantity) {
        this.id = id;
        this.user = user;
        ingredientName = ingredientName;
        this.averageQuantity = averageQuantity;
    }

    public VendorIngridientList(Users user, String ingredientName, double averageQuantity) {
        this.user = user;
        this.ingredientName = ingredientName;
        this.averageQuantity = averageQuantity;
    }

    public VendorIngridientList() {
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

    public String getIngridientName() {
        return ingredientName;
    }

    public void setIngridientName(String ingridientName) {
        this.ingredientName = ingridientName;
    }

    public double getAverageQuantity() {
        return averageQuantity;
    }

    public void setAverageQuantity(double averageQuantity) {
        this.averageQuantity = averageQuantity;
    }
}
