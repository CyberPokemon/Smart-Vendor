package com.hackops.backend.dto.vendor;


public class UserDetailsResponseDto {

    String username;
    String name;
    String emailAddress;
    String addresss;
    String businessname;

    public UserDetailsResponseDto(String username, String name, String emailAddress, String addresss, String businessname) {
        this.username = username;
        this.name = name;
        this.emailAddress = emailAddress;
        this.addresss = addresss;
        this.businessname = businessname;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public String getAddresss() {
        return addresss;
    }

    public void setAddresss(String addresss) {
        this.addresss = addresss;
    }

    public String getBusinessname() {
        return businessname;
    }

    public void setBusinessname(String businessname) {
        this.businessname = businessname;
    }
}
