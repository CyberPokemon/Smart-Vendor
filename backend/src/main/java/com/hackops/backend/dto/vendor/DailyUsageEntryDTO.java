package com.hackops.backend.dto.vendor;

import java.util.List;

public class DailyUsageEntryDTO {
    private List<IngredientUsageRequestDTO> entries;
    private String messageFromVendor;

    public DailyUsageEntryDTO(List<IngredientUsageRequestDTO> entries) {
        this.entries = entries;
    }

    public DailyUsageEntryDTO() {
    }

    public List<IngredientUsageRequestDTO> getEntries() {
        return entries;
    }

    public void setEntries(List<IngredientUsageRequestDTO> entries) {
        this.entries = entries;
    }

    public String getMessageFromVendor() {
        return messageFromVendor;
    }

    public void setMessageFromVendor(String messageFromVendor) {
        this.messageFromVendor = messageFromVendor;
    }
}
