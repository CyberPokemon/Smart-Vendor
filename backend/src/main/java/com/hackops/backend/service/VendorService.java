package com.hackops.backend.service;

import com.hackops.backend.dto.vendor.IngredientResponseDTO;
import com.hackops.backend.dto.vendor.IngredientUsageRequestDTO;
import com.hackops.backend.dto.vendor.IngredientUsageResponseDTO;
import com.hackops.backend.dto.vendor.RequestIngridientsDTO;
import com.hackops.backend.model.IngredientUsageLog;
import com.hackops.backend.model.Users;
import com.hackops.backend.model.VendorIngridientList;
import com.hackops.backend.repository.IngredientUsageLogRepository;
import com.hackops.backend.repository.UserRepository;
import com.hackops.backend.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class VendorService {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private IngredientUsageLogRepository ingredientUsageLogRepository;


    public void registerIngridients(List<RequestIngridientsDTO> requestIngridientsDTO, String username) {
        Users user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        for (RequestIngridientsDTO l : requestIngridientsDTO)
        {
            VendorIngridientList vendorIngridientList = new VendorIngridientList(user, l.getIngridiends(), l.getQuantity());

            vendorRepository.save(vendorIngridientList);

        }

    }

    public void updateIngredients(List<RequestIngridientsDTO> updatedList, String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<VendorIngridientList> existingIngredients = vendorRepository.findByUser(user);

        Map<String, VendorIngridientList> existingMap = new HashMap<>();
        for (VendorIngridientList v : existingIngredients) {
            existingMap.put(v.getIngridientName().toLowerCase(), v);
        }

        Set<String> updatedNames = new HashSet<>();
        for (RequestIngridientsDTO dto : updatedList) {
            String name = dto.getIngridiends().toLowerCase();
            updatedNames.add(name);

            if (existingMap.containsKey(name)) {
                VendorIngridientList existing = existingMap.get(name);
                existing.setAverageQuantity(dto.getQuantity());
                vendorRepository.save(existing);
            } else {
                VendorIngridientList newIngredient = new VendorIngridientList(user, dto.getIngridiends(), dto.getQuantity());
                vendorRepository.save(newIngredient);
            }
        }

        for (VendorIngridientList v : existingIngredients) {
            if (!updatedNames.contains(v.getIngridientName().toLowerCase())) {
                vendorRepository.delete(v);
            }
        }
    }

    public List<IngredientResponseDTO> getIngredientsByUsername(String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<VendorIngridientList> ingredientList = vendorRepository.findByUser(user);

        return ingredientList.stream()
                .map(i -> new IngredientResponseDTO(i.getIngridientName(), i.getAverageQuantity()))
                .collect(Collectors.toList());
    }


    public void saveDailyUsage(String username, List<IngredientUsageRequestDTO> entries) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        for (IngredientUsageRequestDTO dto : entries) {
            LocalDate date;
            if (dto.getDate() != null) {
                date = LocalDate.parse(dto.getDate());
            } else {
                // Convert current UTC time to IST
                ZoneId istZone = ZoneId.of("Asia/Kolkata");
                date = LocalDate.now(istZone);
            }

            IngredientUsageLog log = new IngredientUsageLog();
            log.setUser(user);
            log.setIngredientName(dto.getIngredientName());
            log.setQuantityBought(dto.getQuantityBought());
            log.setQuantityUsed(dto.getQuantityUsed());
            log.setDate(date);

            ingredientUsageLogRepository.save(log);
        }
    }


    public List<IngredientUsageResponseDTO> getUsageByDate(String username, LocalDate date) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ingredientUsageLogRepository.findByUserAndDate(user, date)
                .stream()
                .map(log -> new IngredientUsageResponseDTO(log.getIngredientName(), log.getQuantityBought(), log.getQuantityUsed(), log.getDate().toString()))
                .collect(Collectors.toList());
    }

    public List<IngredientUsageResponseDTO> getUsageByMonth(String username, int month, int year) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ingredientUsageLogRepository.findByUserAndMonthYear(user, month, year)
                .stream()
                .map(log -> new IngredientUsageResponseDTO(log.getIngredientName(), log.getQuantityBought(), log.getQuantityUsed(), log.getDate().toString()))
                .collect(Collectors.toList());
    }

    public List<IngredientUsageResponseDTO> getUsageByDateRange(String username, LocalDate start, LocalDate end) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ingredientUsageLogRepository.findByUserAndDateBetween(user, start, end)
                .stream()
                .map(log -> new IngredientUsageResponseDTO(log.getIngredientName(), log.getQuantityBought(), log.getQuantityUsed(), log.getDate().toString()))
                .collect(Collectors.toList());
    }

}
