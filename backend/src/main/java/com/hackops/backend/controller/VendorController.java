package com.hackops.backend.controller;

import com.hackops.backend.dto.ApiResponseMessageDTO;
import com.hackops.backend.dto.vendor.*;
import com.hackops.backend.service.GeminiService;
import com.hackops.backend.service.JWTService;
import com.hackops.backend.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vendors")
public class VendorController {
    
    @Autowired
    private JWTService jwtService;

    @Autowired
    private VendorService vendorService;

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/setdetails")
    public ResponseEntity<?> setDetails(@RequestHeader("Authorization") String token, @RequestBody VendorDetailsDTO vendorDetailsDTO)
    {
        System.out.println("token = "+ token);
        String username = jwtService.extractUsername(token.substring(7));

        try{
            vendorService.setDetails(vendorDetailsDTO,username);
            return ResponseEntity.ok(new ApiResponseMessageDTO("Details updated successfully"));
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseMessageDTO(e.getMessage()));
        }
    }

//    @PostMapping("/addingredientList")
//    public ResponseEntity<ApiResponseMessageDTO> registerIngridients(@RequestBody List<RequestIngridientsDTO> requestIngridientsDTO, @RequestHeader("Authorization") String token)
//    {
//        System.out.println("token = "+ token);
//        String username = jwtService.extractUsername(token.substring(7));
//        System.out.println("add ingridients username = "+username);
//
//        try
//        {
//            vendorService.registerIngridients(requestIngridientsDTO,username);
//            return ResponseEntity.ok(new ApiResponseMessageDTO("Ingridients Added Successfully"));
//
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(new ApiResponseMessageDTO(e.getMessage()));
//        }
//    }

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
            vendorService.saveDailyUsage(username, request.getEntries(),request.getMessageFromVendor());
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

    @GetMapping("/predictionai")
    public ResponseEntity<?> generatePrediction(@RequestHeader("Authorization") String token)
    {
        String username = jwtService.extractUsername(token.substring(7));
        try{
            Map<String, Map<String, Double>>prediction = geminiService.predictIngriendlist(username);
            return ResponseEntity.ok(prediction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseMessageDTO(e.getMessage()));
        }
    }

    @PostMapping("/syncmenu")
    public ResponseEntity<?> syncMenu(
            @RequestHeader("Authorization") String token,
            @RequestBody List<MenuItemDTO> menuList
    ) {
        String username = jwtService.extractUsername(token.substring(7));
        try {
            vendorService.syncMenu(username, menuList);
            return ResponseEntity.ok(new ApiResponseMessageDTO("Menu synced successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseMessageDTO(e.getMessage()));
        }
    }


    @GetMapping("/getmenu")
    public ResponseEntity<?> getMenu(@RequestHeader("Authorization") String token) {
        String username = jwtService.extractUsername(token.substring(7));
        try {
            List<MenuItemDTO> menu = vendorService.getMenuForUser(username);
            return ResponseEntity.ok(menu);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseMessageDTO(e.getMessage()));
        }
    }

    @GetMapping("/getingredientnames")
    public ResponseEntity<?> getIngredientNames(@RequestHeader("Authorization") String token) {
        String username = jwtService.extractUsername(token.substring(7));
        try {
            List<String> ingredients = vendorService.getIngredientNamesByUsername(username);
            return ResponseEntity.ok(ingredients);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseMessageDTO(e.getMessage()));
        }
    }



}
