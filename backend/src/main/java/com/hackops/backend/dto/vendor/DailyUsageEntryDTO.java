package com.hackops.backend.dto.vendor;

import java.util.List;

public class DailyUsageEntryDTO {
    private List<IngredientUsageRequestDTO> entries;

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
}
