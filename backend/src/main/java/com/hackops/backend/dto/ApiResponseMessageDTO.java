package com.hackops.backend.dto;

public class ApiResponseMessageDTO {

    private String message;

    public ApiResponseMessageDTO(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
