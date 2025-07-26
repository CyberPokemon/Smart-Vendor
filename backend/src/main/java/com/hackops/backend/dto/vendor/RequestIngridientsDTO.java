package com.hackops.backend.dto.vendor;

public class RequestIngridientsDTO {

    String ingridiends;
    int quantity;

    public RequestIngridientsDTO(String ingridiends, int quantity) {
        this.ingridiends = ingridiends;
        this.quantity = quantity;
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
}
