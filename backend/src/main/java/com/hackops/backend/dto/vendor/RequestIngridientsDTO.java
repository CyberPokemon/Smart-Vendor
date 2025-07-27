package com.hackops.backend.dto.vendor;

public class RequestIngridientsDTO {

    String ingridiends;
    int quantity;
    double avgprice;
    String unit;

//    public RequestIngridientsDTO(String ingridiends, int quantity) {
//        this.ingridiends = ingridiends;
//        this.quantity = quantity;
//    }


    public RequestIngridientsDTO(String ingridiends, int quantity, double avgprice, String unit) {
        this.ingridiends = ingridiends;
        this.quantity = quantity;
        this.avgprice = avgprice;
        this.unit = unit;
    }

    public RequestIngridientsDTO() {
    }

    public String getIngridiends() {
        return ingridiends;
    }

    public void setIngridiends(String ingridiends) {
        this.ingridiends = ingridiends;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getAvgprice() {
        return avgprice;
    }

    public void setAvgprice(double avgprice) {
        this.avgprice = avgprice;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }
}
