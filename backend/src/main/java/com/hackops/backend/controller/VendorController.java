package com.hackops.backend.controller;

import com.hackops.backend.dto.ApiResponseMessageDTO;
import com.hackops.backend.dto.vendor.DailyUsageEntryDTO;
import com.hackops.backend.dto.vendor.IngredientResponseDTO;
import com.hackops.backend.dto.vendor.IngredientUsageResponseDTO;
import com.hackops.backend.dto.vendor.RequestIngridientsDTO;
import com.hackops.backend.service.JWTService;
import com.hackops.backend.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/vendors")
public class VendorController {
    
    @Autowired
    private JWTService jwtService;

    @Autowired
    private VendorService vendorService;
    
    @PostMapping("/addingredientList")
    public ResponseEntity<ApiResponseMessageDTO> registerIngridients(@RequestBody List<RequestIngridientsDTO> requestIngridientsDTO, @RequestHeader("Authorization") String token)
    {
        System.out.println("token = "+ token);
        String username = jwtService.extractUsername(token.substring(7));
        System.out.println("add ingridients username = "+username);

        try
        {
            vendorService.registerIngridients(requestIngridientsDTO,username);
            return ResponseEntity.ok(new ApiResponseMessageDTO("Ingridients Added Successfully"));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseMessageDTO(e.getMessage()));
        }
    }

    @PutMapping("/updateingredientlist")
    public ResponseEntity<ApiResponseMessageDTO> updateIngredients(@RequestBody List<RequestIngridientsDTO> updatedIngredients, @RequestHeader("Authorization") String token) {

        String username = jwtService.extractUsername(token.substring(7));
        try{
            vendorService.updateIngredients(updatedIngredients, username);
            return ResponseEntity.ok(new ApiResponseMessageDTO("Ingredients updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseMessageDTO(e.getMessage()));
        }
    }

    @GetMapping("/ingredientslist")
    public ResponseEntity<?> getIngredients(@RequestHeader("Authorization") String token) {
        String username = jwtService.extractUsername(token.substring(7));

        try{
            List<IngredientResponseDTO> ingredients = vendorService.getIngredientsByUsername(username);
            return ResponseEntity.ok(ingredients);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseMessageDTO(e.getMessage()));
        }

    }

    @PostMapping("/setdailyusage")
    public ResponseEntity<ApiResponseMessageDTO> logDailyUsage(@RequestBody DailyUsageEntryDTO request, @RequestHeader("Authorization") String token) {

        String username = jwtService.extractUsername(token.substring(7));
        System.out.println("username = "+username);

        try
        {
            vendorService.saveDailyUsage(username, request.getEntries());
            return ResponseEntity.ok(new ApiResponseMessageDTO("Ingredient usage recorded successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseMessageDTO(e.getMessage()));
        }
    }

    @GetMapping("/usage/bydate")
    public ResponseEntity<List<IngredientUsageResponseDTO>> getByDate(@RequestHeader("Authorization") String token, @RequestParam String date) {

        String username = jwtService.extractUsername(token.substring(7));
        LocalDate localDate = LocalDate.parse(date);
        return ResponseEntity.ok(vendorService.getUsageByDate(username, localDate));
    }

    @GetMapping("/usage/bymonth")
    public ResponseEntity<List<IngredientUsageResponseDTO>> getByMonth(@RequestHeader("Authorization") String token, @RequestParam int month, @RequestParam int year) {

        String username = jwtService.extractUsername(token.substring(7));
        return ResponseEntity.ok(vendorService.getUsageByMonth(username, month, year));
    }

    @GetMapping("/usage/byrange")
    public ResponseEntity<List<IngredientUsageResponseDTO>> getByDateRange(@RequestHeader("Authorization") String token, @RequestParam String start, @RequestParam String end) {

        String username = jwtService.extractUsername(token.substring(7));
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        return ResponseEntity.ok(vendorService.getUsageByDateRange(username, startDate, endDate));
    }
}
