package com.hackops.backend.service;

import com.hackops.backend.dto.vendor.*;
import com.hackops.backend.model.*;
import com.hackops.backend.repository.*;
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

    @Autowired
    private VendorDetailsRepository vendorDetailsRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;



//    public void registerIngridients(List<RequestIngridientsDTO> requestIngridientsDTO, String username) {
//        Users user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
//
//        for (RequestIngridientsDTO l : requestIngridientsDTO)
//        {
//            VendorIngridientList vendorIngridientList = new VendorIngridientList(user, l.getIngridiends(), l.getQuantity());
//
//            vendorRepository.save(vendorIngridientList);
//
//        }
//
//    }

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
                existing.setAveragePrice(dto.getAvgprice());
                existing.setUnit(dto.getUnit());
                vendorRepository.save(existing);
            } else {
                VendorIngridientList newIngredient = new VendorIngridientList(user, dto.getIngridiends(), dto.getQuantity(), dto.getAvgprice(),dto.getUnit());
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

    public List<String> getIngredientNamesByUsername(String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<VendorIngridientList> ingredientList = vendorRepository.findByUser(user);

        return ingredientList.stream()
                .map(VendorIngridientList::getIngridientName)
                .collect(Collectors.toList());
    }



    public void saveDailyUsage(String username, List<IngredientUsageRequestDTO> entries, String messageFromVendors) {
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
            log.setPrice(dto.getPrice());
            log.setDate(date);
            log.setMessageFromVendor(messageFromVendors);

            ingredientUsageLogRepository.save(log);
        }
    }


    public List<IngredientUsageResponseDTO> getUsageByDate(String username, LocalDate date) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ingredientUsageLogRepository.findByUserAndDate(user, date)
                .stream()
                .map(log -> new IngredientUsageResponseDTO(log.getIngredientName(), log.getQuantityBought(), log.getQuantityUsed(), log.getDate().toString(),log.getPrice()))
                .collect(Collectors.toList());
    }

    public List<IngredientUsageResponseDTO> getUsageByMonth(String username, int month, int year) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ingredientUsageLogRepository.findByUserAndMonthYear(user, month, year)
                .stream()
                .map(log -> new IngredientUsageResponseDTO(log.getIngredientName(), log.getQuantityBought(), log.getQuantityUsed(), log.getDate().toString(), log.getPrice()))
                .collect(Collectors.toList());
    }

    public List<IngredientUsageResponseDTO> getUsageByDateRange(String username, LocalDate start, LocalDate end) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ingredientUsageLogRepository.findByUserAndDateBetween(user, start, end)
                .stream()
                .map(log -> new IngredientUsageResponseDTO(log.getIngredientName(), log.getQuantityBought(), log.getQuantityUsed(), log.getDate().toString(), log.getPrice()))
                .collect(Collectors.toList());
    }

//
//    public void setDetails(VendorDetailsDTO vendorDetailsDTO, String username) {
//        Users user =  userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        VendorDetails v = new VendorDetails(user,vendorDetailsDTO.getTypesOfFood(), vendorDetailsDTO.getVegNonVeg());
//        vendorDetailsRepository.save(v);
//
//    }

    public void setDetails(VendorDetailsDTO vendorDetailsDTO, String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<VendorDetails> optionalVendorDetails = vendorDetailsRepository.findByUser(user);

        VendorDetails vendorDetails;
        if (optionalVendorDetails.isPresent()) {
            vendorDetails = optionalVendorDetails.get();
            vendorDetails.setTypesOfFood(vendorDetailsDTO.getTypesOfFood());
//            vendorDetails.setVegNonVeg(vendorDetailsDTO.getVegNonVeg());
        } else {
//            vendorDetails = new VendorDetails(user, vendorDetailsDTO.getTypesOfFood(), vendorDetailsDTO.getVegNonVeg());
            vendorDetails = new VendorDetails(user, vendorDetailsDTO.getTypesOfFood());
        }

        vendorDetailsRepository.save(vendorDetails);
    }

//    public void syncMenu(String username, List<MenuItemDTO> newMenu) {
//        Users user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        List<MenuItem> existingMenu = menuItemRepository.findByUser(user);
//
//        Map<String, MenuItem> existingMap = existingMenu.stream()
//                .collect(Collectors.toMap(MenuItem::getFoodName, item -> item));
//
//        Set<String> incomingFoodNames = new HashSet<>();
//
//        for (MenuItemDTO dto : newMenu) {
//            incomingFoodNames.add(dto.getFoodName());
//            if (existingMap.containsKey(dto.getFoodName())) {
//                MenuItem item = existingMap.get(dto.getFoodName());
//                item.setIngredientNames(dto.getIngredientNames());
//                menuItemRepository.save(item);
//            } else {
//
//                MenuItem item = new MenuItem();
//                item.setUser(user);
//                item.setFoodName(dto.getFoodName());
//                item.setIngredientNames(dto.getIngredientNames());
//                menuItemRepository.save(item);
//            }
//        }
//
//        for (MenuItem existingItem : existingMenu) {
//            if (!incomingFoodNames.contains(existingItem.getFoodName())) {
//                menuItemRepository.delete(existingItem);
//            }
//        }
//    }


    public void syncMenu(String username, List<MenuItemDTO> newMenu) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<MenuItem> existingMenu = menuItemRepository.findByUser(user);
        Map<String, MenuItem> existingMap = existingMenu.stream()
                .collect(Collectors.toMap(MenuItem::getFoodName, item -> item));

        Set<String> incomingFoodNames = new HashSet<>();

        for (MenuItemDTO dto : newMenu) {
            incomingFoodNames.add(dto.getFoodName());

            List<Ingredient> ingredientList = dto.getIngredientNames().stream()
                    .map(i -> new Ingredient(i.getIngredientName(), i.getAmount(), i.getUnitType()))
                    .collect(Collectors.toList());

            MenuItem item = existingMap.getOrDefault(dto.getFoodName(), new MenuItem());
            item.setUser(user);
            item.setFoodName(dto.getFoodName());
            item.setPrice(dto.getPrice());
            item.setIngredientNames(ingredientList);
            item.setFoodType(dto.getFoodType());

            menuItemRepository.save(item);
        }

        for (MenuItem existingItem : existingMenu) {
            if (!incomingFoodNames.contains(existingItem.getFoodName())) {
                menuItemRepository.delete(existingItem);
            }
        }
    }

//    public List<MenuItemDTO> getMenuForUser(String username) {
//        Users user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        List<MenuItem> menuItems = menuItemRepository.findByUser(user);
//
//        return menuItems.stream()
//                .map(item -> new MenuItemDTO(item.getFoodName(), item.getIngredientNames()))
//                .collect(Collectors.toList());
//    }

    public List<MenuItemDTO> getMenuForUser(String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<MenuItem> menuItems = menuItemRepository.findByUser(user);

        return menuItems.stream()
                .map(item -> {
                    List<IngredientListDTO> ingredientDTOs = item.getIngredientNames().stream()
                            .map(ing -> new IngredientListDTO(ing.getName(), ing.getAmount(), ing.getUnitType()))
                            .collect(Collectors.toList());

                    MenuItemDTO dto = new MenuItemDTO();
                    dto.setFoodName(item.getFoodName());
                    dto.setIngredientNames(ingredientDTOs);
                    dto.setPrice(item.getPrice()); // assuming MenuItem has a price field
                    dto.setFoodType(item.getFoodType()); // You should populate this if foodType exists in your entity
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<String> getVendorMessages(Users user, LocalDate start, LocalDate end) {
        return ingredientUsageLogRepository.findByUserAndDateBetween(user, start, end)
                .stream()
                .map(IngredientUsageLog::getMessageFromVendor)
                .filter(msg -> msg != null && !msg.trim().isEmpty())
                .distinct()
                .limit(10) // limit to recent unique 10 comments to avoid clutter
                .collect(Collectors.toList());
    }

    public Map<String, List<String>> getFoodToIngredientsMap(Users user) {
        List<MenuItem> menuItems = menuItemRepository.findByUser(user); // or fetch from repository if not eagerly loaded

        Map<String, List<String>> foodToIngredients = new HashMap<>();

        for (MenuItem item : menuItems) {
            List<String> ingredients = item.getIngredientNames().stream()
                    .map(Ingredient::getName)
                    .collect(Collectors.toList());
            foodToIngredients.put(item.getFoodName(), ingredients);
        }

        return foodToIngredients;
    }


    public UserDetailsResponseDto getUserDetails(String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserDetailsResponseDto(user.getUsername(),user.getName(), user.getEmailAddress(), user.getAddresss(),user.getBusinessname());

    }
}
