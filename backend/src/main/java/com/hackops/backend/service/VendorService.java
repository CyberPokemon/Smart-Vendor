package com.hackops.backend.service;

import com.hackops.backend.dto.vendor.RequestIngridientsDTO;
import com.hackops.backend.model.Users;
import com.hackops.backend.model.VendorIngridientList;
import com.hackops.backend.repository.UserRepository;
import com.hackops.backend.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
}
