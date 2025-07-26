package com.hackops.backend.service;

import com.hackops.backend.dto.vendor.RequestIngridientsDTO;
import com.hackops.backend.model.Users;
import com.hackops.backend.model.VendorIngridientList;
import com.hackops.backend.repository.UserRepository;
import com.hackops.backend.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class VendorService {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;


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
                // Update existing ingredient
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

}
