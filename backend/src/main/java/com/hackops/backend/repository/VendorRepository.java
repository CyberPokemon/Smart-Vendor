package com.hackops.backend.repository;

import com.hackops.backend.model.Users;
import com.hackops.backend.model.VendorIngridientList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<VendorIngridientList,Long> {

    List<VendorIngridientList> findByUser(Users user);
}
